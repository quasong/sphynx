import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Band, createPlot } from './primitives/plot';
import { SequenceDots, SequenceEscapes } from './primitives/sequence';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * The radius as a supremum on the line: inside, partial sums settle; outside,
 * they climb. A farther witness of convergence supplies the geometric bound.
 */

const A = 0;
const R = 1;
const X_IN = 0.55;
const X_OUT = 1.35;
const X0 = 0.85;

const COUNT = 14;
const from = (f: (n: number) => number) =>
  Array.from({ length: COUNT }, (_, i) => f(i + 1));

function partialSums(x: number): number[] {
  let total = 0;
  return from((n) => {
    total += x ** (n - 1);
    return total;
  });
}

const INSIDE = partialSums(X_IN);
const OUTSIDE = partialSums(X_OUT);
const LIMIT = 1 / (1 - X_IN);

const line = createPlot({
  width: 430,
  height: 200,
  padding: { top: 36, right: 28, bottom: 48, left: 28 },
  xDomain: [-1.7, 1.7],
  yDomain: [-0.35, 0.55],
});

const sums = createPlot({
  width: 430,
  height: 300,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [0, COUNT + 1],
  yDomain: [-0.3, 4.2],
});

export function RadiusOfConvergenceFigure({ stepIndex, dropped }: FigureProps) {
  const i = stepIndex;
  if (dropped === 'complete') return <IncompleteInside />;

  if (i <= 0) return <RadiusLine stage="set" />;
  if (i === 1) return <RadiusLine stage="outside" />;
  if (i === 2) return <RadiusLine stage="witness" />;
  if (i === 3) return <GeometricCompare />;
  if (i === 4) return <PartialSumsScene mode="inside" />;
  return <RadiusLine stage="conclude" />;
}

function RadiusLine({ stage }: { stage: 'set' | 'outside' | 'witness' | 'conclude' }) {
  const showOutside = stage === 'outside' || stage === 'conclude';
  const showWitness = stage === 'witness' || stage === 'conclude';
  const showInsidePoint = stage === 'set' || stage === 'witness' || stage === 'conclude';

  return (
    <FigureFrame
      viewBox={line.viewBox}
      title="The radius as a supremum on the number line around the centre a"
      caption={captionFor(stage)}
    >
      <Segment from={line.pt([-1.55, 0])} to={line.pt([1.55, 0])} tone="neutral" />
      <Band plot={line} orientation="vertical" from={-R} to={R} tone="good" />

      <PointMark at={line.pt([A, 0])} tone="accent" radius={5} active />
      <Label at={[line.x(A), line.y(0) + 22]} tone="accent" size={14} weight={700}>
        a
      </Label>

      <PointMark at={line.pt([-R, 0])} tone="good" radius={4} hollow />
      <PointMark at={line.pt([R, 0])} tone="good" radius={4} hollow />
      <Label at={[line.x(R), line.y(0) - 16]} tone="good" size={13} weight={600}>
        a + R
      </Label>
      <Label at={[line.x(-R), line.y(0) - 16]} tone="good" size={13} weight={600}>
        a − R
      </Label>

      {showInsidePoint ? (
        <>
          <PointMark at={line.pt([X_IN, 0])} tone="accent" radius={4} />
          <Label at={[line.x(X_IN), line.y(0) + 22]} tone="accent" size={13}>
            x
          </Label>
        </>
      ) : null}

      {showOutside ? (
        <>
          <PointMark at={line.pt([X_OUT, 0])} tone="warn" radius={5} active />
          <Label at={[line.x(X_OUT), line.y(0) + 22]} tone="warn" size={13} weight={600}>
            |x − a| &gt; R
          </Label>
        </>
      ) : null}

      {showWitness ? (
        <>
          <PointMark at={line.pt([X0, 0])} tone="c" radius={5} active />
          <Label at={[line.x(X0), line.y(0) - 18]} tone="c" size={13} weight={600}>
            x₀
          </Label>
          <Segment from={line.pt([X_IN, 0.22])} to={line.pt([X0, 0.22])} tone="c" dashed />
          <Label at={[line.x((X_IN + X0) / 2), line.y(0.38)]} tone="c" size={12}>
            farther witness
          </Label>
        </>
      ) : null}

      <Label at={[line.x(0), line.y(0.42)]} tone="good" size={13} weight={600}>
        |x − a| &lt; R
      </Label>
    </FigureFrame>
  );
}

