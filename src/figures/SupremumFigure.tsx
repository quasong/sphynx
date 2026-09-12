import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import {
  LineAxis,
  LineGap,
  LineInterval,
  LineMark,
  LineRegion,
  createNumberLine,
} from './primitives/numberline';

/**
 * One axis, held fixed across every stage.
 *
 * The argument is a sequence of attempts at the same question - where does this
 * set end? - so the scale never changes and only the annotation does. That is
 * what makes the closed and half-open cases comparable at a glance.
 */

const line = createNumberLine({
  width: 430,
  height: 190,
  domain: [-0.5, 2.8],
  baselineAt: 0.68,
});

const ROOT2 = Math.SQRT2;

export function SupremumFigure({ stepIndex, highlight }: FigureProps) {
  const i = stepIndex;
  const on = (key: string) => highlight.includes(key);

  const closed = i <= 0 || i === 4; // stages showing E = [0, 1]
  const rationals = i >= 6; // the final stage, where the ambient set is ℚ
  const showBounds = i === 2 || i === 3;

  return (
    <FigureFrame
      viewBox={line.viewBox}
      title="A bounded set on the number line, its upper bounds, and its least upper bound"
      caption={captionFor(i)}
    >
      {showBounds ? (
        <LineRegion
          line={line}
          from={1}
          to={2.8}
          tone="c"
          label="upper bounds"
          {...(i === 3 ? { edge: 'left' as const } : {})}
        />
      ) : null}

      {rationals ? (
        <LineRegion line={line} from={ROOT2} to={2.8} tone="c" label="upper bounds in ℚ" />
      ) : null}

      <LineAxis line={line} ticks={[0, 1, 2]} />

      {rationals ? (
        <>
          <LineInterval
            line={line}
            from={0}
            to={ROOT2}
            openLeft
            openRight
            tone="a"
            label="A = { p ∈ ℚ⁺ : p² < 2 }"
          />
          <LineGap line={line} at={ROOT2} label="√2" />
        </>
      ) : (
        <LineInterval
          line={line}
          from={0}
          to={1}
          openRight={!closed}
          tone="a"
          label={closed ? 'E = [0, 1]' : 'E = [0, 1)'}
          active={on('max') || on('no-max')}
        />
      )}

      {/* Sample upper bounds, to show how many there are and how little that says. */}
      {showBounds
        ? [1, 1.6, 2.2].map((b) => (
            <LineMark key={b} line={line} at={b} tone="c" muted={i === 3 && b !== 1} />
          ))
        : null}

      {i <= 0 ? <LineMark line={line} at={1} tone="a" label="max E = 1" below active /> : null}

      {i === 1 ? (
        <LineMark line={line} at={1} tone="warn" label="no largest element" below hollow active />
      ) : null}

      {i === 3 ? <LineMark line={line} at={1} tone="c" label="sup E = 1" below active /> : null}

      {i === 4 ? (
        <LineMark line={line} at={1} tone="c" label="sup E = max E" below active />
      ) : null}

      {i === 5 ? (
        <LineMark line={line} at={1} tone="c" label="sup E ∉ E" below hollow active />
      ) : null}

      {rationals ? (
        <LineMark
          line={line}
          at={2.1}
          tone="warn"
          label="…and no least one"
          below
          hollow
          active={on('gap')}
        />
      ) : null}
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'A closed interval does have a largest element, and it says where the set ends.';
  if (i === 1) return 'Remove the endpoint and no largest element survives — though the set plainly still ends at 1.';
  if (i === 2) return 'Upper bounds are plentiful: 1, 1.6, 2.2 and everything beyond. Existence alone says nothing.';
  if (i === 3) return 'The upper bounds form a ray. Its left endpoint is the supremum.';
  if (i === 4) return 'When a largest element exists, it is the supremum — the notion extends rather than replaces.';
  if (i === 5) return 'When one does not, the supremum sits just outside the set. That is the price, and the point.';
  return 'Over ℚ the ray of upper bounds has no left endpoint at all: the value that should be there is missing.';
}
