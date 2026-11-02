import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

const EASE = [0.76, 0, 0.24, 1]

// Headline whose lines slide up out of a mask. Pass lines as an array of strings.
export function SplitHeadline({ lines, as = 'h1', className = 'h-xl', delay = 0, id, onLoad = false }) {
  const Tag = motion[as]
  const trigger = onLoad ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.1 } }
  return (
    <Tag className={className} id={id} initial="hidden" {...trigger}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1, delay: delay + i * 0.09, ease: EASE } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function FadeUp({ children, delay = 0, y = 28, className, style, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}

// Text that decodes from random glyphs into the final string when it scrolls into view.
const GLYPHS = '01<>/\\[]{}=+-_#%ΩµΔ∿'
export function Scramble({ text, className, delay = 0, speed = 28 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0, id
    const total = text.length + 12
    const t0 = setTimeout(function tick() {
      frame++
      setOut(text.split('').map((c, i) => (c === ' ' || i < frame - 12 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''))
      if (frame < total) id = setTimeout(tick, speed)
      else setOut(text)
    }, delay * 1000)
    return () => { clearTimeout(t0); clearTimeout(id) }
  }, [inView, text, delay, speed])
  return <span ref={ref} className={className} aria-label={text}>{out}</span>
}

export function Marquee({ items, reverse = false, outline = false }) {
  const list = [...items, ...items]
  return (
    <div className={`marquee ${reverse ? 'rev' : ''} ${outline ? 'outline' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {list.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  )
}

export function CountUp({ to, decimals = 0, duration = 1.8, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setV })
    return () => c.stop()
  }, [inView, to, duration])
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>
}

// A list row whose bottom rule draws across as it enters the viewport.
export function Row({ idx, title, children }) {
  return (
    <motion.div className="row" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      <motion.span className="idx" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}>{idx}</motion.span>
      <motion.h3 variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } } }}>{title}</motion.h3>
      <motion.p variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } } }}>{children}</motion.p>
      <motion.span className="fill" variants={{ hidden: { width: '0%' }, show: { width: '100%', transition: { duration: 1.2, ease: EASE } } }} />
    </motion.div>
  )
}