function GeometricCompare() {
  const rho = X_IN / X0;
  const bound = from((n) => 1.2 * rho ** (n - 1));
  const terms = from((n) => Math.abs(X_IN ** (n - 1)));

  return (
    <FigureFrame
      viewBox={sums.viewBox}
      title="Absolute terms at x bounded by a geometric sequence from the witness x₀"
      caption={captionFor('geometric')}
    >
      <Axes plot={sums} xLabel="n" xTicks={[5, 10]} yTicks={[0.5, 1, 1.5]} />
      <SequenceDots plot={sums} terms={bound} tone="c" connect />
      <SequenceDots plot={sums} terms={terms} tone="accent" connect />
      <Label at={[sums.x(sums.xDomain[1]), sums.y(1.7)]} tone="c" size={13} anchor="end">
        M ρⁿ
      </Label>
      <Label at={[sums.x(sums.xDomain[1]), sums.y(0.55)]} tone="accent" size={13} anchor="end">
        |cₙ (x − a)ⁿ|
      </Label>
    </FigureFrame>
  );
}

function PartialSumsScene({ mode }: { mode: 'inside' | 'outside' }) {
  const inside = mode === 'inside';
  const terms = inside ? INSIDE : OUTSIDE;
  const plot = createPlot({
    width: 430,
    height: 300,
    padding: { top: 26, right: 26, bottom: 36, left: 42 },
    xDomain: [0, COUNT + 1],
    yDomain: inside ? [1.4, 2.5] : [-0.3, 8],
  });

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title={
        inside
          ? 'Absolute convergence inside the radius: partial sums settle'
          : 'Past the radius the partial sums grow without bound'
      }
      caption={captionFor(inside ? 'absolute' : 'outside')}
    >
      <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={inside ? [1.5, 2, 2.5] : [2, 4, 6]} />
      {inside ? (
        <>
          <Segment from={plot.pt([plot.xDomain[0], LIMIT])} to={plot.pt([plot.xDomain[1], LIMIT])} tone="good" dashed />
          <Label at={[plot.x(plot.xDomain[1]), plot.y(LIMIT) - 12]} tone="good" size={13} anchor="end">
            limit
          </Label>
        </>
      ) : (
        <SequenceEscapes plot={plot} terms={terms} tone="warn" />
      )}
      <SequenceDots plot={plot} terms={terms} tone={inside ? 'accent' : 'warn'} connect />
    </FigureFrame>
  );
}

function IncompleteInside() {
  return (
    <FigureFrame
      viewBox={sums.viewBox}
      title="Without completeness, Cauchy absolute tails need not converge in ℚ"
      caption="The geometric comparison still confines the tails; only the limit may be missing."
    >
      <Axes plot={sums} xLabel="n" xTicks={[5, 10]} yTicks={[1.5, 2, 2.5]} />
      <Band plot={sums} orientation="horizontal" from={LIMIT - 0.12} to={LIMIT + 0.12} tone="a" />
      <SequenceDots plot={sums} terms={INSIDE} tone="warn" connect />
      <Label at={[sums.x(sums.xDomain[1]), sums.y(LIMIT) - 14]} tone="warn" size={13} anchor="end">
        Cauchy, no rational limit
      </Label>
    </FigureFrame>
  );
}

function captionFor(
  stage: 'set' | 'outside' | 'witness' | 'geometric' | 'absolute' | 'conclude',
): string {
  if (stage === 'set') return 'R is the supremum of every distance from a at which the series converges.';
  if (stage === 'outside') return 'Nothing past R can belong to that set — so the series diverges there.';
  if (stage === 'witness') return 'Inside R, a farther point of convergence supplies a bound on the coefficients.';
  if (stage === 'geometric') return 'Each absolute term is at most M ρⁿ with ρ < 1 — a convergent geometric series.';
  if (stage === 'absolute') return 'Cauchy tails of the absolute series converge over ℝ, so the power series converges absolutely.';
  return 'Inside: absolute convergence. Outside: divergence. The endpoints |x − a| = R are left open.';
}
