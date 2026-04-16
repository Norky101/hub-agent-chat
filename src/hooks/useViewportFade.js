import { useState, useEffect, useRef } from 'react'

export default function useViewportFade(scrollContainerRef) {
  const ref = useRef(null)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const el = ref.current
    const container = scrollContainerRef?.current
    if (!el || !container) return

    const compute = () => {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()

      // How far is the element's center from the bottom of the visible area
      const elCenter = elRect.top + elRect.height / 2
      const viewBottom = containerRect.bottom
      const viewTop = containerRect.top
      const viewHeight = containerRect.height

      // Messages near the bottom of the viewport = full opacity
      // Messages near the top edge = faded
      // The "focus zone" is the bottom 60% of the viewport
      const focusZoneTop = viewTop + viewHeight * 0.35

      if (elCenter >= focusZoneTop) {
        // In the focus zone — full opacity
        setOpacity(1)
      } else if (elCenter >= viewTop) {
        // Above focus zone but still visible — fade proportionally
        const ratio = (elCenter - viewTop) / (focusZoneTop - viewTop)
        setOpacity(0.35 + ratio * 0.65)
      } else {
        // Above viewport
        setOpacity(0.35)
      }
    }

    // Run on scroll
    container.addEventListener('scroll', compute, { passive: true })
    // Run once on mount and when messages change
    compute()
    const raf = requestAnimationFrame(compute)

    return () => {
      container.removeEventListener('scroll', compute)
      cancelAnimationFrame(raf)
    }
  }, [scrollContainerRef])

  return { ref, opacity }
}
