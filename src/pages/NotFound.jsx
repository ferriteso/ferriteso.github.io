import { FieldCanvas } from '../components/Viz.jsx'
import { SplitHeadline, Scramble } from '../components/Motion.jsx'
import { Btn } from '../components/Blocks.jsx'

export default function NotFound() {
  return (
    <section className="hero">
      <FieldCanvas />
      <div className="wrap">
        <Scramble className="label" text="Error 404" />
        <SplitHeadline lines={['Open', 'circuit.']} className="h-xxl" delay={0.3} onLoad />
        <p className="lede">Nothing is connected at this address.</p>
        <div className="ctas"><Btn to="/" solid>Back home</Btn></div>
      </div>
    </section>
  )
}
