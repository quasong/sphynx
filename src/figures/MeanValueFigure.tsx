import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * A graph, the chord joining its ends, and the tilted copy that starts and
 * ends at zero. The point the proof finds is the top of the tilted copy, and
 * the tangent there, tilted back, is parallel to the chord.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.15, 3.05],
  yDomain: [-0.32, 1.75],
});

const A = 0.3;
const B = 2.7;
const f = (x: number) => 0.35 + 0.55 * x - 0.14 * x * x + 0.16 * Math.sin(2.6 * x);
const fPrime = (x: number) => 0.55 - 0.28 * x + 0.16 * 2.6 * Math.cos(2.6 * x);
const SLOPE = (f(B) - f(A)) / (B - A);
const line = (x: number) => f(A) + SLOPE * (x - A);
const phi = (x: number) => f(x) - line(x);

/** Where φ is largest and smallest on [A, B], found by sampling. */
function extremes(): { max: number; min: number } {
  let max = A;
  let min = A;
  for (let s = 0; s <= 600; s += 1) {
    const x = A + ((B - A) * s) / 600;
    if (phi(x) > phi(max)) max = x;
    if (phi(x) < phi(min)) min = x;
  }
  return { max, min };
}
const EXT = extremes();
const C = EXT.max;

export function MeanValueFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'continuous') return <Jump />;
  if (dropped === 'differentiable') return <Corner />;
  if (stepIndex === 2) return <FlatCase />;
  const i = stepIndex;

  const showPhi = i >= 0 && i <= 3;
  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A curve with the chord joining its endpoints, the curve minus the chord, and a tangent parallel to the chord"
      caption={captionFor(i)}
    >
      <Axes plot={plot} xTicks={[1, 2]} yTicks={[1]} />

      <Curve plot={plot} fn={f} domain={[A, B]} tone="accent" width={i >= 1 && i <= 3 ? 1.5 : 2.5} />
      <Segment from={plot.pt([A, f(A)])} to={plot.pt([B, f(B)])} tone="c" dashed active={i <= 0 || i >= 4} />
      <PointMark at={plot.pt([A, f(A)])} tone="accent" radius={4} />
      <PointMark at={plot.pt([B, f(B)])} tone="accent" radius={4} />
      <Label at={[plot.x(A), plot.y(0) + 18]} tone="neutral" size={13}>
        a
      </Label>
      <Label at={[plot.x(B), plot.y(0) + 18]} tone="neutral" size={13}>
        b
      </Label>

      {showPhi ? (
        <>
          <Curve plot={plot} fn={phi} domain={[A, B]} tone="b" width={2.5} />
          <PointMark at={plot.pt([A, 0])} tone="b" radius={4} />
          <PointMark at={plot.pt([B, 0])} tone="b" radius={4} />
          <Label at={[plot.x(B) + 8, plot.y(phi(B - 0.25)) - 8]} tone="b" size={14} weight={600} anchor="start">
            φ
          </Label>
        </>
      ) : null}

      {i >= 1 && i <= 3 ? (
        <>
          <PointMark at={plot.pt([EXT.max, phi(EXT.max)])} tone="good" radius={5} active />
          <PointMark at={plot.pt([EXT.min, phi(EXT.min)])} tone="good" radius={4} hollow />
          <Label at={[plot.x(EXT.max), plot.y(phi(EXT.max)) - 16]} tone="good" size={13} weight={600}>
            max φ
          </Label>
        </>
      ) : null}

      {i === 3 ? <Fermat /> : null}

      {i >= 4 ? (
        <>
          <Curve plot={plot} fn={(x) => f(C) + fPrime(C) * (x - C)} domain={[C - 0.7, C + 0.7]} tone="good" width={2.5} />
          <PointMark at={plot.pt([C, f(C)])} tone="good" radius={5} active />
          <Segment from={plot.pt([C, 0])} to={plot.pt([C, f(C)])} tone="neutral" dashed muted />
          <Label at={[plot.x(C), plot.y(0) + 18]} tone="good" size={14} weight={700}>
            c
          </Label>
          <Label at={[plot.x(C + 0.7) + 6, plot.y(f(C) + fPrime(C) * 0.7)]} tone="good" size={13} weight={600} anchor="start">
            parallel
          </Label>
        </>
      ) : null}

      <Label at={[plot.x(plot.xDomain[1]) - 2, plot.y(1.68)]} tone="neutral" size={13} anchor="end">
        {headingFor(i)}
      </Label>
    </FigureFrame>
  );
}

function FlatCase() {
  return (
    <FigureFrame viewBox={plot.viewBox} title="The constant case: f is its own chord and φ is zero throughout the interval" caption={captionFor(2)}>
      <Axes plot={plot} xTicks={[1, 2]} yTicks={[1]} />
      <Curve plot={plot} fn={line} domain={[A, B]} tone="accent" />
      <Segment from={plot.pt([A, 0])} to={plot.pt([B, 0])} tone="b" active />
      <PointMark at={plot.pt([A, 0])} tone="b" radius={4} />
      <PointMark at={plot.pt([B, 0])} tone="b" radius={4} />
      <Label at={[plot.x(1.5), plot.y(line(1.5)) - 18]} tone="accent" size={14}>f is the chord</Label>
      <Label at={[plot.x(1.5), plot.y(0) - 18]} tone="b" size={14}>φ ≡ 0 · any interior c works</Label>
      <Label at={[plot.x(A), plot.y(0) + 18]} tone="neutral" size={13}>a</Label>
      <Label at={[plot.x(B), plot.y(0) + 18]} tone="neutral" size={13}>b</Label>
    </FigureFrame>
  );
}

