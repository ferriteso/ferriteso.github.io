import { motion } from 'framer-motion'
import { useCanvas } from './useCanvas.js'

const W = 'rgba(255,255,255,'

/* Iron filings aligned to a slowly rotating dipole field, plus a pole that follows the cursor. */
export function FieldCanvas({ className = 'bg', density = 22 }) {
  const ref = useCanvas(
    (ctx, w, h, t, s) => {
      ctx.clearRect(0, 0, w, h)
      const cx = w * (w < 860 ? 0.6 : 0.72), cy = h * 0.42, r = Math.min(w, h) * 0.17
      const a = t * 0.18
      const P = [[cx + Math.sin(a) * r, cy - Math.cos(a) * r, 1], [cx - Math.sin(a) * r, cy + Math.cos(a) * r, -1]]
      if (s.mouse) {
        s.m = s.m || [...s.mouse]
        s.m[0] += (s.mouse[0] - s.m[0]) * 0.12; s.m[1] += (s.mouse[1] - s.m[1]) * 0.12
        P.push([s.m[0], s.m[1], 1.3])
      } else s.m = null
      ctx.lineWidth = 1
      for (const [x, y, k] of s.pts) {
        let bx = 0, by = 0
        for (const [px, py, q] of P) {
          const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy + 500, d = Math.sqrt(d2)
          bx += q * dx / (d2 * d); by += q * dy / (d2 * d)
        }
        const m = Math.hypot(bx, by) || 1e-9
        const sat = Math.min(1, m * 1.6e5)
        const len = 3 + 8 * sat * k
        const ux = bx / m * len, uy = by / m * len
        ctx.strokeStyle = W + ((0.07 + 0.55 * sat) * k) + ')'
        ctx.beginPath(); ctx.moveTo(x - ux / 2, y - uy / 2); ctx.lineTo(x + ux / 2, y + uy / 2); ctx.stroke()
      }
    },
    (w, h, s) => {
      const step = w < 600 ? density - 4 : density
      s.pts = []
      for (let y = step / 2; y < h; y += step)
        for (let x = step / 2; x < w; x += step)
          s.pts.push([x + (Math.random() - 0.5) * step * 0.6, y + (Math.random() - 0.5) * step * 0.6, 0.4 + Math.random() * 0.6])
    }
  )
  return <canvas ref={ref} className={className} aria-hidden="true" />
}

