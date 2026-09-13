import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, createPlot } from './primitives/plot';
import { SequenceDots } from './primitives/sequence';
import { Label, Segment } from './primitives/shapes';

/**
 * Taylor polynomials as initial segments of a power series, and the geometric
 * series as the model with a visible radius of convergence.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-1.35, 1.35],
  yDomain: [-0.35, 2.35],
});

const f = (x: number) => Math.exp(x);
const taylor = (n: number) => (x: number) => {
  let sum = 0;
  let term = 1;
  for (let k = 0; k <= n; k += 1) {
    if (k > 0) term *= x / k;
    sum += term;
  }
  return sum;
};

const geometric = (n: number) => (x: number) => {
  let sum = 0;
  for (let k = 0; k <= n; k += 1) sum += x ** k;
  return sum;
};

export function PowerSeriesFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  if (i <= 1) {
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="The Taylor polynomials of e^x are finite power series centred at 0"
        caption={powerCaptionFor(i)}
      >
        <Axes plot={plot} xTicks={[-1, 1]} yTicks={[1, 2]} />
        <Curve plot={plot} fn={f} domain={[-1.2, 1.2]} tone="accent" width={2.5} />
        <Curve plot={plot} fn={taylor(1)} domain={[-1.2, 1.2]} tone="b" width={2} />
        <Curve plot={plot} fn={taylor(3)} domain={[-1.2, 1.2]} tone="c" width={2} />
        <Label at={[plot.x(1.05), plot.y(f(1.05))]} tone="accent" size={13} anchor="start">
          e^x
        </Label>
        <Label at={[plot.x(-1.1), plot.y(taylor(1)(-1.1)) - 10]} tone="b" size={13}>
          P_1
        </Label>
        <Label at={[plot.x(0.95), plot.y(taylor(3)(0.95)) + 14]} tone="c" size={13}>
          P_3
        </Label>
      </FigureFrame>
    );
  }

  if (i === 2) {
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="A power series is one coefficient per power of (x − a)"
        caption={powerCaptionFor(i)}
      >
        <Axes plot={plot} xTicks={[-1, 1]} yTicks={[1, 2]} />
        <Curve plot={plot} fn={f} domain={[-1.2, 1.2]} tone="accent" width={2.5} />
        <Curve plot={plot} fn={taylor(5)} domain={[-1.2, 1.2]} tone="good" width={2.5} />
        <Label at={[plot.x(-0.15), plot.y(2.15)]} tone="neutral" size={13} weight={600}>
          Σ c_n x^n
        </Label>
      </FigureFrame>
    );
  }

  const inside = i <= 4;
  const x = inside ? 0.7 : 1.15;
  const degree = i >= 4 ? 12 : 8;
  const geoPlot = createPlot({
    width: 430,
    height: 310,
    padding: { top: 26, right: 26, bottom: 36, left: 42 },
    xDomain: [-0.15, 1.45],
    yDomain: [-0.35, inside ? 3.4 : 6.5],
  });
  const target = 1 / (1 - x);

  return (
    <FigureFrame
      viewBox={geoPlot.viewBox}
      title={`Partial sums of Σx^n at x = ${x}${inside ? ' (inside the radius)' : ' (outside the radius)'}`}
      caption={powerCaptionFor(i)}
    >
      <Axes plot={geoPlot} xLabel="n" xTicks={[5, 10]} yTicks={inside ? [1, 2, 3] : [2, 4, 6]} />

      <Label
        at={[geoPlot.x(geoPlot.xDomain[1]), geoPlot.y(inside ? 3.05 : 6.1)]}
        tone={inside ? 'good' : 'warn'}
        size={13}
        anchor="end"
      >
        {inside ? '|x| < 1: partial sums settle' : '|x| > 1: partial sums grow'}
      </Label>

      <SequenceDots
        plot={geoPlot}
        terms={Array.from({ length: 14 }, (_, i) => geometric(i + 1)(x))}
        tone={inside ? 'accent' : 'warn'}
        connect
      />

      {inside ? (
        <>
          <Segment
            from={geoPlot.pt([geoPlot.xDomain[0], target])}
            to={geoPlot.pt([geoPlot.xDomain[1], target])}
            tone="good"
            dashed
          />
          <Label at={[geoPlot.x(geoPlot.xDomain[1]), geoPlot.y(target) - 12]} tone="good" size={13} anchor="end">
            1/(1 − x)
          </Label>
        </>
      ) : (
        <Label at={[geoPlot.x(geoPlot.xDomain[1]), geoPlot.y(5.8)]} tone="warn" size={13} anchor="end">
          partial sums grow
        </Label>
      )}

      <Label at={[geoPlot.x(0.4), geoPlot.y(inside ? 3.05 : 6.1)]} tone="neutral" size={13}>
        {`P_${degree}(${x}) = ${geometric(degree)(x).toFixed(2)}`}
      </Label>
    </FigureFrame>
  );
}

function powerCaptionFor(i: number): string {
  if (i <= 0) return 'The Taylor polynomial matches f and its derivatives at a — the first segment of a power series.';
  if (i === 1) return 'More terms tighten the fit near a; an infinite sum would be the full series.';
  if (i === 2) return 'Fix x and the power series becomes an ordinary series to test for convergence.';
  if (i === 3) return 'The geometric series Σx^n converges exactly when |x| < 1.';
  return 'Past the radius the partial sums fail the Cauchy tail test and grow without bound.';
}
