import type { ReactNode } from 'react';
import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import {
  LineAxis,
  LineInterval,
  LineMark,
  createNumberLine,
} from './primitives/numberline';
import type { NumberLine } from './primitives/numberline';
import { Label } from './primitives/shapes';
import { stroke } from './primitives/tone';

/**
 * The move, and the two ways the old description of it breaks.
 *
 * Every stage is one axis asking the same question — does some part of this
 * sequence settle, and is the place it settles in K? — so the counterexamples
 * read as the same picture going wrong rather than as new pictures.
 */

const WIDTH = 430;
const HEIGHT = 300;

export function CompactFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  return (
    <FigureFrame
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      title="Sequences in a set, and whether some part of each settles at a point of the set"
      caption={captionFor(i)}
    >
      {i <= 0 ? <Settle heading="bounded: a subsequence settles · closed: it settles in K" /> : null}
      {i === 1 ? <Settle heading="closed and bounded — carry the pair up unchanged?" /> : null}
      {i === 2 ? <Capped /> : null}
      {i === 3 ? <Rationals /> : null}
      {i === 4 ? <Settle heading="every sequence in K has a subsequence settling in K" /> : null}
      {i === 5 ? <OnTheLine /> : null}
      {i >= 6 ? <Settle heading="K compact — the one move both proofs make" /> : null}
    </FigureFrame>
  );
}

const settleLine = createNumberLine({
  width: WIDTH,
  height: HEIGHT,
  domain: [-0.2, 1.2],
  baselineAt: 0.62,
  laneGap: 30,
});

/** A sequence wandering between two clusters inside [0, 1]. */
const WANDER = [0.08, 0.9, 0.2, 0.8, 0.28, 0.74, 0.32, 0.7, 0.34, 0.69];
/** The terms picked out by the subsequence: the upper cluster. */
const PICKED = new Set([1, 3, 5, 7, 9]);
const SETTLES_AT = 0.67;

function Settle({ heading }: { heading: string }) {
  const line = settleLine;

  return (
    <g>
      <Label at={[WIDTH / 2, 40]} tone="neutral" size={13} weight={600}>
        {heading}
      </Label>
      <LineAxis line={line} ticks={[0, 1]} />
      <LineInterval line={line} from={0} to={1} tone="a" lane={1} label="K" />

      {WANDER.map((v, k) => (
        <LineMark
          key={k}
          line={line}
          at={v}
          tone={PICKED.has(k) ? 'accent' : 'neutral'}
          muted={!PICKED.has(k)}
        />
      ))}
      <LineMark line={line} at={SETTLES_AT} tone="good" active />
      <Label at={[line.x(SETTLES_AT), line.baseline + 44]} tone="good" size={13} weight={600}>
        x ∈ K
      </Label>
    </g>
  );
}

const cappedLine = createNumberLine({
  width: WIDTH,
  height: HEIGHT,
  domain: [0.3, 6.7],
  baselineAt: 0.7,
});

/**
 * Pairs of terms, each drawn with the distance the capped metric gives them:
 * two neighbours and one wide pair, so the same label sits on very different
 * spans. The wide arc clears the short one it passes over.
 */
const PAIRS: readonly { m: number; n: number; rise: number }[] = [
  { m: 1, n: 2, rise: 36 },
  { m: 4, n: 5, rise: 36 },
  { m: 2, n: 6, rise: 96 },
];

/** ℕ under min(|x − y|, 1): closed, bounded, and nothing piles up. */
function Capped() {
  const line = cappedLine;
  const y = line.baseline;

  return (
    <g>
      <Label at={[WIDTH / 2, 36]} tone="neutral" size={14} weight={600}>
        d(x, y) = min(|x − y|, 1)
      </Label>
      <LineAxis line={line} ticks={[1, 2, 3, 4, 5, 6]} />

      {PAIRS.map(({ m, n, rise }) => {
        const x1 = line.x(m);
        const x2 = line.x(n);
        // A quadratic's apex sits halfway to its control point.
        return (
          <g key={`${m}-${n}`}>
            <path
              d={`M ${x1} ${y - 8} Q ${(x1 + x2) / 2} ${y - 8 - rise * 2} ${x2} ${y - 8}`}
              fill="none"
              stroke={stroke('b')}
              strokeWidth={1.75}
            />
            <Label at={[(x1 + x2) / 2, y - 8 - rise - 12]} tone="b" size={13} weight={600}>
              1
            </Label>
          </g>
        );
      })}

      {[1, 2, 3, 4, 5, 6].map((n) => (
        <LineMark key={n} line={line} at={n} tone="accent" />
      ))}

      <Label at={[WIDTH / 2, 62]} tone="good" size={13}>
        closed ✓ · bounded — nothing is more than 1 away ✓
      </Label>
      <Label at={[WIDTH / 2, y + 50]} tone="warn" size={13} weight={600}>
        every term 1 from every other: no subsequence settles
      </Label>
    </g>
  );
}

const rationalLine = createNumberLine({
  width: WIDTH,
  height: HEIGHT,
  domain: [-0.2, 2.25],
  baselineAt: 0.45,
  laneGap: 30,
});

