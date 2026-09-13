import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * Chords through one point of a graph, brought in until they settle on the
 * tangent. The curve is smooth so that they do settle; the closing step
 * switches to |x|, where they do not.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.2, 3.2],
  yDomain: [-0.15, 1.55],
});

const f = (x: number) => 0.55 + 0.32 * Math.sin(2.2 * x - 0.6) + 0.12 * x;
const fPrime = (x: number) => 0.32 * 2.2 * Math.cos(2.2 * x - 0.6) + 0.12;
const C = 0.5;
const HS = [1.2, 0.8, 0.5, 0.3];

/** The line through (c, f(c)) and (c + h, f(c + h)), as a function. */
const chord = (h: number) => (x: number) => f(C) + ((f(C + h) - f(C)) / h) * (x - C);
const tangent = (x: number) => f(C) + fPrime(C) * (x - C);

export function DerivativeFigure({ stepIndex }: FigureProps) {
  if (stepIndex >= 5) return <Corner />;
  const i = stepIndex;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A smooth curve with chords from one point, shortening until they lie along the tangent"
      caption={captionFor(i)}
    >
      <Axes plot={plot} xTicks={[1, 2, 3]} yTicks={[1]} />
      <Curve plot={plot} fn={f} domain={[0, 3]} tone="accent" width={2.5} />

      {i <= 0 ? <OneChord h={HS[0] as number} /> : null}
      {i === 1 ? <ManyChords /> : null}
      {i >= 2 ? (
        <>
          {i === 2 ? <ManyChords muted /> : null}
          <Curve plot={plot} fn={tangent} domain={[C - 0.45, C + 1.15]} tone="good" width={2.5} />
          <Label at={[plot.x(C + 1.15) + 6, plot.y(tangent(C + 1.15))]} tone="good" size={13} weight={600} anchor="start">
            slope f′(c)
          </Label>
        </>
      ) : null}
      {i === 3 ? <Errors /> : null}

      <PointMark at={plot.pt([C, f(C)])} tone="accent" radius={5} active />
      <Segment from={plot.pt([C, 0])} to={plot.pt([C, f(C)])} tone="neutral" dashed muted />
      <Label at={[plot.x(C), plot.y(0) + 18]} tone="accent" size={14} weight={600}>
        c
      </Label>

      <Label at={[plot.x(plot.xDomain[1]) - 2, plot.y(1.49)]} tone="neutral" size={13} anchor="end">
        {headingFor(i)}
      </Label>
    </FigureFrame>
  );
}

/** One chord with its rise and run drawn in. */
function OneChord({ h }: { h: number }) {
  const far: readonly [number, number] = [C + h, f(C + h)];
  return (
    <g>
      <Curve plot={plot} fn={chord(h)} domain={[C - 0.35, C + h + 0.35]} tone="a" width={2} />
      <Segment from={plot.pt([C, f(C)])} to={plot.pt([far[0], f(C)])} tone="b" dashed />
      <Segment from={plot.pt([far[0], f(C)])} to={plot.pt(far)} tone="b" dashed />
      <Label at={[plot.x(C + h / 2), plot.y(f(C)) + 16]} tone="b" size={13} weight={600}>
        h
      </Label>
      <Label at={[plot.x(far[0]) + 8, plot.y((f(C) + far[1]) / 2)]} tone="b" size={13} weight={600} anchor="start">
        f(c+h) − f(c)
      </Label>
      <PointMark at={plot.pt(far)} tone="a" radius={4} />
      <Label at={[plot.x(far[0]), plot.y(0) + 18]} tone="a" size={13} weight={600}>
        c + h
      </Label>
    </g>
  );
}

function ManyChords({ muted = false }: { muted?: boolean }) {
  return (
    <g className={muted ? 'is-muted' : ''}>
      {HS.map((h, k) => (
        <g key={h}>
          <Curve plot={plot} fn={chord(h)} domain={[C - 0.35, C + h + 0.25]} tone="a" width={k === HS.length - 1 ? 2.5 : 1.5} />
          <PointMark at={plot.pt([C + h, f(C + h)])} tone="a" radius={3.5} muted={k < HS.length - 1} />
        </g>
      ))}
      {!muted ? (
        <Label at={[plot.x(C + (HS[0] as number)) + 6, plot.y(f(C + (HS[0] as number))) + 14]} tone="a" size={13} anchor="start">
          h → 0
        </Label>
      ) : null}
    </g>
  );
}

