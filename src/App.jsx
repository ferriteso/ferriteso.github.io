import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import Home from './pages/Home.jsx'
import Clusters from './pages/Clusters.jsx'
import Hardware from './pages/Hardware.jsx'
import Company from './pages/Company.jsx'
import NotFound from './pages/NotFound.jsx'

const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Three bars sweep across the screen between pages, echoing the logo.
function Wipe() {
  return (
    <div className="wipe" aria-hidden="true">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="wipe-bar"
          style={{ top: `${i * 33.34}%` }}
          initial={{ scaleX: 1, originX: 1 }}
          animate={{ scaleX: 0, transition: { duration: 0.7, delay: 0.08 * i, ease: [0.76, 0, 0.24, 1] } }}
          exit={{ scaleX: 1, originX: 0, transition: { duration: 0.5, delay: 0.06 * i, ease: [0.76, 0, 0.24, 1] } }}
        />
      ))}
    </div>
  )
}

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {!reduce && <Wipe />}
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.1 })
    window.__lenis = lenis
    let id
    const raf = t => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  return (
    <>
      <Cursor />
      <Nav />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => { window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0) }}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/clusters" element={<Page><Clusters /></Page>} />
          <Route path="/hardware" element={<Page><Hardware /></Page>} />
          <Route path="/company" element={<Page><Company /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
