import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, Tube, createPlot } from './primitives/plot';
import { Label, Segment } from './primitives/shapes';
import { fill, stroke } from './primitives/tone';

/**
 * The geometric example f_k(x)=x^k/2^k. Its numerical envelopes are visible
 * above the graph, so the same shrinking tail can be read as a row of numbers
 * and as a uniform tube around the sum function.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 108, right: 26, bottom: 34, left: 42 },
  xDomain: [-0.06, 1.08],
  yDomain: [-0.12, 1.18],
});

const DOMAIN: readonly [number, number] = [0, 1];
const term = (k: number) => (x: number) => x ** k / 2 ** k;
const partial = (n: number) => (x: number) => {
  let total = 0;
  for (let k = 1; k <= n; k += 1) total += term(k)(x);
  return total;
};
const limit = (x: number) => x / (2 - x);
const tail = (n: number) => 2 ** (-n);

export function MTestFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'uniform-majorant') return <MovingSpikes />;
  if (dropped === 'summable-majorant') return <HarmonicWalls />;

  const i = stepIndex;
  const n = i <= 0 ? 1 : i === 1 ? 2 : i <= 3 ? 3 : i === 4 ? 4 : 5;
  const showLimit = i >= 4;
  const showTube = i >= 2;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A geometric row of numerical majorants above partial-sum functions trapped by the same shrinking tail"
      caption={captionFor(i, n)}
    >
      <MajorantBars n={n} active={i >= 1} />
      <Axes plot={plot} xTicks={[1]} yTicks={[0.5, 1]} />

      {i <= 0 ? (
        <>
          {[1, 2, 3].map((k) => (
            <Curve key={k} plot={plot} fn={term(k)} domain={DOMAIN} tone={k === 1 ? 'accent' : 'a'} width={2} />
          ))}
          <Label at={[plot.x(0.04), plot.y(1.02)]} tone="neutral" size={13} anchor="start">
            |fₖ(x)| ≤ Mₖ
          </Label>
        </>
      ) : (
        <>
          {showTube ? (
            <Tube
              plot={plot}
              fn={showLimit ? limit : partial(n)}
              domain={DOMAIN}
              half={tail(n)}
              tone={showLimit ? 'good' : 'c'}
            />
          ) : null}
          <Curve plot={plot} fn={partial(n)} domain={DOMAIN} tone="accent" width={3} />
          {i === 2 || i === 3 ? (
            <Curve plot={plot} fn={partial(n + 3)} domain={DOMAIN} tone="b" width={2.5} />
          ) : null}
          {showLimit ? <Curve plot={plot} fn={limit} domain={DOMAIN} tone="good" width={2.5} /> : null}

          <Label at={[plot.x(0.97), plot.y(partial(n)(0.97)) + 14]} tone="accent" size={13} weight={700} anchor="end">
            Sₙ
          </Label>
          {showLimit ? (
            <Label at={[plot.x(0.97), plot.y(limit(0.97)) - 14]} tone="good" size={13} weight={700} anchor="end">
              S
            </Label>
          ) : null}
          {i === 3 ? (
            <Segment
              from={plot.pt([1, partial(n)(1)])}
              to={plot.pt([1, partial(n + 3)(1)])}
              tone="c"
              active
              label="< tail"
              labelGap={28}
            />
          ) : null}
          {i >= 5 ? (
            <Label at={[plot.x(0.04), plot.y(1.04)]} tone={i >= 6 ? 'good' : 'c'} size={13} weight={600} anchor="start">
              {i >= 6 ? 'absolute and uniform' : 'one tail bounds every x'}
            </Label>
          ) : null}
        </>
      )}
    </FigureFrame>
  );
}

function MajorantBars({ n, active }: { n: number; active: boolean }) {
  const baseline = 88;
  const start = 72;
  const gap = 43;
  const width = 22;
  const count = 7;

  return (
    <g>
      <Label at={[42, 24]} tone="neutral" size={13} weight={600} anchor="start">
        Mₖ = 2⁻ᵏ
      </Label>
      <line x1={start - 12} y1={baseline} x2={start + gap * (count - 1) + width + 12} y2={baseline} stroke="var(--fig-axis)" strokeWidth={1.25} />
      {Array.from({ length: count }, (_, index) => {
        const k = index + 1;
        const height = 52 / 2 ** (k - 1);
        const tone = active && k > n ? 'c' : 'neutral';
        return (
          <g key={k} className={active && k <= n ? 'is-muted' : ''}>
            <rect
              x={start + index * gap}
              y={baseline - height}
              width={width}
              height={height}
              rx={3}
              fill={fill(tone)}
              stroke={stroke(tone)}
              strokeWidth={1.5}
            />
            <Label at={[start + index * gap + width / 2, baseline + 13]} tone={tone} size={11}>
              {String(k)}
            </Label>
          </g>
        );
      })}
      {active ? (
        <>
          <Segment
            from={[start + n * gap - 7, 101]}
            to={[start + (count - 1) * gap + width + 7, 101]}
            tone="c"
            active
          />
          <Label at={[start + (n * gap + (count - 1) * gap + width) / 2, 91]} tone="c" size={12} weight={700}>
            tail ≤ 2⁻ᴺ
          </Label>
        </>
      ) : null}
    </g>
  );
}

const counterPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 28, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.05, 1.05],
  yDomain: [-0.18, 1.25],
});

function MovingSpikes() {
  const spike = (n: number) => {
    const centre = 1 - 2 ** (-n);
    const half = 2 ** (-(n + 2));
    return (x: number) => Math.max(0, 1 - Math.abs(x - centre) / half);
  };

  return (
    <FigureFrame
      viewBox={counterPlot.viewBox}
      title="Disjoint unit spikes moving towards 1, whose pointwise series is finite but whose uniform tail never falls below 1"
      caption="Each point meets at most one spike, but every tail contains a later spike of height 1. Pointwise envelopes cannot provide one N for the whole domain."
    >
      <Axes plot={counterPlot} xTicks={[1]} yTicks={[1]} />
      {[1, 2, 3, 4, 5].map((n) => (
        <Curve key={n} plot={counterPlot} fn={spike(n)} domain={DOMAIN} tone={n === 5 ? 'warn' : 'a'} width={n === 5 ? 3 : 2} />
      ))}
      <Segment from={counterPlot.pt([0, 1])} to={counterPlot.pt([1, 1])} tone="warn" dashed />
      <Label at={[counterPlot.x(0.04), counterPlot.y(1.12)]} tone="warn" size={14} weight={700} anchor="start">
        supₓ |tail| = 1 forever
      </Label>
    </FigureFrame>
  );
}

const harmonicPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 28, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.05, 1.05],
  yDomain: [-0.15, 3.7],
});

function HarmonicWalls() {
  const orders = [1, 2, 4, 8, 16];
  const harmonic = (n: number) => Array.from({ length: n }, (_, k) => 1 / (k + 1)).reduce((sum, value) => sum + value, 0);

  return (
    <FigureFrame
      viewBox={harmonicPlot.viewBox}
      title="Constant partial-sum functions of the harmonic series rising without settling"
      caption="The bound Mₙ = 1/n is shared by every x, but its total diverges. The partial-sum functions are horizontal walls that keep rising."
    >
      <Axes plot={harmonicPlot} xTicks={[1]} yTicks={[1, 2, 3]} />
      {orders.map((n, index) => (
        <g key={n} className={index < orders.length - 1 ? 'is-muted' : ''}>
          <Segment
            from={harmonicPlot.pt([0, harmonic(n)])}
            to={harmonicPlot.pt([1, harmonic(n)])}
            tone={index === orders.length - 1 ? 'warn' : 'a'}
            active={index === orders.length - 1}
          />
          <Label at={[harmonicPlot.x(0.98), harmonicPlot.y(harmonic(n)) - 10]} tone={index === orders.length - 1 ? 'warn' : 'a'} size={12} anchor="end">
            {`S${n}`}
          </Label>
        </g>
      ))}
      <Label at={[harmonicPlot.x(0.04), harmonicPlot.y(2.9)]} tone="warn" size={14} weight={700} anchor="start">
        no finite tail budget
      </Label>
    </FigureFrame>
  );
}

function captionFor(i: number, n: number): string {
  if (i <= 0) return 'Each function term stays under one numerical height Mₖ, the same at every x.';
  if (i === 1) return 'The partial sums of the functions and of their numerical envelopes run in parallel.';
  if (i === 2) return `Past N = ${n}, the remaining majorant bars have total at most 2⁻ᴺ.`;
  if (i === 3) return 'The triangle inequality puts every function tail inside that same numerical budget.';
  if (i === 4) return 'At each x the partial sums are Cauchy, so completeness supplies the sum S(x).';
  if (i === 5) return 'The entire graph of Sₙ lies in one shrinking tube around S: uniform convergence.';
  return 'The same positive envelope also bounds the absolute series at every point.';
}
