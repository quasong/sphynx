import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, createPlot } from './primitives/plot';
import { SequenceDots } from './primitives/sequence';
import { Label, Segment } from './primitives/shapes';

/**
 * The Cauchy picture is the tail in a box, and the box has no centre line.
 *
 * That absence is the content of the definition, so both figures here draw the
 * box the same way and differ only in whether a limit exists to be drawn beside
 * it - which is exactly the difference between ℝ and ℚ.
 */

const COUNT = 14;
const from = (f: (n: number) => number) =>
  Array.from({ length: COUNT }, (_, i) => f(i + 1));

const SETTLING = from((n) => 2 + (-0.8) ** n / n);
const HARMONIC = (() => {
  let total = 0;
  return from((n) => {
    total += 1 / n;
    return total;
  });
})();

/** Continued-fraction convergents to √2: every term rational, closing in fast. */
const ROOT2_APPROX = [1.5, 1.4, 1.4166667, 1.4137931, 1.4142857, 1.4142012, 1.4142157];
const ROOT2 = Math.SQRT2;

function framed(
  yDomain: readonly [number, number],
  count = COUNT,
  padLeft = 40,
): Plot {
  return createPlot({
    width: 430,
    height: 300,
    padding: { top: 26, right: 26, bottom: 36, left: padLeft },
    xDomain: [0, count + 1],
    yDomain,
  });
}

/** The strip holding every term from `firstIndex` on. */
function tailBox(terms: readonly number[], firstIndex: number) {
  const tail = terms.slice(firstIndex - 1);
  return { low: Math.min(...tail), high: Math.max(...tail), firstIndex };
}

export function CauchyFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  // Stages 2-3 are about steps between neighbours; the rest about the tail.
  const harmonic = i === 1 || i === 2;
  const plot = harmonic ? framed([-0.2, 3.6]) : framed([1.0, 2.65]);
  const terms = harmonic ? HARMONIC : SETTLING;
  const box = harmonic ? null : tailBox(SETTLING, 6);
  const showBox = !harmonic && i >= 3;
  const showLimitLine = i <= 0;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A sequence against its index, with the strip that holds its whole tail"
      caption={captionFor(i)}
    >
      <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={harmonic ? [1, 2, 3] : [1.5, 2, 2.5]} />

      {/* Only the first stage draws a limit; after that the point is its absence. */}
      {showLimitLine ? (
        <>
          <Segment
            from={plot.pt([plot.xDomain[0], 2])}
            to={plot.pt([plot.xDomain[1], 2])}
            tone="good"
            dashed
          />
          <Label
            at={[plot.x(plot.xDomain[1]), plot.y(2) - 12]}
            tone="good"
            size={14}
            weight={600}
            anchor="end"
          >
            L — which you must already have
          </Label>
        </>
      ) : null}

      {showBox && box ? (
        <>
          <rect
            x={plot.x(box.firstIndex) - 6}
            y={plot.y(box.high) - 5}
            width={plot.x(plot.xDomain[1]) - plot.x(box.firstIndex)}
            height={plot.y(box.low) - plot.y(box.high) + 10}
            fill="var(--fig-c-fill)"
            stroke="var(--fig-c)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <Label
            at={[plot.x(box.firstIndex) + 4, plot.y(box.high) - 18]}
            tone="c"
            size={14}
            weight={700}
            anchor="start"
          >
            every later pair within ε
          </Label>
          <Segment
            from={plot.pt([box.firstIndex, plot.yDomain[0]])}
            to={plot.pt([box.firstIndex, plot.yDomain[1]])}
            tone="a"
            dashed
            muted
          />
          <Label
            at={[plot.x(box.firstIndex), plot.y(plot.yDomain[0]) + 22]}
            tone="a"
            size={13}
            weight={700}
          >
            N
          </Label>
        </>
      ) : null}

      <SequenceDots
        plot={plot}
        terms={terms}
        tone={harmonic ? 'warn' : 'accent'}
        connect={harmonic}
        {...(showBox && box ? { settledFrom: box.firstIndex } : {})}
      />

      {harmonic ? (
        <Label
          at={[plot.x(COUNT - 1), plot.y(HARMONIC[COUNT - 1] as number) - 18]}
          tone="warn"
          size={14}
          weight={600}
          anchor="end"
        >
          steps shrink, total does not
        </Label>
      ) : null}
    </FigureFrame>
  );
}

export function CauchyCriterionFigure({ dropped }: FigureProps) {
  const inRationals = dropped === 'complete';
  const plot = framed([1.3855, 1.528], ROOT2_APPROX.length, 54);
  const box = tailBox(ROOT2_APPROX, 3);

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="Rational approximations to the square root of two, with and without the number they close in on"
      caption={
        inRationals
          ? 'The same terms, the same strip — and nothing at the middle of it. Every term is rational; the value they bunch around is not.'
          : 'The terms bunch up, and over ℝ there is a number sitting where they bunch. The strip is the Cauchy condition; the dot is what completeness adds.'
      }
    >
      <Axes
        plot={plot}
        xLabel="n"
        xTicks={[2, 4, 6]}
        yTicks={[1.4, 1.45, 1.5]}
        format={(v) => v.toFixed(2)}
      />

      <rect
        x={plot.x(box.firstIndex) - 8}
        y={plot.y(box.high) - 6}
        width={plot.x(plot.xDomain[1]) - plot.x(box.firstIndex)}
        height={plot.y(box.low) - plot.y(box.high) + 12}
        fill="var(--fig-c-fill)"
        stroke="var(--fig-c)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      {/* Clear of the terms themselves: the strip hugs them closely. */}
      <Label
        at={[plot.x(box.firstIndex) + 6, plot.y(box.high) - 34]}
        tone="c"
        size={13}
        weight={700}
        anchor="start"
      >
        the whole tail, in one strip
      </Label>

      <Segment
        from={plot.pt([plot.xDomain[0], ROOT2])}
        to={plot.pt([plot.xDomain[1], ROOT2])}
        tone={inRationals ? 'warn' : 'good'}
        dashed
      />
      <circle
        cx={plot.x(plot.xDomain[1]) - 16}
        cy={plot.y(ROOT2)}
        r={6}
        fill={inRationals ? 'var(--surface)' : 'var(--fig-good)'}
        stroke={inRationals ? 'var(--fig-warn)' : 'var(--fig-good)'}
        strokeWidth={2}
      />
      <Label
        at={[plot.x(plot.xDomain[1]) - 26, plot.y(ROOT2) - 16]}
        tone={inRationals ? 'warn' : 'good'}
        size={14}
        weight={700}
        anchor="end"
      >
        {inRationals ? '√2 ∉ ℚ — no limit here' : '√2 ∈ ℝ'}
      </Label>

      <SequenceDots plot={plot} terms={ROOT2_APPROX} tone="accent" connect />
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'The ε–N test is about a pair: the sequence and a limit you must supply.';
  if (i === 1) return 'So try asking only that consecutive terms close up.';
  if (i === 2) return 'Not enough: the harmonic sums take ever smaller steps and still leave every bound.';
  if (i === 3) return 'Ask it of every later pair, and the whole tail is confined to a strip.';
  if (i === 4) return 'Note what is not on this drawing: no limit line. The condition never mentions one.';
  return 'Whether that strip means a limit exists is a question about the space, not the sequence.';
}
