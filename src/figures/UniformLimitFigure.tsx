import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Band, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';
import type { Tone } from './primitives/tone';
import { fill, stroke } from './primitives/tone';

/**
 * The detour, drawn.
 *
 * f and one f_N close to it everywhere; three vertical legs from f(x) to f(x₀)
 * by way of f_N; a tube of height ε/3 around f that bounds the outer two; and
 * the window around x₀ that bounds the middle one. Each counterexample keeps
 * the same parts and shows which one can no longer be drawn.
 */

const WIDTH = 430;
const HEIGHT = 310;
const PADDING = { top: 26, right: 26, bottom: 36, left: 42 };

const EPSILON = 0.3;
const THIRD = EPSILON / 3;

const plot = createPlot({
  width: WIDTH,
  height: HEIGHT,
  padding: PADDING,
  xDomain: [0.9, 2.45],
  yDomain: [0.15, 1.0],
});

const f = (x: number) => 0.55 + 0.3 * Math.sin(1.7 * x + 0.2);
/** Within 0.09 of f everywhere, so inside the ε/3 tube with room to spare. */
const fN = (x: number) => f(x) + 0.09 * Math.cos(3 * x + 1);
const DOMAIN: readonly [number, number] = [0.95, 2.4];

const X0 = 1.6;
const X = 1.8;
/** Keeps f_N within ε/3 of f_N(x₀) across the window; checked numerically. */
const DELTA = 0.21;

export function UniformLimitFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'uniform') return <PointwiseOnly />;
  if (dropped === 'continuous') return <NoRadius />;

  const i = stepIndex;
  const tube = i >= 2;
  const showWindow = i >= 3;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A limit function f and one approximating function close to it everywhere, with the three gaps that bound |f(x) − f(x₀)|"
      caption={captionFor(i)}
    >
      {i <= 0 ? (
        <Band plot={plot} orientation="horizontal" from={f(X0) - EPSILON} to={f(X0) + EPSILON} tone="c" label="f(x₀) ± ε" />
      ) : null}
      {tube ? <Tube plot={plot} fn={f} domain={DOMAIN} half={THIRD} tone="good" /> : null}
      {showWindow ? <Window plot={plot} x0={X0} delta={DELTA} centre={fN(X0)} half={THIRD} /> : null}

      <Axes plot={plot} />
      <Curve plot={plot} fn={f} domain={DOMAIN} tone="accent" />
      {i >= 1 ? <Curve plot={plot} fn={fN} domain={DOMAIN} tone="b" width={2} /> : null}

      <Names withFN={i >= 1} />
      <Marker at={X0} label="x₀" />
      {i >= 1 ? <Marker at={X} label="x" /> : null}

      {i >= 1 ? (
        <Legs
          outer={i === 1 || i === 2 || i >= 4}
          middle={i === 1 || i >= 3}
          emphasise={i === 2 ? 'outer' : i === 3 ? 'middle' : 'all'}
        />
      ) : null}

      {i <= 0 ? (
        <Label at={[plot.x(DOMAIN[1]), plot.y(1.0)]} tone="neutral" size={13} anchor="end">
          a δ keeping f inside the band?
        </Label>
      ) : null}
      {i === 5 ? (
        <Label at={[plot.x(DOMAIN[1]), plot.y(1.0)]} tone="neutral" size={14} weight={600} anchor="end">
          ε → N → δ → x
        </Label>
      ) : null}
    </FigureFrame>
  );
}

function Names({ withFN }: { withFN: boolean }) {
  return (
    <g>
      {/* At the left edge f_N runs below f, so f is named above and f_N below. */}
      <Label at={[plot.x(1.0), plot.y(f(1.0)) - 16]} tone="accent" size={15} weight={700} anchor="start">
        f
      </Label>
      {withFN ? (
        <Label at={[plot.x(1.0), plot.y(fN(1.0)) + 18]} tone="b" size={15} weight={700} anchor="start">
          f_N
        </Label>
      ) : null}
    </g>
  );
}

/** A tick on the x-axis with its name under it. */
function Marker({ at, label }: { at: number; label: string }) {
  const y = plot.y(plot.yDomain[0]);
  return (
    <g>
      <line x1={plot.x(at)} y1={y - 5} x2={plot.x(at)} y2={y + 5} stroke="var(--fig-axis)" strokeWidth={1.5} />
      <Label at={[plot.x(at), y + 18]} tone="neutral" size={14}>
        {label}
      </Label>
    </g>
  );
}

/**
 * The three legs of the detour. Legs 1 and 3 stand at x and x₀; leg 2, which
 * is a difference of two values of f_N, stands between them with guides back
 * to the points it compares.
 */
