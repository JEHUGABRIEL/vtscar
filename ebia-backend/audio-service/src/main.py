# audio-service/src/main.py
# ============================================================
#  E-Bia — Service de reconnaissance audio (type Shazam)
#  Algorithme : Wang 2003 — spectrogramme FFT + hash de paires
# ============================================================

import os
import hashlib
import tempfile
import time
from pathlib import Path
from typing import Optional

import numpy as np
import librosa
from scipy.ndimage import maximum_filter
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import psycopg2
import redis

app = FastAPI(title="E-Bia Audio Service", version="1.0.0")

# ── Connexions ────────────────────────────────────────────────
DB_URL  = os.environ["POSTGRES_URL"]
REDIS_URL = os.environ.get("REDIS_URL", "redis://redis:6379")

_redis = redis.from_url(REDIS_URL, decode_responses=True)

def get_db():
    return psycopg2.connect(DB_URL)

# ── Paramètres de l'algorithme ────────────────────────────────
SR          = 22050    # Sample rate (Hz)
HOP_LENGTH  = 512      # Saut FFT (~23ms à 22kHz)
N_FFT       = 4096     # Taille fenêtre FFT
PEAK_DELTA  = 10       # Voisinage de détection des pics (bins)
FAN_OUT     = 15       # Nb de paires par pic (fan-out)
MIN_DELAY   = 0        # Délai min entre deux pics (frames)
MAX_DELAY   = 200      # Délai max entre deux pics (frames)
HASH_BITS   = 20       # Bits pour fréquence dans le hash
MIN_CONFIDENCE = 0.30  # Seuil minimum pour accepter un match


# ─────────────────────────────────────────────────────────────
#  MOTEUR DE FINGERPRINTING
# ─────────────────────────────────────────────────────────────

def compute_spectrogram(audio_path: str) -> np.ndarray:
    """Charge l'audio et calcule le spectrogramme en dB."""
    y, _ = librosa.load(audio_path, sr=SR, mono=True, duration=30)
    D = np.abs(librosa.stft(y, n_fft=N_FFT, hop_length=HOP_LENGTH))
    return librosa.amplitude_to_db(D, ref=np.max)

def find_peaks(spec: np.ndarray) -> list[tuple[int, int]]:
    """
    Détecte les maxima locaux (peaks) dans le spectrogramme.
    Retourne une liste de (bin_freq, frame_time).
    """
    neighborhood = np.ones((PEAK_DELTA * 2 + 1, PEAK_DELTA * 2 + 1))
    local_max = maximum_filter(spec, footprint=neighborhood) == spec
    # Seuil : garder seulement les pics > -60 dB
    threshold = spec.max() - 60
    peaks = np.argwhere(local_max & (spec > threshold))
    return [(int(p[0]), int(p[1])) for p in peaks]

def generate_hashes(peaks: list[tuple[int, int]]) -> list[tuple[int, float]]:
    """
    Génère des hash 64-bit à partir de paires de pics.
    Hash = combinaison (f1, f2, delta_t) encodée en BIGINT.
    Retourne : liste de (hash, time_offset_en_secondes)
    """
    hashes = []
    peaks_sorted = sorted(peaks, key=lambda p: p[1])  # trier par temps

    for i, (f1, t1) in enumerate(peaks_sorted):
        for j in range(i + 1, len(peaks_sorted)):
            f2, t2 = peaks_sorted[j]
            delta = t2 - t1
            if delta < MIN_DELAY:
                continue
            if delta > MAX_DELAY:
                break
            if len(hashes) - i >= FAN_OUT:
                break  # limiter le fan-out

            # Encoder en hash 64-bit : f1 | f2 | delta
            h = (f1 & ((1 << HASH_BITS) - 1)) << (2 * HASH_BITS)
            h |= (f2 & ((1 << HASH_BITS) - 1)) << HASH_BITS
            h |= (delta & ((1 << HASH_BITS) - 1))

            # Convertir en entier signé PostgreSQL BIGINT
            if h >= 2**63:
                h -= 2**64

            time_offset = t1 * HOP_LENGTH / SR
            hashes.append((h, time_offset))

    return hashes

def fingerprint_audio(audio_path: str) -> list[tuple[int, float]]:
    """Pipeline complet : audio → empreintes."""
    spec   = compute_spectrogram(audio_path)
    peaks  = find_peaks(spec)
    return generate_hashes(peaks)


# ─────────────────────────────────────────────────────────────
#  RECONNAISSANCE — Recherche dans la base de données
# ─────────────────────────────────────────────────────────────

