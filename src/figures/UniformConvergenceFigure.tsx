import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';
import { stroke } from './primitives/tone';

/**
 * xⁿ on [0, 1], and the band of height ε around its limit.
 *
 * The same few graphs are drawn at every stage; what changes is the question
 * put to them — one vertical line at a time, and then the whole graph against
 * the band at once.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.08, 1.12],
  yDomain: [-0.65, 1.25],
});

const EPSILON = 0.5;
/** The terms whose N at x = 0.5, 0.9, 0.99 is 2, 7 and 69. */
const SHOWN = [2, 7, 69] as const;
const FAMILY = [1, 2, 4, 8, 16, 40];
/** The vertical line the first stage reads a single sequence off. */
const PROBE = 0.7;

const power = (n: number) => (x: number) => x ** n;
const half = (value: number) => (value === 0.5 ? '½' : String(value));

export function UniformConvergenceFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="The graphs of xⁿ on the unit interval, their limit, and a band of fixed height around it"
      caption={captionFor(i)}
    >
      {i <= 0 ? <Probe /> : null}
      {i === 1 ? <Jump /> : null}
      {i === 2 ? <Runaway /> : null}
      {i === 3 || i === 4 ? <InBand /> : null}
      {i === 5 ? <InBand witness /> : null}
      {i >= 6 ? <Gap /> : null}
    </FigureFrame>
  );
}

/** One vertical line: at a fixed x, an ordinary sequence of numbers. */
function Probe() {
  const values = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => PROBE ** n);

  return (
    <g>
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
      <g className="is-muted">
        {FAMILY.map((n) => (
          <Curve key={n} plot={plot} fn={power(n)} domain={[0, 1]} tone="a" width={1.75} />
        ))}
      </g>
      <Segment from={plot.pt([PROBE, 0])} to={plot.pt([PROBE, 1.05])} tone="neutral" dashed />
      {values.map((v, k) => (
        <PointMark key={k} at={plot.pt([PROBE, v])} tone="accent" radius={4} muted={k < 2} />
      ))}
      <Label at={[plot.x(PROBE) + 12, plot.y(0.45)]} tone="accent" size={14} weight={600} anchor="start">
        fₙ(0.7) → 0
      </Label>
      <Label at={[plot.x(0.02), plot.y(1.15)]} tone="neutral" size={13} anchor="start">
        at each x, an ordinary sequence of numbers
      </Label>
    </g>
  );
}

/** The limit, drawn over the continuous functions that produced it. */
function Limit() {
  return (
    <g>
      <Segment from={plot.pt([0, 0])} to={plot.pt([1, 0])} tone="accent" active />
      <PointMark at={plot.pt([1, 0])} tone="accent" radius={5} hollow />
      <PointMark at={plot.pt([1, 1])} tone="accent" radius={5} />
    </g>
  );
}

function Jump() {
  return (
    <g>
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
      <g className="is-muted">
        {FAMILY.map((n) => (
          <Curve key={n} plot={plot} fn={power(n)} domain={[0, 1]} tone="a" width={1.75} />
        ))}
      </g>
      <Limit />
      <Label at={[plot.x(0.02), plot.y(1.15)]} tone="neutral" size={13} anchor="start">
        every fₙ continuous
      </Label>
      <Label at={[plot.x(1) - 10, plot.y(-0.22)]} tone="warn" size={13} weight={600} anchor="end">
        the limit jumps at 1
      </Label>
    </g>
  );
}

/** Where each of three points first gets inside the band: N = 2, 7, 69. */
function Runaway() {
  const probes = [
    { x: 0.5, n: 2, labelAt: -0.28 },
    { x: 0.9, n: 7, labelAt: -0.28 },
    { x: 0.99, n: 69, labelAt: -0.5 },
  ];

  return (
    <g>
      <Axes plot={plot} yTicks={[EPSILON, 1]} format={half} />
      {SHOWN.map((n) => (
        <Curve key={n} plot={plot} fn={power(n)} domain={[0, 1]} tone="a" width={1.75} />
      ))}
      <Segment from={plot.pt([0, EPSILON])} to={plot.pt([1, EPSILON])} tone="c" dashed />
      <Label at={[plot.x(0.02), plot.y(EPSILON) - 12]} tone="c" size={13} weight={600} anchor="start">
        ε = ½
      </Label>

      {probes.map(({ x, n, labelAt }) => (
        <g key={n}>
          <Segment from={plot.pt([x, labelAt + 0.1])} to={plot.pt([x, x ** n])} tone="warn" />
          <PointMark at={plot.pt([x, x ** n])} tone="warn" radius={4} active />
          <Label at={[plot.x(x), plot.y(labelAt)]} tone="warn" size={13} weight={600}>
            {`N = ${n}`}
          </Label>
        </g>
      ))}
    </g>
  );
}

