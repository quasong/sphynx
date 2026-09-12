import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Pt } from './primitives/shapes';
import { Label, Polygon, RightAngle, Segment } from './primitives/shapes';

/**
 * The two packings of a square of side a + b.
 *
 * Every triangle is drawn once, in its first-packing position, and moved to its
 * second-packing position by a rigid motion written as an SVG transform. The
 * transforms were chosen to be rotations and translations only - no
 * reflections - so that what the reader sees matches what the proof claims:
 * the same four triangles, merely moved.
 */

const U = 44; // pixels per unit length
const PAD = 46;
const A = 3; // short leg
const B = 4; // long leg
const S = A + B; // side of the enclosing square
const SIZE = S * U + 2 * PAD;

/** Unit coordinates to SVG user space. */
const p = (x: number, y: number): Pt => [PAD + x * U, PAD + y * U];
const scale = (u: number) => u * U;

/** The four congruent triangles, with the motion that carries each to packing B. */
const TRIANGLES: readonly { id: string; pts: readonly Pt[]; toB: string }[] = [
  {
    id: 't1',
    pts: [p(0, 0), p(A, 0), p(0, B)],
    toB: `translate(0, ${scale(A)})`,
  },
  {
    id: 't2',
    pts: [p(S, 0), p(S, A), p(A, 0)],
    // Already in place: this triangle is the one that does not move.
    toB: '',
  },
  {
    id: 't3',
    pts: [p(S, S), p(B, S), p(S, A)],
    toB: `translate(${-scale(B)}, ${-scale(B)}) rotate(90, ${p(S, S)[0]}, ${p(S, S)[1]})`,
  },
  {
    id: 't4',
    pts: [p(0, S), p(0, B), p(B, S)],
    toB: `translate(${scale(A)}, 0) rotate(-90, ${p(0, S)[0]}, ${p(0, S)[1]})`,
  },
];

const FRAME: readonly Pt[] = [p(0, 0), p(S, 0), p(S, S), p(0, S)];
const HOLE: readonly Pt[] = [p(A, 0), p(S, A), p(B, S), p(0, B)];
const SQUARE_A: readonly Pt[] = [p(0, 0), p(A, 0), p(A, A), p(0, A)];
const SQUARE_B: readonly Pt[] = [p(A, A), p(S, A), p(S, S), p(A, S)];

/** Offset that parks the lone triangle in the middle of the canvas at the start. */
const HERO_SHIFT = `translate(${scale(2)}, ${scale(1.5)})`;

export function PythagorasFigure({ stepIndex, highlight }: FigureProps) {
  const i = stepIndex;
  const on = (key: string) => highlight.includes(key);

  const heroOnly = i <= 0; // only the bare triangle is shown
  const showFrame = i >= 1;
  const showAllTriangles = i >= 2;
  const packingB = i >= 5;
  const showHole = i === 3 || i === 4;
  const showLeftoverSquares = i >= 6;
  const showHoleGhost = i >= 8;
  const showEdgeSplit = i === 1;

  return (
    <FigureFrame
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      title="Four copies of a right triangle packed into a square of side a + b, in two different arrangements"
      caption={captionFor(i)}
    >
      {/* The enclosing square, whose area is the fixed quantity being spent. */}
      {showFrame ? (
        <polygon
          points={FRAME.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke="var(--fig-neutral)"
          strokeWidth={on('square-frame') ? 3 : 1.75}
        />
      ) : null}

      {showEdgeSplit ? (
        <>
          <Segment from={p(0, 0)} to={p(A, 0)} tone="a" label="a" labelGap={-18} active />
          <Segment from={p(A, 0)} to={p(S, 0)} tone="b" label="b" labelGap={-18} active />
        </>
      ) : null}

      {/* Leftover regions. Drawn under the triangles so their edges stay crisp. */}
      {showHole || showHoleGhost ? (
        <g className={showHole ? '' : 'is-ghost'}>
          <Polygon
            points={HOLE}
            tone="c"
            active={on('inner-square') || on('c2')}
            outline
          />
          <Label at={centroid(HOLE)} tone="c" size={22} weight={700}>
            c²
          </Label>
        </g>
      ) : null}

      {showLeftoverSquares ? (
        <>
          <Polygon points={SQUARE_A} tone="a" active={on('a2')} label="a²" />
          <Polygon points={SQUARE_B} tone="b" active={on('b2')} label="b²" />
        </>
      ) : null}

      {TRIANGLES.map((t, idx) => {
        const isHero = idx === 0;
        const hidden = !showAllTriangles && !isHero;
        const transform = heroOnly && isHero ? HERO_SHIFT : packingB ? t.toB : '';

        return (
          <g
            key={t.id}
            className={`shape--movable ${hidden ? 'is-hidden' : ''}`}
            transform={transform || undefined}
          >
            <Polygon points={t.pts} tone="neutral" active={on('pinwheel') || on('rearranged')} />
            {isHero && heroOnly ? (
              <>
                <Segment from={p(0, 0)} to={p(A, 0)} tone="a" label="a" labelGap={-18} active={on('legs')} />
                <Segment from={p(0, 0)} to={p(0, B)} tone="b" label="b" labelGap={18} active={on('legs')} />
                <Segment from={p(A, 0)} to={p(0, B)} tone="c" label="c" labelGap={-20} active={on('triangle')} />
                <RightAngle at={p(0, 0)} from={p(A, 0)} to={p(0, B)} />
              </>
            ) : null}
          </g>
        );
      })}
    </FigureFrame>
  );
}

function centroid(points: readonly Pt[]): Pt {
  return [
    points.reduce((s, q) => s + q[0], 0) / points.length,
    points.reduce((s, q) => s + q[1], 0) / points.length,
  ];
}

function captionFor(i: number): string {
  if (i <= 0) return 'The given right triangle: legs a and b, hypotenuse c.';
  if (i === 1) return 'Each side of the enclosing square is one leg a plus one leg b.';
  if (i === 2) return 'Four copies, each a quarter turn from the last. A gap opens in the middle.';
  if (i === 3) return 'The gap is bounded by four hypotenuses and four right angles — a square of side c.';
  if (i === 4) return 'Big square = four triangles + the tilted square.';
  if (i === 5) return 'The same four triangles, slid and turned into two rectangles.';
  if (i === 6 || i === 7) return 'Big square = four triangles + a square of side a + a square of side b.';
  return 'The same four triangles both times, so the dashed square and the two filled squares have equal area.';
}
