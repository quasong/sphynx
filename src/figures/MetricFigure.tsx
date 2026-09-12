import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Pt } from './primitives/shapes';
import { Arrow, Label, PointMark, Segment } from './primitives/shapes';

/**
 * The axioms, one failure at a time, and then the reason the structure is named
 * separately from the set: the same points under three metrics, with three
 * different answers to "which points are within 1 of here".
 */

const W = 430;
const H = 300;

export function MetricFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  return (
    <FigureFrame
      viewBox={`0 0 ${W} ${H}`}
      title="Points with distances between them, showing what each axiom of a metric rules out"
      caption={captionFor(i)}
    >
      {i <= 0 ? <Pair /> : null}
      {i === 1 ? <Separation /> : null}
      {i === 2 ? <Symmetry /> : null}
      {i >= 3 && i <= 4 ? <Triangle /> : null}
      {i >= 5 ? <Balls /> : null}
    </FigureFrame>
  );
}

/** Two points and the one quantity every definition asked for. */
function Pair() {
  const x: Pt = [120, 150];
  const y: Pt = [310, 150];
  return (
    <g>
      <Segment from={x} to={y} tone="accent" label="d(x, y)" labelGap={-18} active />
      <PointMark at={x} tone="accent" label="x" radius={6} />
      <PointMark at={y} tone="accent" label="y" radius={6} />
      <Label at={[W / 2, 230]} tone="neutral" size={14}>
        the only thing the proofs ever used
      </Label>
    </g>
  );
}

/** Distinct points at distance zero: a sequence would converge to both. */
function Separation() {
  const x: Pt = [206, 150];
  const y: Pt = [222, 150];
  const approach: readonly Pt[] = [[90, 150], [130, 150], [162, 150], [184, 150]];
  return (
    <g>
      {approach.map((p, k) => (
        <PointMark key={k} at={p} tone="neutral" radius={4} muted={k < 2} />
      ))}
      <PointMark at={x} tone="warn" label="x" radius={6} />
      <PointMark at={y} tone="warn" label="y" labelOffset={[0, 26]} radius={6} />
      <Label at={[W / 2 + 40, 110]} tone="warn" size={15} weight={700} anchor="start">
        d(x, y) = 0 with x ≠ y
      </Label>
      <Label at={[W / 2, 230]} tone="warn" size={14}>
        then a sequence converges to both, and “the” limit means nothing
      </Label>
    </g>
  );
}

/** A distance that depends on which end you start from. */
function Symmetry() {
  const x: Pt = [120, 160];
  const y: Pt = [320, 160];
  return (
    <g>
      <Arrow from={[x[0] + 12, x[1] - 16]} to={[y[0] - 12, y[1] - 16]} tone="b" label="d(x, y) = 3" />
      <Arrow from={[y[0] - 12, y[1] + 22]} to={[x[0] + 12, x[1] + 22]} tone="warn" label="d(y, x) = 5" />
      <PointMark at={x} tone="accent" label="x" radius={6} />
      <PointMark at={y} tone="accent" label="y" radius={6} />
      <Label at={[W / 2, 250]} tone="warn" size={14}>
        then “within ε of x” and “has x within ε” are different sets
      </Label>
    </g>
  );
}

/** The axiom every chained estimate in the library spends. */
function Triangle() {
  const x: Pt = [90, 215];
  const y: Pt = [215, 80];
  const z: Pt = [345, 215];
  return (
    <g>
      <Segment from={x} to={y} tone="b" label="d(x, y)" labelGap={-20} />
      <Segment from={y} to={z} tone="b" label="d(y, z)" labelGap={20} />
      <Segment from={x} to={z} tone="accent" label="d(x, z)" labelGap={22} active />
      <PointMark at={x} tone="accent" label="x" labelOffset={[-18, 0]} radius={6} />
      <PointMark at={y} tone="accent" label="y" radius={6} />
      <PointMark at={z} tone="accent" label="z" labelOffset={[18, 0]} radius={6} />
      <Label at={[W / 2, 268]} tone="neutral" size={14}>
        going direct is never worse than going via y
      </Label>
    </g>
  );
}

/** One set, three metrics, three different unit balls. */
function Balls() {
  const centres: readonly { cx: number; label: string; name: string }[] = [
    { cx: 78, label: 'd₂ — Euclidean', name: 'disc' },
    { cx: 215, label: 'd₁ — taxicab', name: 'diamond' },
    { cx: 352, label: 'd₀ — discrete', name: 'point' },
  ];
  const cy = 140;
  const r = 46;

  return (
    <g>
      {centres.map(({ cx, label, name }) => (
        <g key={name}>
          <line x1={cx - r - 14} y1={cy} x2={cx + r + 14} y2={cy} stroke="var(--fig-axis)" strokeWidth={1.25} />
          <line x1={cx} y1={cy - r - 14} x2={cx} y2={cy + r + 14} stroke="var(--fig-axis)" strokeWidth={1.25} />
          {name === 'disc' ? (
            <circle cx={cx} cy={cy} r={r} fill="var(--fig-c-fill)" stroke="var(--fig-c)" strokeWidth={2} />
          ) : null}
          {name === 'diamond' ? (
            <polygon
              points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
              fill="var(--fig-a-fill)"
              stroke="var(--fig-a)"
              strokeWidth={2}
            />
          ) : null}
          {name === 'point' ? (
            <circle cx={cx} cy={cy} r={6} fill="var(--fig-b)" stroke="var(--fig-b)" strokeWidth={2} />
          ) : null}
          <Label at={[cx, cy + r + 40]} tone="neutral" size={13}>
            {label}
          </Label>
        </g>
      ))}
      <Label at={[W / 2, 40]} tone="neutral" size={14} weight={600}>
        the points within 1 of the origin
      </Label>
    </g>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'Every definition so far asked one thing of |x − y|: how far apart are these two?';
  if (i === 1) return 'Allow distinct points at distance zero and limits stop being unique.';
  if (i === 2) return 'Allow the distance to depend on direction and a neighbourhood stops being one set.';
  if (i === 3) return 'And this is the axiom every chained estimate in this library spends.';
  if (i === 4) return 'With those three, the old definitions read word for word with d in place of |·|.';
  return 'The same set, three metrics — and the unit ball is a disc, a diamond, or a single point.';
}
