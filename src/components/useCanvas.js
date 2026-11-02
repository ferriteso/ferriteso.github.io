import { useEffect, useRef } from 'react'

export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Sizes a canvas to its box at device pixel ratio and runs `frame(ctx, w, h, t, state)` every
// animation frame while the canvas is on screen. `setup(w, h, state)` runs on every resize.
export function useCanvas(frame, setup) {
  const ref = useRef(null)
  const frameRef = useRef(frame)
  const setupRef = useRef(setup)
  frameRef.current = frame
  setupRef.current = setup

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const state = { mouse: null }
    let w = 0, h = 0, id = 0, visible = true, start = performance.now()

    const resize = () => {
      const r = cv.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width; h = r.height
      cv.width = Math.max(1, w * dpr); cv.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      setupRef.current && setupRef.current(w, h, state)
      if (reduceMotion()) frameRef.current(ctx, w, h, 2, state)
    }
    const loop = now => {
      if (visible) frameRef.current(ctx, w, h, (now - start) / 1000, state)
      id = requestAnimationFrame(loop)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(cv)
    const move = e => { const r = cv.getBoundingClientRect(); state.mouse = [e.clientX - r.left, e.clientY - r.top] }
    const leave = () => { state.mouse = null }
    const host = cv.parentElement
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    resize()
    if (!reduceMotion()) id = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(id); ro.disconnect(); io.disconnect()
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave)
    }
  }, [])

  return ref
}