function Legs({
  outer,
  middle,
  emphasise,
}: {
  outer: boolean;
  middle: boolean;
  emphasise: 'outer' | 'middle' | 'all';
}) {
  const column = (X + X0) / 2;
  const outerActive = emphasise !== 'middle';
  const middleActive = emphasise !== 'outer';

  return (
    <g>
      <g className={outer ? '' : 'is-muted'}>
        <Segment from={plot.pt([X, f(X)])} to={plot.pt([X, fN(X)])} tone="c" active={outerActive} />
        <Label at={[plot.x(X) + 10, plot.y((f(X) + fN(X)) / 2)]} tone="c" size={13} weight={700} anchor="start">
          1
        </Label>
        <Segment from={plot.pt([X0, fN(X0)])} to={plot.pt([X0, f(X0)])} tone="c" active={outerActive} />
        <Label at={[plot.x(X0) - 10, plot.y((f(X0) + fN(X0)) / 2)]} tone="c" size={13} weight={700} anchor="end">
          3
        </Label>
      </g>

      <g className={middle ? '' : 'is-muted'}>
        <Segment from={plot.pt([X0, fN(X0)])} to={plot.pt([column, fN(X0)])} tone="b" dashed />
        <Segment from={plot.pt([X, fN(X)])} to={plot.pt([column, fN(X)])} tone="b" dashed />
        <Segment from={plot.pt([column, fN(X0)])} to={plot.pt([column, fN(X)])} tone="b" active={middleActive} />
        <Label at={[plot.x(column), plot.y(fN(X0)) - 12]} tone="b" size={13} weight={700}>
          2
        </Label>
      </g>

      <PointMark at={plot.pt([X, f(X)])} tone="accent" radius={3.5} />
      <PointMark at={plot.pt([X0, f(X0)])} tone="accent" radius={3.5} />
      <PointMark at={plot.pt([X, fN(X)])} tone="b" radius={3.5} />
      <PointMark at={plot.pt([X0, fN(X0)])} tone="b" radius={3.5} />
    </g>
  );
}

interface TubeProps {
  plot: Plot;
  fn: (x: number) => number;
  domain: readonly [number, number];
  half: number;
  tone: Tone;
  /** Where fn jumps; the tube is drawn in separate pieces either side. */
  breaks?: readonly number[];
}

/** Everything within `half` of the graph of fn, vertically. */
function Tube({ plot: p, fn, domain, half, tone, breaks = [] }: TubeProps) {
  const cuts = [domain[0], ...breaks, domain[1]];
  const pieces: string[] = [];
  for (let k = 0; k < cuts.length - 1; k += 1) {
    const lo = cuts[k] as number;
    // Stop a hair short of a jump so the piece does not take the value past it.
    const hi = (cuts[k + 1] as number) - (k < cuts.length - 2 ? 1e-6 : 0);
    const xs = Array.from({ length: 81 }, (_, s) => lo + ((hi - lo) * s) / 80);
    const top = xs.map((x) => `${p.x(x).toFixed(1)},${p.y(fn(x) + half).toFixed(1)}`);
    const bottom = xs.reverse().map((x) => `${p.x(x).toFixed(1)},${p.y(fn(x) - half).toFixed(1)}`);
    pieces.push([...top, ...bottom].join(' '));
  }

  return (
    <g>
      {pieces.map((points, k) => (
        <polygon
          key={k}
          points={points}
          fill={fill(tone)}
          stroke={stroke(tone)}
          strokeWidth={1.25}
          strokeDasharray="5 4"
        />
      ))}
    </g>
  );
}

/** The δ-window around x₀, as tall as the tolerance it has to keep. */
function Window({
  plot: p,
  x0,
  delta,
  centre,
  half,
  tone = 'a',
}: {
  plot: Plot;
  x0: number;
  delta: number;
  centre: number;
  half: number;
  tone?: Tone;
}) {
  const left = p.x(x0 - delta);
  const right = p.x(x0 + delta);
  const top = p.y(centre + half);
  const bottom = p.y(centre - half);
  return (
    <g>
      <rect
        x={left}
        y={top}
        width={right - left}
        height={bottom - top}
        fill={fill(tone)}
        stroke={stroke(tone)}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <Label at={[(left + right) / 2, bottom + 14]} tone={tone} size={13} weight={600}>
        δ
      </Label>
    </g>
  );
}

const powerPlot = createPlot({
  width: WIDTH,
  height: HEIGHT,
  padding: PADDING,
  xDomain: [-0.08, 1.12],
  yDomain: [-0.3, 1.2],
});

