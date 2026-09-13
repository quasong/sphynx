import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Arrow, Label, PointMark, Segment } from './primitives/shapes';
import { fill, stroke } from './primitives/tone';

/**
 * A slope at every point, and the one curve that follows them.
 *
 * The instance is y′ = y through (0, 1), whose Picard iterates are the partial
 * sums of the exponential series. The rectangle is a = 0.6, b = 1, so M = 2
 * and the proof's own choice gives h = min(a, b/M, 1/2L) = 0.5: the interval
 * drawn is the one the argument actually produces, not a wider one chosen to
 * look good. Everything is held in one frame so that what changes between
 * steps is what the step is about.
 */

const T0 = 0;
const Y0 = 1;
const A = 0.6;
const B = 1;
const H = 0.5;
const I: readonly [number, number] = [T0 - H, T0 + H];
const R_T: readonly [number, number] = [T0 - A, T0 + A];
const R_Y: readonly [number, number] = [Y0 - B, Y0 + B];
/** Where the interval I is drawn, on its own lane below the axis. */
const LANE = -0.34;

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.8, 0.8],
  yDomain: [-0.56, 2.5],
});

const F = (_t: number, y: number) => y;
const exp = (t: number) => Math.exp(t);
/** The n-th Picard iterate for y′ = y from y₀ ≡ 1: the n-th partial sum of eᵗ. */
const iterate = (n: number) => (t: number) => {
  let sum = 0;
  let term = 1;
  for (let k = 0; k <= n; k += 1) {
    sum += term;
    term *= t / (k + 1);
  }
  return sum;
};
/** A second candidate, chosen inside the band; T sends it to 1 + 0.4t. */
const Z = 0.4;
const applyT = (c: number) => (t: number) => Y0 + c * t;

export function PicardFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'lipschitz') return <Fan />;
  if (dropped === 'continuous') return <Corner />;
  if (stepIndex >= 8) return <Blowup />;

  const i = stepIndex;
  const fieldMuted = i >= 1 && i <= 6;
  const showRect = i >= 2;
  const showInterval = i >= 2;
  const showBand = i >= 3 && i <= 6;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A slope field for y′ = y with the point (0, 1), the rectangle and interval the proof chooses, and the Picard iterates converging to the exponential"
      caption={captionFor(i)}
    >
      {showBand ? <BandOverI muted={i === 6} /> : null}
      <Axes plot={plot} xTicks={[0.5]} yTicks={[2]} />
      {/* Grid offset from the axes and the rectangle's edges, so no stroke sits on a line. */}
      <SlopeField plot={plot} f={F} ts={range(-0.5, 0.5, 0.2)} ys={range(0.2, 1.8, 0.4)} muted={fieldMuted} />

      {showRect ? <Rectangle muted={i >= 3} /> : null}
      {showInterval ? <IntervalMarker plot={plot} span={I} label="I" active={i === 2} /> : null}

      {i === 1 ? <OneApplication /> : null}
      {i === 4 ? <StaysInside /> : null}
      {i === 5 ? <Shrinks /> : null}
      {i === 6 ? <Iterates /> : null}
      {i >= 7 ? <Curve plot={plot} fn={exp} domain={I} tone="good" width={3} /> : null}

      <PointMark at={plot.pt([T0, Y0])} tone={i >= 7 ? 'good' : 'accent'} radius={5} active={i <= 0 || i >= 7} />
      {i <= 0 || i >= 7 ? (
        <Label at={[plot.x(T0) + 11, plot.y(Y0) + 17]} tone={i >= 7 ? 'good' : 'accent'} size={13} weight={600} anchor="start">
          (t₀, y₀)
        </Label>
      ) : null}
      {i >= 7 ? (
        <Label at={[plot.x(I[1]) + 6, plot.y(exp(I[1]))]} tone="good" size={14} weight={700} anchor="start">
          y*
        </Label>
      ) : null}

      <Label at={[plot.x(plot.xDomain[0]) + 4, plot.y(2.42)]} tone="neutral" size={13} anchor="start">
        {headingFor(i)}
      </Label>
    </FigureFrame>
  );
}

