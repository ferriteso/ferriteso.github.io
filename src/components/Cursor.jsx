import { useEffect, useRef } from 'react'

// A small square cursor that inverts what it passes over and grows on links.
export default function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const el = ref.current
    let x = -100, y = -100, cx = -100, cy = -100, id
    const move = e => {
      x = e.clientX; y = e.clientY
      const t = e.target.closest && e.target.closest('a, button, [data-hover]')
      el.classList.toggle('big', !!t)
    }
    const loop = () => {
      cx += (x - cx) * 0.25; cy += (y - cy) * 0.25
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      id = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move)
    id = requestAnimationFrame(loop)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(id) }
  }, [])
  return <div className="cursor" ref={ref} aria-hidden="true" />
}