/**
 * The band around the limit, and the part of each graph that is outside it.
 * With `witness`, the point where each graph is still exactly ½ away.
 */
function InBand({ witness = false }: { witness?: boolean }) {
  const left = plot.x(0);
  const right = plot.x(1);
  const top = plot.y(EPSILON);
  const bottom = plot.y(-EPSILON);

  return (
    <g>
      <rect
        x={left}
        y={top}
        width={right - left}
        height={bottom - top}
        fill="var(--fig-good-fill)"
        stroke={stroke('good')}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <Axes plot={plot} yTicks={[EPSILON, 1]} format={half} />
      <Label at={[left + 8, plot.y(-EPSILON) - 14]} tone="good" size={13} weight={600} anchor="start">
        |y − f(x)| &lt; ½
      </Label>

      {SHOWN.map((n) => {
        // xⁿ leaves the band where it crosses ε, at ε^(1/n).
        const exit = EPSILON ** (1 / n);
        return (
          <g key={n}>
            <Curve plot={plot} fn={power(n)} domain={[0, exit]} tone="a" width={1.75} />
            <Curve plot={plot} fn={power(n)} domain={[exit, 1]} tone="warn" width={2.5} />
          </g>
        );
      })}
      <Limit />

      {witness ? (
        <>
          {SHOWN.map((n) => (
            <PointMark key={n} at={plot.pt([2 ** (-1 / n), EPSILON])} tone="warn" radius={5} active />
          ))}
          <Label at={[plot.x(0.02), plot.y(1.15)]} tone="warn" size={13} weight={600} anchor="start">
            every graph still reaches ½ below x = 1
          </Label>
        </>
      ) : (
        <Label at={[plot.x(0.02), plot.y(1.15)]} tone="neutral" size={13} anchor="start">
          from N on, the whole graph inside the band?
        </Label>
      )}
    </g>
  );
}

const lower = (x: number) => 0.15 + 0.45 * x * x;
const upper = (x: number) => lower(x) + 0.08 + 0.3 * Math.sin(Math.PI * x) ** 4;
/** Where upper − lower is largest: sin⁴(πx) peaks at x = ½. */
const WIDEST = 0.5;

/** Two functions and the one number that measures how far apart they are. */
function Gap() {
  return (
    <g>
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
      <Curve plot={plot} fn={lower} domain={[0, 1]} tone="accent" />
      <Curve plot={plot} fn={upper} domain={[0, 1]} tone="b" />
      <Segment from={plot.pt([WIDEST, lower(WIDEST)])} to={plot.pt([WIDEST, upper(WIDEST)])} tone="c" active />
      <Label at={[plot.x(WIDEST) + 12, plot.y((lower(WIDEST) + upper(WIDEST)) / 2)]} tone="c" size={14} weight={700} anchor="start">
        d∞(f, g)
      </Label>
      <Label at={[plot.x(0.98), plot.y(lower(0.98)) + 16]} tone="accent" size={14} weight={600} anchor="end">
        f
      </Label>
      <Label at={[plot.x(0.98), plot.y(upper(0.98)) - 14]} tone="b" size={14} weight={600} anchor="end">
        g
      </Label>
      <Label at={[plot.x(0.02), plot.y(1.15)]} tone="neutral" size={13} anchor="start">
        the largest gap anywhere — one number for the pair
      </Label>
    </g>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'Fix x and the values fₙ(x) are an ordinary sequence; convergence at every point is convergence of each one.';
  if (i === 1) return 'Every xⁿ is continuous, and the limit jumps at 1.';
  if (i === 2) return 'For ε = ½, the N each point needs grows without bound towards 1.';
  if (i === 3) return 'One N for every x at once: from N on, the whole graph of fₙ inside the band.';
  if (i === 4) return 'The largest gap between fₙ and f is what has to shrink — and for xⁿ some of each graph is always outside.';
  if (i === 5) return 'Each xⁿ still reaches ½ just left of 1, so no N works for ε = ½.';
  return 'The largest vertical gap is a distance between functions, and uniform convergence is ordinary convergence in it.';
}
