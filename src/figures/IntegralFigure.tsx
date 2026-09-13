import type { ReactNode } from 'react';
import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';
import { fill, stroke } from './primitives/tone';
import { integrand as g, integrandRange, integral as G, slopeBound } from './models/integration';

/**
 * The three integration figures share one curve, one frame and one way of
 * drawing rectangles, so that the definition, the integrability theorem and
 * the fundamental theorem read as three views of the same object rather than
 * three pictures.
 */

const A = 0;
const B = 3;

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.25, 3.3],
  yDomain: [-0.2, 1.95],
});

/** The region between the graph and the axis over [lo, hi]. */
function Area({ p, fn, lo, hi, tone }: { p: Plot; fn: (x: number) => number; lo: number; hi: number; tone: 'accent' | 'a' | 'b' | 'c' }) {
  const n = 80;
  const top = Array.from({ length: n + 1 }, (_, s) => {
    const x = lo + ((hi - lo) * s) / n;
    return `${p.x(x).toFixed(1)},${p.y(fn(x)).toFixed(1)}`;
  });
  return <polygon points={`${p.x(lo)},${p.y(0)} ${top.join(' ')} ${p.x(hi)},${p.y(0)}`} fill={fill(tone)} />;
}

interface RectsProps {
  p: Plot;
  lo: number;
  hi: number;
  n: number;
  /** Draw the short rectangles, the tall ones, or only the strips between. */
  kind: 'lower' | 'upper' | 'gap';
  muted?: boolean;
}

/** Upper or lower rectangles over an equal partition, or the gap between them. */
function Rects({ p, lo, hi, n, kind, muted = false }: RectsProps) {
  const tone = kind === 'lower' ? 'a' : kind === 'upper' ? 'b' : 'c';
  return (
    <g className={muted ? 'is-muted' : ''}>
      {Array.from({ length: n }, (_, i) => {
        const x0 = lo + ((hi - lo) * i) / n;
        const x1 = lo + ((hi - lo) * (i + 1)) / n;
        const { min, max } = integrandRange(x0, x1);
        const top = kind === 'lower' ? min : max;
        const bottom = kind === 'gap' ? min : 0;
        return (
          <rect
            key={i}
            x={p.x(x0)}
            y={p.y(top)}
            width={p.dx(x1 - x0)}
            height={Math.max(0, p.dy(top - bottom))}
            fill={fill(tone)}
            stroke={stroke(tone)}
            strokeWidth={kind === 'gap' ? 1.25 : 1}
          />
        );
      })}
    </g>
  );
}

function Frame({ title, caption, children, split = false }: { title: string; caption: string; children: ReactNode; split?: boolean }) {
  return (
    <FigureFrame viewBox={plot.viewBox} title={title} caption={caption}>
      <Axes plot={plot} xTicks={[1, 2]} yTicks={[1]} />
      {children}
      <Label at={[plot.x(A), plot.y(0) + 18]} tone="neutral" size={13}>
        a
      </Label>
      <Label at={[plot.x(B), plot.y(0) + 18]} tone="neutral" size={13}>
        {split ? 'c' : 'b'}
      </Label>
      {split ? <Label at={[plot.x(1.8), plot.y(0) + 18]} tone="neutral" size={13}>b</Label> : null}
    </FigureFrame>
  );
}

function Heading({ text }: { text: string }) {
  return (
    <Label at={[plot.x(plot.xDomain[1]) - 2, plot.y(1.88)]} tone="neutral" size={13} anchor="end">
      {text}
    </Label>
  );
}

/* ------------------------------------------------------------------------ */

