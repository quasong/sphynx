import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.12, 3.2],
  yDomain: [-0.2, 3.6],
});

const C = 0.35;
const L = 0.42;
const u = (t: number) => 0.35 + 0.18 * Math.sin(1.7 * t + 0.25);
const v = (t: number) => C + L * (0.35 * t + (0.18 / 1.7) * (Math.cos(0.25) - Math.cos(1.7 * t + 0.25)));
const envelope = (t: number) => C * Math.exp(L * t);
const factor = (t: number) => Math.exp(-L * t) * v(t);

export function GronwallFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'continuous') return <NonIntegrable />;
  const i = stepIndex;
  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A continuous error curve under its accumulated comparison and exponential envelope"
      caption={captionFor(i)}
    >
      <Axes plot={plot} xTicks={[1, 2, 3]} yTicks={[1, 2, 3]} />
      <Curve plot={plot} fn={u} domain={[0, 3]} tone="accent" width={2.5} />
      {i >= 0 ? <Curve plot={plot} fn={v} domain={[0, 3]} tone="a" width={2} dashed={i < 2} /> : null}
      {i >= 3 ? <Curve plot={plot} fn={envelope} domain={[0, 3]} tone="good" width={2.5} /> : null}
      {i === 1 ? (
        <>
          <Segment from={plot.pt([1.55, 0])} to={plot.pt([1.55, factor(1.55)])} tone="c" dashed />
          <Label at={[plot.x(1.55) + 8, plot.y(factor(1.55))]} tone="c" size={13} weight={600} anchor="start">w = e⁻ᴸᵗv</Label>
        </>
      ) : null}
      {i >= 2 ? <PointMark at={plot.pt([0, factor(0)])} tone="good" radius={4} /> : null}
      <Label at={[plot.x(3) + 7, plot.y(u(3))]} tone="accent" size={13} weight={600} anchor="start">|u|</Label>
      {i >= 0 ? <Label at={[plot.x(3) + 7, plot.y(v(3))]} tone="a" size={13} weight={600} anchor="start">v</Label> : null}
      {i >= 3 ? <Label at={[plot.x(3) + 7, plot.y(envelope(3))]} tone="good" size={13} weight={600} anchor="start">Ceᴸᵗ</Label> : null}
    </FigureFrame>
  );
}

function NonIntegrable() {
  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A schematic discontinuous error with values one on rationals and zero on irrationals"
      caption="The Riemann integral of |u| is not defined, so the comparison function cannot be formed by the theory in this library."
    >
      <Axes plot={plot} xTicks={[1, 2, 3]} yTicks={[1]} />
      {Array.from({ length: 52 }, (_, index) => {
        const x = (3 * index) / 51;
        return (
          <g key={index}>
            <PointMark at={plot.pt([x, 1])} tone="warn" radius={1.7} />
            <PointMark at={plot.pt([(3 * index + Math.SQRT1_2) / 52, 0])} tone="warn" radius={1.7} />
          </g>
        );
      })}
      <Label at={[plot.x(1.5), plot.y(1.25)]} tone="warn" size={14} weight={700}>upper sum 3, lower sum 0</Label>
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i < 0) return 'An error curve, its accumulated comparison function, and the exponential envelope Grönwall will force.';
  if (i === 0) return 'The comparison v(t) starts at C and stays above |u(t)|.';
  if (i === 1) return 'Multiplying by e⁻ᴸᵗ removes the growth that the integral inequality allows.';
  if (i === 2) return 'The discounted comparison w has non-positive derivative, so it never rises above C.';
  if (i === 3) return 'Undo the factor: v(t) is at most C eᴸᵗ.';
  return 'Since |u| lies below v, the same exponential envelope bounds the error; C = 0 forces u ≡ 0.';
}
