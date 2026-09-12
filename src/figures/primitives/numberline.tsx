import { Label, PointMark } from './shapes';
import type { Pt } from './shapes';
import type { Tone } from './tone';
import { fill, stroke } from './tone';

/**
 * The number line.
 *
 * Nearly every argument about the order structure of the reals is a statement
 * about points, intervals and gaps on one axis, so the whole of the
 * completeness material draws through these few components rather than through
 * the two-dimensional plot helpers.
 */

export interface NumberLine {
  readonly width: number;
  readonly height: number;
  readonly viewBox: string;
  /** y coordinate of the axis in SVG user space. */
  readonly baseline: number;
  readonly domain: readonly [number, number];
  /** Value to SVG x. */
  x(v: number): number;
  /** A distance in values to a distance in SVG units. */
  dx(v: number): number;
  /** y coordinate of a lane above the axis; lane 0 sits just above it. */
  lane(index: number): number;
}

export interface NumberLineOptions {
  width: number;
  height: number;
  domain: readonly [number, number];
  padding?: number;
  /** Fraction of the height where the axis sits. */
  baselineAt?: number;
  /** Vertical distance between lanes. */
  laneGap?: number;
}

export function createNumberLine({
  width,
  height,
  domain,
  padding = 38,
  baselineAt = 0.66,
  laneGap = 34,
}: NumberLineOptions): NumberLine {
  const [lo, hi] = domain;
  const innerW = width - padding * 2;
  const baseline = Math.round(height * baselineAt);

  return {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    baseline,
    domain,
    x: (v) => padding + ((v - lo) / (hi - lo)) * innerW,
    dx: (v) => (v / (hi - lo)) * innerW,
    lane: (index) => baseline - laneGap * (index + 1),
  };
}

interface AxisProps {
  line: NumberLine;
  ticks?: readonly number[];
  format?: (v: number) => string;
}

/** The axis itself, with arrowheads to say it continues in both directions. */
export function LineAxis({ line, ticks = [], format = String }: AxisProps) {
  const left = line.x(line.domain[0]);
  const right = line.x(line.domain[1]);
  const y = line.baseline;

  return (
    <g>
      <line x1={left} y1={y} x2={right} y2={y} stroke="var(--fig-axis)" strokeWidth={1.5} />
      <Chevron at={[left, y]} direction={-1} />
      <Chevron at={[right, y]} direction={1} />
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={line.x(t)}
            y1={y - 5}
            x2={line.x(t)}
            y2={y + 5}
            stroke="var(--fig-axis)"
            strokeWidth={1.5}
          />
          <Label at={[line.x(t), y + 20]} size={13} tone="neutral">
            {format(t)}
          </Label>
        </g>
      ))}
    </g>
  );
}

interface IntervalProps {
  line: NumberLine;
  from: number;
  to: number;
  /** Hollow endpoint markers mean the endpoint is not in the set. */
  openLeft?: boolean;
  openRight?: boolean;
  /** Draw an arrow instead of an endpoint, for a set running off the axis. */
  arrowRight?: boolean;
  arrowLeft?: boolean;
  tone?: Tone;
  label?: string;
  /** Which lane above the axis to draw in. */
  lane?: number;
  muted?: boolean;
  active?: boolean;
}

