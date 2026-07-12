import { useState, useEffect } from 'react'

/**
 * Mesure dynamiquement la hauteur du `<header>` via ResizeObserver
 * pour adapter le contenu à la navbar (bannière refermable comprise).
 *
 * @returns {number} Hauteur actuelle du header en pixels (fallback 80px)
 */
export default function useHeaderHeight() {
  const [height, setHeight] = useState(80)

  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) {
      // fallback : 5rem (80px)
      setHeight(80)
      return
    }

    const update = () => setHeight(header.getBoundingClientRect().height)

    update()

    const observer = new ResizeObserver(update)
    observer.observe(header)

    return () => observer.disconnect()
  }, [])

  return height
}