/* Spine–leaf network: packets run between spines, leaves and nodes. Hover lights up a node's paths. */
export function FabricCanvas() {
  const ref = useCanvas(
    (ctx, w, h, t, s) => {
      ctx.clearRect(0, 0, w, h)
      const { spines, leaves, nodes, links } = s
      // hover: nearest node
      let hot = -1
      if (s.mouse) {
        let best = 1e9
        nodes.forEach((n, i) => { const d = Math.hypot(n.x - s.mouse[0], n.y - s.mouse[1]); if (d < best) { best = d; hot = i } })
        if (best > 60) hot = -1
      }
      const hotLeaf = hot >= 0 ? nodes[hot].leaf : -1
      for (const L of links) {
        const lit = hotLeaf >= 0 && (L.leaf === hotLeaf && (L.kind === 'up' || L.node === hot))
        ctx.strokeStyle = lit ? W + '0.9)' : W + '0.1)'
        ctx.lineWidth = lit ? 1.4 : 1
        ctx.beginPath(); ctx.moveTo(L.a.x, L.a.y); ctx.lineTo(L.b.x, L.b.y); ctx.stroke()
      }
      // packets
      for (const p of s.packets) {
        p.u += p.v
        if (p.u > 1) { p.u = 0; p.L = links[(Math.random() * links.length) | 0]; p.dir = Math.random() < 0.5 }
        const { a, b } = p.L
        const u = p.dir ? p.u : 1 - p.u
        const x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u
        ctx.fillStyle = '#fff'; ctx.fillRect(x - 2, y - 2, 4, 4)
        ctx.fillStyle = W + '0.25)'; ctx.fillRect(x - 5, y - 5, 10, 10)
      }
      const box = (n, sz, label, on) => {
        ctx.fillStyle = on ? '#fff' : '#070708'
        ctx.strokeStyle = W + (on ? '1)' : '0.6)')
        ctx.fillRect(n.x - sz / 2, n.y - sz / 2, sz, sz); ctx.strokeRect(n.x - sz / 2 + 0.5, n.y - sz / 2 + 0.5, sz - 1, sz - 1)
        if (label) { ctx.fillStyle = W + '0.5)'; ctx.font = '10px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText(label, n.x, n.y - sz / 2 - 8) }
      }
      spines.forEach((n, i) => box(n, 18, `SPINE ${i + 1}`, false))
      leaves.forEach((n, i) => box(n, 14, w > 520 ? `LEAF ${i + 1}` : '', i === hotLeaf))
      nodes.forEach((n, i) => {
        const blink = (Math.sin(t * 3 + n.ph) > 0.6)
        box(n, 8, '', i === hot)
        if (blink && i !== hot) { ctx.fillStyle = '#fff'; ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3) }
      })
    },
    (w, h, s) => {
      const nS = 4, nL = w < 520 ? 4 : 8, per = w < 520 ? 3 : 4
      const spines = Array.from({ length: nS }, (_, i) => ({ x: w * (i + 1) / (nS + 1), y: h * 0.16 }))
      const leaves = Array.from({ length: nL }, (_, i) => ({ x: w * (i + 0.5) / nL, y: h * 0.5 }))
      const nodes = []
      leaves.forEach((L, li) => {
        for (let k = 0; k < per; k++) {
          const span = w / nL * 0.7
          nodes.push({ x: L.x - span / 2 + span * k / (per - 1), y: h * 0.84, leaf: li, ph: Math.random() * 6 })
        }
      })
      const links = []
      leaves.forEach((L, li) => spines.forEach(S => links.push({ a: S, b: L, kind: 'up', leaf: li })))
      nodes.forEach((n, ni) => links.push({ a: leaves[n.leaf], b: n, kind: 'down', leaf: n.leaf, node: ni }))
      const packets = Array.from({ length: 40 }, () => ({ L: links[(Math.random() * links.length) | 0], u: Math.random(), v: 0.006 + Math.random() * 0.012, dir: Math.random() < 0.5 }))
      Object.assign(s, { spines, leaves, nodes, links, packets })
    }
  )
  return <canvas ref={ref} aria-hidden="true" />
}

/* A wireframe rack of servers turning in 3D, with blinking status LEDs. Drag the cursor to tilt it. */
export function RackCanvas({ units = 12 }) {
  const ref = useCanvas(
    (ctx, w, h, t, s) => {
      ctx.clearRect(0, 0, w, h)
      const target = s.mouse ? (s.mouse[0] / w - 0.5) * 1.6 : Math.sin(t * 0.35) * 0.7
      s.ry = (s.ry ?? 0.5) + (target - (s.ry ?? 0.5)) * 0.05
      const rx = s.mouse ? (s.mouse[1] / h - 0.5) * 0.5 : -0.18
      s.rx = (s.rx ?? rx) + (rx - (s.rx ?? rx)) * 0.05
      const cy = Math.cos(s.ry), sy = Math.sin(s.ry), cx = Math.cos(s.rx), sx = Math.sin(s.rx)
      const scale = Math.min(w, h * 0.9) / 3.6, f = 5
      const P = ([x, y, z]) => {
        let X = x * cy + z * sy, Z = -x * sy + z * cy
        let Y = y * cx - Z * sx; Z = y * sx + Z * cx
        const k = f / (f + Z)
        return [w / 2 + X * scale * k, h / 2 + Y * scale * k, Z]
      }
      const line = (a, b, al) => { const A = P(a), B = P(b); ctx.strokeStyle = W + al + ')'; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke() }
      const RW = 0.6, RH = 1.5, RD = 0.9
      const box = (x0, y0, z0, x1, y1, z1, al) => {
        const v = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]
        ;[[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a, b]) => line(v[a], v[b], al))
      }
      ctx.lineWidth = 1
      box(-RW, -RH, -RD, RW, RH, RD, 0.75)
      const uh = (RH * 2 - 0.16) / units
      for (let i = 0; i < units; i++) {
        const y0 = -RH + 0.08 + i * uh, y1 = y0 + uh - 0.03
        // slide-in on load
        const prog = Math.min(1, Math.max(0, (t - i * 0.08) / 0.8))
        const e = 1 - Math.pow(1 - prog, 3)
        const off = (1 - e) * 1.6
        box(-RW + 0.04, y0, -RD + 0.04 - off, RW - 0.04, y1, RD - 0.04 - off, 0.18 + 0.25 * e)
        // front panel LEDs
        for (let k = 0; k < 6; k++) {
          const on = Math.sin(t * (2 + k * 0.7) + i * 1.7 + k) > 0.2
          const p = P([-RW + 0.12 + k * 0.08, (y0 + y1) / 2, -RD + 0.04 - off])
          ctx.fillStyle = on ? '#fff' : W + '0.15)'
          ctx.fillRect(p[0] - 1.5, p[1] - 1.5, 3, 3)
        }
      }
      // floor grid
      for (let g = -3; g <= 3; g++) { line([g * 0.5, RH, -1.6], [g * 0.5, RH, 1.6], 0.07); line([-1.5, RH, g * 0.5], [1.5, RH, g * 0.5], 0.07) }
    }
  )
  return <canvas ref={ref} aria-hidden="true" />
}

