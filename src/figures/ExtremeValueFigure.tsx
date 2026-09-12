import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * The same claim under four conditions.
 *
 * Every case is drawn in the same vertical frame with the supremum at one, so
 * the dashed line sits at the same height on screen whichever hypothesis is
 * switched off. The comparison the reader is being asked to make is whether the
 * curve touches that line, and holding the frame still is what makes it a
 * comparison rather than four separate pictures.
 */

const HEIGHT = 300;
const WIDTH = 430;
/** Where the set K is drawn, just under the axis. */
const SET_LANE = -0.12;

interface Scene {
  plot: Plot;
  fn: (x: number) => number;
  /** The set K as an interval, in math coordinates. */
  set: readonly [number, number];
  /**
   * Where to draw the graph, when that is not the whole of K. A jump at an
   * endpoint of K cannot be handled by `breaks`, which only splits the interior,
   * so the curve is stopped short and the marks carry the jump instead.
   */
  curveDomain?: readonly [number, number];
  openLeft?: boolean;
  openRight?: boolean;
  /** K continues past the right edge of the frame. */
  ray?: boolean;
  breaks?: readonly number[];
  /** Where the supremum is reached, if it is reached at all. */
  attainedAt?: number;
  /** Where the curve heads towards the supremum without arriving. */
  missedAt?: number;
  missedLabel?: string;
  /** An extra value the function does take, when a jump throws the sup away. */
  strandedAt?: readonly [number, number];
  minAt?: number;
  xTicks: readonly number[];
}

function framed(xDomain: readonly [number, number]): Plot {
  return createPlot({
    width: WIDTH,
    height: HEIGHT,
    padding: { top: 26, right: 26, bottom: 38, left: 42 },
    xDomain,
    // Held fixed across every case so the supremum line never moves.
    yDomain: [-0.28, 1.35],
  });
}

function sceneFor(dropped: string | null | undefined): Scene {
  switch (dropped) {
    case 'closed':
      return {
        plot: framed([-0.25, 1.4]),
        fn: (x) => x,
        set: [0, 1],
        openLeft: true,
        openRight: true,
        missedAt: 1,
        missedLabel: 'no last value',
        xTicks: [0.5, 1],
      };

    case 'bounded':
      return {
        plot: framed([-1.1, 6.4]),
        fn: (x) => x / (1 + x),
        set: [0, 6.4],
        ray: true,
        missedAt: 6.4,
        missedLabel: 'approached as x → ∞',
        xTicks: [2, 4, 6],
      };

    case 'continuous':
      return {
        plot: framed([-0.25, 1.4]),
        fn: (x) => (x < 1 ? x : 0),
        set: [0, 1],
        curveDomain: [0, 0.997],
        missedAt: 1,
        missedLabel: 'the value is thrown away',
        strandedAt: [1, 0],
        xTicks: [0.5, 1],
      };

    default:
      return {
        plot: framed([-0.25, 1.4]),
        fn: (x) => 4 * x * (1 - x),
        set: [0, 1],
        attainedAt: 0.5,
        minAt: 0,
        xTicks: [0.5, 1],
      };
  }
}

