import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import type { Plot } from './primitives/plot';
import { Axes, Curve, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * The level, the last point still below it, and what continuity forbids on
 * either side of that point. The proof never traces the graph across, so the
 * drawing does not either: it marks the supremum and then shows the two
 * neighbourhoods that rule out every value except c.
 */

const LEVEL = 1.5;

const rising = (x: number) => 0.6 + 1.6 * x - 0.35 * x * x;
const jump = (x: number) => (x < 1 ? 0.5 : 2.4);
const split = (x: number) => (x <= 1 ? 0.6 : 2.4);

/** Where the rising curve meets the level. */
const CROSSING = (1.6 - Math.sqrt(1.6 * 1.6 - 4 * 0.35 * 0.9)) / (2 * 0.35);

const plot: Plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.25, 2.6],
  yDomain: [-0.35, 3],
});

export function IntermediateValueFigure({ stepIndex, dropped }: FigureProps) {
  const i = stepIndex;

  if (dropped === 'continuous') {
    return (
      <Scene
        fn={jump}
        pieces={[[0, 0.997], [1, 2]]}
        supremum={1}
        caption="Below the level, then above it, with nothing in between. The last point still below is 1 — and f leaps across at exactly that point."
        broken
      />
    );
  }

  if (dropped === 'interval') {
    return (
      <Scene
        fn={split}
        pieces={[[0, 1], [1.6, 2.5]]}
        supremum={1}
        caption="Continuous on its domain — each piece is constant. The level falls in the gap, where there is no point for the function to take it at."
        broken
      />
    );
  }

  return (
    <Scene
      fn={rising}
      pieces={[[0, 2]]}
      supremum={CROSSING}
      showSupremum={i >= 1}
      showProbes={i >= 2 ? (i >= 3 ? 'both' : 'right') : 'none'}
      showCrossing={i >= 4}
      caption={captionFor(i)}
    />
  );
}

interface SceneProps {
  fn: (x: number) => number;
  /** The domain, as one or more intervals. */
  pieces: readonly (readonly [number, number])[];
  supremum: number;
  showSupremum?: boolean;
  showProbes?: 'none' | 'right' | 'both';
  showCrossing?: boolean;
  broken?: boolean;
  caption: string;
}

function Scene({
  fn,
  pieces,
  supremum,
  showSupremum = true,
  showProbes = 'none',
  showCrossing = false,
  broken = false,
  caption,
}: SceneProps) {
  const first = pieces[0] as readonly [number, number];

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="A function crossing a level, with the last point at which it is still below"
      caption={caption}
    >
      <Axes plot={plot} xLabel="x" xTicks={[1, 2]} yTicks={[1, 2]} />

      {/* The level to be attained. */}
      <Segment
        from={plot.pt([plot.xDomain[0], LEVEL])}
        to={plot.pt([plot.xDomain[1], LEVEL])}
        tone="c"
        dashed
      />
      <Label
        at={[plot.x(plot.xDomain[1]), plot.y(LEVEL) - 12]}
        tone="c"
        size={14}
        weight={600}
        anchor="end"
      >
        c
      </Label>

      {/* The points where f is still below c, marked on the axis. */}
      <Segment
        from={plot.pt([first[0], -0.18])}
        to={plot.pt([supremum, -0.18])}
        tone="a"
        active
      />
      <Label at={[plot.x((first[0] + supremum) / 2), plot.y(-0.18) + 22]} tone="a" size={13}>
        S = where f ≤ c
      </Label>

      {pieces.map((piece, k) => (
        <Curve key={k} plot={plot} fn={fn} domain={piece} tone="accent" width={2.8} />
      ))}

      {showSupremum ? (
        <>
          <Segment
            from={plot.pt([supremum, plot.yDomain[0]])}
            to={plot.pt([supremum, plot.yDomain[1]])}
            tone="a"
            dashed
          />
          <Label
            at={[plot.x(supremum) + 8, plot.y(plot.yDomain[1]) + 10]}
            tone="a"
            size={14}
            weight={700}
            anchor="start"
          >
            s = sup S
          </Label>
        </>
      ) : null}

      {/* If f(s) were below c it would stay below just past s, so s would not
          bound S; if above, it would stay above just before s. */}
      {showProbes !== 'none' ? (
        <Probe plot={plot} fn={fn} at={supremum + 0.28} label="still below?" />
      ) : null}
      {showProbes === 'both' ? (
        <Probe plot={plot} fn={fn} at={supremum - 0.28} label="still above?" />
      ) : null}

      {showCrossing && !broken ? (
        <>
          <PointMark at={plot.pt([supremum, LEVEL])} tone="good" radius={6} active />
          <Label
            at={[plot.x(supremum), plot.y(LEVEL) - 20]}
            tone="good"
            size={14}
            weight={700}
          >
            f(s) = c
          </Label>
        </>
      ) : null}

      {broken ? (
        <>
          <PointMark at={plot.pt([supremum, LEVEL])} tone="warn" radius={6} hollow active />
          <Label
            at={[plot.x(supremum) + 12, plot.y(LEVEL) + 20]}
            tone="warn"
            size={14}
            weight={700}
            anchor="start"
          >
            never taken
          </Label>
        </>
      ) : null}
    </FigureFrame>
  );
}

function Probe({
  plot: p,
  fn,
  at,
  label,
}: {
  plot: Plot;
  fn: (x: number) => number;
  at: number;
  label: string;
}) {
  return (
    <g>
      <PointMark at={p.pt([at, fn(at)])} tone="b" radius={5} />
      <Label at={[p.x(at), p.y(fn(at)) - 16]} tone="b" size={13}>
        {label}
      </Label>
    </g>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'Collect the points where f has not yet reached the level.';
  if (i === 1) return 'That set has a last point, and the domain being unbroken keeps it inside.';
  if (i === 2) return 'If f were still below c there, it would stay below just past s — so s would not be the last one.';
  if (i === 3) return 'And if it were above, it would be above just before s, so S would end sooner.';
  return 'Neither is possible, so f(s) is exactly c. The crossing was never traced; it was cornered.';
}
