import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * The cobweb: the map against the diagonal, and the staircase an orbit walks.
 * A fixed point is where the two curves meet, so the whole theorem is the claim
 * that the staircase has somewhere to go.
 */

const contraction = (x: number) => 0.55 * x + 1.2;
const creeping = (x: number) => x + 1 / x;
const halving = (x: number) => x / 2;

interface Scene {
  plot: Plot;
  fn: (x: number) => number;
  domain: readonly [number, number];
  start: number;
  steps: number;
  /** Where the staircase is heading, and whether the space contains it. */
  fixed: number;
  fixedPresent: boolean;
  ticks: readonly number[];
}

function framed(span: readonly [number, number]): Plot {
  return createPlot({
    width: 430,
    height: 310,
    padding: { top: 26, right: 26, bottom: 36, left: 42 },
    xDomain: span,
    yDomain: span,
  });
}

function sceneFor(dropped: string | null | undefined): Scene {
  if (dropped === 'contraction') {
    return {
      plot: framed([0, 5.4]),
      fn: creeping,
      domain: [1, 5.2],
      start: 1.2,
      steps: 6,
      fixed: Number.NaN,
      fixedPresent: false,
      ticks: [1, 2, 3, 4, 5],
    };
  }

  if (dropped === 'complete') {
    return {
      plot: framed([0, 1.25]),
      fn: halving,
      domain: [0.02, 1],
      start: 0.9,
      steps: 6,
      fixed: 0,
      fixedPresent: false,
      ticks: [0.5, 1],
    };
  }

  return {
    plot: framed([0, 5.4]),
    fn: contraction,
    domain: [0, 5.2],
    start: 0.4,
    steps: 7,
    fixed: 1.2 / 0.45,
    fixedPresent: true,
    ticks: [1, 2, 3, 4, 5],
  };
}

/** The staircase: across to the graph, down to the diagonal, repeat. */
function cobweb(
  fn: (x: number) => number,
  start: number,
  steps: number,
): readonly (readonly [number, number])[] {
  const points: [number, number][] = [[start, start]];
  let x = start;
  for (let i = 0; i < steps; i += 1) {
    const next = fn(x);
    points.push([x, next], [next, next]);
    x = next;
  }
  return points;
}

export function FixedPointFigure({ stepIndex, dropped }: FigureProps) {
  const scene = sceneFor(dropped);
  const { plot } = scene;
  const broken = Boolean(dropped);

  // While the theorem stands the orbit unrolls with the proof; while a
  // condition is off the reader is looking at a counterexample, not an argument.
  const steps = broken ? scene.steps : Math.min(scene.steps, Math.max(1, stepIndex + 1));
  const path = cobweb(scene.fn, scene.start, steps);
  const showFixed = broken || stepIndex >= 4;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A map plotted against the diagonal, with the staircase traced by iterating it"
      caption={captionFor(dropped, stepIndex)}
    >
      <Axes plot={plot} xLabel="x" xTicks={scene.ticks} yTicks={scene.ticks} />

      {/* The diagonal: a fixed point is where the map meets it. */}
      <Segment
        from={plot.pt([plot.xDomain[0], plot.xDomain[0]])}
        to={plot.pt([plot.xDomain[1], plot.xDomain[1]])}
        tone="neutral"
        dashed
      />
      <Label
        at={[plot.x(plot.xDomain[1]) - 6, plot.y(plot.xDomain[1]) + 16]}
        tone="neutral"
        size={13}
        anchor="end"
      >
        y = x
      </Label>

      <Curve plot={plot} fn={scene.fn} domain={scene.domain} tone="accent" width={2.5} />

      <polyline
        points={path.map(([x, y]) => `${plot.x(x)},${plot.y(y)}`).join(' ')}
        fill="none"
        stroke={`var(--fig-${broken ? 'warn' : 'a'})`}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <PointMark at={plot.pt([scene.start, scene.start])} tone="a" radius={5} />
      <Label
        at={[plot.x(scene.start), plot.y(scene.start) + 22]}
        tone="a"
        size={13}
        weight={600}
      >
        x₀
      </Label>

      {showFixed && Number.isFinite(scene.fixed) ? (
        <>
          <PointMark
            at={plot.pt([scene.fixed, scene.fixed])}
            tone={scene.fixedPresent ? 'good' : 'warn'}
            radius={6}
            hollow={!scene.fixedPresent}
            active
          />
          <Label
            at={[plot.x(scene.fixed) + 14, plot.y(scene.fixed) - 12]}
            tone={scene.fixedPresent ? 'good' : 'warn'}
            size={14}
            weight={700}
            anchor="start"
          >
            {scene.fixedPresent ? 'x* = T x*' : 'x* not in X'}
          </Label>
        </>
      ) : null}

      {dropped === 'contraction' ? (
        <Label
          at={[plot.x(2.6), plot.y(4.6)]}
          tone="warn"
          size={14}
          weight={700}
        >
          the graph never meets the diagonal
        </Label>
      ) : null}
    </FigureFrame>
  );
}

function captionFor(dropped: string | null | undefined, i: number): string {
  if (dropped === 'contraction') {
    return 'T shortens every distance — yet the factor creeps up to 1, the graph stays above the diagonal, and the staircase climbs away for ever.';
  }
  if (dropped === 'complete') {
    return 'A genuine contraction on a space missing one point. The staircase closes in on 0, and 0 is not there.';
  }
  if (i <= 0) return 'Start anywhere: across to the graph, back to the diagonal, repeat.';
  if (i <= 2) return 'Each step is at most k times the last, so the staircase converges geometrically.';
  if (i === 3) return 'Which makes the orbit Cauchy — and completeness gives it somewhere to land.';
  if (i <= 5) return 'The landing point is where the graph meets the diagonal: T leaves it alone.';
  return 'And it is the only such point. Unusually, the proof is a recipe: iterate, and you are within kⁿ/(1−k) of the answer.';
}
