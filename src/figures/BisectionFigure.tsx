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
 * The halving, drawn.
 *
 * Each stage is a lane above the axis, so the reader sees the intervals nest
 * rather than replace one another - the point being that nothing new happens at
 * any stage, only the same step repeated. This motif returns for nested
 * intervals, for the compactness of a closed interval, and for the Cantor set.
 */

const M = 4;
/** Where the terms pile up; the halving is what corners it. */
const LIMIT = 1.25;

const TERMS = [
  -3.4, 2.9, -0.6, 3.8, 1.9, -2.2, 0.7, 1.5, -3.9, 1.05, 2.4, 1.35, -1.1, 1.18, 3.2, 1.29,
];

/** The nested intervals, each half of the last and each holding the pile-up. */
const NESTED: readonly (readonly [number, number])[] = [
  [-M, M],
  [0, M],
  [0, 2],
  [1, 2],
  [1, 1.5],
];

/** The half discarded at each stage, drawn faint so the choice is visible. */
const DISCARDED: readonly (readonly [number, number])[] = [
  [-M, 0],
  [2, M],
  [0, 1],
  [1.5, 2],
];

const line = createNumberLine({
  width: 430,
  height: 320,
  domain: [-4.6, 4.6],
  baselineAt: 0.84,
  laneGap: 30,
});

const escaped = createNumberLine({
  width: 430,
  height: 320,
  domain: [-0.6, 11.5],
  baselineAt: 0.84,
  laneGap: 30,
});

export function BisectionFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'bounded') return <Unbounded />;

  const i = stepIndex;
  // One more interval revealed per stage, up to the full nest.
  const levels = i <= 0 ? 1 : i === 1 ? 2 : Math.min(NESTED.length, 4 + Math.max(0, i - 2));
  const showPicked = i >= 3;
  const showLimit = i >= 4;

  return (
    <FigureFrame
      viewBox={line.viewBox}
      title="A bounded sequence on the number line, with intervals halved around the point its terms pile up at"
      caption={captionFor(i)}
    >
      <LineAxis line={line} ticks={[-4, -2, 2, 4]} />

      {NESTED.slice(0, levels).map((span, k) => (
        <LineInterval
          key={k}
          line={line}
          from={span[0]}
          to={span[1]}
          tone="a"
          lane={NESTED.length - 1 - k}
          active={k === levels - 1}
          {...(k === 0 ? { label: 'I₀ holds every term' } : {})}
        />
      ))}

      {/* The half let go of at each stage. */}
      {DISCARDED.slice(0, Math.max(0, levels - 1)).map((span, k) => (
        <LineInterval
          key={`x${k}`}
          line={line}
          from={span[0]}
          to={span[1]}
          tone="neutral"
          lane={NESTED.length - 2 - k}
          muted
        />
      ))}

      {TERMS.map((value, k) => (
        <LineMark
          key={k}
          line={line}
          at={value}
          tone={showPicked && insideDeepest(value, levels) ? 'accent' : 'neutral'}
          active={showPicked && insideDeepest(value, levels)}
          muted={!showPicked}
        />
      ))}

      {showLimit ? (
        <>
          <LineMark line={line} at={LIMIT} tone="good" label="x" below active />
          <Label at={[line.x(LIMIT), line.baseline + 46]} tone="good" size={13}>
            every interval contains it
          </Label>
        </>
      ) : null}
    </FigureFrame>
  );
}

/** Without a bound there is no interval to start from. */
function Unbounded() {
  const terms = Array.from({ length: 11 }, (_, i) => i + 1);
  return (
    <FigureFrame
      viewBox={escaped.viewBox}
      title="An unbounded sequence whose terms stay a fixed distance apart"
      caption="The terms stay a unit apart forever. No interval short enough to matter can hold more than one of them, so no subsequence settles."
    >
      <LineAxis line={escaped} ticks={[2, 4, 6, 8, 10]} />
      {terms.map((value) => (
        <LineMark key={value} line={escaped} at={value} tone="warn" />
      ))}
      <Label at={[escaped.x(5.5), escaped.lane(0)]} tone="warn" size={14} weight={600}>
        aₙ = n, off to infinity
      </Label>
    </FigureFrame>
  );
}

function insideDeepest(value: number, levels: number): boolean {
  const span = NESTED[Math.min(levels, NESTED.length) - 1];
  if (!span) return false;
  return value >= span[0] && value <= span[1];
}

function captionFor(i: number): string {
  if (i <= 0) return 'Bounded, so one interval holds every term — and therefore infinitely many of them.';
  if (i === 1) return 'Halve it. Both halves cannot hold only finitely many, so keep one that does not.';
  if (i === 2) return 'Repeat. Nothing new happens at any stage, which is what makes it legitimate.';
  if (i === 3) return 'Take one term from each interval, always with a later index than the last.';
  if (i === 4) return 'The intervals close on a single point: the supremum of their left endpoints.';
  if (i === 5) return 'And their lengths halve away to nothing.';
  return 'So the chosen terms, trapped alongside x in ever shorter intervals, converge to it.';
}
