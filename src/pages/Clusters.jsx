import { useEffect, useState } from 'react'
import { FabricCanvas, HeatCanvas, RackCanvas } from '../components/Viz.jsx'
import { SplitHeadline, FadeUp, Marquee, Row, Scramble } from '../components/Motion.jsx'
import { PageHero, Panel, CtaBand, Btn } from '../components/Blocks.jsx'

const PODS = ['POD-A', 'POD-B', 'POD-C', 'POD-D', 'POD-E', 'POD-F']

// Simulated telemetry so the page feels alive. Clearly labelled as a simulation on screen.
function Telemetry() {
  const make = () => PODS.map(p => ({ p, load: 55 + Math.random() * 43, temp: 38 + Math.random() * 9, kw: 80 + Math.random() * 38 }))
  const [rows, setRows] = useState(make)
  useEffect(() => { const id = setInterval(() => setRows(make()), 1600); return () => clearInterval(id) }, [])
  return (
    <div className="board">
      <div className="bh"><span>Pod telemetry</span><span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><i className="dot" /> Simulated</span></div>
      <div className="br" style={{ color: 'var(--grey)' }}><span>Pod</span><span>Load</span><span>Coolant</span><span>Power</span></div>
      {rows.map(r => (
        <div className="br" key={r.p}>
          <span>{r.p}</span>
          <span className="bar"><i style={{ width: `${r.load}%` }} /></span>
          <span>{r.temp.toFixed(1)} °C</span>
          <span>{r.kw.toFixed(0)} kW</span>
        </div>
      ))}
    </div>
  )
}

export default function Clusters() {
  return (
    <>
      <PageHero
        label="Clusters"
        lines={['Compute,', 'at rack', 'scale.']}
        lede="Clusters designed as one system: nodes, network, power and cooling planned together so they scale without surprises."
      >
        <FadeUp delay={0.8}><Btn to="/hardware" solid>The hardware under it</Btn></FadeUp>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Panel tag="Fabric · spine–leaf · hover a node" height={520}><FabricCanvas /></Panel>
        </div>
      </section>

      <Marquee items={['Two-hop fabric', 'Direct-to-chip cooling', '48 V rack bus', 'Hot-swap trays', 'Telemetry everywhere']} />

      <section className="section">
        <div className="wrap split">
          <div className="stack">
            <span className="label">Observability</span>
            <SplitHeadline as="h2" className="h-l" lines={['Every watt', 'accounted', 'for.']} />
            <FadeUp><p className="body">Each pod reports load, coolant temperature and power draw continuously, so we can see a problem in the plumbing before it shows up in a job.</p></FadeUp>
          </div>
          <FadeUp delay={0.15}><Telemetry /></FadeUp>
        </div>
      </section>

      <section className="section rule">
        <div className="wrap stack" style={{ gap: 40 }}>
          <div className="hero-row">
            <SplitHeadline as="h2" className="h-l" lines={['Load,', 'in motion.']} />
            <FadeUp><p className="body">Accelerator utilization across a pod. Move your cursor over it to push load into a region.</p></FadeUp>
          </div>
          <Panel tag="Accelerator utilization · 384 devices" height={360}><HeatCanvas /></Panel>
        </div>
      </section>

      <section className="section light">
        <div className="wrap stack" style={{ gap: 56 }}>
          <div className="split">
            <div className="stack">
              <span className="label">Inside a cluster</span>
              <SplitHeadline as="h2" className="h-l" lines={['Four', 'systems.']} />
            </div>
            <FadeUp><p className="body">What we are designing and building in-house.</p></FadeUp>
          </div>
          <div className="rows">
            <Row idx="01" title="Compute trays">Dense accelerator trays with cold plates, blind-mate power and front-serviceable parts.</Row>
            <Row idx="02" title="Network">Spine–leaf switching with predictable latency between any two nodes.</Row>
            <Row idx="03" title="Cooling loop">Manifolds, quick disconnects and coolant distribution sized for the full rack.</Row>
            <Row idx="04" title="Control plane">Provisioning, health monitoring and automatic drain of failing nodes.</Row>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split" style={{ alignItems: 'center' }}>
          <Panel tag="Rack 01 · drag to rotate" height={560}><RackCanvas units={14} /></Panel>
          <div className="stack">
            <Scramble className="label" text="Rack 01 / Prototype" />
            <SplitHeadline as="h2" className="h-l" lines={['One rack,', 'one', 'machine.']} />
            <FadeUp><p className="body">Power shelf at the base, compute trays in the middle, switches on top, coolant down the back. Our first prototype rack is in design now.</p></FadeUp>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
