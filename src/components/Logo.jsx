import { motion } from 'framer-motion'

const BARS = [[6, 12], [14, 27], [22, 42]]

// The Ferrite mark: three offset bars, like stacked core laminations.
export function Mark({ size = 24, animate = false, delay = 0 }) {
  return (
    <svg width={size} height={size} viewBox="4 4 56 56" aria-hidden="true">
      {BARS.map(([x, y], i) =>
        animate ? (
          <motion.rect
            key={i} x={x} y={y} width="36" height="10"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + i * 0.12, ease: [0.76, 0, 0.24, 1] }}
          />
        ) : (
          <rect key={i} x={x} y={y} width="36" height="10" />
        )
      )}
    </svg>
  )
}

export function Wordmark({ height = 18, className, style }) {
  return (
    <svg className={className} style={style} height={height} width={height ? height * 5.675 : undefined} viewBox="0 0 227 40" role="img" aria-label="Ferrite">
      <rect x="0" y="0" width="7" height="40" /><rect x="0" y="0" width="26" height="7" /><rect x="0" y="17" width="21" height="7" />
      <g transform="translate(36 0)"><rect x="0" y="0" width="7" height="40" /><rect x="0" y="0" width="26" height="7" /><rect x="0" y="17" width="21" height="7" /><rect x="0" y="33" width="26" height="7" /></g>
      <g transform="translate(72 0)"><path fillRule="evenodd" d="M0 0H16.5A11.5 11.5 0 0 1 16.5 23H7V40H0Z M7 7V16H16.5A4.5 4.5 0 0 0 16.5 7Z" /><path d="M12 23H20L28 40H20Z" /></g>
      <g transform="translate(110 0)"><path fillRule="evenodd" d="M0 0H16.5A11.5 11.5 0 0 1 16.5 23H7V40H0Z M7 7V16H16.5A4.5 4.5 0 0 0 16.5 7Z" /><path d="M12 23H20L28 40H20Z" /></g>
      <rect x="148" y="0" width="7" height="40" />
      <g transform="translate(165 0)"><rect x="0" y="0" width="26" height="7" /><rect x="9.5" y="0" width="7" height="40" /></g>
      <g transform="translate(201 0)"><rect x="0" y="0" width="7" height="40" /><rect x="0" y="0" width="26" height="7" /><rect x="0" y="17" width="21" height="7" /><rect x="0" y="33" width="26" height="7" /></g>
    </svg>
  )
}
