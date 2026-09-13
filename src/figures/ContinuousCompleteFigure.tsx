import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, Tube, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * A Cauchy sequence of functions, and the limit it is made to produce.
 *
 * The terms are a fixed continuous shape plus a wobble that shrinks
 * geometrically, so they bunch up in d∞ by construction. The stages go from
 * one point at a time — a vertical line, a dotted limit — to the whole graph at
 * once, which is the order the proof earns them in.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.08, 1.1],
  yDomain: [-0.15, 1.25],
});

const K: readonly [number, number] = [0, 1];
const limit = (x: number) => 0.5 + 0.26 * Math.sin(5 * x + 0.3);
/** The n-th term: the limit plus a wobble of amplitude 0.34 · 0.55ⁿ. */
const term = (n: number) => (x: number) => limit(x) + 0.34 * 0.55 ** n * Math.cos(9 * x + 1.3 * n);
const TERMS = [0, 1, 2, 3, 4, 5, 6];
/** From here on every term is within ε of the limit: 0.34 · 0.55⁴ ≈ 0.031. */
const LATE = 4;
const EPSILON = 0.06;
const PROBE = 0.35;

export function ContinuousCompleteFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'compact') return <Unbounded />;
  if (dropped === 'real') return <Rational />;

  const i = stepIndex;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A sequence of continuous functions bunching up, and the continuous function it converges to"
      caption={captionFor(i)}
    >
      {i === 4 ? <Tube plot={plot} fn={limit} domain={K} half={EPSILON} /> : null}
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />

      {i <= 0 ? <Gap /> : <Terms fadeEarly={i >= 4} muted={i === 2 || i === 3} />}

      {i === 2 ? <Probe /> : null}
      {i === 3 ? <DottedLimit /> : null}
      {i >= 5 ? <Curve plot={plot} fn={limit} domain={K} tone="good" width={3} /> : null}

      <Label at={[plot.x(0.02), plot.y(1.18)]} tone={i === 3 ? 'warn' : 'neutral'} size={13} anchor="start">
        {headingFor(i)}
      </Label>
    </FigureFrame>
  );
}

/** The first two terms and the largest gap between them, which K lets them attain. */
function Gap() {
  const f = term(0);
  const g = term(1);
  let at = 0;
  for (let s = 0; s <= 400; s += 1) {
    const x = s / 400;
    if (Math.abs(f(x) - g(x)) > Math.abs(f(at) - g(at))) at = x;
  }

  return (
    <g>
      <Curve plot={plot} fn={f} domain={K} tone="a" />
      <Curve plot={plot} fn={g} domain={K} tone="b" />
      <Segment from={plot.pt([at, f(at)])} to={plot.pt([at, g(at)])} tone="c" active />
      <PointMark at={plot.pt([at, f(at)])} tone="c" radius={4} />
      <PointMark at={plot.pt([at, g(at)])} tone="c" radius={4} />
      <Label at={[plot.x(at) + 12, plot.y((f(at) + g(at)) / 2)]} tone="c" size={14} weight={700} anchor="start">
        d∞ — attained
      </Label>
    </g>
  );
}

function Terms({ fadeEarly, muted }: { fadeEarly: boolean; muted: boolean }) {
  return (
    <g className={muted ? 'is-muted' : ''}>
      {TERMS.map((n) => (
        <g key={n} className={fadeEarly && n < LATE ? 'is-muted' : ''}>
          <Curve plot={plot} fn={term(n)} domain={K} tone={n >= LATE ? 'accent' : 'a'} width={n >= LATE ? 2 : 1.5} />
        </g>
      ))}
    </g>
  );
}

/** One vertical line: the values at a single point, bunching up as numbers. */
function Probe() {
  return (
    <g>
      <Segment from={plot.pt([PROBE, 0])} to={plot.pt([PROBE, 1.0])} tone="neutral" dashed />
      {TERMS.map((n) => (
        <PointMark key={n} at={plot.pt([PROBE, term(n)(PROBE)])} tone="accent" radius={4} muted={n < 2} />
      ))}
      <Label at={[plot.x(PROBE) + 12, plot.y(0.18)]} tone="accent" size={13} weight={600} anchor="start">
        a Cauchy sequence in ℝ
      </Label>
    </g>
  );
}