export function ExtremeValueFigure({ stepIndex, dropped }: FigureProps) {
  const scene = sceneFor(dropped);
  const { plot } = scene;
  const broken = Boolean(dropped);

  // While the theorem stands, the drawing follows the proof. While a hypothesis
  // is off, the reader is looking at the counterexample rather than working
  // through an argument, so everything is shown at once.
  const showSup = broken || stepIndex >= 5;
  const showMax = broken || stepIndex >= 8;
  const showMin = !broken && stepIndex >= 9;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A function on a set, with its supremum marked, showing whether the value is reached"
      caption={captionFor(dropped, stepIndex)}
    >
      <Axes plot={plot} xLabel="x" yLabel="f(x)" xTicks={scene.xTicks} yTicks={[1]} />

      {showSup ? (
        <>
          <Segment
            from={plot.pt([plot.xDomain[0], 1])}
            to={plot.pt([plot.xDomain[1], 1])}
            tone="c"
            dashed
          />
          <Label
            at={[plot.x(plot.xDomain[0]) + 6, plot.y(1) - 14]}
            tone="c"
            size={14}
            weight={600}
            anchor="start"
          >
            sup f(K) = 1
          </Label>
        </>
      ) : null}

      <SetMarker scene={scene} />

      <Curve
        plot={plot}
        fn={scene.fn}
        domain={scene.curveDomain ?? scene.set}
        breaks={scene.breaks}
        tone="accent"
        width={3}
      />

      {showMax && scene.attainedAt !== undefined ? (
        <>
          <PointMark at={plot.pt([scene.attainedAt, 1])} tone="good" radius={6} active />
          <Label
            at={[plot.x(scene.attainedAt), plot.y(1) - 20]}
            tone="good"
            size={14}
            weight={700}
          >
            maximum, reached
          </Label>
        </>
      ) : null}

      {showMax && scene.missedAt !== undefined ? (
        <>
          <PointMark at={plot.pt([scene.missedAt, 1])} tone="warn" radius={6} hollow active />
          <Label
            at={[plot.x(scene.missedAt) - 10, plot.y(1) - 20]}
            tone="warn"
            size={14}
            weight={700}
            anchor="end"
          >
            {scene.missedLabel ?? 'never reached'}
          </Label>
        </>
      ) : null}

      {scene.strandedAt ? (
        <>
          <PointMark at={plot.pt(scene.strandedAt)} tone="warn" radius={5} />
          <Label
            at={[plot.x(scene.strandedAt[0]) + 10, plot.y(scene.strandedAt[1]) - 4]}
            tone="warn"
            size={13}
            anchor="start"
          >
            f(1) = 0
          </Label>
        </>
      ) : null}

      {showMin && scene.minAt !== undefined ? (
        <PointMark at={plot.pt([scene.minAt, scene.fn(scene.minAt)])} tone="good" radius={5} />
      ) : null}
    </FigureFrame>
  );
}

/** K itself, drawn on its own lane below the axis with honest endpoints. */
function SetMarker({ scene }: { scene: Scene }) {
  const { plot, set } = scene;
  const y = plot.y(SET_LANE);
  const x1 = plot.x(set[0]);
  const x2 = plot.x(set[1]);

  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="var(--fig-a)" strokeWidth={6} />
      <Endpoint x={x1} y={y} open={scene.openLeft ?? false} />
      {scene.ray ? (
        <polygon
          points={`${x2 + 9},${y} ${x2},${y - 5} ${x2},${y + 5}`}
          fill="var(--fig-a)"
        />
      ) : (
        <Endpoint x={x2} y={y} open={scene.openRight ?? false} />
      )}
      <Label at={[(x1 + x2) / 2, y + 22]} tone="a" size={14} weight={600}>
        {scene.ray ? 'K = [0, ∞)' : scene.openLeft ? 'K = (0, 1)' : 'K = [0, 1]'}
      </Label>
    </g>
  );
}

function Endpoint({ x, y, open }: { x: number; y: number; open: boolean }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={5}
      fill={open ? 'var(--surface)' : 'var(--fig-a)'}
      stroke="var(--fig-a)"
      strokeWidth={2}
    />
  );
}

function captionFor(dropped: string | null | undefined, stepIndex: number): string {
  if (dropped === 'closed') {
    return 'Bounded and continuous, but K is missing the point where the maximum would be. For every value there is a larger one still inside.';
  }
  if (dropped === 'bounded') {
    return 'Closed and continuous, and f is bounded too — only K is infinite. That alone is enough: the curve climbs towards 1 along the whole of K and arrives nowhere.';
  }
  if (dropped === 'continuous') {
    return 'K is closed and bounded, so the chase converges to a point of K — and f discards the value on arrival.';
  }
  if (stepIndex < 5) return 'A continuous function on a closed, bounded set.';
  if (stepIndex < 8) return 'The values are bounded above, so a least upper bound exists. Whether it is reached is the question.';
  if (stepIndex < 9) return 'It is reached: some point of K is sent exactly to the supremum.';
  return 'And the same argument applied to −f puts the minimum in K as well.';
}