/** A set of points drawn as a bar above the axis. */
export function LineInterval({
  line,
  from,
  to,
  openLeft = false,
  openRight = false,
  arrowLeft = false,
  arrowRight = false,
  tone = 'accent',
  label,
  lane = 0,
  muted,
  active,
}: IntervalProps) {
  const y = line.lane(lane);
  const x1 = line.x(from);
  const x2 = line.x(to);

  return (
    <g className={[muted ? 'is-muted' : '', active ? 'is-active' : ''].filter(Boolean).join(' ')}>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={stroke(tone)}
        strokeWidth={active ? 7 : 5}
        strokeLinecap="butt"
      />
      {arrowLeft ? (
        <Chevron at={[x1, y]} direction={-1} tone={tone} />
      ) : (
        <Endpoint at={[x1, y]} tone={tone} open={openLeft} />
      )}
      {arrowRight ? (
        <Chevron at={[x2, y]} direction={1} tone={tone} />
      ) : (
        <Endpoint at={[x2, y]} tone={tone} open={openRight} />
      )}
      {label ? (
        <Label at={[(x1 + x2) / 2, y - 18]} tone={tone} size={15} weight={600}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

interface MarkProps {
  line: NumberLine;
  at: number;
  tone?: Tone;
  label?: string;
  /** Hollow means the value is being discussed but is not in the set. */
  hollow?: boolean;
  /** Put the label under the axis instead of over it. */
  below?: boolean;
  lane?: number;
  muted?: boolean;
  active?: boolean;
}

/** A single value called out on the axis. */
export function LineMark({
  line,
  at,
  tone = 'accent',
  label,
  hollow = false,
  below = false,
  lane,
  muted,
  active,
}: MarkProps) {
  const y = lane === undefined ? line.baseline : line.lane(lane);
  const point: Pt = [line.x(at), y];

  return (
    <g className={[muted ? 'is-muted' : '', active ? 'is-active' : ''].filter(Boolean).join(' ')}>
      <PointMark at={point} tone={tone} radius={5} hollow={hollow} active={active} />
      {label ? (
        <Label at={[point[0], y + (below ? 24 : -18)]} tone={tone} size={14} weight={600}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

interface RegionProps {
  line: NumberLine;
  from: number;
  to: number;
  tone?: Tone;
  label?: string;
  /** Mark the near edge as the one that matters, e.g. a least upper bound. */
  edge?: 'left' | 'right';
}

/** A shaded band spanning the figure, for a whole region of the axis. */
export function LineRegion({ line, from, to, tone = 'neutral', label, edge }: RegionProps) {
  const x1 = line.x(from);
  const x2 = line.x(to);
  const top = 12;
  const bottom = line.baseline + 8;

  return (
    <g className="shape--movable">
      <rect x={x1} y={top} width={Math.max(0, x2 - x1)} height={bottom - top} fill={fill(tone)} />
      {edge ? (
        <line
          x1={edge === 'left' ? x1 : x2}
          y1={top}
          x2={edge === 'left' ? x1 : x2}
          y2={bottom}
          stroke={stroke(tone)}
          strokeWidth={2}
        />
      ) : null}
      {label ? (
        <Label at={[(x1 + x2) / 2, top + 16]} tone={tone} size={14} weight={600}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

interface GapProps {
  line: NumberLine;
  at: number;
  label?: string;
  tone?: Tone;
}

/** A value the ambient set does not contain: the hole the argument is about. */
export function LineGap({ line, at, label, tone = 'warn' }: GapProps) {
  const x = line.x(at);
  return (
    <g>
      <line
        x1={x}
        y1={16}
        x2={x}
        y2={line.baseline + 10}
        stroke={stroke(tone)}
        strokeWidth={1.75}
        strokeDasharray="6 5"
      />
      <PointMark at={[x, line.baseline]} tone={tone} radius={5} hollow />
      {label ? (
        <Label at={[x, 10]} tone={tone} size={14} weight={600}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

function Endpoint({ at, tone, open }: { at: Pt; tone: Tone; open: boolean }) {
  return (
    <circle
      cx={at[0]}
      cy={at[1]}
      r={5}
      fill={open ? 'var(--surface)' : stroke(tone)}
      stroke={stroke(tone)}
      strokeWidth={2}
    />
  );
}

function Chevron({ at, direction, tone }: { at: Pt; direction: 1 | -1; tone?: Tone }) {
  const size = 7;
  const tip = at[0] + direction * size;
  const colour = tone ? stroke(tone) : 'var(--fig-axis)';
  return (
    <polygon
      points={`${tip},${at[1]} ${at[0]},${at[1] - size * 0.65} ${at[0]},${at[1] + size * 0.65}`}
      fill={colour}
    />
  );
}
