import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLinkedinIn } from 'react-icons/fa6'
import { SplitHeadline, FadeUp } from './Motion.jsx'
import { LINKEDIN } from './Nav.jsx'

export function Btn({ to, href, children, solid = false }) {
  const inner = <><span>{children}</span><span className="arrow">→</span></>
  if (href) return <a className={`btn ${solid ? 'solid' : ''}`} href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  return <Link className={`btn ${solid ? 'solid' : ''}`} to={to}>{inner}</Link>
}

export function PageHero({ label, lines, lede, children }) {
  return (
    <section className="hero page-hero">
      <div className="wrap">
        <FadeUp><span className="label">{label}</span></FadeUp>
        <SplitHeadline lines={lines} className="h-xl" delay={0.35} onLoad />
        <div className="hero-row">
          <FadeUp delay={0.6}><p className="lede">{lede}</p></FadeUp>
          {children}
        </div>
      </div>
    </section>
  )
}

export function Panel({ tag, live = true, height = 420, children, style }) {
  return (
    <motion.div
      className="panel"
      style={{ height, ...style }}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      {tag && <span className="label tag">{tag}</span>}
      {live && <span className="label tag-r"><i className="dot" /> Live sim</span>}
      {children}
    </motion.div>
  )
}

export function CtaBand() {
  return (
    <section className="section cta-band light">
      <div className="wrap">
        <span className="label">Follow the build</span>
        <SplitHeadline as="h2" className="h-xxl" lines={['Built to', 'matter.']} />
        <div className="hero-row">
          <p className="lede">We post progress, hardware and hiring on LinkedIn first.</p>
          <a className="btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}><FaLinkedinIn size={14} /> Follow on LinkedIn</span>
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
