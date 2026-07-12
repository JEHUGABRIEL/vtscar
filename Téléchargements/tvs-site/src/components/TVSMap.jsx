import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Coordonnées du showroom TVS — Avenue de l'Indépendance, PK0, Bangui
const CENTER = [4.3616, 18.5553]
const ZOOM = 15

// Marqueur personnalisé aux couleurs TVS
const MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#d81f2a"/>
  <circle cx="12" cy="12" r="5" fill="#fff"/>
</svg>`

const MARKER_ICON = L.divIcon({
  className: '',
  html: MARKER_SVG,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
})

/**
 * Carte Leaflet interactive aux couleurs TVS.
 * Aucune clé API requise — utilise les tuiles CartoDB dark.
 */
export default function TVSMap() {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    // Initialisation de la carte
    const map = L.map(containerRef.current, {
      center: CENTER,
      zoom: ZOOM,
      zoomControl: true,
      scrollWheelZoom: false, // désactive le zoom au scroll pour ne pas gêner la navigation
    })

    // Tuiles CartoDB Dark Matter (gratuites, sans clé)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
      minZoom: 1,
    }).addTo(map)

    // Marqueur personnalisé
    const marker = L.marker(CENTER, { icon: MARKER_ICON }).addTo(map)
    marker.bindPopup(
      '<div style="font-family:inherit;font-size:13px;line-height:1.4;text-align:center">' +
        '<strong style="color:#d81f2a">TVS Bangui</strong><br/>' +
        'Avenue de l\'Indépendance, PK0<br/>' +
        'Lun–Sam, 8h–18h' +
        '</div>'
    )

    // Rendu plus rapide au scroll
    mapRef.current = map

    // Nettoyage
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ minHeight: '250px' }}
      role="application"
      aria-label="Carte interactive du showroom TVS Bangui"
    />
  )
}