/** The gap between the graph and its tangent, at a few h: small even against h. */
function Errors() {
  const hs = [0.9, 0.6, 0.3];
  return (
    <g>
      {hs.map((h) => (
        <g key={h}>
          <Segment from={plot.pt([C + h, Math.min(tangent(C + h), 1.5)])} to={plot.pt([C + h, f(C + h)])} tone="warn" active />
          <PointMark at={plot.pt([C + h, f(C + h)])} tone="warn" radius={3.5} />
        </g>
      ))}
      <Label at={[plot.x(C + 0.9) + 8, plot.y((tangent(C + 0.9) + f(C + 0.9)) / 2)]} tone="warn" size={13} weight={600} anchor="start">
        r(h)
      </Label>
    </g>
  );
}

const cornerPlot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-1.3, 1.3],
  yDomain: [-0.3, 1.45],
});

/** |x| at 0: the chords from the right all have slope 1, from the left all −1. */
function Corner() {
  const p = cornerPlot;
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The graph of |x| with chords from the origin: slope 1 on the right, −1 on the left, and no single tangent"
      caption="Every chord from the right has slope 1 and every chord from the left has slope −1. No number is within ½ of both, so ε = ½ defeats every δ: continuous, and no derivative at 0."
    >
      <Axes plot={p} xTicks={[-1, 1]} yTicks={[1]} />
      <Curve plot={p} fn={(x) => Math.abs(x)} domain={[-1.2, 1.2]} tone="accent" width={2.5} />
      {[0.9, 0.5, 0.25].map((h) => (
        <g key={h}>
          <PointMark at={p.pt([h, h])} tone="a" radius={3.5} />
          <PointMark at={p.pt([-h, h])} tone="b" radius={3.5} />
        </g>
      ))}
      <Curve plot={p} fn={(x) => x} domain={[-0.25, 1.25]} tone="a" width={1.5} dashed />
      <Curve plot={p} fn={(x) => -x} domain={[-1.25, 0.25]} tone="b" width={1.5} dashed />
      <PointMark at={p.pt([0, 0])} tone="warn" radius={6} hollow active />
      <Label at={[p.x(0.85), p.y(0.55)]} tone="a" size={14} weight={600} anchor="start">
        slope 1
      </Label>
      <Label at={[p.x(-0.85), p.y(0.55)]} tone="b" size={14} weight={600} anchor="end">
        slope −1
      </Label>
      <Label at={[p.x(0), p.y(0) + 22]} tone="warn" size={14} weight={700}>
        no single slope
      </Label>
    </FigureFrame>
  );
}

function headingFor(i: number): string {
  if (i <= 0) return 'the slope of one chord: rise over run';
  if (i === 1) return 'shorter chords turn towards one line';
  if (i === 2) return 'the line they settle on: the tangent';
  if (i === 3) return 'the graph leaves the tangent slowly — r(h)/h → 0';
  return 'a derivative at c forces continuity at c';
}

function captionFor(i: number): string {
  if (i < 0) return 'The direction of a curve at one point, defined through the chords that leave it.';
  if (i === 0) return 'One chord, one slope. It measures the change between c and c + h, and depends on where c + h was put.';
  if (i === 1) return 'Bring c + h in and the chords pile up on one line. The definition has to say what "pile up" means.';
  if (i === 2) return 'Every chord shorter than δ has slope within ε of f′(c): the continuity sentence, for the chord slope at h = 0.';
  if (i === 3) return 'The gap between the graph and the tangent is r(h), and r(h)/h → 0. Any other line through the point has error proportional to h.';
  return 'The rise is |h| times a bounded slope, so it tends to 0 with h: differentiable at c means continuous at c.';
}
