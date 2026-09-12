import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * Both entries about uniform continuity draw the same thing: a band of fixed
 * height, and the widest input window that keeps the graph inside it, at
 * several points at once. The only question the reader has to answer is whether
 * those windows are all the same width.
 *
 * Kept in one file because they are one picture, asked twice.
 */

const reciprocal = (x: number) => 1 / x;
const square = (x: number) => x * x;
const jump = (x: number) => (x < 1 ? 1 : 2);

/** Widest δ at x0 that keeps 1/x inside a band of half-height ε. */
const deltaReciprocal = (x0: number, epsilon: number) =>
  (epsilon * x0 * x0) / (1 + epsilon * x0);

/** Widest δ at x0 for x², from |x² − y²| = |x − y||x + y|. */
const deltaSquare = (x0: number, epsilon: number) => epsilon / (2 * x0 + 1);

interface Scene {
  plot: Plot;
  fn: (x: number) => number;
  /** The interval f is being considered on. */
  domain: readonly [number, number];
  breaks?: readonly number[];
  epsilon: number;
  /** Where to put a window, and how wide it may be there. */
  windows: readonly { x0: number; delta: number }[];
  /** True when one width serves every point. */
  uniform: boolean;
  xTicks: readonly number[];
  yTicks: readonly number[];
}

function framed(
  xDomain: readonly [number, number],
  yDomain: readonly [number, number],
): Plot {
  return createPlot({
    width: 430,
    height: 310,
    padding: { top: 26, right: 26, bottom: 36, left: 42 },
    xDomain,
    yDomain,
  });
}

const NARROW = () => framed([-0.12, 2.3], [-0.3, 4.4]);

/** 1/x on an open interval: the window closes up as x0 approaches the gap. */
function shrinkingScene(epsilon: number): Scene {
  return {
    plot: NARROW(),
    fn: reciprocal,
    domain: [0.26, 2.2],
    epsilon,
    windows: [1.0, 0.5, 0.3].map((x0) => ({ x0, delta: deltaReciprocal(x0, epsilon) })),
    uniform: false,
    xTicks: [1, 2],
    yTicks: [1, 2, 3, 4],
  };
}

/** The same function on a closed bounded set: one width covers all of it. */
function uniformScene(epsilon: number): Scene {
  const worst = deltaReciprocal(0.5, epsilon);
  return {
    plot: NARROW(),
    fn: reciprocal,
    domain: [0.5, 2],
    epsilon,
    windows: [0.62, 1.1, 1.8].map((x0) => ({ x0, delta: worst })),
    uniform: true,
    xTicks: [1, 2],
    yTicks: [1, 2],
  };
}

export function UniformContinuityFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;
  const epsilon = 0.6;

  // Stage 4 is about one pair of points rather than about windows.
  const witness = i === 3;
  const scene = i <= 0 ? oneWindow(epsilon) : shrinkingScene(epsilon);

  return (
    <Drawing
      scene={witness ? shrinkingScene(epsilon) : scene}
      showWindows={!witness}
      witness={witness ? { a: 1 / 3, b: 1 / 4 } : undefined}
      caption={captionForDefinition(i)}
    />
  );
}

function oneWindow(epsilon: number): Scene {
  const base = shrinkingScene(epsilon);
  const first = base.windows[1];
  return { ...base, windows: first ? [first] : [] };
}

export function HeineCantorFigure({ stepIndex, dropped }: FigureProps) {
  const epsilon = 0.6;

  if (dropped === 'closed') {
    return (
      <Drawing
        scene={shrinkingScene(epsilon)}
        showWindows
        caption="Bounded and continuous. The window closes up as x₀ approaches 0 — and 0 is not in the set, so there is no point there to appeal to."
      />
    );
  }

  if (dropped === 'bounded') {
    const wide = framed([-0.2, 4.7], [-1.4, 21]);
    return (
      <Drawing
        scene={{
          plot: wide,
          fn: square,
          domain: [0, 4.5],
          epsilon: 2,
          windows: [1, 2.5, 4].map((x0) => ({ x0, delta: deltaSquare(x0, 2) })),
          uniform: false,
          xTicks: [1, 2, 3, 4],
          yTicks: [5, 10, 15, 20],
        }}
        showWindows
        caption="Closed and continuous. The window closes up towards infinity instead: slide a fixed gap outwards and the outputs separate without limit."
      />
    );
  }

  if (dropped === 'continuous') {
    const plot = framed([-0.12, 2.3], [-0.3, 4.4]);
    return (
      <Drawing
        scene={{
          plot,
          fn: jump,
          domain: [0.5, 2],
          breaks: [1],
          epsilon,
          windows: [{ x0: 1, delta: 0.28 }],
          uniform: false,
          xTicks: [1, 2],
          yTicks: [1, 2],
        }}
        showWindows
        caption="Closed and bounded, and no window at the jump works at all: points on either side are 1 apart in value however close they are in x."
      />
    );
  }

  const scene = uniformScene(epsilon);
  const shown = stepIndex <= 0 ? 1 : stepIndex <= 3 ? 2 : 3;
  return (
    <Drawing
      scene={{ ...scene, windows: scene.windows.slice(0, shown) }}
      showWindows
      caption={captionForTheorem(stepIndex)}
    />
  );
}