export function RiemannFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;
  if (i === 5) return <Dirichlet />;

  const n = i <= 1 ? 5 : i === 2 || i === 3 ? 10 : i === 4 ? 20 : 1;
  const curve = <Curve plot={plot} fn={g} domain={[A, B]} tone="accent" width={2.5} />;

  return (
    <Frame
      title="A curve over an interval, with the region under it trapped between short rectangles from below and tall ones from above"
      caption={riemannCaption(i)}
      split={i >= 7}
    >
      {i <= 0 ? (
        <>
          <Area p={plot} fn={g} lo={A} hi={B} tone="accent" />
          {curve}
          <Label at={[plot.x(1.5), plot.y(0.5)]} tone="accent" size={15} weight={600}>
            area?
          </Label>
        </>
      ) : null}

      {i >= 1 && i <= 4 ? (
        <>
          <Rects p={plot} lo={A} hi={B} n={n} kind="upper" />
          <Rects p={plot} lo={A} hi={B} n={n} kind="lower" />
          {curve}
          <Label at={[plot.x(B) + 6, plot.y(integrandRange(B - (B - A) / n, B).max)]} tone="b" size={13} weight={600} anchor="start">
            U
          </Label>
          <Label at={[plot.x(B) + 6, plot.y(integrandRange(B - (B - A) / n, B).min) + 14]} tone="a" size={13} weight={600} anchor="start">
            L
          </Label>
        </>
      ) : null}

      {i === 6 ? <Coarse /> : null}
      {i === 6 ? curve : null}

      {i >= 7 ? (
        <>
          <Area p={plot} fn={g} lo={A} hi={1.8} tone="a" />
          <Area p={plot} fn={g} lo={1.8} hi={B} tone="b" />
          {curve}
          <Segment from={plot.pt([1.8, 0])} to={plot.pt([1.8, g(1.8)])} tone="neutral" dashed />
          <Label at={[plot.x(0.9), plot.y(0.45)]} tone="a" size={14} weight={600}>
            ∫ₐᵇ
          </Label>
          <Label at={[plot.x(2.4), plot.y(0.45)]} tone="b" size={14} weight={600}>
            ∫ᵇᶜ
          </Label>
        </>
      ) : null}

      <Heading text={riemannHeading(i)} />
    </Frame>
  );
}

/** The partition with no interior cut: one short rectangle and one tall one. */
function Coarse() {
  const { min, max } = integrandRange(A, B);
  return (
    <g>
      <rect x={plot.x(A)} y={plot.y(max)} width={plot.dx(B - A)} height={plot.dy(max)} fill={fill('b')} stroke={stroke('b')} />
      <rect x={plot.x(A)} y={plot.y(min)} width={plot.dx(B - A)} height={plot.dy(min)} fill={fill('a')} stroke={stroke('a')} />
      <Label at={[plot.x(B) - 6, plot.y(max) - 10]} tone="b" size={13} weight={600} anchor="end">
        sup f
      </Label>
      <Label at={[plot.x(B) - 6, plot.y(min) + 16]} tone="a" size={13} weight={600} anchor="end">
        inf f
      </Label>
    </g>
  );
}

const dirichletPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.12, 1.25],
  yDomain: [-0.2, 1.4],
});

/** 1 on the rationals, 0 elsewhere: every upper sum 1, every lower sum 0. */
function Dirichlet() {
  const p = dirichletPlot;
  const dots = Array.from({ length: 41 }, (_, s) => s / 40);
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The Dirichlet function on [0, 1]: values 1 at rationals and 0 at irrationals, with the upper sum filling the unit square and the lower sum empty"
      caption="The dots are schematic samples of two dense sets, not two values at the same point. Every partition piece contains rationals at height 1 and irrationals at height 0. So U = 1 and L = 0 whatever the cuts."
    >
      <Axes plot={p} xTicks={[1]} yTicks={[1]} />
      <rect x={p.x(0)} y={p.y(1)} width={p.dx(1)} height={p.dy(1)} fill={fill('b')} stroke={stroke('b')} strokeDasharray="5 4" />
      {[0.25, 0.5, 0.75].map((x) => (
        <Segment key={x} from={p.pt([x, 0])} to={p.pt([x, 1])} tone="neutral" dashed muted />
      ))}
      {dots.map((x) => (
        <g key={x}>
          <PointMark at={p.pt([x, 1])} tone="warn" radius={1.8} />
          <PointMark at={p.pt([(40 * x + Math.SQRT1_2) / 41, 0])} tone="warn" radius={1.8} />
        </g>
      ))}
      <Label at={[p.x(1) + 8, p.y(1)]} tone="b" size={14} weight={600} anchor="start">
        U = 1
      </Label>
      <Label at={[p.x(1) + 8, p.y(0)]} tone="a" size={14} weight={600} anchor="start">
        L = 0
      </Label>
      <Label at={[p.x(0.5), p.y(1.3)]} tone="warn" size={14} weight={700}>
        the trap never closes
      </Label>
    </FigureFrame>
  );
}

function riemannHeading(i: number): string {
  if (i <= 0) return 'the region under a graph — but area is what is being defined';
  if (i === 1) return 'trap it: short rectangles below, tall ones above';
  if (i === 2) return 'cut finer: L rises, U falls';
  if (i === 3) return 'every lower sum is below every upper sum';
  if (i === 4) return 'the best estimates from each side meet';
  if (i === 6) return 'the coarsest partition: one short rectangle, one tall';
  return 'the integral adds over adjacent intervals';
}