/** Chords leaving the top of φ: down or level on both sides, so the tangent is level. */
function Fermat() {
  const hs = [0.5, 0.25];
  return (
    <g>
      {hs.map((h) => (
        <g key={h}>
          <Segment from={plot.pt([C, phi(C)])} to={plot.pt([C + h, phi(C + h)])} tone="a" />
          <Segment from={plot.pt([C, phi(C)])} to={plot.pt([C - h, phi(C - h)])} tone="a" />
        </g>
      ))}
      <Segment from={plot.pt([C - 0.6, phi(C)])} to={plot.pt([C + 0.6, phi(C)])} tone="good" active />
      <Label at={[plot.x(C + 0.6) + 6, plot.y(phi(C))]} tone="good" size={13} weight={600} anchor="start">
        φ′(c) = 0
      </Label>
    </g>
  );
}

function framed(x: readonly [number, number], y: readonly [number, number]): Plot {
  return createPlot({
    width: 430,
    height: 310,
    padding: { top: 26, right: 26, bottom: 36, left: 42 },
    xDomain: x,
    yDomain: y,
  });
}

/** Without continuity: x on [0, 1) and 0 at 1. Level chord, slope 1 inside. */
function Jump() {
  const p = framed([-0.2, 1.35], [-0.3, 1.3]);
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The function x on [0, 1) with value 0 at 1: a level chord from (0, 0) to (1, 0) and slope 1 everywhere between"
      caption="Differentiable inside with derivative 1 throughout, and the chord is level, because the function returns to 0 by a jump. The tilted function climbs towards 1 and never has a maximum."
    >
      <Axes plot={p} xTicks={[1]} yTicks={[1]} />
      <Curve plot={p} fn={(x) => x} domain={[0, 0.997]} tone="accent" width={2.5} />
      <PointMark at={p.pt([1, 1])} tone="accent" radius={5} hollow />
      <PointMark at={p.pt([1, 0])} tone="accent" radius={5} />
      <PointMark at={p.pt([0, 0])} tone="accent" radius={5} />
      <Segment from={p.pt([0, 0])} to={p.pt([1, 0])} tone="c" dashed active />
      <Label at={[p.x(0.5), p.y(0) - 14]} tone="c" size={13} weight={600}>
        chord: slope 0
      </Label>
      <Label at={[p.x(0.62), p.y(0.78)]} tone="warn" size={14} weight={700} anchor="end">
        f′ = 1 everywhere inside
      </Label>
    </FigureFrame>
  );
}

/** Without differentiability: |x| on [−1, 1]. Level chord, and a corner where the tangent would be. */
function Corner() {
  const p = framed([-1.3, 1.3], [-0.3, 1.45]);
  return (
    <FigureFrame
      viewBox={p.viewBox}
      title="The graph of |x| on [−1, 1] with its level chord at height 1 and a corner at the origin"
      caption="Continuous, with a level chord, and the only point where a level tangent could be is the one point with no tangent. The extreme value theorem still finds the minimum; there is no derivative to read off it."
    >
      <Axes plot={p} xTicks={[-1, 1]} yTicks={[1]} />
      <Curve plot={p} fn={(x) => Math.abs(x)} domain={[-1, 1]} tone="accent" width={2.5} />
      <Segment from={p.pt([-1, 1])} to={p.pt([1, 1])} tone="c" dashed active />
      <PointMark at={p.pt([-1, 1])} tone="accent" radius={4} />
      <PointMark at={p.pt([1, 1])} tone="accent" radius={4} />
      <PointMark at={p.pt([0, 0])} tone="warn" radius={6} hollow active />
      <Label at={[p.x(0), p.y(1) + 16]} tone="c" size={13} weight={600}>
        chord: slope 0
      </Label>
      <Label at={[p.x(0), p.y(0) + 22]} tone="warn" size={14} weight={700}>
        no tangent here
      </Label>
    </FigureFrame>
  );
}

function headingFor(i: number): string {
  if (i < 0) return 'somewhere, a tangent parallel to the chord';
  if (i === 0) return 'φ = f minus the chord: zero at both ends';
  if (i === 1) return 'φ has a largest and a smallest value';
  if (i === 2) return 'if both are at the ends, φ ≡ 0';
  if (i === 3) return 'at an interior maximum the chords go down both ways';
  return 'tilt back: f′(c) is the slope of the chord';
}

function captionFor(i: number): string {
  if (i < 0) return 'A curve and the chord joining its ends. The theorem promises a point where the tangent is parallel to it.';
  if (i === 0) return 'Subtract the chord. φ is continuous on [a, b], differentiable inside, and zero at both ends.';
  if (i === 1) return 'A continuous function on a closed bounded interval attains a maximum and a minimum — the extreme value theorem.';
  if (i === 2) return 'If the maximum and the minimum are both endpoint values they are both 0, so φ is 0 everywhere and any c will do.';
  if (i === 3) return 'Otherwise an extremum is interior. Chords leaving a maximum slope down on the right and up on the left, so the one number both families approach is 0.';
  return 'φ′(c) = 0 means f′(c) equals the slope of the chord: the tangent at c is parallel to it.';
}