interface DrawingProps {
  scene: Scene;
  showWindows: boolean;
  /** Two points close in x whose values stay far apart. */
  witness?: { a: number; b: number };
  caption: string;
}

function Drawing({ scene, showWindows, witness, caption }: DrawingProps) {
  const { plot, fn, epsilon } = scene;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A function with the widest input window that keeps its values inside a fixed band, shown at several points"
      caption={caption}
    >
      <Axes plot={plot} xLabel="x" xTicks={scene.xTicks} yTicks={scene.yTicks} />

      <Curve
        plot={plot}
        fn={fn}
        domain={scene.domain}
        breaks={scene.breaks}
        tone="accent"
        width={2.5}
      />

      {showWindows
        ? scene.windows.map((w, k) => (
            <Window
              key={k}
              plot={plot}
              fn={fn}
              x0={w.x0}
              delta={w.delta}
              epsilon={epsilon}
              tone={scene.uniform ? 'good' : 'a'}
              breaks={scene.breaks}
            />
          ))
        : null}

      {/* The δ of each window, laid on the axis so the widths compare directly. */}
      {showWindows
        ? scene.windows.map((w, k) => (
            <Segment
              key={`rail${k}`}
              from={plot.pt([w.x0 - w.delta, plot.yDomain[0] + 0.12 * (plot.yDomain[1] - plot.yDomain[0])])}
              to={plot.pt([w.x0 + w.delta, plot.yDomain[0] + 0.12 * (plot.yDomain[1] - plot.yDomain[0])])}
              tone={scene.uniform ? 'good' : 'a'}
              active
            />
          ))
        : null}

      {showWindows && scene.windows.length > 1 ? (
        <Label
          at={[plot.x(plot.xDomain[1]), plot.y(plot.yDomain[1]) + 12]}
          tone={scene.uniform ? 'good' : 'warn'}
          size={14}
          weight={700}
          anchor="end"
        >
          {scene.uniform ? 'one width, everywhere' : 'no width serves them all'}
        </Label>
      ) : null}

      {witness ? (
        <>
          <PointMark at={plot.pt([witness.a, fn(witness.a)])} tone="warn" radius={5} active />
          <PointMark at={plot.pt([witness.b, fn(witness.b)])} tone="warn" radius={5} active />
          <Segment
            from={plot.pt([witness.a, fn(witness.a)])}
            to={plot.pt([witness.b, fn(witness.b)])}
            tone="warn"
            active
          />
          <Label
            at={[plot.x(witness.b) + 14, plot.y((fn(witness.a) + fn(witness.b)) / 2)]}
            tone="warn"
            size={14}
            weight={700}
            anchor="start"
          >
            values stay 1 apart
          </Label>
        </>
      ) : null}
    </FigureFrame>
  );
}

/** One input window, with the band it has to keep the graph inside. */
function Window({
  plot,
  fn,
  x0,
  delta,
  epsilon,
  tone,
  breaks,
}: {
  plot: Plot;
  fn: (x: number) => number;
  x0: number;
  delta: number;
  epsilon: number;
  tone: 'a' | 'good';
  breaks?: readonly number[];
}) {
  const y0 = fn(x0);
  const left = plot.x(x0 - delta);
  const right = plot.x(x0 + delta);
  const top = plot.y(y0 + epsilon);
  const bottom = plot.y(y0 - epsilon);

  return (
    <g>
      <rect
        x={left}
        y={top}
        width={Math.max(1.5, right - left)}
        height={bottom - top}
        fill={`var(--fig-${tone}-fill)`}
        stroke={`var(--fig-${tone})`}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <Curve
        plot={plot}
        fn={fn}
        domain={[x0 - delta, x0 + delta]}
        breaks={breaks}
        tone={tone}
        width={3.5}
      />
    </g>
  );
}

function captionForDefinition(i: number): string {
  if (i <= 0) return 'Continuity lets the window be chosen after the point is named.';
  if (i === 1) return 'And on 1/x the window it needs closes up as the point approaches 0.';
  if (i === 2) return 'Uniform continuity asks for one width that serves every point at once.';
  if (i === 3) return 'These two points can be brought arbitrarily close with their values exactly 1 apart — so for ε = 1 no width works.';
  if (i === 4) return 'A width that works everywhere works in particular at any one point; the converse fails.';
  return 'Where the radius may depend on the point, a fact proved at each point separately need not assemble into a fact about the set.';
}

function captionForTheorem(i: number): string {
  if (i <= 0) return 'The same function, now on a closed bounded set.';
  if (i <= 3) return 'The bad points would have to accumulate somewhere — and closedness puts that somewhere inside K.';
  return 'One width, taken from the worst point, covers the whole set. The proof never produces it; it shows no tolerance can defeat every candidate.';
}