/** The limit as it first exists: a value at each point, and nothing joining them. */
function DottedLimit() {
  const xs = Array.from({ length: 26 }, (_, s) => s / 25);
  return (
    <g>
      {xs.map((x) => (
        <PointMark key={x} at={plot.pt([x, limit(x)])} tone="good" radius={3} />
      ))}
    </g>
  );
}

const reciprocalPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.08, 1.1],
  yDomain: [-0.3, 6.5],
});

/** Without compactness: 1/x against 0 on (0, 1], and no largest gap. */
function Unbounded() {
  const p = reciprocalPlot;
  const probes = [0.5, 0.3, 0.2];

  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The function 1/x and the zero function on (0, 1], with gaps between them growing without bound"
      caption="Both continuous on (0, 1]. Every gap is outgrown by a larger one further left, so d∞ is not a number."
    >
      <Axes plot={p} xTicks={[1]} />
      <Curve plot={p} fn={(x) => 1 / x} domain={[1 / 6.4, 1]} tone="a" />
      <Segment from={p.pt([0, 0])} to={p.pt([1, 0])} tone="b" active />
      <PointMark at={p.pt([0, 0])} tone="b" radius={5} hollow />
      <PointMark at={p.pt([1, 0])} tone="b" radius={5} />
      {probes.map((x) => (
        <Segment key={x} from={p.pt([x, 0])} to={p.pt([x, 1 / x])} tone="warn" active={x === 0.2} />
      ))}
      <Label at={[p.x(0.24), p.y(5.9)]} tone="warn" size={13} weight={600} anchor="start">
        no largest gap
      </Label>
      <Label at={[p.x(0.62), p.y(2.2)]} tone="a" size={14} weight={700} anchor="start">
        1/x
      </Label>
    </FigureFrame>
  );
}

const rationalPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.08, 1.1],
  yDomain: [0.85, 1.68],
});

/** Without real values: constant functions into ℚ, closing in on √2. */
function Rational() {
  const p = rationalPlot;
  // Convergents of √2, which land on alternate sides of it; decimal
  // approximations all sit below and merge into one line at this scale.
  const levels = [1, 3 / 2, 7 / 5, 17 / 12];

  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="Constant rational-valued functions approaching the constant √2, which is not one of them"
      caption="Continuous into ℚ on an interval means constant, so these are just rational numbers — and they close in on √2."
    >
      <Axes plot={p} xTicks={[1]} />
      {levels.map((q, k) => (
        <Segment key={q} from={p.pt([0, q])} to={p.pt([1, q])} tone="accent" muted={k < 1} />
      ))}
      <Segment from={p.pt([0, Math.SQRT2])} to={p.pt([1, Math.SQRT2])} tone="warn" dashed active />
      <Label at={[p.x(1) + 4, p.y(Math.SQRT2) - 14]} tone="warn" size={13} weight={600} anchor="end">
        √2 — not a function into ℚ
      </Label>
      <Label at={[p.x(1) + 4, p.y(1) - 12]} tone="accent" size={13} anchor="end">
        f₁ ≡ 1
      </Label>
      <Label at={[p.x(0.02), p.y(1.63)]} tone="neutral" size={13} anchor="start">
        fₙ ≡ 1, 3/2, 7/5, 17/12, …
      </Label>
    </FigureFrame>
  );
}

function headingFor(i: number): string {
  if (i <= 0) return 'on a compact K the largest gap is reached';
  if (i === 1) return 'terms bunching up in d∞';
  if (i === 2) return 'fix x: numbers';
  if (i === 3) return 'a value at each x — nothing yet joins them';
  if (i === 4) return 'one N: the whole of every late term inside the tube';
  if (i === 5) return 'a uniform limit of continuous functions';
  return 'every Cauchy sequence lands in C(K)';
}

function captionFor(i: number): string {
  if (i <= 0) return 'On a compact set the largest gap between two continuous functions is attained, so d∞ is a number.';
  if (i === 1) return 'A Cauchy sequence in d∞: past some N, any two terms are within ε of each other everywhere at once.';
  if (i === 2) return 'Fix a point and the values are a Cauchy sequence of real numbers.';
  if (i === 3) return 'Completeness of ℝ gives each one a limit. That defines f — point by point, which on its own proves nothing about continuity.';
  if (i === 4) return 'But the N came before x, so from N on every term lies inside a tube of height ε around f.';
  if (i === 5) return 'Uniform convergence of continuous functions: f is continuous.';
  return 'And the terms converge to it in d∞. The space has no holes.';
}
