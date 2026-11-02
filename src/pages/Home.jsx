import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FieldCanvas, FabricCanvas, ScopeCanvas, RackCanvas } from '../components/Viz.jsx'
import { SplitHeadline, FadeUp, Scramble, Marquee, CountUp, Row } from '../components/Motion.jsx'
import { Btn, Panel, CtaBand } from '../components/Blocks.jsx'

export default function Home() {
  return (
    <>
      <section className="hero">
        <FieldCanvas />
        <div className="wrap">
          <FadeUp delay={0.3}><Scramble className="label" text="Ferrite — Clusters & Hardware" delay={0.4} /></FadeUp>
          <SplitHeadline lines={['Built to', 'matter.']} className="h-xxl" delay={0.45} onLoad />
          <div className="hero-row">
            <FadeUp delay={0.8}>
              <p className="lede">We build compute clusters and the electrical hardware under them: power delivery, boards, magnetics and cooling.</p>
            </FadeUp>
            <FadeUp delay={0.95} className="ctas">
              <Btn to="/clusters" solid>Explore clusters</Btn>
              <Btn to="/hardware">See the hardware</Btn>
            </FadeUp>
          </div>
          <FadeUp delay={1.1} className="coords label">
            <span>Fe₂O₃ · MO</span>
            <span>Spinel / Fd3m</span>
            <span>Move your cursor ↗</span>
          </FadeUp>
        </div>
      </section>

      <Marquee items={['Compute clusters', 'Power delivery', 'Liquid cooling', 'Custom boards', 'Magnetics', 'Rack-scale systems']} />

      <section className="section">
        <div className="wrap stack" style={{ gap: 56 }}>
          <div className="split">
            <div className="stack">
              <span className="label">What we build</span>
              <SplitHeadline as="h2" className="h-l" lines={['From the wall', 'socket to', 'the model.']} />
            </div>
            <FadeUp delay={0.2}>
              <p className="body" style={{ marginTop: 8 }}>Most compute is limited by power, heat and wiring long before it runs out of chips. We design the whole path: how electricity arrives, how it is converted, how heat leaves, and how thousands of processors talk to each other.</p>
            </FadeUp>
          </div>
          <div className="cards">
            <Link to="/clusters" className="card" data-hover>
              <div className="stack" style={{ gap: 12 }}>
                <span className="label">01 · Clusters</span>
                <h3 className="h-m">Rack-scale compute</h3>
              </div>
              <div className="viz"><FabricCanvas /></div>
              <div className="go"><span className="body">Nodes, fabric, cooling and orchestration.</span><span className="arrow">↗</span></div>
            </Link>
            <Link to="/hardware" className="card" data-hover>
              <div className="stack" style={{ gap: 12 }}>
                <span className="label">02 · Hardware</span>
                <h3 className="h-m">Power and boards</h3>
              </div>
              <div className="viz"><ScopeCanvas /></div>
              <div className="go"><span className="body">Converters, PCBs, magnetics and thermal.</span><span className="arrow">↗</span></div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section rule">
        <div className="wrap stack" style={{ gap: 48 }}>
          <div className="hero-row">
            <SplitHeadline as="h2" className="h-l" lines={['Design', 'targets.']} />
            <FadeUp><p className="body">What our first rack is being designed to hit. Targets, not shipped numbers.</p></FadeUp>
          </div>
          <div className="grid4">
            <div className="cell"><span className="label">Rack power</span><span className="v"><CountUp to={120} /><small>kW</small></span><p>Per rack, liquid cooled, without derating.</p></div>
            <div className="cell"><span className="label">DC bus</span><span className="v"><CountUp to={48} /><small>V</small></span><p>One bus across the rack, fewer conversion stages.</p></div>
            <div className="cell"><span className="label">Conversion</span><span className="v"><CountUp to={97.5} decimals={1} /><small>%</small></span><p>Grid to chip efficiency for the power chain.</p></div>
            <div className="cell"><span className="label">Coolant in</span><span className="v"><CountUp to={45} /><small>°C</small></span><p>Warm-water cooling, no chillers required.</p></div>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="wrap stack" style={{ gap: 56 }}>
          <div className="split">
            <div className="stack">
              <span className="label">The stack</span>
              <SplitHeadline as="h2" className="h-l" lines={['Top to', 'bottom.']} />
            </div>
            <FadeUp><p className="body">Six layers, one team. Every layer is designed knowing what sits above and below it.</p></FadeUp>
          </div>
          <div className="rows">
            <Row idx="L6" title="Orchestration">Scheduling, health checks and failover across the whole cluster.</Row>
            <Row idx="L5" title="Network fabric">Spine–leaf networking so any node reaches any other in two hops.</Row>
            <Row idx="L4" title="Compute nodes">Dense accelerator trays built for easy service and direct liquid cooling.</Row>
            <Row idx="L3" title="Power delivery">48 V distribution and point-of-load converters right next to the silicon.</Row>
            <Row idx="L2" title="Cooling">Direct-to-chip liquid loops, manifolds and heat rejection.</Row>
            <Row idx="L1" title="Magnetics">Inductors and transformers on ferrite cores, the parts we are named for.</Row>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split" style={{ alignItems: 'center' }}>
          <div className="stack">
            <span className="label">Rack-scale from day one</span>
            <SplitHeadline as="h2" className="h-l" lines={['The rack', 'is the', 'computer.']} />
            <FadeUp><p className="body">We design the rack as one machine: power shelf, compute trays, switches and coolant manifolds planned together instead of bolted together later.</p></FadeUp>
            <FadeUp delay={0.1}><Btn to="/clusters">Inside the cluster</Btn></FadeUp>
          </div>
          <Panel tag="Rack 01 / 12U view" height={520}><RackCanvas /></Panel>
        </div>
      </section>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Marquee outline reverse items={['Built to matter', 'Ferrite', 'Built to matter', 'Ferrite']} />
      </motion.div>

      <CtaBand />
    </>
  )
}