/* Oscilloscope: switch node (PWM), inductor current ripple and output voltage of a buck stage. */
export function ScopeCanvas({ light = false }) {
  const ref = useCanvas((ctx, w, h, t) => {
    const ink = light ? 'rgba(0,0,0,' : W
    ctx.clearRect(0, 0, w, h)
    // graticule
    ctx.strokeStyle = ink + '0.08)'; ctx.lineWidth = 1
    for (let i = 1; i < 10; i++) { const x = (w * i) / 10; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let i = 1; i < 8; i++) { const y = (h * i) / 8; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
    ctx.strokeStyle = ink + '0.2)'
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke()
    const period = w / 5, duty = 0.42 + Math.sin(t * 0.6) * 0.08, shift = (t * 60) % period
    const trace = (fn, y0, amp, a, lw) => {
      ctx.strokeStyle = ink + a + ')'; ctx.lineWidth = lw; ctx.beginPath()
      for (let x = 0; x <= w; x += 1) { const ph = (((x + shift) % period) + period) % period / period; const y = y0 - fn(ph, x) * amp; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }
      ctx.stroke()
    }
    trace(ph => (ph < duty ? 1 : 0) + (ph < 0.02 ? 0.15 * Math.sin(ph * 900) : 0), h * 0.3, h * 0.18, 0.95, 1.5)
    trace(ph => (ph < duty ? ph / duty : 1 - (ph - duty) / (1 - duty)) - 0.5, h * 0.58, h * 0.14, 0.7, 1.5)
    trace((ph, x) => 0.06 * Math.sin(ph * Math.PI * 2) + 0.02 * Math.sin(x * 0.3 + t * 9), h * 0.82, h * 0.18, 0.5, 1.2)
    ctx.fillStyle = ink + '0.55)'; ctx.font = '10px "IBM Plex Mono", monospace'; ctx.textAlign = 'left'
    ctx.fillText('CH1  V_SW', 10, h * 0.3 - h * 0.18 - 8)
    ctx.fillText('CH2  I_L', 10, h * 0.58 - h * 0.1)
    ctx.fillText('CH3  V_OUT  AC', 10, h * 0.82 - 16)
    ctx.textAlign = 'right'
    ctx.fillText(`D = ${(duty * 100).toFixed(1)}%`, w - 10, h - 10)
  })
  return <canvas ref={ref} aria-hidden="true" />
}

/* Accelerator utilization across a pod: a grid of cells whose load drifts like weather. */
export function HeatCanvas({ cols = 32, rows = 12 }) {
  const ref = useCanvas((ctx, w, h, t, s) => {
    ctx.clearRect(0, 0, w, h)
    const c = w < 520 ? Math.round(cols / 2) : cols
    const gap = 3, cw = (w - gap * (c + 1)) / c, ch = (h - gap * (rows + 1)) / rows
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < c; i++) {
        let v = 0.5 + 0.25 * Math.sin(i * 0.35 + t * 0.9) * Math.cos(j * 0.5 - t * 0.6) + 0.25 * Math.sin((i + j) * 0.22 - t * 1.3)
        if (s.mouse) { const dx = (gap + i * (cw + gap) + cw / 2) - s.mouse[0], dy = (gap + j * (ch + gap) + ch / 2) - s.mouse[1]; v += Math.max(0, 0.6 - Math.hypot(dx, dy) / 140) }
        v = Math.max(0.04, Math.min(1, v))
        ctx.fillStyle = W + (v * 0.9).toFixed(3) + ')'
        ctx.fillRect(gap + i * (cw + gap), gap + j * (ch + gap), cw, ch)
      }
  })
  return <canvas ref={ref} aria-hidden="true" />
}

