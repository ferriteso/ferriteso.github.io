import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLinkedinIn } from 'react-icons/fa6'
import { Wordmark } from './Logo.jsx'
import { LINKEDIN, PAGES } from './Nav.jsx'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="stack" style={{ gap: 16 }}>
            <span className="label">Ferrite</span>
            <p className="h-m" style={{ maxWidth: '16ch' }}>Built to Matter.</p>
          </div>
          <nav aria-label="Footer">
            <span className="label">Pages</span>
            <Link to="/">Home</Link>
            {PAGES.map(p => <Link key={p.to} to={p.to}>{p.label}</Link>)}
          </nav>
          <nav aria-label="Social">
            <span className="label">Follow</span>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
              <FaLinkedinIn size={14} /> LinkedIn ↗
            </a>
          </nav>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Wordmark className="giant" height={undefined} style={{ width: '100%', height: 'auto' }} />
        </motion.div>
        <div className="foot-bot label">
          <span>© 2026 Ferrite</span>
          <span>Clusters · Power · Hardware</span>
        </div>
      </div>
    </footer>
  )
}
