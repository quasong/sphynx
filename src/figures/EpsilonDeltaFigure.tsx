import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Band, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * The epsilon-delta game, drawn.
 *
 * Each stage of the motivation needs a different function to make its point -
 * a smooth curve for the general statement, the identity to defeat the wrong
 * quantifier order, a step function to be rejected, a parabola to be accepted.
 * Switching functions per step is exactly the freedom a hand-written figure
 * buys; a generic scene description would have had to encode all four.
 */

const WIDTH = 430;
const HEIGHT = 330;

const wave = (x: number) => 0.9 * Math.sin(1.6 * x);
const identity = (x: number) => x;
const step = (x: number) => (x < 0 ? 0 : 1);
const square = (x: number) => x * x;

interface Scene {
  plot: Plot;
  fn: (x: number) => number;
  /** x positions where the function jumps, so the curve is not drawn through the gap. */
  breaks?: readonly number[];
  x0: number;
  /** Tolerance demanded around f(x0). */
  epsilon?: number;
  /** Radius offered around x0; null means no radius can work. */
  delta?: number;
  /** An x inside the delta-neighbourhood whose value escapes the epsilon-band. */
  violation?: number;
  /** Draw the box where the two bands meet, and the arc of the graph inside it. */
  showBox?: boolean;
  verdict?: 'fits' | 'fails';
  xTicks: readonly number[];
  yTicks: readonly number[];
}

function sceneFor(i: number): Scene {
  const smooth = createPlot({
    width: WIDTH,
    height: HEIGHT,
    padding: { top: 22, right: 26, bottom: 34, left: 40 },
    xDomain: [-3.2, 3.2],
    yDomain: [-1.5, 1.5],
  });

  // Stage 1-2: the naive picture. No quantities yet, just an unbroken graph.
  if (i <= 1) {
    return {
      plot: smooth,
      fn: wave,
      x0: 0.8,
      xTicks: [-3, -2, -1, 1, 2, 3],
      yTicks: [-1, 1],
    };
  }

  // Stage 3-4: the identity function defeats "one delta for every epsilon".
  if (i <= 3) {
    const plot = createPlot({
      width: WIDTH,
      height: HEIGHT,
      padding: { top: 22, right: 26, bottom: 34, left: 40 },
      xDomain: [-1.5, 1.5],
      yDomain: [-1.5, 1.5],
    });
    return {
      plot,
      fn: identity,
      x0: 0,
      epsilon: 0.3,
      delta: 1,
      violation: 0.75,
      verdict: 'fails',
      xTicks: [-1, 1],
      yTicks: [-1, 1],
    };
  }

  // Stage 5: the definition itself, on a function that satisfies it.
  if (i === 4) {
    return {
      plot: smooth,
      fn: wave,
      x0: 0.8,
      epsilon: 0.4,
      delta: 0.35,
      showBox: true,
      verdict: 'fits',
      xTicks: [-3, -2, -1, 1, 2, 3],
      yTicks: [-1, 1],
    };
  }

  // Stage 6: a jump, which the definition must reject.
  if (i === 5) {
    const plot = createPlot({
      width: WIDTH,
      height: HEIGHT,
      padding: { top: 22, right: 26, bottom: 34, left: 40 },
      xDomain: [-1.3, 1.3],
      yDomain: [-0.7, 1.9],
    });
    return {
      plot,
      fn: step,
      breaks: [0],
      x0: 0,
      epsilon: 0.5,
      delta: 0.6,
      violation: -0.3,
      showBox: true,
      verdict: 'fails',
      xTicks: [-1, 1],
      yTicks: [1],
    };
  }

  // Stage 7-8: a parabola, which it must accept, with delta computed from epsilon.
  const plot = createPlot({
    width: WIDTH,
    height: HEIGHT,
    padding: { top: 22, right: 26, bottom: 34, left: 40 },
    xDomain: [0, 1.75],
    yDomain: [0, 2.6],
  });
  return {
    plot,
    fn: square,
    x0: 1,
    epsilon: 0.6,
    delta: 0.2,
    showBox: true,
    verdict: 'fits',
    xTicks: [0.5, 1, 1.5],
    yTicks: [1, 2],
  };
}

export function EpsilonDeltaFigure({ stepIndex, highlight }: FigureProps) {
  const i = stepIndex;
  const scene = sceneFor(i);
  const { plot, fn, x0 } = scene;
  const y0 = fn(x0);
  const on = (key: string) => highlight.includes(key);

  const center = plot.pt([x0, y0]);

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A function graph with the epsilon band around f(x0) and the delta band around x0"
      caption={captionFor(i)}
    >
      <Axes
        plot={plot}
        xLabel="x"
        yLabel="f(x)"
        xTicks={scene.xTicks}
        yTicks={scene.yTicks}
        format={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))}
      />

      {scene.epsilon !== undefined ? (
        <Band
          plot={plot}
          orientation="horizontal"
          from={y0 - scene.epsilon}
          to={y0 + scene.epsilon}
          tone="c"
          label="ε"
        />
      ) : null}
      {scene.delta !== undefined ? (
        <Band
          plot={plot}
          orientation="vertical"
          from={x0 - scene.delta}
          to={x0 + scene.delta}
          tone="a"
          label="δ"
        />
      ) : null}

      <Curve plot={plot} fn={fn} breaks={scene.breaks} tone="accent" width={on('pen') ? 3.5 : 2.5} />

      {/* The arc the definition is actually about: the graph over the delta-neighbourhood. */}
      {scene.showBox && scene.delta !== undefined ? (
        <Curve
          plot={plot}
          fn={fn}
          domain={[x0 - scene.delta, x0 + scene.delta]}
          breaks={scene.breaks}
          tone={scene.verdict === 'fits' ? 'good' : 'warn'}
          width={4}
        />
      ) : null}

      {/* Guides locating f(x0) on both axes. */}
      <Segment from={[plot.x(x0), plot.y(plot.yDomain[0])]} to={center} tone="neutral" dashed muted />
      <Segment from={[plot.x(plot.xDomain[0]), plot.y(y0)]} to={center} tone="neutral" dashed muted />
      <PointMark at={center} tone="accent" radius={5} />
      <Label at={[center[0] + 10, center[1] - 16]} tone="accent" size={14} anchor="start">
        {`(x₀, f(x₀))`}
      </Label>

      {scene.violation !== undefined ? (
        <>
          <PointMark at={plot.pt([scene.violation, fn(scene.violation)])} tone="warn" radius={5} active />
          <Label
            at={[
              plot.x(scene.violation) + (scene.violation < x0 ? -10 : 10),
              plot.y(fn(scene.violation)) + 20,
            ]}
            tone="warn"
            size={13}
            anchor={scene.violation < x0 ? 'end' : 'start'}
            active={on('violation')}
          >
            escapes ε
          </Label>
        </>
      ) : null}
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'The intuition: an unbroken graph. True, but not yet a definition of anything.';
  if (i === 1) return 'Closeness in x should force closeness in f(x) — but "close" still has no meaning.';
  if (i === 2) return 'One fixed δ, asked to work for every ε.';
  if (i === 3) return 'It cannot: shrink ε below δ and a point inside the δ-band escapes the ε-band.';
  if (i === 4) return 'With ε given first, δ can be chosen in response — and the arc over it stays inside the band.';
  if (i === 5) return 'At a jump, ε = ½ leaves no room: every δ-band reaches across the gap.';
  if (i === 6) return 'For x² at x₀ = 1, the recipe δ = min(1, ε/3) answers every ε.';
  return 'Each clause of the definition is doing work: ∀ε for tightness, ∃δ to respond, the implication to stay local.';
}
