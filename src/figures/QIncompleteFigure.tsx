import type { ReactElement } from 'react';
import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import {
  LineAxis,
  LineGap,
  LineInterval,
  LineMark,
  createNumberLine,
} from './primitives/numberline';
import { Arrow, Label } from './primitives/shapes';
import type { Pt } from './primitives/shapes';

/**
 * The two sets crowding a hole from both sides.
 *
 * The view is deliberately tight around sqrt(2), because the argument is about
 * what happens arbitrarily close to it: the later iterates are only a few
 * pixels apart, and that crowding is the claim - every element of A is beaten
 * by another element of A, with no last one.
 */

const ROOT2 = Math.SQRT2;

const line = createNumberLine({
  width: 430,
  height: 240,
  domain: [0.9, 2.15],
  baselineAt: 0.52,
  laneGap: 36,
});

/** q = (2p + 2) / (p + 2): stays on its own side of the gap, and moves toward it. */
const nudge = (p: number) => (2 * p + 2) / (p + 2);

function chain(start: number, count: number): number[] {
  const out = [start];
  for (let k = 1; k < count; k += 1) out.push(nudge(out[k - 1] as number));
  return out;
}

const FROM_A = chain(1, 4); // 1, 4/3, 1.4, …
const FROM_B = chain(2, 4); // 2, 3/2, 1.428…, …

const LANE_A = 1;
const LANE_B = -2; // negative lanes sit below the axis

export function QIncompleteFigure({ stepIndex, highlight }: FigureProps) {
  const i = stepIndex;
  const on = (key: string) => highlight.includes(key);

  const showFirstNudge = i === 2;
  const showChainA = i >= 3;
  const showChainB = i >= 4;
  const showCollision = i === 5;
  const finale = i >= 6;

  const yA = line.lane(LANE_A);
  const yB = line.lane(LANE_B);

  return (
    <FigureFrame
      viewBox={line.viewBox}
      title="The rationals below and above the square root of two, crowding a gap from both sides"
      caption={captionFor(i)}
    >
      <LineAxis line={line} ticks={[1, 2]} />

      <LineInterval line={line} from={0.9} to={ROOT2} openRight arrowLeft tone="a" label="A" active={on('sets')} />
      <LineInterval line={line} from={ROOT2} to={2.15} openLeft arrowRight tone="b" label="B" active={on('sets')} />

      <LineGap line={line} at={ROOT2} label="√2 ∉ ℚ" tone={finale ? 'warn' : 'neutral'} />

      {/* One application of the map, before the whole chain is drawn. */}
      {showFirstNudge ? (
        <>
          <LineMark line={line} at={FROM_A[0] as number} tone="a" lane={LANE_A} label="p" active />
          <LineMark line={line} at={FROM_A[1] as number} tone="a" lane={LANE_A} label="q" active />
          <Arrow
            from={[line.x(FROM_A[0] as number) + 8, yA]}
            to={[line.x(FROM_A[1] as number) - 8, yA]}
            tone="a"
          />
        </>
      ) : null}

      {showChainA ? (
        <g className={showChainB && !on('climb-a') ? 'is-muted' : ''}>
          {FROM_A.map((p, k) => (
            <LineMark key={k} line={line} at={p} tone="a" lane={LANE_A} />
          ))}
          {arrowsBetween(FROM_A, yA, 'a')}
          <Label at={[line.x(1.62), yA - 22]} tone="a" size={14} anchor="start">
            no largest element
          </Label>
        </g>
      ) : null}

      {showChainB ? (
        <g>
          {FROM_B.map((p, k) => (
            <LineMark key={k} line={line} at={p} tone="b" lane={LANE_B} />
          ))}
          {arrowsBetween(FROM_B, yB, 'b')}
          <Label at={[line.x(1.62), yB + 26]} tone="b" size={14} anchor="start">
            no smallest element
          </Label>
        </g>
      ) : null}

      {/* The supposed supremum, and an upper bound below it. */}
      {showCollision ? (
        <>
          <LineMark line={line} at={1.62} tone="warn" active />
          <LineMark line={line} at={1.48} tone="warn" active />
          {/* Stacked rather than side by side: the two values are close enough
              on the axis that centred labels would sit on top of each other. */}
          <Label at={[line.x(1.62), line.baseline + 24]} tone="warn" size={14} weight={600}>
            α = sup A ?
          </Label>
          <Label at={[line.x(1.48), line.baseline + 46]} tone="warn" size={14} weight={600}>
            {'q < α, and still in B'}
          </Label>
          <Arrow
            from={[line.x(1.62) - 6, line.baseline - 22]}
            to={[line.x(1.48) + 6, line.baseline - 22]}
            tone="warn"
          />
        </>
      ) : null}
    </FigureFrame>
  );
}

/** Arrows linking consecutive iterates, skipped once they are too close to draw. */
function arrowsBetween(points: readonly number[], y: number, tone: 'a' | 'b'): ReactElement[] {
  const out: ReactElement[] = [];
  for (let k = 0; k < points.length - 1; k += 1) {
    const from = line.x(points[k] as number);
    const to = line.x(points[k + 1] as number);
    if (Math.abs(to - from) < 18) continue;
    const shrink = Math.sign(to - from) * 7;
    const a: Pt = [from + shrink, y];
    const b: Pt = [to - shrink, y];
    out.push(<Arrow key={k} from={a} to={b} tone={tone} />);
  }
  return out;
}

function captionFor(i: number): string {
  if (i <= 0) return 'Every positive rational is on one side or the other: there is no rational on the line itself.';
  if (i === 1) return 'Anything in B outranks everything in A, so the upper bounds of A live in B.';
  if (i === 2) return 'The map carries p to a rational q on the same side, but nearer the gap.';
  if (i === 3) return 'Applied from inside A it always produces something larger, still inside A. No last element.';
  if (i === 4) return 'Applied from inside B it always produces something smaller, still inside B. No first element.';
  if (i === 5) return 'A supremum would have to lie in B — but B has members below it, and those bound A too.';
  return 'The ray of upper bounds has no left endpoint. ℚ is missing the number that should be there.';
}
