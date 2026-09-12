import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import { Axes, Curve, Lattice, createPlot } from './primitives/plot';
import type { Pt } from './primitives/shapes';
import { Arrow, Label, PointMark, Segment } from './primitives/shapes';

/**
 * The proof read geometrically.
 *
 * A fraction p/q equal to sqrt(2) is the same thing as a lattice point (q, p)
 * on the line y = sqrt(2) x. The figure draws that line over the integer grid
 * and follows the assumption: the point is marked hollow because the proof is
 * about to show that it cannot exist, and halving it produces a smaller point
 * with the same property - which is what "lowest terms" forbids.
 */

const ROOT2 = Math.SQRT2;
const Q = 8; // the hypothetical denominator, chosen so three halvings stay visible

const plot = createPlot({
  width: 400,
  height: 440,
  padding: { top: 26, right: 30, bottom: 36, left: 44 },
  xDomain: [0, 10],
  yDomain: [0, 13],
});

/** The assumed lattice point and the chain produced by halving it. */
const CHAIN: readonly Pt[] = [
  [Q, Q * ROOT2],
  [Q / 2, (Q / 2) * ROOT2],
  [Q / 4, (Q / 4) * ROOT2],
  [Q / 8, (Q / 8) * ROOT2],
];

export function Sqrt2Figure({ stepIndex, highlight }: FigureProps) {
  const i = stepIndex;
  const on = (key: string) => highlight.includes(key);

  const head = CHAIN[0] as Pt;
  const halved = CHAIN[1] as Pt;
  const origin = plot.pt([0, 0]);
  const headPx = plot.pt(head);

  const showCandidate = i >= 0;
  const showGuides = i >= 1;
  const showHalved = i >= 6;
  const showDescent = i >= 7;

  return (
    <FigureFrame
      viewBox={plot.viewBox}
      title="The line y = x·√2 drawn over the integer lattice, with the hypothetical lattice point the proof assumes"
      caption={captionFor(i)}
    >
      <Lattice plot={plot} xRange={[0, 10]} yRange={[0, 13]} />
      {/* The axes carry numbers only: p and q are named on the guides below,
          and repeating them on the axes just crowds the corner. */}
      <Axes plot={plot} xTicks={[2, 4, 6, 8, 10]} yTicks={[2, 4, 6, 8, 10, 12]} />

      {/* Every point on this line has p/q = √2; the proof shows none of them is a lattice point. */}
      <Curve
        plot={plot}
        fn={(x) => ROOT2 * x}
        domain={[0, 13 / ROOT2]}
        tone="c"
        width={on('line') ? 3.5 : 2.5}
      />
      <Label at={[plot.x(3) - 10, plot.y(3 * ROOT2) - 6]} tone="c" size={15} anchor="end">
        p = √2·q
      </Label>

      {showGuides ? (
        <>
          <Segment
            from={[plot.x(0), headPx[1]]}
            to={headPx}
            tone="b"
            dashed
            label="p"
            labelGap={-16}
            active={on('p-even')}
            muted={on('q-even')}
          />
          <Segment
            from={[headPx[0], plot.y(0)]}
            to={headPx}
            tone="a"
            dashed
            label="q"
            labelGap={-16}
            active={on('q-even')}
            muted={on('p-even')}
          />
        </>
      ) : null}

      {/* Hollow, because this point is assumed rather than exhibited. */}
      {showCandidate ? (
        <>
          <PointMark at={headPx} tone="accent" radius={6} hollow active={on('candidate')} />
          <Label at={[headPx[0] + 12, headPx[1] - 16]} tone="accent" size={15} anchor="start">
            (q, p)
          </Label>
        </>
      ) : null}

      {i >= 3 ? (
        <Label at={[plot.x(0) + 8, headPx[1] - 18]} tone="b" size={14} anchor="start" active={on('p-even')}>
          p is even
        </Label>
      ) : null}
      {i >= 5 ? (
        <Label at={[headPx[0] + 8, plot.y(0) - 16]} tone="a" size={14} anchor="start" active={on('q-even')}>
          q is even
        </Label>
      ) : null}

      {showHalved ? (
        <>
          <Arrow from={headPx} to={plot.pt(halved)} tone="warn" active={on('halved')} />
          <PointMark at={plot.pt(halved)} tone="warn" radius={5} hollow active={on('halved')} />
          <Label
            at={[plot.pt(halved)[0] + 12, plot.pt(halved)[1] - 14]}
            tone="warn"
            size={14}
            anchor="start"
          >
            (q/2, p/2)
          </Label>
        </>
      ) : null}

      {showDescent ? (
        <g className="is-ghost">
          {CHAIN.slice(2).map((point, idx) => (
            <PointMark key={idx} at={plot.pt(point)} tone="warn" radius={4} hollow />
          ))}
          <Arrow from={plot.pt(halved)} to={[origin[0] + 10, origin[1] - 14]} tone="warn" />
          <Label at={[plot.x(2.6), plot.y(1.2)]} tone="warn" size={14} anchor="start">
            smaller, forever
          </Label>
        </g>
      ) : null}
    </FigureFrame>
  );
}

function captionFor(i: number): string {
  if (i <= 0) {
    return 'A fraction p/q equal to √2 is a lattice point (q, p) on this line. It is drawn hollow: the proof assumes it, and will refute it.';
  }
  if (i === 1 || i === 2) return 'The coordinates of that point are the numerator and denominator.';
  if (i === 3 || i === 4) return 'The height p is forced to be even.';
  if (i === 5) return 'And so is the width q — both coordinates are even.';
  if (i === 6) return 'Halving both coordinates lands on the line again, at a strictly smaller lattice point.';
  return 'Which could be halved again, and again. No lattice point but the origin lies on this line.';
}
