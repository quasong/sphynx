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

/**
 * Three spaces, the same question asked of each: a sequence bunches up, and is
 * there anything at the place it bunches? Stacked rather than switched, because
 * the answer only means something as a comparison.
 */

const WIDTH = 430;
const HEIGHT = 320;
const ROOT2 = Math.SQRT2;

/** Rational approximations to √2 — Cauchy in every one of the three spaces. */
const APPROACH = [1.5, 1.4, 1.4167, 1.4138, 1.4143, 1.41420];
/** 1/n, which is Cauchy inside (0,1) and heads for an endpoint it lacks. */
const TOWARDS_ZERO = [0.8, 0.45, 0.28, 0.19, 0.14, 0.11, 0.09];

function row(baselineAt: number): NumberLine {
  return createNumberLine({
    width: WIDTH,
    height: HEIGHT,
    domain: [-0.15, 2.1],
    baselineAt,
    laneGap: 26,
  });
}

const REALS = row(0.26);
const RATIONALS = row(0.58);
const INTERVAL = row(0.9);

export function CompleteMetricFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  return (
    <FigureFrame
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      title="The same bunching-up sequence in three spaces, with and without the point it closes in on"
      caption={captionFor(i)}
    >
      <Row
        line={REALS}
        label="ℝ"
        verdict="complete"
        terms={APPROACH}
        target={ROOT2}
        present
      />

      {i >= 1 ? (
        <Row
          line={RATIONALS}
          label="ℚ"
          verdict="not complete"
          terms={APPROACH}
          target={ROOT2}
          present={false}
          note="√2 is missing"
        />
      ) : null}

      {i >= 2 ? (
        <Row
          line={INTERVAL}
          label="(0, 1)"
          verdict="not complete"
          terms={TOWARDS_ZERO}
          target={0}
          present={false}
          span={[0, 1]}
          note="its own endpoint is missing"
        />
      ) : null}
    </FigureFrame>
  );
}

interface RowProps {
  line: NumberLine;
  label: string;
  verdict: string;
  terms: readonly number[];
  target: number;
  present: boolean;
  /** Drawn when the space is a proper piece of the line rather than all of it. */
  span?: readonly [number, number];
  note?: string;
}

function Row({ line, label, verdict, terms, target, present, span, note }: RowProps) {
  return (
    <g>
      <LineAxis line={line} />
      {span ? (
        <LineInterval
          line={line}
          from={span[0]}
          to={span[1]}
          openLeft
          openRight
          tone="neutral"
          lane={0}
        />
      ) : null}

      {terms.map((value, k) => (
        <LineMark key={k} line={line} at={value} tone="accent" muted={k < 2} />
      ))}

      <LineMark
        line={line}
        at={target}
        tone={present ? 'good' : 'warn'}
        hollow={!present}
        active
      />

      <Label at={[line.x(-0.15) + 4, line.baseline - 24]} tone="neutral" size={15} weight={700} anchor="start">
        {label}
      </Label>
      <Label
        at={[line.x(2.1), line.baseline - 24]}
        tone={present ? 'good' : 'warn'}
        size={13}
        weight={600}
        anchor="end"
      >
        {verdict}
      </Label>
      {note ? (
        <Label at={[line.x(target) + 12, line.baseline + 22]} tone="warn" size={12} anchor="start">
          {note}
        </Label>
      ) : null}
    </g>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'Over ℝ the terms bunch up and there is a number sitting where they bunch.';
  if (i === 1) return 'The same rational terms, read in ℚ: the strip is identical and the point is gone.';
  if (i === 2) return 'And (0,1) fails at its own endpoint — completeness is not inherited by the parts.';
  return 'None of these failures is about the sequences. Each is about what the space is missing.';
}
