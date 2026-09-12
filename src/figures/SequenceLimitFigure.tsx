import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Band, createPlot } from './primitives/plot';
import { SequenceDots } from './primitives/sequence';
import { Label, Segment } from './primitives/shapes';

/**
 * Four sequences, one per failed reading of "approaches L".
 *
 * Index runs along the horizontal axis, so "from some point on" is a place on
 * the drawing: the threshold N is a vertical line, and the definition is the
 * claim that everything to the right of it is inside the band.
 */

const COUNT = 14;
const from = (f: (n: number) => number) =>
  Array.from({ length: COUNT }, (_, i) => f(i + 1));

const SHIFTED = from((n) => 1 + 1 / n);
const RECIPROCAL = from((n) => 1 / n);
const ALTERNATING = from((n) => (n % 2 === 0 ? 1 : -1));

interface Scene {
  plot: Plot;
  terms: readonly number[];
  /** The value the definition is being tested against. */
  claimed: number;
  claimedLabel: string;
  /** Where the sequence actually settles, when that is the point being made. */
  actual?: number;
  epsilon?: number;
  /** First index from which every term is inside the band. */
  threshold?: number;
  yTicks: readonly number[];
}

function framed(yDomain: readonly [number, number]): Plot {
  return createPlot({
    width: 430,
    height: 300,
    padding: { top: 26, right: 26, bottom: 36, left: 40 },
    xDomain: [0, COUNT + 1],
    yDomain,
  });
}

function sceneFor(i: number): Scene {
  // Stages 1-2: closer and closer, to the wrong place.
  if (i <= 1) {
    return {
      plot: framed([-0.45, 2.4]),
      terms: SHIFTED,
      claimed: 0,
      claimedLabel: 'L = 0 ?',
      actual: 1,
      yTicks: [1, 2],
    };
  }

  // Stage 3: arrival is too much to ask.
  if (i === 2) {
    return {
      plot: framed([-0.35, 1.25]),
      terms: RECIPROCAL,
      claimed: 0,
      claimedLabel: 'L = 0',
      yTicks: [1],
    };
  }

  // Stages 4-5: visiting the neighbourhood is not staying in it.
  if (i <= 4) {
    return {
      plot: framed([-1.6, 1.6]),
      terms: ALTERNATING,
      claimed: 1,
      claimedLabel: 'L = 1 ?',
      epsilon: 0.35,
      yTicks: [-1, 1],
    };
  }

  // Stage 6: the definition, and stage 7: the same with a tighter tolerance,
  // to show the threshold move.
  const epsilon = i === 5 ? 0.25 : 0.12;
  return {
    plot: framed([-0.35, 1.25]),
    terms: RECIPROCAL,
    claimed: 0,
    claimedLabel: 'L = 0',
    epsilon,
    // Strictly beyond 1/ε: at N = ceil(1/ε) the term 1/N can equal ε rather
    // than fall below it, which is not what the definition asks for.
    threshold: Math.floor(1 / epsilon) + 1,
    yTicks: [1],
  };
}

export function SequenceLimitFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;
  const scene = sceneFor(i);
  const { plot } = scene;
  const showViolation = i === 4;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A sequence plotted against its index, with the tolerance band around the claimed limit"
      caption={captionFor(i)}
    >
      <Axes plot={plot} xLabel="n" yTicks={scene.yTicks} xTicks={[5, 10]} />

      {scene.epsilon !== undefined ? (
        <Band
          plot={plot}
          orientation="horizontal"
          from={scene.claimed - scene.epsilon}
          to={scene.claimed + scene.epsilon}
          tone="c"
          label="ε"
        />
      ) : null}

      {/* The level the definition is being tested against. */}
      <Segment
        from={plot.pt([plot.xDomain[0], scene.claimed])}
        to={plot.pt([plot.xDomain[1], scene.claimed])}
        tone={scene.actual === undefined ? 'good' : 'warn'}
        dashed
      />
      <Label
        at={[plot.x(plot.xDomain[1]), plot.y(scene.claimed) - 12]}
        tone={scene.actual === undefined ? 'good' : 'warn'}
        size={14}
        weight={600}
        anchor="end"
      >
        {scene.claimedLabel}
      </Label>

      {/* Where it really settles, when that is the point. */}
      {scene.actual !== undefined ? (
        <>
          <Segment
            from={plot.pt([plot.xDomain[0], scene.actual])}
            to={plot.pt([plot.xDomain[1], scene.actual])}
            tone="good"
            dashed
          />
          <Label
            at={[plot.x(plot.xDomain[1]), plot.y(scene.actual) - 12]}
            tone="good"
            size={14}
            weight={600}
            anchor="end"
          >
            settles at 1
          </Label>
        </>
      ) : null}

      {scene.threshold !== undefined ? (
        <>
          <Segment
            from={plot.pt([scene.threshold, plot.yDomain[0]])}
            to={plot.pt([scene.threshold, plot.yDomain[1]])}
            tone="a"
            dashed
          />
          <Label
            at={[plot.x(scene.threshold) + 8, plot.y(plot.yDomain[1]) + 10]}
            tone="a"
            size={14}
            weight={700}
            anchor="start"
          >
            {`N = ${scene.threshold}`}
          </Label>
        </>
      ) : null}

      <SequenceDots
        plot={plot}
        terms={scene.terms}
        tone="accent"
        {...(scene.threshold === undefined ? {} : { settledFrom: scene.threshold })}
      />

      {/* The terms that defeat "some term is within ε". */}
      {showViolation ? (
        <SequenceDots
          plot={plot}
          terms={scene.terms.map((v) => (v < 0 ? v : Number.NaN))}
          tone="warn"
          radius={5}
        />
      ) : null}
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'Every term is closer to 0 than the one before it.';
  if (i === 1) return 'And the sequence settles at 1. "Closer each step" never said where.';
  if (i === 2) return '1/n converges to 0 and is never equal to it. Arrival is the wrong demand.';
  if (i === 3) return 'Every other term is exactly 1, so every tolerance is met by some term.';
  if (i === 4) return 'And the rest sit at −1 forever. The sequence visits the band; it does not stay.';
  if (i === 5) return 'Past N every term is inside the band — that is the whole definition.';
  return 'Halve the tolerance and the threshold moves right. N is chosen after ε, and depends on it.';
}
