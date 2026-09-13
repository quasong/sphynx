import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Band, createPlot } from './primitives/plot';
import { SequenceDots, SequenceEscapes } from './primitives/sequence';
import { Label, Segment } from './primitives/shapes';

/**
 * Partial sums plotted against their index: the harmonic totals climb without
 * bound; the geometric totals settle. The figure makes "convergence" visible as
 * a property of (S_n), not of the individual terms.
 */

const COUNT = 14;
const from = (f: (n: number) => number) =>
  Array.from({ length: COUNT }, (_, i) => f(i + 1));

const HARMONIC = (() => {
  let total = 0;
  return from((n) => {
    total += 1 / n;
    return total;
  });
})();

const GEOMETRIC = (() => {
  const x = 0.55;
  let total = 0;
  return from((n) => {
    total += x ** (n - 1);
    return total;
  });
})();

const TERMS = from((n) => 1 / n);
const LIMIT = 1 / (1 - 0.55);

function framed(yDomain: readonly [number, number], count = COUNT): Plot {
  return createPlot({
    width: 430,
    height: 300,
    padding: { top: 26, right: 26, bottom: 36, left: 42 },
    xDomain: [0, count + 1],
    yDomain,
  });
}

function tailBox(terms: readonly number[], firstIndex: number) {
  const tail = terms.slice(firstIndex - 1);
  return { low: Math.min(...tail), high: Math.max(...tail), firstIndex };
}

export function SeriesConvergenceFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  if (i <= 1) {
    const plot = framed([-0.05, 0.55]);
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="Individual terms of 1/n against their index"
        caption={captionFor(i)}
      >
        <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={[0.2, 0.4]} />
        <SequenceDots plot={plot} terms={TERMS} tone="accent" connect />
        <Label at={[plot.x(plot.xDomain[1]), plot.y(0.48)]} tone="neutral" size={13} anchor="end">
          a_n = 1/n → 0
        </Label>
      </FigureFrame>
    );
  }

  if (i === 2 || i === 3) {
    const plot = framed([-0.05, 0.55]);
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="The terms shrink, which is necessary but not sufficient"
        caption={captionFor(i)}
      >
        <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={[0.2, 0.4]} />
        <SequenceDots plot={plot} terms={TERMS} tone="accent" connect />
        <Segment from={plot.pt([plot.xDomain[0], 0])} to={plot.pt([plot.xDomain[1], 0])} tone="good" dashed />
        <Label at={[plot.x(plot.xDomain[1]), plot.y(0) - 12]} tone="good" size={13} anchor="end">
          a_n → 0
        </Label>
      </FigureFrame>
    );
  }

  if (i === 4) {
    const plot = framed([-0.2, 3.6]);
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="Partial sums of the harmonic series against their index"
        caption={captionFor(i)}
      >
        <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={[1, 2, 3]} />
        <SequenceDots plot={plot} terms={HARMONIC} tone="warn" connect />
        <SequenceEscapes plot={plot} terms={HARMONIC} tone="warn" />
        <Label at={[plot.x(plot.xDomain[1]), plot.y(3.35)]} tone="warn" size={13} anchor="end">
          S_n → ∞
        </Label>
      </FigureFrame>
    );
  }

  const geometric = i === 5 || i >= 6;
  const plot = geometric ? framed([1.4, 2.5]) : framed([-0.2, 3.6]);
  const terms = geometric ? GEOMETRIC : HARMONIC;
  const epsilon = 0.08;
  const box = geometric ? tailBox(GEOMETRIC, 8) : null;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title={
        geometric
          ? 'Partial sums of Σx^n with x = 0.55, settling at 1/(1 − x)'
          : 'Partial sums climbing without a destination'
      }
      caption={captionFor(i)}
    >
      <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={geometric ? [1.5, 2, 2.5] : [1, 2, 3]} />

      {geometric ? (
        <>
          <Band plot={plot} orientation="horizontal" from={LIMIT - epsilon} to={LIMIT + epsilon} tone="c" label="ε" />
          <Segment from={plot.pt([plot.xDomain[0], LIMIT])} to={plot.pt([plot.xDomain[1], LIMIT])} tone="good" dashed />
          <Label at={[plot.x(plot.xDomain[1]), plot.y(LIMIT) - 12]} tone="good" size={13} anchor="end">
            1/(1 − x)
          </Label>
          {box && i >= 6 ? (
            <>
              <Band plot={plot} orientation="horizontal" from={box.low} to={box.high} tone="a" />
              <Segment
                from={plot.pt([box.firstIndex, plot.yDomain[0]])}
                to={plot.pt([box.firstIndex, plot.yDomain[1]])}
                tone="a"
                dashed
              />
            </>
          ) : null}
        </>
      ) : null}

      <SequenceDots
        plot={plot}
        terms={terms}
        tone={geometric ? 'accent' : 'warn'}
        connect
        {...(geometric && box && i >= 6 ? { settledFrom: box.firstIndex } : {})}
      />
      {!geometric ? <SequenceEscapes plot={plot} terms={terms} tone="warn" /> : null}
    </FigureFrame>
  );
}