const step = (x: number) => (x < 1 ? 0 : 1);

/** Without uniformity: xⁿ, and no N keeps it in the tube near x₀ = 1. */
function PointwiseOnly() {
  const p = powerPlot;
  const shown = [6, 20, 60];

  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The functions xⁿ leaving a thin tube around their discontinuous limit just to the left of 1"
      caption="At x₀ = 1 every xⁿ is exactly right. Just to its left each one is still near 1 while the limit is 0 — and every window around 1 reaches those points."
    >
      <Tube plot={p} fn={step} domain={[0, 1]} half={THIRD} tone="good" breaks={[1]} />
      <Axes plot={p} xTicks={[1]} yTicks={[1]} />
      {shown.map((n) => {
        // xⁿ leaves the tube where it crosses ε/3.
        const exit = THIRD ** (1 / n);
        return (
          <g key={n}>
            <Curve plot={p} fn={(x) => x ** n} domain={[0, exit]} tone="b" width={1.75} />
            <Curve plot={p} fn={(x) => x ** n} domain={[exit, 1]} tone="warn" width={2.5} />
          </g>
        );
      })}
      <Segment from={p.pt([0, 0])} to={p.pt([1, 0])} tone="accent" active />
      <PointMark at={p.pt([1, 0])} tone="accent" radius={5} hollow />
      <PointMark at={p.pt([1, 1])} tone="accent" radius={5} />
      <Band plot={p} orientation="vertical" from={0.8} to={1.08} tone="a" edges />
      <Label at={[p.x(0.02), p.y(1.1)]} tone="warn" size={13} weight={600} anchor="start">
        no single N keeps fₙ in the tube near 1
      </Label>
    </FigureFrame>
  );
}

const jumpPlot = createPlot({
  width: WIDTH,
  height: HEIGHT,
  padding: PADDING,
  xDomain: [-1.1, 1.1],
  yDomain: [-0.3, 1.35],
});

const heaviside = (x: number) => (x < 0 ? 0 : 1);
const LIFT = 0.06;

/** Without continuous terms: every fₙ jumps, so there is no radius to borrow. */
function NoRadius() {
  const p = jumpPlot;
  const lifted = (x: number) => heaviside(x) + LIFT;
  const x = -0.12;

  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="A step function and a copy lifted slightly, both with the same jump at zero"
      caption="f_N is within 1/N of the limit everywhere, and jumps exactly where the limit does. No window around 0 keeps leg 2 small."
    >
      <Tube plot={p} fn={heaviside} domain={[-1, 1]} half={THIRD} tone="good" breaks={[0]} />
      <Axes plot={p} yTicks={[1]} />
      <Curve plot={p} fn={heaviside} domain={[-1, 1]} breaks={[0]} tone="accent" />
      <Curve plot={p} fn={lifted} domain={[-1, 1]} breaks={[0]} tone="b" width={2} />
      <PointMark at={p.pt([0, 0])} tone="accent" radius={4} hollow />
      <PointMark at={p.pt([0, 1])} tone="accent" radius={4} />

      <Band plot={p} orientation="vertical" from={-0.2} to={0.2} tone="a" edges />
      <Segment from={p.pt([x, lifted(x)])} to={p.pt([x, lifted(0)])} tone="warn" active />
      <Label at={[p.x(x) - 10, p.y(0.55)]} tone="warn" size={13} weight={700} anchor="end">
        2
      </Label>
      <Label at={[p.x(-1), p.y(1.25)]} tone="warn" size={13} weight={600} anchor="start">
        f_N jumps too — no δ to borrow
      </Label>
      <Label at={[p.x(1), p.y(1) - 34]} tone="b" size={14} weight={700} anchor="end">
        f_N
      </Label>
      <Label at={[p.x(1), p.y(1) + 26]} tone="accent" size={14} weight={700} anchor="end">
        f
      </Label>
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'Continuity of f at x₀: some window around x₀ keeps f within ε of f(x₀). Nothing about f is known directly.';
  if (i === 1) return 'Go round by way of f_N: down at x, along f_N, back up at x₀.';
  if (i === 2) return 'One N puts f_N inside the ε/3 tube everywhere — at x₀, and at an x nobody has chosen yet.';
  if (i === 3) return 'With N fixed, f_N is continuous at x₀: a window keeps it within ε/3 of f_N(x₀).';
  if (i === 4) return 'Inside the window, all three legs are under ε/3.';
  if (i === 5) return 'N is chosen before δ, and δ before x. A choice of N that depended on x could not be made.';
  return 'So f is continuous: a limit, in d∞, of continuous functions is continuous.';
}