/* A toroidal ferrite core made of points, with a copper-free white winding, turning slowly. */
export function CoreCanvas() {
  const ref = useCanvas(
    (ctx, w, h, t, s) => {
      ctx.clearRect(0, 0, w, h)
      const ay = t * 0.4 + (s.mouse ? (s.mouse[0] / w - 0.5) * 2 : 0), ax = 1.05 + (s.mouse ? (s.mouse[1] / h - 0.5) * 0.6 : Math.sin(t * 0.3) * 0.15)
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax)
      const sc = Math.min(w, h) / 3.1
      const proj = []
      for (const [x, y, z, kind] of s.pts) {
        let X = x * cy + z * sy, Z = -x * sy + z * cy
        let Y = y * cx - Z * sx; Z = y * sx + Z * cx
        const k = 4 / (4 + Z)
        proj.push([w / 2 + X * sc * k, h / 2 + Y * sc * k, Z, kind])
      }
      proj.sort((a, b) => b[2] - a[2])
      for (const [x, y, z, kind] of proj) {
        const a = Math.max(0.05, Math.min(1, 0.55 - z * 0.45))
        if (kind) { ctx.fillStyle = W + a + ')'; ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4) }
        else { ctx.fillStyle = W + (a * 0.35) + ')'; ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4) }
      }
    },
    (w, h, s) => {
      const R = 1, r = 0.38, pts = []
      for (let i = 0; i < 90; i++) for (let j = 0; j < 22; j++) {
        const u = (i / 90) * Math.PI * 2, v = (j / 22) * Math.PI * 2
        pts.push([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u), 0])
      }
      // winding: a helix around the tube over 3/4 of the ring
      for (let i = 0; i < 1400; i++) {
        const u = (i / 1400) * Math.PI * 1.5 + 0.4, v = u * 26, rr = r + 0.06
        pts.push([(R + rr * Math.cos(v)) * Math.cos(u), rr * Math.sin(v), (R + rr * Math.cos(v)) * Math.sin(u), 1])
      }
      s.pts = pts
    }
  )
  return <canvas ref={ref} aria-hidden="true" />
}

/* PCB traces that route themselves in, with signal pulses running along them. */
const TRACES = [
  'M20 60 H140 L170 90 H300 L330 60 H460',
  'M20 120 H110 L140 150 H260 L290 120 H460',
  'M20 180 H80 L110 210 H230 L260 180 H360 L390 210 H460',
  'M20 240 H170 L200 270 H460',
  'M60 300 V250 M120 300 V240 M180 300 V280',
]
const PADS = [[20, 60], [460, 60], [20, 120], [460, 120], [20, 180], [460, 180], [20, 240], [460, 240], [300, 90], [260, 150], [230, 210], [170, 240]]
export function PcbSvg() {
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="pcbgrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.05)" /></pattern>
      </defs>
      <rect width="480" height="320" fill="url(#pcbgrid)" />
      <motion.rect x="190" y="110" width="80" height="80" fill="#000" stroke="#fff" strokeWidth="1.2"
        initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.9 }} style={{ transformOrigin: '230px 150px' }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} stroke="#fff" strokeWidth="1.2">
          <line x1="190" x2="182" y1={118 + i * 12.8} y2={118 + i * 12.8} /><line x1="270" x2="278" y1={118 + i * 12.8} y2={118 + i * 12.8} />
          <line y1="110" y2="102" x1={198 + i * 12.8} x2={198 + i * 12.8} /><line y1="190" y2="198" x1={198 + i * 12.8} x2={198 + i * 12.8} />
        </g>
      ))}
      {TRACES.map((d, i) => (
        <g key={i}>
          <motion.path d={d} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: i * 0.15, ease: [0.65, 0, 0.35, 1] }} />
          <path d={d} fill="none" stroke="#fff" strokeWidth="2.4" strokeDasharray="14 420" className="pulse" style={{ animationDelay: `${i * 0.7}s` }} />
        </g>
      ))}
      {PADS.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="5" fill="#000" stroke="#fff" strokeWidth="1.5"
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.05, type: 'spring', stiffness: 400 }} style={{ transformOrigin: `${x}px ${y}px` }} />
      ))}
      <text x="230" y="154" textAnchor="middle" fill="#fff" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.5">FE-01</text>
    </svg>
  )
}