export function SeriesCauchyCriterionFigure({ stepIndex, dropped }: FigureProps) {
  const i = stepIndex;
  const plot = framed([1.4, 2.5]);
  const box = tailBox(GEOMETRIC, i >= 4 ? 7 : 9);
  const showBox = i >= 2 && dropped !== 'complete';

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="Partial sums of a convergent series, with the strip holding the whole tail"
      caption={cauchyCaptionFor(i, dropped)}
    >
      <Axes plot={plot} xLabel="n" xTicks={[5, 10]} yTicks={[1.5, 2, 2.5]} />

      {i >= 3 && dropped !== 'complete' ? (
        <>
          <Segment from={plot.pt([plot.xDomain[0], LIMIT])} to={plot.pt([plot.xDomain[1], LIMIT])} tone="good" dashed />
          <Label at={[plot.x(plot.xDomain[1]), plot.y(LIMIT) - 12]} tone="good" size={13} anchor="end">
            limit
          </Label>
        </>
      ) : null}

      {showBox ? (
        <>
          <Band plot={plot} orientation="horizontal" from={box.low} to={box.high} tone="a" />
          <Segment
            from={plot.pt([box.firstIndex, plot.yDomain[0]])}
            to={plot.pt([box.firstIndex, plot.yDomain[1]])}
            tone="a"
            dashed
          />
          <Label at={[plot.x(box.firstIndex) + 8, plot.y(plot.yDomain[1]) + 10]} tone="a" size={13} weight={600} anchor="start">
            tail
          </Label>
        </>
      ) : null}

      <SequenceDots
        plot={plot}
        terms={GEOMETRIC}
        tone="accent"
        connect
        {...(showBox ? { settledFrom: box.firstIndex } : {})}
      />
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'The notation suggests adding forever; the definition asks whether the running totals settle.';
  if (i === 1) return 'Each partial sum S_n is an ordinary finite sum — the infinite sum is S_n → L.';
  if (i <= 3) return 'Each term 1/n is smaller than the last. Necessary for convergence, but not enough on its own.';
  if (i === 4) return 'The terms vanish, yet the partial sums grow without bound.';
  if (i === 5) return 'Here the partial sums have a closed form and settle at 1/(1 − x).';
  return 'Convergence is a property of (S_n), tested with the same ε–N language as any sequence.';
}

function cauchyCaptionFor(i: number, dropped: FigureProps['dropped']): string {
  if (dropped === 'complete') return 'Without completeness, Cauchy partial sums need not converge to any rational total.';
  if (i <= 0) return 'A convergent series is a convergent sequence of partial sums.';
  if (i === 1) return 'The tail sum between n and m is exactly S_m − S_n.';
  if (i <= 2) return 'Convergence forces every tail sum past N below ε.';
  if (i === 3) return 'Small tail sums make (S_n) Cauchy; completeness turns Cauchy into convergence.';
  return 'The tail condition is the Cauchy criterion for partial sums, rewritten.';
}
