import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Band, createPlot } from './primitives/plot';
import { SequenceDots, SequenceEscapes } from './primitives/sequence';
import { Label, Segment } from './primitives/shapes';

/**
 * The same frame under each condition, so the two failures can be told apart:
 * without monotonicity the terms keep leaving the band they have already
 * reached; without boundedness there is no band, because there is no
 * supremum to draw one around.
 */

const COUNT = 14;
const EPSILON = 0.15;

const from = (f: (n: number) => number) =>
  Array.from({ length: COUNT }, (_, i) => f(i + 1));

const CLIMBING = from((n) => 1 - 0.75 ** n);
const ALTERNATING = from((n) => (n % 2 === 0 ? 1 : -1));
const UNBOUNDED = from((n) => n / 6);

const plot = createPlot({
  width: 430,
  height: 300,
  padding: { top: 26, right: 26, bottom: 36, left: 40 },
  xDomain: [0, COUNT + 1],
  yDomain: [-1.35, 1.35],
});

/** First index whose term, and every later one, is inside the band. */
const THRESHOLD = CLIMBING.findIndex((v) => v > 1 - EPSILON) + 1;

export function MonotoneFigure({ stepIndex, dropped }: FigureProps) {
  const i = stepIndex;
  const broken = Boolean(dropped);

  const terms =
    dropped === 'monotone' ? ALTERNATING : dropped === 'bounded' ? UNBOUNDED : CLIMBING;
  // Without boundedness there is no supremum, so there is nothing to draw.
  const supremum = dropped === 'bounded' ? null : 1;

  const showSup = broken || i >= 1;
  const showBand = broken ? dropped === 'monotone' : i >= 2;
  const showThreshold = !broken && i >= 2;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="An increasing bounded sequence climbing towards its least upper bound"
      caption={captionFor(dropped, i)}
    >
      <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={[-1, 1]} />

      {showBand && supremum !== null ? (
        <Band
          plot={plot}
          orientation="horizontal"
          from={supremum - EPSILON}
          to={supremum}
          tone="c"
          label="ε"
        />
      ) : null}

      {showSup && supremum !== null ? (
        <>
          <Segment
            from={plot.pt([plot.xDomain[0], supremum])}
            to={plot.pt([plot.xDomain[1], supremum])}
            tone="good"
            dashed
          />
          <Label
            at={[plot.x(plot.xDomain[1]), plot.y(supremum) - 12]}
            tone="good"
            size={14}
            weight={600}
            anchor="end"
          >
            L = sup
          </Label>
        </>
      ) : null}

      {showThreshold ? (
        <>
          <Segment
            from={plot.pt([THRESHOLD, plot.yDomain[0]])}
            to={plot.pt([THRESHOLD, plot.yDomain[1]])}
            tone="a"
            dashed
          />
          <Label
            at={[plot.x(THRESHOLD) + 8, plot.y(plot.yDomain[1]) + 10]}
            tone="a"
            size={14}
            weight={700}
            anchor="start"
          >
            {`N = ${THRESHOLD}`}
          </Label>
        </>
      ) : null}

      <SequenceDots
        plot={plot}
        terms={terms}
        tone={broken ? 'warn' : 'accent'}
        connect={dropped === 'monotone'}
        {...(showThreshold ? { settledFrom: THRESHOLD } : {})}
      />
      {dropped === 'bounded' ? <SequenceEscapes plot={plot} terms={terms} /> : null}
    </FigureFrame>
  );
}

function captionFor(dropped: string | null | undefined, i: number): string {
  if (dropped === 'monotone') {
    return 'Bounded, and the supremum is hit every other term — then abandoned again. Reaching a level repeatedly is not settling at it.';
  }
  if (dropped === 'bounded') {
    return 'Increasing, and it leaves the frame. There is no least upper bound, so the proof has nothing to name as the limit.';
  }
  if (i <= 0) return 'An increasing sequence, held under a ceiling.';
  if (i === 1) return 'Completeness supplies the least such ceiling.';
  if (i === 2) return 'L − ε is below it, so some term has already passed that line.';
  if (i <= 4) return 'And because the sequence never comes back down, every later term stays past it.';
  return 'Trapped between L − ε and L from N onwards — which is what convergence to L means.';
}
