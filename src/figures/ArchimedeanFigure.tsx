import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import {
  LineAxis,
  LineInterval,
  LineMark,
  createNumberLine,
} from './primitives/numberline';
import { Label } from './primitives/shapes';

/**
 * Two scenes, because the theorem has two halves with different pictures.
 *
 * Part (a) is drawn inside the false assumption: the multiples are shown
 * penned below a supremum, and the contradiction is the single step that gets
 * out. Part (b) rescales to the gap between two reals, where the whole content
 * is that a fine enough grid cannot step over it.
 */

const MULTIPLE = 0.55; // the x of part (a)
const ALPHA = 3.35; // the supremum the false assumption would produce
const Y_BOUND = 3.6;

const partA = createNumberLine({
  width: 430,
  height: 230,
  domain: [0, 4.2],
  baselineAt: 0.5,
});

const partB = createNumberLine({
  width: 430,
  height: 230,
  domain: [0.9, 1.9],
  baselineAt: 0.5,
});

/** The grid of part (b) sits well below the axis, clear of the x and y labels. */
const GRID_LANE = -3;

const X_LOW = 1.15; // the x and y of part (b)
const Y_HIGH = 1.62;
const N = 3; // 1/N is finer than the gap
const M = 4; // the least integer above N·X_LOW

export function ArchimedeanFigure({ stepIndex, highlight }: FigureProps) {
  const i = stepIndex;
  return i >= 4 ? <Density step={i} highlight={highlight} /> : <Multiples step={i} />;
}

/** Part (a): multiples of x, penned below a supremum that cannot hold them. */
function Multiples({ step }: { step: number }) {
  const line = partA;
  const multiples = [1, 2, 3, 4, 5, 6].map((n) => n * MULTIPLE);
  const overshoot = 7 * MULTIPLE;

  return (
    <FigureFrame
      viewBox={line.viewBox}
      title="Successive multiples of x, a supposed upper bound for them, and the multiple that escapes it"
      caption={captionForA(step)}
    >
      <LineAxis line={line} ticks={[1, 2, 3, 4]} />

      {/* The two rules sit close together, so their labels lean away from each
          other rather than both centring on their own line. */}
      {step >= 1 ? <Rule line={line} at={ALPHA} tone="c" label="α = sup" side="right" /> : null}
      {step >= 2 ? (
        <Rule line={line} at={ALPHA - MULTIPLE} tone="b" label="α − x" side="left" />
      ) : null}

      <LineMark line={line} at={Y_BOUND} tone="neutral" label="y" below />

      {multiples.map((v, k) => (
        <LineMark
          key={k}
          line={line}
          at={v}
          tone="a"
          lane={0}
          muted={step >= 2 && v <= ALPHA - MULTIPLE}
          active={step === 2 && v > ALPHA - MULTIPLE}
        />
      ))}
      <Label at={[line.x(MULTIPLE), line.lane(0) - 18]} tone="a" size={14}>
        x
      </Label>
      <Label at={[line.x(2 * MULTIPLE), line.lane(0) - 18]} tone="a" size={14}>
        2x
      </Label>
      {step >= 2 ? (
        <Label at={[line.x(6 * MULTIPLE), line.lane(0) - 18]} tone="a" size={14}>
          mx
        </Label>
      ) : null}

      {step >= 3 ? (
        <>
          <LineMark line={line} at={overshoot} tone="warn" lane={0} active />
          <Label at={[line.x(overshoot), line.lane(0) - 18]} tone="warn" size={14} weight={700}>
            (m+1)x
          </Label>
        </>
      ) : null}
    </FigureFrame>
  );
}

/** Part (b): a grid of spacing 1/n, finer than the gap it has to land in. */
function Density({ step, highlight }: { step: number; highlight: readonly string[] }) {
  const line = partB;
  const grid = [3, 4, 5, 6].map((k) => k / N).filter((v) => v >= 0.9 && v <= 1.9);
  const landed = M / N;

  return (
    <FigureFrame
      viewBox={line.viewBox}
      title="Two nearby reals and a grid of spacing one over n, fine enough that a grid point falls between them"
      caption={captionForB(step)}
    >
      <LineAxis line={line} ticks={[1]} />

      <LineInterval
        line={line}
        from={X_LOW}
        to={Y_HIGH}
        openLeft
        openRight
        tone="c"
        label="the gap (x, y)"
        active={highlight.includes('gap-xy')}
      />

      {step >= 5
        ? grid.map((v) => (
            <LineMark
              key={v}
              line={line}
              at={v}
              tone="a"
              lane={GRID_LANE}
              muted={step >= 6 && Math.abs(v - landed) > 1e-9}
            />
          ))
        : null}

      {step >= 5 ? (
        <Label at={[line.x(1 + 1 / (2 * N)), line.lane(GRID_LANE) + 26]} tone="a" size={14}>
          steps of 1/n
        </Label>
      ) : null}

      <LineMark line={line} at={X_LOW} tone="neutral" label="x" below />
      <LineMark line={line} at={Y_HIGH} tone="neutral" label="y" below />

      {step >= 6 ? (
        <LineMark line={line} at={landed} tone="good" lane={GRID_LANE} label="m/n" active />
      ) : null}
    </FigureFrame>
  );
}

/** A dashed vertical reference line — a value that matters but is not a point of a set. */
function Rule({
  line,
  at,
  tone,
  label,
  side = 'right',
}: {
  line: ReturnType<typeof createNumberLine>;
  at: number;
  tone: 'b' | 'c';
  label: string;
  side?: 'left' | 'right';
}) {
  const x = line.x(at);
  return (
    <g>
      <line
        x1={x}
        y1={22}
        x2={x}
        y2={line.baseline + 10}
        stroke={`var(--fig-${tone})`}
        strokeWidth={1.75}
        strokeDasharray="6 5"
      />
      <Label
        at={[x + (side === 'right' ? 6 : -6), 14]}
        tone={tone}
        size={14}
        weight={600}
        anchor={side === 'right' ? 'start' : 'end'}
      >
        {label}
      </Label>
    </g>
  );
}

function captionForA(step: number): string {
  if (step <= 0) return 'Assume the multiples of x never pass y. Then y bounds them all.';
  if (step === 1) return 'A bounded non-empty set, so completeness hands us a least upper bound α.';
  if (step === 2) return 'α − x is smaller than α, so it cannot be an upper bound: some multiple mx clears it.';
  return 'Then the next multiple clears α itself — an element of the set above its own upper bound.';
}

function captionForB(step: number): string {
  if (step === 4) return 'Now two reals with a gap between them, however small.';
  if (step === 5) return 'Part (a) supplies an n with 1/n smaller than the gap. Lay down that grid.';
  if (step === 6) return 'A step shorter than the gap cannot stride across it: some grid point lands inside.';
  return 'That grid point is a rational strictly between x and y.';
}
