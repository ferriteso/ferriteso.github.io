import { motion } from 'framer-motion'
import { FieldCanvas } from '../components/Viz.jsx'
import { SplitHeadline, FadeUp, Marquee } from '../components/Motion.jsx'
import { PageHero, CtaBand } from '../components/Blocks.jsx'

const ROADMAP = [
  { state: 'Done', on: true, title: 'Founded', text: 'Ferrite starts in 2026 with one goal: build compute infrastructure properly.' },
  { state: 'Now', on: true, title: 'Power bench', text: 'First power stages and controller boards on the bench.' },
  { state: 'Next', on: false, title: 'Prototype rack', text: 'One full rack: power shelf, trays, cooling and switches together.' },
  { state: 'Later', on: false, title: 'Pilot cluster', text: 'Several racks running real workloads around the clock.' },
]

export default function Company() {
  return (
    <>
      <PageHero
        label="Company"
        lines={['Hard things,', 'built', 'properly.']}
        lede="Ferrite is a small engineering team building the machines behind modern compute. We are early, and we like it that way."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="panel" style={{ height: 380 }}>
            <FieldCanvas className="" density={20} />
            <span className="label tag">Field · move your cursor</span>
          </div>
        </div>
      </section>

      <section className="section rule">
        <div className="wrap stack" style={{ gap: 48 }}>
          <div className="split">
            <div className="stack">
              <span className="label">How we engineer</span>
              <SplitHeadline as="h2" className="h-l" lines={['Hard parts,', 'no heat loss.']} />
            </div>
            <FadeUp><p className="body">Four rules we hold every design to.</p></FadeUp>
          </div>
          <div className="grid4">
            {[
              ['Durability', 'Decades', 'Proven parts and real margins, so it keeps running long after launch day.'],
              ['Efficiency', 'No waste', 'Every watt, gram and part number has to earn its place.'],
              ['Testing', 'Measured', 'If it is not on the scope or the test rig, it is not done.'],
              ['Manufacturing', 'Buildable', 'Designed for the factory from day one, not fixed for it later.'],
            ].map(([l, v, p], i) => (
              <motion.div className="cell" key={l} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}>
                <span className="label">{l}</span><span className="v" style={{ fontSize: 'clamp(26px, 2.5vw, 38px)' }}>{v}</span><p>{p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="wrap stack" style={{ gap: 56 }}>
          <div className="split">
            <div className="stack">
              <span className="label">Roadmap</span>
              <SplitHeadline as="h2" className="h-l" lines={['Where we', 'are.']} />
            </div>
            <FadeUp><p className="body">In order. Filled squares are done or underway.</p></FadeUp>
          </div>
          <div className="timeline">
            {ROADMAP.map((r, i) => (
              <motion.div className="t" key={r.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}>
                <span className="label state"><i className={r.on ? 'on' : ''} /> {r.state}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Marquee outline items={['Built to matter', 'Ferrite', 'Built to matter', 'Ferrite']} />
      <CtaBand />
    </>
  )
}