/** Short strokes with the slope F prescribes, at a grid of points. */
function SlopeField({
  plot: p,
  f,
  ts,
  ys,
  muted = false,
  length = 15,
}: {
  plot: Plot;
  f: (t: number, y: number) => number;
  ts: readonly number[];
  ys: readonly number[];
  muted?: boolean;
  length?: number;
}) {
  return (
    <g className={muted ? 'is-muted' : ''}>
      {ts.map((t) =>
        ys.map((y) => {
          // The direction (1, m) in math space, flipped and scaled for the screen.
          const dx = p.dx(1);
          const dy = -p.dy(f(t, y));
          const norm = Math.hypot(dx, dy) || 1;
          const ux = (dx / norm) * (length / 2);
          const uy = (dy / norm) * (length / 2);
          const [cx, cy] = p.pt([t, y]);
          return (
            <line
              key={`${t},${y}`}
              x1={cx - ux}
              y1={cy - uy}
              x2={cx + ux}
              y2={cy + uy}
              stroke={stroke('neutral')}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          );
        }),
      )}
    </g>
  );
}

function Rectangle({ muted }: { muted: boolean }) {
  const x = plot.x(R_T[0]);
  const y = plot.y(R_Y[1]);
  return (
    <g className={muted ? 'is-muted' : ''}>
      <rect
        x={x}
        y={y}
        width={plot.dx(R_T[1] - R_T[0])}
        height={plot.dy(R_Y[1] - R_Y[0])}
        fill="none"
        stroke={stroke('neutral')}
        strokeWidth={1.5}
        strokeDasharray="6 5"
      />
      <Label at={[x + 12, y + 14]} tone="neutral" size={13} weight={600} anchor="start">
        R
      </Label>
    </g>
  );
}

/** The band |y − y₀| ≤ b, over the interval I only: the space X, drawn. */
function BandOverI({ muted }: { muted: boolean }) {
  const x = plot.x(I[0]);
  const y = plot.y(R_Y[1]);
  const w = plot.dx(I[1] - I[0]);
  const h = plot.dy(R_Y[1] - R_Y[0]);
  return (
    <g className={muted ? 'is-muted' : ''}>
      <rect x={x} y={y} width={w} height={h} fill={fill('accent')} />
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={stroke('accent')} strokeWidth={1.5} strokeDasharray="5 5" />
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={stroke('accent')} strokeWidth={1.5} strokeDasharray="5 5" />
      <Label at={[x + w - 8, y + 14]} tone="accent" size={13} weight={600} anchor="end">
        |y − y₀| ≤ b
      </Label>
    </g>
  );
}

function IntervalMarker({
  plot: p,
  span,
  label,
  active,
}: {
  plot: Plot;
  span: readonly [number, number];
  label: string;
  active: boolean;
}) {
  const y = p.y(LANE);
  const x1 = p.x(span[0]);
  const x2 = p.x(span[1]);
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={stroke('accent')} strokeWidth={active ? 6 : 4} />
      <circle cx={x1} cy={y} r={4} fill={stroke('accent')} />
      <circle cx={x2} cy={y} r={4} fill={stroke('accent')} />
      <Label at={[x2 + 14, y + 1]} tone="accent" size={14} weight={active ? 700 : 600} anchor="start">
        {label}
      </Label>
    </g>
  );
}