function riemannCaption(i: number): string {
  if (i < 0) return 'The region under a curve, and the two families of rectangles that will define its area.';
  if (i === 0) return 'The picture everyone has. It is not a definition: the only areas known are those of rectangles.';
  if (i === 1) return 'Cut the interval; on each piece the graph lies between its lowest and highest value. The region lies between L and U.';
  if (i === 2) return 'Add cuts and the short rectangles grow, the tall ones shrink. Refining never loosens either estimate.';
  if (i === 3) return 'Two partitions are compared through their common refinement, so any L is at most any U.';
  if (i === 4) return 'sup L and inf U exist by completeness. f is integrable when they coincide, and the common value is the integral.';
  if (i === 6) return 'With no interior cut the integral is trapped between inf f and sup f times the length — the estimate the fundamental theorem uses.';
  return 'Partitions of the two halves join into a partition of the whole, and the sums add. So the integrals add.';
}

/* ------------------------------------------------------------------------ */

export function ContinuousIntegrableFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'continuous') return <Dirichlet />;
  const i = stepIndex;
  const n = i <= 0 ? 6 : i <= 4 ? 12 : 24;
  const X0 = 1.35;
  const DELTA = 0.3;
  const EPS = slopeBound * DELTA;

  return (
    <Frame
      title="A continuous curve with upper and lower rectangles, and the thin strips between them that shrink as the partition is refined"
      caption={integrableCaption(i)}
    >
      {i !== 1 && i !== 2 ? (
        <>
          <Rects p={plot} lo={A} hi={B} n={n} kind="upper" muted />
          <Rects p={plot} lo={A} hi={B} n={n} kind="lower" muted />
          <Rects p={plot} lo={A} hi={B} n={n} kind="gap" />
        </>
      ) : null}
      {i === 2 ? (
        <g>
          {Array.from({ length: n + 1 }, (_, k) => A + ((B - A) * k) / n).map((x) => (
            <Segment key={x} from={plot.pt([x, 0])} to={plot.pt([x, g(x)])} tone="neutral" dashed muted />
          ))}
          <Segment from={plot.pt([1.0, 0.2])} to={plot.pt([1.25, 0.2])} tone="accent" active />
          <Label at={[plot.x(1.125), plot.y(0.2) - 14]} tone="accent" size={13} weight={600}>
            Δx &lt; δ
          </Label>
        </g>
      ) : null}
      <Curve plot={plot} fn={g} domain={[A, B]} tone="accent" width={2.5} />

      {i === 1 ? (
        <g>
          <Segment from={plot.pt([X0 - DELTA, 0])} to={plot.pt([X0 + DELTA, 0])} tone="accent" active />
          <Label at={[plot.x(X0), plot.y(0) - 14]} tone="accent" size={13} weight={600}>
            2δ
          </Label>
          <rect
            x={plot.x(X0 - DELTA)}
            y={plot.y(g(X0) + EPS)}
            width={plot.dx(2 * DELTA)}
            height={plot.dy(2 * EPS)}
            fill={fill('good')}
            stroke={stroke('good')}
            strokeDasharray="4 4"
          />
          <Label at={[plot.x(X0 + DELTA) + 8, plot.y(g(X0))]} tone="good" size={13} weight={600} anchor="start">
            ε/(b−a)
          </Label>
          <Label at={[plot.x(0.35), plot.y(1.72)]} tone="good" size={13} anchor="start">
            the same δ, wherever the window is put
          </Label>
        </g>
      ) : null}

      {i === 4 ? (
        <Label at={[plot.x(B) - 6, plot.y(integrandRange(B - 0.25, B).max) - 14]} tone="c" size={13} weight={700} anchor="end">
          Σ &lt; ε
        </Label>
      ) : null}

      <Heading text={integrableHeading(i)} />
    </Frame>
  );
}

function integrableHeading(i: number): string {
  if (i <= 0) return 'the gap U − L: the strips between tall and short';
  if (i === 1) return 'one δ for the whole interval — Heine–Cantor';
  if (i === 2) return 'cut into pieces shorter than δ';
  if (i === 3) return 'on every piece, top and bottom within ε/(b−a)';
  if (i === 4) return 'the strips add up to less than ε';
  return 'so sup L = inf U: f is integrable';
}

