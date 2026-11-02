import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaLinkedinIn } from 'react-icons/fa6'
import { Mark, Wordmark } from './Logo.jsx'

export const LINKEDIN = 'https://www.linkedin.com/company/ferriteso'
export const PAGES = [
  { to: '/clusters', label: 'Clusters' },
  { to: '/hardware', label: 'Hardware' },
  { to: '/company', label: 'Company' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
        <div className="wrap nav-in">
          <Link className="brand" to="/" aria-label="Ferrite home" data-hover>
            <Mark size={24} animate />
            <Wordmark height={17} />
          </Link>
          <nav className="links" aria-label="Main">
            {PAGES.map(p => (
              <NavLink key={p.to} to={p.to} className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`} data-hover>
                {({ isActive }) => (
                  <>
                    {p.label}
                    {isActive && <motion.span layoutId="nav-ind" className="ind" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  </>
                )}
              </NavLink>
            ))}
            <a className="social" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="Ferrite on LinkedIn" data-hover>
              <FaLinkedinIn size={16} />
            </a>
            <button className={`burger ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
              <i /><i /><i />
            </button>
          </nav>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}>
            {[{ to: '/', label: 'Home' }, ...PAGES].map((p, i) => (
              <motion.div key={p.to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06 }}>
                <Link to={p.to}>{p.label}</Link>
              </motion.div>
            ))}
            <motion.a className="label" style={{ marginTop: 24, textDecoration: 'none' }} href={LINKEDIN} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              LinkedIn ↗
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
