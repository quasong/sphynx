import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, Tube, createPlot } from './primitives/plot';
import { Label, PointMark, Segment } from './primitives/shapes';

/**
 * Equicontinuity as a shared δ across a family; Arzelà–Ascoli as extracting a
 * subsequence that settles into a tube. The runaway family is xⁿ again.
 */

const plot = createPlot({
  width: 430,
  height: 310,
  padding: { top: 26, right: 26, bottom: 36, left: 42 },
  xDomain: [-0.08, 1.12],
  yDomain: [-0.25, 1.35],
});

const K: readonly [number, number] = [0, 1];
const FAMILY = [1, 2, 4, 8, 16];
const power = (n: number) => (x: number) => x ** n;

/** Mildly oscillating family with a shared Lipschitz-like look. */
const mild = (n: number) => (x: number) => 0.45 + 0.2 * Math.sin(3 * x + 0.4 * n) + 0.08 * Math.sin(7 * x);
const LIMIT = (x: number) => 0.45 + 0.2 * Math.sin(3 * x) + 0.08 * Math.sin(7 * x);
const SUBSEQ = [0, 2, 4, 6, 8];

export function EquicontinuityFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  if (i <= 0) {
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="A family of continuous graphs, each with its own continuity radius"
        caption={equiCaption(i)}
      >
        <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
        {FAMILY.map((n) => (
          <Curve key={n} plot={plot} fn={power(n)} domain={K} tone="a" width={1.75} />
        ))}
        <Label at={[plot.x(0.02), plot.y(1.22)]} tone="neutral" size={13} anchor="start">
          each fₙ continuous on its own
        </Label>
      </FigureFrame>
    );
  }

  if (i === 1) {
    const a = 1 - 1 / 8;
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="xⁿ near 1: points close in the domain stay a fixed gap apart in the range"
        caption={equiCaption(i)}
      >
        <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
        {FAMILY.map((n) => (
          <Curve key={n} plot={plot} fn={power(n)} domain={K} tone="a" width={1.75} />
        ))}
        <Segment from={plot.pt([a, 0])} to={plot.pt([a, power(8)(a)])} tone="warn" dashed />
        <Segment from={plot.pt([1, 0])} to={plot.pt([1, 1])} tone="warn" dashed />
        <Segment from={plot.pt([a, power(8)(a)])} to={plot.pt([1, 1])} tone="warn" active />
        <PointMark at={plot.pt([a, power(8)(a)])} tone="warn" radius={4} />
        <PointMark at={plot.pt([1, 1])} tone="warn" radius={4} />
        <Label at={[plot.x(0.55), plot.y(0.85)]} tone="warn" size={13} weight={600}>
          gap refuses to shrink
        </Label>
      </FigureFrame>
    );
  }

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="An equicontinuous family: one δ keeps every graph inside a shared vertical window"
      caption={equiCaption(i)}
    >
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
      {SUBSEQ.map((n) => (
        <Curve key={n} plot={plot} fn={mild(n)} domain={K} tone="accent" width={2} />
      ))}
      <Segment from={plot.pt([0.4, 0])} to={plot.pt([0.4, 1.2])} tone="good" dashed />
      <Segment from={plot.pt([0.55, 0])} to={plot.pt([0.55, 1.2])} tone="good" dashed />
      <Label at={[plot.x(0.475), plot.y(1.22)]} tone="good" size={13} weight={600}>
        shared δ
      </Label>
      <Label at={[plot.x(0.02), plot.y(-0.08)]} tone="neutral" size={13} anchor="start">
        {i === 2 ? 'one δ for every f' : i === 3 ? 'a shared slope bound is enough' : 'equicontinuous'}
      </Label>
    </FigureFrame>
  );
}

