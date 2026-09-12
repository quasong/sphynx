import type { Tone } from './tone';
import { fill, stroke } from './tone';

export type Pt = readonly [number, number];

interface Emphasis {
  /** Push the element into the background when it is not part of the current step. */
  muted?: boolean;
  /** Thicken and brighten the element when the current step is about it. */
  active?: boolean;
}

interface SegmentProps extends Emphasis {
  from: Pt;
  to: Pt;
  tone?: Tone;
  dashed?: boolean;
  /** Text placed at the midpoint, offset perpendicular to the segment. */
  label?: string;
  labelGap?: number;
}

/** A straight line, optionally labelled with its length. */
export function Segment({
  from,
  to,
  tone = 'neutral',
  dashed = false,
  label,
  labelGap = 16,
  muted,
  active,
}: SegmentProps) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular unit vector, used to lift the label clear of the line.
  const nx = -dy / len;
  const ny = dx / len;

  return (
    <g className={className(muted, active)}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke(tone)}
        strokeWidth={active ? 3.5 : 2}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 6' : undefined}
      />
      {label ? (
        <Label at={[(x1 + x2) / 2 + nx * labelGap, (y1 + y2) / 2 + ny * labelGap]} tone={tone}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

interface PolygonProps extends Emphasis {
  points: readonly Pt[];
  tone?: Tone;
  /** Rigid motion applied to the whole shape; animated by CSS when it changes. */
  transform?: string;
  label?: string;
  outline?: boolean;
}

/** A filled region. The workhorse of the dissection proofs. */
export function Polygon({
  points,
  tone = 'neutral',
  transform,
  label,
  muted,
  active,
  outline = true,
}: PolygonProps) {
  const path = points.map(([x, y]) => `${x},${y}`).join(' ');
  const centroid: Pt = [
    points.reduce((s, p) => s + p[0], 0) / points.length,
    points.reduce((s, p) => s + p[1], 0) / points.length,
  ];

  return (
    <g className={`shape--movable ${className(muted, active)}`} transform={transform}>
      <polygon
        points={path}
        fill={fill(tone)}
        stroke={outline ? stroke(tone) : 'none'}
        strokeWidth={active ? 3 : 1.75}
        strokeLinejoin="round"
      />
      {label ? (
        <Label at={centroid} tone={tone} weight={600}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

interface PointProps extends Emphasis {
  at: Pt;
  tone?: Tone;
  label?: string;
  /** Direction to place the label in, as an offset in user units. */
  labelOffset?: Pt;
  radius?: number;
  hollow?: boolean;
}

/** A marked point, optionally named. */
export function PointMark({
  at,
  tone = 'neutral',
  label,
  labelOffset = [0, -14],
  radius = 4,
  hollow = false,
  muted,
  active,
}: PointProps) {
  return (
    <g className={className(muted, active)}>
      <circle
        cx={at[0]}
        cy={at[1]}
        r={active ? radius * 1.4 : radius}
        fill={hollow ? 'var(--surface)' : stroke(tone)}
        stroke={stroke(tone)}
        strokeWidth={2}
      />
      {label ? (
        <Label at={[at[0] + labelOffset[0], at[1] + labelOffset[1]]} tone={tone}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

interface RightAngleProps extends Emphasis {
  /** The vertex holding the right angle. */
  at: Pt;
  /** Any point along one arm. */
  from: Pt;
  /** Any point along the other arm. */
  to: Pt;
  size?: number;
  tone?: Tone;
}

/** The small square that marks a perpendicular pair of arms. */
export function RightAngle({ at, from, to, size = 14, tone = 'neutral', muted }: RightAngleProps) {
  const u = unit(at, from);
  const v = unit(at, to);
  const p1: Pt = [at[0] + u[0] * size, at[1] + u[1] * size];
  const p2: Pt = [at[0] + (u[0] + v[0]) * size, at[1] + (u[1] + v[1]) * size];
  const p3: Pt = [at[0] + v[0] * size, at[1] + v[1] * size];

  return (
    <polyline
      className={className(muted)}
      points={`${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
      fill="none"
      stroke={stroke(tone)}
      strokeWidth={1.75}
    />
  );
}

interface LabelProps extends Emphasis {
  at: Pt;
  tone?: Tone;
  size?: number;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}

/**
 * Text inside a figure. Deliberately plain SVG text rather than rendered LaTeX:
 * in-figure labels are single symbols, and the real formulas live in the
 * step panel beside the drawing.
 */
export function Label({
  at,
  tone = 'neutral',
  size = 17,
  weight = 500,
  anchor = 'middle',
  muted,
  active,
  children,
}: LabelProps) {
  return (
    <text
      className={`figure__label ${className(muted, active)}`}
      x={at[0]}
      y={at[1]}
      fill={stroke(tone)}
      fontSize={size}
      fontWeight={active ? 700 : weight}
      textAnchor={anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

interface ArrowProps extends Emphasis {
  from: Pt;
  to: Pt;
  tone?: Tone;
  label?: string;
}

/** A directed indicator, for pointing at things or showing a motion. */
export function Arrow({ from, to, tone = 'accent', label, muted, active }: ArrowProps) {
  const head = 9;
  const u = unit(to, from);
  // Pull the shaft back so it ends at the base of the head, not the tip.
  const shaftEnd: Pt = [to[0] + u[0] * head, to[1] + u[1] * head];
  const perp: Pt = [-u[1], u[0]];
  const w1: Pt = [shaftEnd[0] + perp[0] * head * 0.5, shaftEnd[1] + perp[1] * head * 0.5];
  const w2: Pt = [shaftEnd[0] - perp[0] * head * 0.5, shaftEnd[1] - perp[1] * head * 0.5];

  return (
    <g className={className(muted, active)}>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={shaftEnd[0]}
        y2={shaftEnd[1]}
        stroke={stroke(tone)}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <polygon points={`${to[0]},${to[1]} ${w1[0]},${w1[1]} ${w2[0]},${w2[1]}`} fill={stroke(tone)} />
      {label ? (
        <Label at={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 - 12]} tone={tone} size={15}>
          {label}
        </Label>
      ) : null}
    </g>
  );
}

function unit(from: Pt, to: Pt): Pt {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

function className(muted?: boolean, active?: boolean): string {
  return [muted ? 'is-muted' : '', active ? 'is-active' : ''].filter(Boolean).join(' ');
}