function integrableCaption(i: number): string {
  if (i < 0) return 'A continuous function, and the two estimates the definition asks to be squeezed together.';
  if (i === 0) return 'It is enough to make the strips between the tall and short rectangles total less than ε, for one partition.';
  if (i === 1) return 'One radius serves every centre x: whenever |y − x| < δ, the value f(y) is within ε/(b − a) of f(x). The window shows this bound relative to its centre, not between its two ends.';
  if (i === 2) return 'Cut the interval into equal pieces shorter than δ. There is such an n by the Archimedean property.';
  if (i === 3) return 'On each piece the highest and lowest values are taken at two points within δ of each other, so each strip is shorter than ε/(b − a).';
  if (i === 4) return 'Strips shorter than ε/(b − a), over widths that add up to b − a: total less than ε.';
  return 'ε was arbitrary, so the upper and lower integrals coincide. Compactness entered once — in the single δ.';
}

/* ------------------------------------------------------------------------ */

const T = 1.9;

export function FundamentalCalculusFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'continuous') return <StepFunction />;
  const i = stepIndex;
  if (i >= 5) return <Shift />;
  const h = i >= 4 ? 0.22 : 0.55;

  return (
    <Frame
      title="The area under a curve from a to a moving right-hand end t, and the thin sliver added when t is pushed out by h"
      caption={ftcCaption(i)}
    >
      <Area p={plot} fn={g} lo={A} hi={T} tone="accent" />
      {i === 1 ? <CoarseOver lo={A} hi={T} /> : null}
      {i >= 2 ? <Area p={plot} fn={g} lo={T} hi={T + h} tone="c" /> : null}
      {i >= 3 ? <CoarseOver lo={T} hi={T + h} marks /> : null}
      <Curve plot={plot} fn={g} domain={[A, B]} tone="accent" width={2.5} />

      <Segment from={plot.pt([T, 0])} to={plot.pt([T, g(T)])} tone="accent" />
      <Label at={[plot.x(T), plot.y(0) + 18]} tone="accent" size={13} weight={600}>
        t
      </Label>
      {i <= 1 ? (
        <Label at={[plot.x((A + T) / 2), plot.y(0.45)]} tone="accent" size={15} weight={600}>
          G(t)
        </Label>
      ) : null}
      {i >= 2 ? (
        <>
          <Segment from={plot.pt([T + h, 0])} to={plot.pt([T + h, g(T + h)])} tone="c" />
          <Label at={[plot.x(T + h) + (i >= 4 ? 10 : 0), plot.y(0) + 18]} tone="c" size={13} weight={600} anchor={i >= 4 ? 'start' : 'middle'}>
            t + h
          </Label>
        </>
      ) : null}
      {i >= 4 ? (
        <Label at={[plot.x(T + h) + 10, plot.y(g(T)) - 12]} tone="good" size={13} weight={700} anchor="start">
          ≈ g(t) · h
        </Label>
      ) : null}

      <Heading text={ftcHeading(i)} />
    </Frame>
  );
}

/** Lowest and highest value of g over [lo, hi], as rectangles, with the points where they are taken. */
function CoarseOver({ lo, hi, marks = false }: { lo: number; hi: number; marks?: boolean }) {
  const { min, max, pMax, pMin } = integrandRange(lo, hi);
  return (
    <g>
      <rect x={plot.x(lo)} y={plot.y(max)} width={plot.dx(hi - lo)} height={plot.dy(max)} fill="none" stroke={stroke('b')} strokeWidth={1.5} strokeDasharray="4 3" />
      <rect x={plot.x(lo)} y={plot.y(min)} width={plot.dx(hi - lo)} height={plot.dy(min)} fill="none" stroke={stroke('a')} strokeWidth={1.5} strokeDasharray="4 3" />
      {marks ? (
        <>
          <PointMark at={plot.pt([pMax, max])} tone="b" radius={4} label="p" labelOffset={[0, -13]} />
          <PointMark at={plot.pt([pMin, min])} tone="a" radius={4} label="q" labelOffset={[0, 15]} />
        </>
      ) : (
        <>
          <Label at={[plot.x(lo) - 6, plot.y(max)]} tone="b" size={13} weight={600} anchor="end">
            max
          </Label>
          <Label at={[plot.x(lo) - 6, plot.y(min)]} tone="a" size={13} weight={600} anchor="end">
            min
          </Label>
        </>
      )}
    </g>
  );
}

const shiftPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.25, 3.3],
  yDomain: [-0.35, 4.1],
});