export function ArzelaAscoliFigure({ stepIndex, dropped }: FigureProps) {
  if (dropped === 'equicontinuous') return <PowersCounterexample />;
  if (dropped === 'bounded') return <EscapeCounterexample />;

  const i = stepIndex;

  if (i <= 0) {
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="A countable dense set of probe points on the compact interval"
        caption={arzelaCaption(i)}
      >
        <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
        {SUBSEQ.map((n) => (
          <Curve key={n} plot={plot} fn={mild(n)} domain={K} tone="a" width={1.5} />
        ))}
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((q) => (
          <Segment key={q} from={plot.pt([q, 0])} to={plot.pt([q, 1.15])} tone="c" dashed muted />
        ))}
        <Label at={[plot.x(0.02), plot.y(1.22)]} tone="c" size={13} anchor="start">
          D dense in K
        </Label>
      </FigureFrame>
    );
  }

  if (i === 1) {
    const q = 0.35;
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="At each dense point the values are bounded, so a subsequence settles there"
        caption={arzelaCaption(i)}
      >
        <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
        {SUBSEQ.map((n) => (
          <Curve key={n} plot={plot} fn={mild(n)} domain={K} tone="a" width={1.5} />
        ))}
        <Segment from={plot.pt([q, 0])} to={plot.pt([q, 1.15])} tone="accent" dashed />
        {SUBSEQ.map((n) => (
          <PointMark key={n} at={plot.pt([q, mild(n)(q)])} tone="accent" radius={4} />
        ))}
        <Label at={[plot.x(q) + 10, plot.y(0.9)]} tone="accent" size={13} anchor="start">
          fₙ(q) bounded
        </Label>
      </FigureFrame>
    );
  }

  if (i === 2) {
    return (
      <FigureFrame
        viewBox={plot.viewBox}
        title="Equicontinuity spreads convergence on D to a uniform Cauchy condition on K"
        caption={arzelaCaption(i)}
      >
        <Tube plot={plot} fn={LIMIT} domain={K} half={0.12} />
        <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
        {SUBSEQ.slice(2).map((n) => (
          <Curve key={n} plot={plot} fn={mild(n)} domain={K} tone="accent" width={2} />
        ))}
        <Label at={[plot.x(0.02), plot.y(1.22)]} tone="good" size={13} anchor="start">
          uniformly Cauchy
        </Label>
      </FigureFrame>
    );
  }

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="Completeness of C(K) turns the Cauchy subsequence into a continuous uniform limit"
      caption={arzelaCaption(i)}
    >
      <Tube plot={plot} fn={LIMIT} domain={K} half={0.1} />
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
      {SUBSEQ.slice(3).map((n) => (
        <Curve key={n} plot={plot} fn={mild(n)} domain={K} tone="a" width={1.5} />
      ))}
      <Curve plot={plot} fn={LIMIT} domain={K} tone="good" width={3} />
      <Label at={[plot.x(0.72), plot.y(LIMIT(0.72)) - 14]} tone="good" size={14} weight={600}>
        f
      </Label>
    </FigureFrame>
  );
}

function PowersCounterexample() {
  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="Without equicontinuity: xⁿ is pointwise bounded but has no uniformly convergent subsequence"
      caption="Every subsequence converges pointwise to a jump; a uniform limit would have to be continuous."
    >
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
      {FAMILY.map((n) => (
        <Curve key={n} plot={plot} fn={power(n)} domain={K} tone="warn" width={2} />
      ))}
      <Curve
        plot={plot}
        fn={(x) => (x < 1 ? 0 : 1)}
        domain={K}
        tone="warn"
        width={2.5}
        dashed
        breaks={[1]}
      />
    </FigureFrame>
  );
}

function EscapeCounterexample() {
  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="Without pointwise bounds: flat graphs escaping to infinity"
      caption="Equicontinuous — every graph is level — yet d∞(fₙ, fₘ) = |n − m| never settles."
    >
      <Axes plot={plot} xTicks={[1]} yTicks={[1]} />
      {[0.2, 0.45, 0.7, 0.95, 1.2].map((h, n) => (
        <Curve key={n} plot={plot} fn={() => h} domain={K} tone="warn" width={2} />
      ))}
      <Label at={[plot.x(0.5), plot.y(1.22)]} tone="warn" size={13} weight={600}>
        fₙ ≡ n
      </Label>
    </FigureFrame>
  );
}

function equiCaption(i: number): string {
  if (i <= 0) return 'Continuity of each member allows δ to depend on which function you asked about.';
  if (i === 1) return 'Near 1 the graphs of xⁿ steepen without bound — no shared δ survives every n.';
  if (i === 2) return 'Move the quantifier: choose δ from ε alone, then demand it of every f in the family.';
  if (i === 3) return 'A uniform Lipschitz bound is the simplest source of a shared δ.';
  return 'Equicontinuity alone is not enough; Arzelà–Ascoli also needs the values not to blow up.';
}

function arzelaCaption(i: number): string {
  if (i <= 0) return 'Build the subsequence on a countable dense set first.';
  if (i === 1) return 'Pointwise bounds plus Bolzano–Weierstrass, applied diagonally at each qⱼ.';
  if (i === 2) return 'A shared δ and a finite net turn D-convergence into uniform Cauchy on K.';
  if (i === 3) return 'C(K) is complete, so a uniformly Cauchy sequence converges to a continuous limit.';
  return 'Every equicontinuous, pointwise bounded sequence in C(K) has a subsequence convergent in d∞.';
}
