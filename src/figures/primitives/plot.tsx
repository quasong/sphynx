import type { Pt } from './shapes';
import { Label } from './shapes';
import type { Tone } from './tone';
import { fill, stroke } from './tone';

export interface PlotOptions {
  width: number;
  height: number;
  padding?: number | { top: number; right: number; bottom: number; left: number };
  xDomain: readonly [number, number];
  yDomain: readonly [number, number];
}

/**
 * Maps mathematical coordinates to SVG user space, with y pointing up the way
 * a reader expects rather than down the way SVG does.
 */
export interface Plot {
  readonly width: number;
  readonly height: number;
  readonly viewBox: string;
  readonly xDomain: readonly [number, number];
  readonly yDomain: readonly [number, number];
  /** Math x to SVG x. */
  x(v: number): number;
  /** Math y to SVG y (flipped). */
  y(v: number): number;
  /** Math point to SVG point. */
  pt(p: Pt): Pt;
  /** A math-space x-distance in SVG units. */
  dx(v: number): number;
  /** A math-space y-distance in SVG units. */
  dy(v: number): number;
}

export function createPlot({ width, height, padding = 36, xDomain, yDomain }: PlotOptions): Plot {
  const pad =
    typeof padding === 'number'
      ? { top: padding, right: padding, bottom: padding, left: padding }
      : padding;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;

  const x = (v: number) => pad.left + ((v - x0) / (x1 - x0)) * innerW;
  const y = (v: number) => pad.top + innerH - ((v - y0) / (y1 - y0)) * innerH;

  return {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    xDomain,
    yDomain,
    x,
    y,
    pt: (p) => [x(p[0]), y(p[1])],
    dx: (v) => (v / (x1 - x0)) * innerW,
    dy: (v) => (v / (y1 - y0)) * innerH,
  };
}

interface AxesProps {
  plot: Plot;
  xLabel?: string;
  yLabel?: string;
  /** Math-space x positions to tick. */
  xTicks?: readonly number[];
  yTicks?: readonly number[];
  /** Format a tick value for display. */
  format?: (v: number) => string;
}

/** A pair of axes through the origin, with ticks. */
export function Axes({ plot, xLabel, yLabel, xTicks = [], yTicks = [], format = String }: AxesProps) {
  const originY = clamp(plot.y(0), plot.y(plot.yDomain[1]), plot.y(plot.yDomain[0]));
  const originX = clamp(plot.x(0), plot.x(plot.xDomain[0]), plot.x(plot.xDomain[1]));

  return (
    <g className="plot__axes">
      <line
        x1={plot.x(plot.xDomain[0])}
        y1={originY}
        x2={plot.x(plot.xDomain[1])}
        y2={originY}
        stroke="var(--fig-axis)"
        strokeWidth={1.5}
      />
      <line
        x1={originX}
        y1={plot.y(plot.yDomain[0])}
        x2={originX}
        y2={plot.y(plot.yDomain[1])}
        stroke="var(--fig-axis)"
        strokeWidth={1.5}
      />
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={plot.x(t)} y1={originY - 4} x2={plot.x(t)} y2={originY + 4} stroke="var(--fig-axis)" strokeWidth={1.5} />
          <Label at={[plot.x(t), originY + 18]} size={13} tone="neutral">
            {format(t)}
          </Label>
        </g>
      ))}
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line x1={originX - 4} y1={plot.y(t)} x2={originX + 4} y2={plot.y(t)} stroke="var(--fig-axis)" strokeWidth={1.5} />
          <Label at={[originX - 16, plot.y(t)]} size={13} tone="neutral" anchor="end">
            {format(t)}
          </Label>
        </g>
      ))}
      {xLabel ? (
        <Label at={[plot.x(plot.xDomain[1]) + 4, originY - 14]} size={15} anchor="end">
          {xLabel}
        </Label>
      ) : null}
      {yLabel ? (
        <Label at={[originX + 20, plot.y(plot.yDomain[1]) + 6]} size={15} anchor="start">
          {yLabel}
        </Label>
      ) : null}
    </g>
  );
}

interface CurveProps {
  plot: Plot;
  /** The function to draw, in math coordinates. */
  fn: (x: number) => number;
  /** Restrict the drawn interval; defaults to the plot's x domain. */
  domain?: readonly [number, number];
  samples?: number;
  tone?: Tone;
  dashed?: boolean;
  /**
   * x positions where the function jumps. The curve is broken into separate
   * polylines there instead of drawing a vertical line through the gap - which
   * would be a lie about the function.
   */
  breaks?: readonly number[];
  width?: number;
}