/** The second half: y and G have the same derivative, so they differ by a constant. */
function Shift() {
  const p = shiftPlot;
  const c = 0.7;
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The integrand g, its area function G starting at zero, and another function y with the same derivative, running parallel to G at a constant height above it"
      caption="y′ = g = G′, so y − G has derivative 0 everywhere. By the mean value theorem its chord from a to any t has slope 0: y − G is constant, and the constant is y(a)."
    >
      <Axes plot={p} xTicks={[1, 2, 3]} yTicks={[1, 2, 3]} />
      <Curve plot={p} fn={g} domain={[A, B]} tone="accent" width={1.5} dashed />
      <Curve plot={p} fn={G} domain={[A, B]} tone="good" width={2.5} />
      <Curve plot={p} fn={(t) => G(t) + c} domain={[A, B]} tone="good" width={2.5} />
      {[0.8, 1.9, 2.8].map((t) => (
        <Segment key={t} from={p.pt([t, G(t)])} to={p.pt([t, G(t) + c])} tone="c" active />
      ))}
      <Label at={[p.x(B) + 6, p.y(g(B))]} tone="accent" size={13} anchor="start">
        g
      </Label>
      <Label at={[p.x(B) + 6, p.y(G(B))]} tone="good" size={14} weight={600} anchor="start">
        G
      </Label>
      <Label at={[p.x(B) + 6, p.y(G(B) + c)]} tone="good" size={14} weight={600} anchor="start">
        y
      </Label>
      <Label at={[p.x(0.8) + 8, p.y(G(0.8) + c / 2)]} tone="c" size={13} weight={600} anchor="start">
        y − G = y(a)
      </Label>
      <PointMark at={p.pt([A, 0])} tone="good" radius={4} />
      <PointMark at={p.pt([A, c])} tone="good" radius={4} />
      <Label at={[p.x(A) - 8, p.y(c)]} tone="good" size={13} anchor="end">
        y(a)
      </Label>
    </FigureFrame>
  );
}

const stepPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-1.15, 1.15],
  yDomain: [-0.3, 1.35],
});

/** Without continuity: a step integrand, and an area function with a corner where it jumps. */
function StepFunction() {
  const p = stepPlot;
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="A step function jumping from 0 to 1 at the origin, and its area function, which is flat and then climbs with slope 1, with a corner at the jump"
      caption="g is integrable, so G exists: 0 up to the jump, then climbing at slope 1. The chords of G from the left have slope 0 and from the right slope 1. No derivative at 0 — the trap between min g and max g never closes there."
    >
      <Axes plot={p} xTicks={[-1, 1]} yTicks={[1]} />
      <Curve plot={p} fn={() => 0} domain={[-1, 0]} tone="warn" width={2.5} />
      <Curve plot={p} fn={() => 1} domain={[0, 1]} tone="warn" width={2.5} />
      <PointMark at={p.pt([0, 0])} tone="warn" radius={4} hollow />
      <PointMark at={p.pt([0, 1])} tone="warn" radius={4} />
      <Curve plot={p} fn={(t) => Math.max(0, t)} domain={[-1, 1]} tone="good" width={2.5} />
      <PointMark at={p.pt([0, 0])} tone="good" radius={6} hollow active />
      <Label at={[p.x(0.55), p.y(1) + 16]} tone="warn" size={13} weight={600}>
        g
      </Label>
      <Label at={[p.x(0.82), p.y(0.82) - 14]} tone="good" size={14} weight={600}>
        G
      </Label>
      <Label at={[p.x(0), p.y(0) + 22]} tone="good" size={14} weight={700}>
        G has a corner
      </Label>
    </FigureFrame>
  );
}

function ftcHeading(i: number): string {
  if (i <= 0) return 'the area from a to t, as a function of t';
  if (i === 1) return 'trapped between min · (t − a) and max · (t − a)';
  if (i === 2) return 'push t out by h: the new sliver is G(t+h) − G(t)';
  if (i === 3) return 'the sliver lies between h · min g and h · max g';
  return 'as h → 0 both bounds close on g(t): G′(t) = g(t)';
}

function ftcCaption(i: number): string {
  if (i < 0) return 'The area under g up to a moving right-hand end. The theorem says it grows at exactly the rate g.';
  if (i === 0) return 'g is continuous, so it is integrable on [a, t] for every t, and G(t) is a number.';
  if (i === 1) return 'The coarsest estimate: G(t) lies between the smallest and largest value of g on [a, t], times the length.';
  if (i === 2) return 'The integral adds over adjacent intervals, so the change in G is the area of the sliver between t and t + h.';
  if (i === 3) return 'The same estimate on the sliver: its area over h lies between g(q) and g(p), values g takes within |h| of t.';
  return 'Continuity of g at t puts both g(p) and g(q) within ε of g(t) once |h| < δ, and the difference quotient with them.';
}