/**
 * The same stretch around √2, enlarged. At the scale of [0, 2] every term past
 * the first sits within a pixel of the hole and the bunching cannot be seen.
 */
const LENS: readonly [number, number] = [1.37, 1.43];
const lensLine = createNumberLine({
  width: WIDTH,
  height: HEIGHT,
  domain: LENS,
  baselineAt: 0.8,
});

const DECIMALS = [1, 1.4, 1.41, 1.414, 1.4142];

/** [0, 2] ∩ ℚ inside ℚ: closed there, bounded, and bunching at a hole. */
function Rationals() {
  const line = rationalLine;
  const lens = lensLine;

  return (
    <g>
      <Label at={[WIDTH / 2, 26]} tone="good" size={13}>
        in the space ℚ: closed ✓ · bounded ✓
      </Label>
      <LineAxis line={line} ticks={[0, 2]} />
      <LineInterval line={line} from={0} to={2} tone="a" lane={1} label="K = [0, 2] ∩ ℚ" />
      {DECIMALS.map((v, k) => (
        <LineMark key={k} line={line} at={v} tone="accent" muted={k < 1} />
      ))}
      <LineMark line={line} at={Math.SQRT2} tone="warn" hollow />

      {LENS.map((edge) => (
        <line
          key={edge}
          x1={line.x(edge)}
          y1={line.baseline + 10}
          x2={lens.x(edge)}
          y2={lens.baseline - 14}
          stroke="var(--fig-axis)"
          strokeWidth={1.25}
          strokeDasharray="4 4"
        />
      ))}
      <LineAxis line={lens} />
      {DECIMALS.filter((v) => v >= LENS[0]).map((v, k) => (
        <LineMark key={k} line={lens} at={v} tone="accent" muted={k < 1} />
      ))}
      <LineMark line={lens} at={Math.SQRT2} tone="warn" hollow active />
      <Label at={[lens.x(Math.SQRT2), lens.baseline + 26]} tone="warn" size={13} weight={600}>
        √2 ∉ ℚ — nowhere to settle
      </Label>
    </g>
  );
}

function row(baselineAt: number): NumberLine {
  return createNumberLine({
    width: WIDTH,
    height: HEIGHT,
    domain: [-0.3, 2.4],
    baselineAt,
    laneGap: 22,
  });
}

const CLOSED_BOUNDED = row(0.27);
const OPEN = row(0.58);
const UNBOUNDED = row(0.89);

/** The three sets the old description sorted correctly, read with the new one. */
function OnTheLine() {
  return (
    <g>
      <Row line={CLOSED_BOUNDED} label="[0, 1]" verdict="compact" good>
        <LineInterval line={CLOSED_BOUNDED} from={0} to={1} tone="neutral" lane={0} />
        {[0.9, 0.3, 0.8, 0.35, 0.72].map((v, k) => (
          <LineMark key={k} line={CLOSED_BOUNDED} at={v} tone="accent" muted={k % 2 === 1} />
        ))}
        <LineMark line={CLOSED_BOUNDED} at={SETTLES_AT} tone="good" active />
      </Row>

      <Row line={OPEN} label="(0, 1)" verdict="not closed">
        <LineInterval line={OPEN} from={0} to={1} tone="neutral" lane={0} openLeft openRight />
        {[0.6, 0.3, 0.17, 0.1, 0.06].map((v, k) => (
          <LineMark key={k} line={OPEN} at={v} tone="accent" muted={k < 2} />
        ))}
        <LineMark line={OPEN} at={0} tone="warn" hollow active />
      </Row>

      <Row line={UNBOUNDED} label="[0, ∞)" verdict="not bounded">
        <LineInterval line={UNBOUNDED} from={0} to={2.25} tone="neutral" lane={0} arrowRight />
        {[0.3, 0.8, 1.3, 1.8, 2.2].map((v, k) => (
          <LineMark key={k} line={UNBOUNDED} at={v} tone="accent" muted={k < 2} />
        ))}
      </Row>
    </g>
  );
}

interface RowProps {
  line: NumberLine;
  label: string;
  verdict: string;
  good?: boolean;
  children: ReactNode;
}

function Row({ line, label, verdict, good = false, children }: RowProps) {
  return (
    <g>
      <LineAxis line={line} />
      {children}
      <Label at={[line.x(-0.3) + 4, line.baseline - 44]} tone="neutral" size={15} weight={700} anchor="start">
        {label}
      </Label>
      <Label at={[line.x(2.4), line.baseline - 44]} tone={good ? 'good' : 'warn'} size={13} weight={600} anchor="end">
        {verdict}
      </Label>
    </g>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'The move both proofs made: some part of the sequence settles, and where it settles is still in K.';
  if (i === 1) return 'Both words make sense in any metric space. The obvious move is to keep them.';
  if (i === 2) return 'Cap the distance at 1 and ℕ becomes bounded — without a single sequence starting to converge.';
  if (i === 3) return 'Closed in ℚ, bounded, and the approximations to √2 bunch up at a point the space does not have.';
  if (i === 4) return 'So keep the move itself. Neither counterexample survives it.';
  if (i === 5) return 'On the line the new definition sorts every set exactly as the old description did.';
  return 'And with that move as the definition, the proofs that made it read the same in any metric space.';
}