/** A sampled function graph. */
export function Curve({
  plot,
  fn,
  domain,
  samples = 240,
  tone = 'accent',
  dashed = false,
  breaks = [],
  width = 2.5,
}: CurveProps) {
  const [a, b] = domain ?? plot.xDomain;
  const cuts = [a, ...breaks.filter((c) => c > a && c < b), b];
  const segments: string[] = [];
  const epsilon = (b - a) / (samples * 4);

  for (let i = 0; i < cuts.length - 1; i += 1) {
    const lo = (cuts[i] as number) + (i === 0 ? 0 : epsilon);
    const hi = (cuts[i + 1] as number) - (i === cuts.length - 2 ? 0 : epsilon);
    const n = Math.max(2, Math.round((samples * (hi - lo)) / (b - a)));
    const pts: string[] = [];
    for (let k = 0; k <= n; k += 1) {
      const mx = lo + ((hi - lo) * k) / n;
      const my = fn(mx);
      if (!Number.isFinite(my)) continue;
      pts.push(`${plot.x(mx).toFixed(2)},${plot.y(my).toFixed(2)}`);
    }
    if (pts.length > 1) segments.push(pts.join(' '));
  }

  return (
    <g>
      {segments.map((pts, i) => (
        <polyline
          key={i}
          points={pts}
          fill="none"
          stroke={stroke(tone)}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={dashed ? '7 6' : undefined}
        />
      ))}
    </g>
  );
}

interface BandProps {
  plot: Plot;
  orientation: 'horizontal' | 'vertical';
  /** The band's extent along its own axis, in math coordinates. */
  from: number;
  to: number;
  tone?: Tone;
  label?: string;
  /** Draw dashed edges to make the band's boundaries legible. */
  edges?: boolean;
}

/**
 * A shaded strip across the plot. Two of these - one for epsilon, one for
 * delta - are the whole picture of a limit.
 */
export function Band({ plot, orientation, from, to, tone = 'accent', label, edges = true }: BandProps) {
  const horizontal = orientation === 'horizontal';
  const x = horizontal ? plot.x(plot.xDomain[0]) : plot.x(Math.min(from, to));
  const y = horizontal ? plot.y(Math.max(from, to)) : plot.y(plot.yDomain[1]);
  const w = horizontal ? plot.dx(plot.xDomain[1] - plot.xDomain[0]) : Math.abs(plot.dx(to - from));
  const h = horizontal ? Math.abs(plot.dy(to - from)) : plot.dy(plot.yDomain[1] - plot.yDomain[0]);

  return (
    <g className="shape--movable">
      <rect x={x} y={y} width={w} height={h} fill={fill(tone)} />
      {edges ? (
        <>
          <line
            x1={x}
            y1={y}
            x2={horizontal ? x + w : x}
            y2={horizontal ? y : y + h}
            stroke={stroke(tone)}
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
          <line
            x1={horizontal ? x : x + w}
            y1={horizontal ? y + h : y}
            x2={x + w}
            y2={y + h}
            stroke={stroke(tone)}
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
        </>
      ) : null}
      {label ? (
        <Label
          at={horizontal ? [x + w - 14, y + h / 2] : [x + w / 2, y + 16]}
          tone={tone}
          size={15}
          weight={600}
          anchor={horizontal ? 'end' : 'middle'}
        >
          {label}
        </Label>
      ) : null}
    </g>
  );
}

interface TubeProps {
  plot: Plot;
  fn: (x: number) => number;
  domain: readonly [number, number];
  /** Vertical distance from the graph to either edge. */
  half: number;
  tone?: Tone;
  /** Where fn jumps; the tube is drawn in separate pieces either side. */
  breaks?: readonly number[];
}

/**
 * Everything within `half` of a graph, vertically. The picture of a uniform
 * estimate, the way a Band is the picture of a pointwise one.
 */
export function Tube({ plot, fn, domain, half, tone = 'good', breaks = [] }: TubeProps) {
  const cuts = [domain[0], ...breaks, domain[1]];
  const pieces: string[] = [];
  for (let k = 0; k < cuts.length - 1; k += 1) {
    const lo = cuts[k] as number;
    // Stop a hair short of a jump so the piece does not take the value past it.
    const hi = (cuts[k + 1] as number) - (k < cuts.length - 2 ? 1e-6 : 0);
    const xs = Array.from({ length: 81 }, (_, s) => lo + ((hi - lo) * s) / 80);
    const top = xs.map((x) => `${plot.x(x).toFixed(1)},${plot.y(fn(x) + half).toFixed(1)}`);
    const bottom = xs.reverse().map((x) => `${plot.x(x).toFixed(1)},${plot.y(fn(x) - half).toFixed(1)}`);
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

interface LatticeProps {
  plot: Plot;
  /** Inclusive integer bounds to draw dots for. */
  xRange: readonly [number, number];
  yRange: readonly [number, number];
  radius?: number;
}

/** The integer grid, for arguments about whole numbers. */
export function Lattice({ plot, xRange, yRange, radius = 2 }: LatticeProps) {
  const dots: Pt[] = [];
  for (let i = xRange[0]; i <= xRange[1]; i += 1) {
    for (let j = yRange[0]; j <= yRange[1]; j += 1) {
      dots.push([plot.x(i), plot.y(j)]);
    }
  }
  return (
    <g>
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={radius} fill="var(--fig-lattice)" />
      ))}
    </g>
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, Math.min(lo, hi)), Math.max(lo, hi));
}