def recognize(query_hashes: list[tuple[int, float]]) -> Optional[dict]:
    """
    Compare les hash de la requête avec la Hash DB.
    Méthode : vote + cohérence temporelle (offset alignment).
    """
    if not query_hashes:
        return None

    # Vérifier le cache Redis d'abord
    hash_values = [h for h, _ in query_hashes[:50]]
    cache_key = "fp:" + hashlib.md5(str(hash_values).encode()).hexdigest()
    cached = _redis.get(cache_key)
    if cached:
        return None  # déjà traité récemment, pas de résultat mis en cache

    conn = get_db()
    cur  = conn.cursor()

    # Récupérer tous les candidats matching un hash de la requête
    placeholders = ",".join(["%s"] * len(hash_values))
    cur.execute(
        f"SELECT hash, track_id, time_offset FROM fingerprints WHERE hash IN ({placeholders})",
        hash_values
    )
    db_matches = cur.fetchall()
    cur.close()
    conn.close()

    if not db_matches:
        return None

    # Construire un index des hash de la requête → offsets
    query_index: dict[int, list[float]] = {}
    for h, t in query_hashes:
        query_index.setdefault(h, []).append(t)

    # Voter par alignement temporel (delta offset)
    votes: dict[str, dict[float, int]] = {}
    for db_hash, track_id, db_offset in db_matches:
        for q_offset in query_index.get(db_hash, []):
            delta = round(db_offset - q_offset, 1)
            tid = str(track_id)
            votes.setdefault(tid, {})
            votes[tid][delta] = votes[tid].get(delta, 0) + 1

    # Trouver le meilleur candidat
    best_track, best_score = None, 0
    for tid, deltas in votes.items():
        score = max(deltas.values())
        if score > best_score:
            best_score, best_track = score, tid

    if not best_track:
        return None

    confidence = min(best_score / 50.0, 1.0)  # Normaliser

    if confidence < MIN_CONFIDENCE:
        return None

    # Récupérer les métadonnées de la piste
    conn = get_db()
    cur  = conn.cursor()
    cur.execute(
        """SELECT t.id, t.title, t.genre, t.duration_s,
                  a.name AS artist, a.avatar_url AS cover_url
           FROM tracks t JOIN artists a ON a.id = t.artist_id
           WHERE t.id = %s""",
        (best_track,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return None

    return {
        "match": True,
        "confidence": round(confidence, 3),
        "track": {
            "id":       str(row[0]),
            "title":    row[1],
            "genre":    row[2],
            "duration_s": row[3],
            "artist":   row[4],
            "cover_url": row[5],
        }
    }


# ─────────────────────────────────────────────────────────────
#  ENDPOINTS FASTAPI
# ─────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "audio-service"}

@app.post("/api/v1/recognize")
async def recognize_endpoint(audio: UploadFile = File(...)):
    """
    Reçoit un fichier audio (OGG/WAV ~280 Ko max),
    génère ses empreintes et cherche dans la Hash DB.
    Latence cible : < 3 secondes.
    """
    start = time.time()

    # Validation basique
    if audio.size and audio.size > 1_024 * 1_024:
        raise HTTPException(400, "Fichier trop volumineux (max 1 Mo)")

    # Sauvegarder dans un fichier temporaire
    suffix = Path(audio.filename or "rec.ogg").suffix or ".ogg"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        hashes = fingerprint_audio(tmp_path)
        result = recognize(hashes)
        elapsed = round(time.time() - start, 2)

        if result:
            result["elapsed_s"] = elapsed
            return JSONResponse(result)

        return JSONResponse({
            "match":     False,
            "message":   "Chanson non reconnue dans le catalogue",
            "elapsed_s": elapsed,
        }, status_code=404)

    finally:
        os.unlink(tmp_path)


@app.post("/api/v1/tracks/index")
async def index_track(body: dict):
    """
    Indexe un titre existant dans la Hash DB.
    Appelé par l'admin après upload d'un fichier audio dans MinIO.
    Body: { track_id: str, audio_path: str }
    """
    track_id   = body.get("track_id")
    audio_path = body.get("audio_path")

    if not track_id or not audio_path:
        raise HTTPException(400, "track_id et audio_path requis")

    if not Path(audio_path).exists():
        raise HTTPException(404, f"Fichier introuvable : {audio_path}")

    hashes = fingerprint_audio(audio_path)

    conn = get_db()
    cur  = conn.cursor()

    # Supprimer les anciennes empreintes de ce titre
    cur.execute("DELETE FROM fingerprints WHERE track_id = %s", (track_id,))

    # Insérer les nouvelles (batch insert)
    from psycopg2.extras import execute_values
    execute_values(
        cur,
        "INSERT INTO fingerprints (hash, track_id, time_offset) VALUES %s",
        [(h, track_id, t) for h, t in hashes],
        page_size=1000,
    )
    conn.commit()
    cur.close()
    conn.close()

    return {"indexed": len(hashes), "track_id": track_id}
