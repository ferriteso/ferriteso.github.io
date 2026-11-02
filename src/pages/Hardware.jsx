import { ScopeCanvas, PcbSvg, CoreCanvas } from '../components/Viz.jsx'
import { SplitHeadline, FadeUp, Marquee, Row, CountUp, Scramble } from '../components/Motion.jsx'
import { PageHero, Panel, CtaBand, Btn } from '../components/Blocks.jsx'

export default function Hardware() {
  return (
    <>
      <PageHero
        label="Hardware"
        lines={['Power,', 'boards,', 'magnetics.']}
        lede="The electrical engineering under the cluster: converting power efficiently, routing it cleanly and getting the heat out."
      >
        <FadeUp delay={0.8}><Btn to="/clusters" solid>What it powers</Btn></FadeUp>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Panel tag="Buck stage · 3 channels" height={460}><ScopeCanvas /></Panel>
        </div>
      </section>

      <Marquee reverse items={['48 V → 0.8 V', 'Multiphase buck', 'GaN switching', 'Ferrite magnetics', 'Thermal design']} />

      <section className="section">
        <div className="wrap split" style={{ alignItems: 'center' }}>
          <div className="stack">
            <span className="label">Boards</span>
            <SplitHeadline as="h2" className="h-l" lines={['Routed', 'for power.']} />
            <FadeUp><p className="body">High-current boards fail at the copper: wide pours, short loops and careful stack-ups decide efficiency and noise. We lay out our own power and control boards.</p></FadeUp>
          </div>
          <Panel tag="FE-01 · controller board" live={false} height={420}><PcbSvg /></Panel>
        </div>
      </section>

      <section className="section rule">
        <div className="wrap split" style={{ alignItems: 'center' }}>
          <Panel tag="Toroid · wound core · drag to turn" height={520}><CoreCanvas /></Panel>
          <div className="stack">
            <Scramble className="label" text="Magnetics / where the name comes from" />
            <SplitHeadline as="h2" className="h-l" lines={['Iron oxide,', 'fired hard.']} />
            <FadeUp><p className="body">Ferrite is a ceramic of iron oxide and a second metal, pressed and sintered until it is hard. It sits inside nearly every power converter, shaping magnetic fields without turning energy into heat. Nobody sees it. Everything depends on it.</p></FadeUp>
          </div>
        </div>
      </section>

      <section className="section rule">
        <div className="wrap">
          <div className="grid4">
            <div className="cell"><span className="label">Resistivity, NiZn</span><span className="v">10<sup style={{ fontSize: '.5em' }}>5–7</sup><small>Ω·m</small></span><p>Blocks eddy currents, so cores stay cool at high frequency.</p></div>
            <div className="cell"><span className="label">Sintering</span><span className="v">~<CountUp to={1300} /><small>°C</small></span><p>Fired once, then it holds its shape for decades.</p></div>
            <div className="cell"><span className="label">Hardness</span><span className="v"><CountUp to={6} /><small>Mohs</small></span><p>Ground, never machined.</p></div>
            <div className="cell"><span className="label">Structure</span><span className="v">Spinel</span><p>A small, repeated, very stable cubic oxide lattice.</p></div>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="wrap stack" style={{ gap: 56 }}>
          <div className="split">
            <div className="stack">
              <span className="label">Disciplines</span>
              <SplitHeadline as="h2" className="h-l" lines={['What we', 'design.']} />
            </div>
            <FadeUp><p className="body">Each one built and tested on our own bench before it goes near a rack.</p></FadeUp>
          </div>
          <div className="rows">
            <Row idx="01" title="Power conversion">Rack-level rectification, 48 V distribution and multiphase point-of-load converters.</Row>
            <Row idx="02" title="Board design">Schematics, stack-ups and layout for power, control and monitoring boards.</Row>
            <Row idx="03" title="Magnetics">Custom inductors and transformers, modeled and measured for loss and saturation.</Row>
            <Row idx="04" title="Thermal">Cold plates, heat spreaders and the airflow and liquid paths around them.</Row>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
