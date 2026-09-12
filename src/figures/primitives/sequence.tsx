import type { Plot } from './plot';
import { PointMark } from './shapes';
import type { Tone } from './tone';
import { stroke } from './tone';

/**
 * A sequence drawn against its index.
 *
 * Every statement about convergence is a statement about what the terms do
 * eventually, which is exactly what this view shows and a number line does not:
 * the horizontal axis is the index, so "from some point on" is a position you
 * can point at.
 */

interface SequenceDotsProps {
  plot: Plot;
  /** a_1, a_2, … in order; the index is the position in the array plus one. */
  terms: readonly number[];
  tone?: Tone;
  /** Terms before this index (1-based) are drawn as also-rans. */
  settledFrom?: number;
  /** Join consecutive terms, for a sequence whose shape matters. */
  connect?: boolean;
  radius?: number;
}

export function SequenceDots({
  plot,
  terms,
  tone = 'accent',
  settledFrom,
  connect = false,
  radius = 4,
}: SequenceDotsProps) {
  const points = terms.map((value, i) => ({ n: i + 1, value }));
  const visible = points.filter(
    (p) => p.value >= plot.yDomain[0] && p.value <= plot.yDomain[1],
  );

  return (
    <g>
      {connect ? (
        <polyline
          points={visible.map((p) => `${plot.x(p.n)},${plot.y(p.value)}`).join(' ')}
          fill="none"
          stroke={stroke(tone)}
          strokeWidth={1.25}
          strokeDasharray="3 4"
          opacity={0.5}
        />
      ) : null}
      {visible.map((p) => (
        <PointMark
          key={p.n}
          at={plot.pt([p.n, p.value])}
          tone={tone}
          radius={radius}
          muted={settledFrom !== undefined && p.n < settledFrom}
        />
      ))}
    </g>
  );
}

/** Terms that leave the top of the frame, drawn as arrows at the edge. */
export function SequenceEscapes({
  plot,
  terms,
  tone = 'warn',
}: {
  plot: Plot;
  terms: readonly number[];
  tone?: Tone;
}) {
  const top = plot.y(plot.yDomain[1]);
  const escaping = terms
    .map((value, i) => ({ n: i + 1, value }))
    .filter((p) => p.value > plot.yDomain[1]);

  return (
    <g>
      {escaping.map((p) => (
        <polygon
          key={p.n}
          points={`${plot.x(p.n)},${top + 2} ${plot.x(p.n) - 5},${top + 12} ${plot.x(p.n) + 5},${top + 12}`}
          fill={stroke(tone)}
        />
      ))}
    </g>
  );
}
