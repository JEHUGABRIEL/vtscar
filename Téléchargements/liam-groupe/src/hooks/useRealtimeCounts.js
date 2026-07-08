import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase.js";

// Singleton AudioContext réutilisable (évite de le recréer à chaque notification)
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx)
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

// Joue un son de notification via Web Audio API
function playNotification() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Deux petites notes (la → do#) pour un "ding-ding" discret
    osc.frequency.setValueAtTime(880, ctx.currentTime); // La5
    osc.frequency.setValueAtTime(1108, ctx.currentTime + 0.12); // Do#6

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Web Audio non disponible → silencieux
  }
}

/**
 * Hook réutilisable qui centralise le comptage (messages non lus,
 * inscriptions en attente) avec :
 *  - Requête Supabase initiale
 *  - Abonnement Realtime (INSERT/UPDATE/DELETE)
 *  - Rechargement au retour sur l'onglet (visibilitychange)
 *  - Notification sonore optionnelle quand un compteur augmente
 *
 * @param {Object} options
 * @param {string}  options.channelName  - Nom unique du canal Realtime
 * @param {boolean} [options.enableSound=false] - Activer le son sur incrément
 * @returns {{ pendingCount: number, unreadCount: number, connected: boolean }}
 */
export default function useRealtimeCounts({ channelName, enableSound = false } = {}) {
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  // Refs pour détecter une augmentation (son)
  const prevPendingRef = useRef(Infinity);
  const prevUnreadRef = useRef(Infinity);

  useEffect(() => {
    const fetchCounts = async () => {
      const { count: pCount } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("status", "en_attente");
      if (typeof pCount === "number") {
        if (enableSound && pCount > prevPendingRef.current) playNotification();
        prevPendingRef.current = pCount;
        setPendingCount(pCount);
      }

      const { count: uCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      if (typeof uCount === "number") {
        if (enableSound && uCount > prevUnreadRef.current) playNotification();
        prevUnreadRef.current = uCount;
        setUnreadCount(uCount);
      }
    };

    fetchCounts();

    // Abonnement Realtime
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "registrations" }, fetchCounts)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchCounts)
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    // Recharge quand l'onglet reprend le focus
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchCounts();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [channelName, enableSound]);

  return { pendingCount, unreadCount, connected };
}
