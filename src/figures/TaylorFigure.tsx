import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * sin(x) and its Taylor polynomials, with the remainder visible as the gap
 * between the curve and the approximation. Counterexamples mirror the mean
 * value figure: a jump kills continuity; a corner kills the next derivative.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.35, 3.35],
  yDomain: [-0.55, 1.55],
});

const A = 0.35;
const B = 2.85;
const f = (x: number) => Math.sin(x);
const taylor = (n: number) => (x: number) => {
  let sum = 0;
  for (let k = 0; k <= n; k += 2) {
    sum += ((-1) ** (k / 2) * x ** k) / factorial(k);
  }
  return sum;
};

function factorial(n: number): number {
  let out = 1;
  for (let k = 2; k <= n; k += 1) out *= k;
  return out;
}

function degreeFor(i: number): number {
  if (i <= 0) return 1;
  if (i === 1) return 3;
  if (i <= 3) return 5;
  return 7;
}

export function TaylorFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'continuous') return <JumpCounterexample />;
  if (dropped === 'derivatives') return <CornerCounterexample />;

  const i = stepIndex;
  const n = degreeFor(i);
  const P = taylor(n);

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="sin x and its Taylor polynomial, with the remainder as the gap between them"
      caption={taylorCaptionFor(i)}
    >
      <Axes plot={plot} xTicks={[1, 2, 3]} yTicks={[-0.5, 0.5, 1]} />

      <Curve plot={plot} fn={f} domain={[A, B]} tone="accent" width={2.5} />
      <Curve plot={plot} fn={P} domain={[A, B]} tone="good" width={2.5} dashed={i <= 1} />

      <PointMark at={plot.pt([A, f(A)])} tone="accent" radius={4} />
      <PointMark at={plot.pt([B, f(B)])} tone="accent" radius={4} />
      <PointMark at={plot.pt([A, P(A)])} tone="good" radius={4} hollow />
      <PointMark at={plot.pt([B, P(B)])} tone="good" radius={4} hollow />

      {i >= 1 ? (
        <Segment from={plot.pt([B, f(B)])} to={plot.pt([B, P(B)])} tone="c" active />
      ) : null}

      <Label at={[plot.x(A), plot.y(0) + 18]} tone="neutral" size={13}>
        a
      </Label>
      <Label at={[plot.x(B), plot.y(0) + 18]} tone="neutral" size={13}>
        b
      </Label>
      <Label at={[plot.x(B) + 8, plot.y(f(B))]} tone="accent" size={13} anchor="start">
        f(b)
      </Label>
      {i >= 1 ? (
        <Label at={[plot.x(B) + 8, plot.y(P(B))]} tone="good" size={13} anchor="start">
          P_n(b)
        </Label>
      ) : null}
      {i >= 3 ? (
        <Label at={[plot.x(1.6), plot.y(1.35)]} tone="c" size={13} weight={600}>
          remainder
        </Label>
      ) : null}
      <Label at={[plot.x(2.2), plot.y(P(2.2)) - 14]} tone="good" size={13}>
        {`P_${n}`}
      </Label>
    </FigureFrame>
  );
}

function JumpCounterexample() {
  const jump = (x: number) => (x < 1 ? 0 : 1);
  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="Without continuity at the endpoint, the chord slope need not match any interior derivative"
      caption="Differentiable on (0, 1) with derivative 0, yet f(1) − f(0) = 1."
    >
      <Axes plot={plot} xTicks={[1, 2, 3]} yTicks={[0.5, 1]} />
      <Curve plot={plot} fn={jump} domain={[0, 0.98]} tone="accent" width={2.5} />
      <PointMark at={plot.pt([0, 0])} tone="accent" radius={4} />
      <PointMark at={plot.pt([1, 1])} tone="warn" radius={5} active />
      <Segment from={plot.pt([0, 0])} to={plot.pt([1, 1])} tone="c" dashed />
    </FigureFrame>
  );
}

function CornerCounterexample() {
  const abs = (x: number) => Math.abs(x - 1.5);
  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="Without the (n + 1)st derivative, Rolle cannot be applied again"
      caption="A level chord through |x − 1.5|, but no interior point has derivative 0."
    >
      <Axes plot={plot} xTicks={[1, 2, 3]} yTicks={[0.5, 1]} />
      <Curve plot={plot} fn={abs} domain={[0.2, 2.8]} tone="accent" width={2.5} />
      <PointMark at={plot.pt([0.2, abs(0.2)])} tone="accent" radius={4} />
      <PointMark at={plot.pt([2.8, abs(2.8)])} tone="accent" radius={4} />
      <Segment from={plot.pt([0.2, abs(0.2)])} to={plot.pt([2.8, abs(2.8)])} tone="c" dashed />
      <PointMark at={plot.pt([1.5, 0])} tone="warn" radius={5} active />
    </FigureFrame>
  );
}

function taylorCaptionFor(i: number): string {
  if (i <= 0) return 'P_n matches f and its first n derivatives at a.';
  if (i === 1) return 'The auxiliary function φ is built so φ(a) = φ(b) = 0.';
  if (i === 2) return 'Rolle applied repeatedly drives φ^{(n)} to zero at an interior point.';
  if (i === 3) return 'Solving for R_n(b) gives the Lagrange remainder in one term.';
  return 'More terms shrink the remainder when f^{(n+1)} is bounded — the polynomial tracks the curve.';
}