/** One function in, one function out. */
function OneApplication() {
  const at = 0.46;
  return (
    <g>
      <Curve plot={plot} fn={() => Y0} domain={R_T} tone="a" width={2.5} />
      <Curve plot={plot} fn={applyT(Y0)} domain={R_T} tone="b" width={2.5} />
      <Arrow from={plot.pt([at, Y0 + 0.04])} to={plot.pt([at, applyT(Y0)(at) - 0.04])} tone="c" />
      <Label at={[plot.x(at) - 10, plot.y((Y0 + applyT(Y0)(at)) / 2)]} tone="c" size={15} weight={700} anchor="end">
        T
      </Label>
      <Label at={[plot.x(R_T[1]) + 6, plot.y(Y0)]} tone="a" size={14} weight={600} anchor="start">
        y
      </Label>
      <Label at={[plot.x(R_T[1]) + 6, plot.y(applyT(Y0)(R_T[1]))]} tone="b" size={14} weight={600} anchor="start">
        Ty
      </Label>
    </g>
  );
}

/** A candidate anywhere in the band, and its image still in the band. */
function StaysInside() {
  return (
    <g>
      <Curve plot={plot} fn={() => Z} domain={I} tone="a" width={2.5} />
      <Curve plot={plot} fn={applyT(Z)} domain={I} tone="b" width={2.5} />
      <Label at={[plot.x(I[1]) + 6, plot.y(Z)]} tone="a" size={14} weight={600} anchor="start">
        z
      </Label>
      <Label at={[plot.x(I[1]) + 6, plot.y(applyT(Z)(I[1]))]} tone="b" size={14} weight={600} anchor="start">
        Tz
      </Label>
    </g>
  );
}

/**
 * Two candidates a distance d apart, and their images at most d/2 apart. Both
 * gaps are measured at the right end of I, one above the other, so the reader
 * compares two brackets on the same vertical line.
 */
function Shrinks() {
  const at = I[1];
  return (
    <g>
      <Curve plot={plot} fn={() => Y0} domain={I} tone="a" width={2} />
      <Curve plot={plot} fn={() => Z} domain={I} tone="b" width={2} />
      <Curve plot={plot} fn={applyT(Y0)} domain={I} tone="a" width={2.5} dashed />
      <Curve plot={plot} fn={applyT(Z)} domain={I} tone="b" width={2.5} dashed />

      <Segment from={plot.pt([at, Y0])} to={plot.pt([at, Z])} tone="c" active />
      <Label at={[plot.x(at) + 8, plot.y((Y0 + Z) / 2)]} tone="c" size={13} weight={700} anchor="start">
        d = d(y, z)
      </Label>

      <Segment from={plot.pt([at, applyT(Y0)(at)])} to={plot.pt([at, applyT(Z)(at)])} tone="c" active />
      <Label
        at={[plot.x(at) + 8, plot.y((applyT(Y0)(at) + applyT(Z)(at)) / 2)]}
        tone="c"
        size={13}
        weight={700}
        anchor="start"
      >
        ≤ d/2
      </Label>

      <Label at={[plot.x(I[0]) - 6, plot.y(Y0)]} tone="a" size={14} weight={600} anchor="end">
        y
      </Label>
      <Label at={[plot.x(I[0]) - 6, plot.y(Z)]} tone="b" size={14} weight={600} anchor="end">
        z
      </Label>
    </g>
  );
}

/** Picard's iteration: the partial sums of eᵗ, closing in. */
function Iterates() {
  const ns = [0, 1, 2, 3];
  return (
    <g>
      {ns.map((n) => (
        <g key={n} className={n < 2 ? 'is-muted' : ''}>
          <Curve plot={plot} fn={iterate(n)} domain={I} tone="accent" width={n === 3 ? 2.75 : 1.75} />
        </g>
      ))}
      <Label at={[plot.x(I[1]) + 6, plot.y(iterate(0)(I[1]))]} tone="accent" size={13} anchor="start" muted>
        y₀
      </Label>
      <Label at={[plot.x(I[1]) + 6, plot.y(iterate(1)(I[1]))]} tone="accent" size={13} anchor="start" muted>
        y₁
      </Label>
      <Label at={[plot.x(I[1]) + 6, plot.y(iterate(3)(I[1])) - 2]} tone="accent" size={13} weight={600} anchor="start">
        y₂, y₃, …
      </Label>
    </g>
  );
}

const blowupPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-1.3, 1.3],
  yDomain: [-0.85, 5.2],
});

/**
 * y′ = y² through (0, 1). Continuous and Lipschitz on every rectangle, and the
 * solution 1/(1 − t) still cannot be continued past t = 1. On the rectangle
 * a = 0.5, b = 1 the proof's own h is min(0.5, 1/4, 1/8) = 0.125.
 */
function Blowup() {
  const p = blowupPlot;
  const rT: readonly [number, number] = [-0.5, 0.5];
  const rY: readonly [number, number] = [0, 2];
  const h = 0.125;

  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The solution of y′ = y² through (0, 1), rising to infinity as t approaches 1, with the small interval the theorem guarantees"
      caption="F = y² is as well behaved as the theorem asks, everywhere — and the solution still leaves every rectangle before t = 1. No h works for all of them; on this one, the proof's h is 1/8."
    >
      <Axes plot={p} yTicks={[1, 2, 3, 4]} />
      <rect
        x={p.x(rT[0])}
        y={p.y(rY[1])}
        width={p.dx(rT[1] - rT[0])}
        height={p.dy(rY[1] - rY[0])}
        fill="none"
        stroke={stroke('neutral')}
        strokeWidth={1.5}
        strokeDasharray="6 5"
      />
      <Label at={[p.x(rT[0]) + 12, p.y(rY[1]) + 14]} tone="neutral" size={13} weight={600} anchor="start">
        R
      </Label>
      <Segment from={p.pt([1, p.yDomain[0] + 0.1])} to={p.pt([1, p.yDomain[1]])} tone="warn" dashed />
      <Label at={[p.x(1) + 8, p.y(4.6)]} tone="warn" size={13} weight={600} anchor="start">
        t = 1
      </Label>

      <Curve plot={p} fn={(t) => 1 / (1 - t)} domain={[-1.3, 0.8]} tone="good" width={3} />
      <Curve plot={p} fn={(t) => 1 / (1 - t)} domain={[-h, h]} tone="accent" width={5} />
      <IntervalMarker plot={p} span={[-h, h]} label="I" active />
      <PointMark at={p.pt([0, 1])} tone="good" radius={5} active />

      <Label at={[p.x(-1.25), p.y(4.3)]} tone="warn" size={14} weight={700} anchor="start">
        leaves every rectangle
      </Label>
    </FigureFrame>
  );
}

const fanPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.35, 1.3],
  yDomain: [-0.2, 1.2],
});

/** Without Lipschitz: y′ = 2√|y| through (0, 0), and a whole fan of solutions. */
function Fan() {
  const p = fanPlot;
  const departures = [0, 0.3, 0.6];
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The slope field of y′ = 2√|y| and several distinct solutions all passing through the origin"
      caption="Continuous, and every curve here is a solution through (0, 0): stay at zero as long as you like, then leave along a parabola. Near y = 0 no single L bounds the slope's growth, and the map shrinks nothing."
    >
      <Axes plot={p} xTicks={[1]} yTicks={[1]} />
      <SlopeField
        plot={p}
        f={(_t, y) => 2 * Math.sqrt(Math.abs(y))}
        ts={range(-0.2, 1.2, 0.2)}
        ys={range(0, 1, 0.2)}
        muted
      />
      <Curve plot={p} fn={() => 0} domain={[p.xDomain[0], p.xDomain[1]]} tone="warn" width={2.5} />
      {departures.map((c) => (
        <Curve key={c} plot={p} fn={(t) => (t - c) ** 2} domain={[c, Math.min(p.xDomain[1], c + 1.05)]} tone="warn" width={2.5} />
      ))}
      <PointMark at={p.pt([0, 0])} tone="warn" radius={6} active />
      <Label at={[p.x(0) - 10, p.y(0) - 16]} tone="warn" size={13} weight={600} anchor="end">
        (0, 0)
      </Label>
      <Label at={[p.x(0.02), p.y(1.12)]} tone="warn" size={14} weight={700} anchor="start">
        one point, many solutions
      </Label>
    </FigureFrame>
  );
}

const cornerPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-1.15, 1.15],
  yDomain: [-0.3, 1.3],
});

/** Without continuity: y′ = sgn t through (0, 0). The fixed point is |t|, which is not a solution. */
function Corner() {
  const p = cornerPlot;
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The slope field of y′ = sgn t, all slopes −1 on the left and +1 on the right, and the function |t| with a corner at the origin"
      caption="F jumps at t = 0, and T lands on |t| at the first application, whatever it is fed. But |t| has no derivative at 0, so the fixed point is not a solution — and nothing else is either."
    >
      <Axes plot={p} xTicks={[-1, 1]} yTicks={[1]} />
      <SlopeField
        plot={p}
        f={(t) => Math.sign(t)}
        ts={[-1, -0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8, 1]}
        ys={[0.35, 0.7, 1.05]}
      />
      <Segment from={p.pt([0, 0])} to={p.pt([0, 1.22])} tone="neutral" dashed />
      <Label at={[p.x(0) + 8, p.y(1.18)]} tone="neutral" size={13} anchor="start">
        F jumps here
      </Label>
      <Curve plot={p} fn={(t) => Math.abs(t)} domain={[-1.1, 1.1]} tone="warn" width={3} />
      <PointMark at={p.pt([0, 0])} tone="warn" radius={6} hollow active />
      <Label at={[p.x(0) + 12, p.y(0) + 22]} tone="warn" size={14} weight={700} anchor="start">
        no derivative here
      </Label>
      <Label at={[p.x(0.46), p.y(0.17)]} tone="warn" size={14} weight={600} anchor="start">
        Ty = |t|
      </Label>
    </FigureFrame>
  );
}

/** Inclusive arithmetic progression, rounded to avoid 0.6000000001 keys. */
function range(from: number, to: number, step: number): readonly number[] {
  const out: number[] = [];
  for (let k = 0; from + k * step <= to + 1e-9; k += 1) {
    out.push(Math.round((from + k * step) * 1000) / 1000);
  }
  return out;
}

function headingFor(i: number): string {
  if (i <= 0) return 'a slope at every point; is there a curve that follows them?';
  if (i === 1) return 'T: a function in, a function out';
  if (i === 2) return 'the rectangle F lives on, and the interval the proof keeps';
  if (i === 3) return 'X: continuous on I, within b of y₀';
  if (i === 4) return 'T does not throw anything out of the band';
  if (i === 5) return 'one pass through T halves the distance';
  if (i === 6) return 'Picard iteration: y₀, Ty₀, T²y₀, …';
  return 'the fixed point follows every slope';
}

function captionFor(i: number): string {
  if (i < 0) return 'y′ = y: at every point a slope is prescribed. The theorem says one curve through (0, 1) obeys all of them, for a while.';
  if (i === 0) return 'The derivative is traded for an integral. The unknown is now a whole function, and the equation says a certain map leaves it alone.';
  if (i === 1) return 'T feeds a candidate through the integral. The constant y₀ goes to 1 + t; a solution would come back unchanged.';
  if (i === 2) return 'h = min(a, b/M, 1/2L) — here 0.5. Short enough to stay in R, to stay in the band, and to make the shrink factor ½.';
  if (i === 3) return 'The space: continuous functions on I staying in the band. A closed part of C(I), so complete.';
  if (i === 4) return 'The integral over I is at most Mh ≤ b, so a candidate in the band has its image in the band.';
  if (i === 5) return 'Two candidates a distance d apart come out at most Lh·d ≤ d/2 apart. T is a contraction.';
  if (i === 6) return 'So the fixed point theorem applies: iterate from the constant y₀, and the iterates converge uniformly on I.';
  return 'The limit satisfies the integral equation, hence the differential equation — and it is the only function that does.';
}
