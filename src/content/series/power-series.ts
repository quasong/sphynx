import type { Entry } from '../../types/entry';

/**
 * A power series is a series whose terms are scaled powers of (x − a). The
 * geometric series is the model; the Taylor series is the reason to care.
 */
export const powerSeries: Entry = {
  id: 'def.power-series',
  kind: 'definition',
  title: 'Power series',
  statement: String.raw`
    (c_n) \text{ a sequence}, \quad a \in \mathbb{R}
    \\[4pt]
    \sum_{n=0}^{\infty} c_n (x - a)^n
    \;\stackrel{\text{def}}{\iff}\;
    \text{the series whose } n\text{-th term is } c_n (x - a)^n
  `,
  informal:
    'An infinite polynomial centred at a: each term is a coefficient times a power of the offset from a. For a fixed x it is an ordinary series; the question is which x make the partial sums settle — and for many power series the answer is all x within some radius of a, then none beyond it.',
  tags: ['analysis', 'series'],
  figureId: 'power-series',
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 5.5' }],
  timeline: {
    kind: 'motivation',
    given: [String.raw`f \text{ differentiable at } a`],
    steps: [
      {
        id: 'polynomial',
        title: 'Start from the best polynomial approximation',
        claim: String.raw`
          P_n(x) = f(a) + f'(a)(x-a) + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n
        `,
        note: 'The Taylor polynomial matches f and its first n derivatives at a. It is the natural finite approximation — but a polynomial has only finitely many terms. If f is to be represented as a polynomial of unlimited degree, the approximation has to become an infinite sum.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.derivative', note: 'each coefficient is a derivative at a' }],
        highlight: ['polynomial'],
      },
      {
        id: 'pattern',
        title: 'Read the pattern as a series',
        claim: String.raw`
          \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}\,(x-a)^n
          \qquad\text{with}\qquad
          c_n = \frac{f^{(n)}(a)}{n!}
        `,
        note: 'Each term is a number times (x − a)^n. Fixing x turns this into an ordinary series; varying x turns it into a function — but only where the series converges.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'polynomial' },
          { type: 'cite', ref: 'def.series-convergence', note: 'convergence is tested at each x separately' },
        ],
        dependsOn: ['polynomial'],
        highlight: ['series'],
      },
      {
        id: 'geometric',
        title: 'The model: the geometric series is a power series',
        claim: String.raw`
          \sum_{n=0}^{\infty} x^n = \sum_{n=0}^{\infty} 1 \cdot x^n,
          \qquad |x| < 1
        `,
        note: 'Here a = 0 and c_n = 1. The partial sums have a closed form and converge exactly when |x| < 1 — not at the endpoints, where the tail sums fail the Cauchy test. This is the prototype: convergence inside an interval, divergence outside it.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'pattern' },
          { type: 'cite', ref: 'def.series-convergence' },
          { type: 'algebra', note: 'S_n = (1 − x^n)/(1 − x).' },
        ],
        dependsOn: ['pattern'],
        highlight: ['geometric', 'radius'],
      },
      {
        id: 'radius',
        title: 'Notice what the definition does not pin down',
        claim: String.raw`
          \text{convergence at a fixed } x \text{ says nothing about convergence at another } x
        `,
        note: 'A power series is a family of series, one per x. Whether they converge can change abruptly — the geometric series converges at |x| = 0.9 and diverges at |x| = 1.1. There is always a radius (possibly 0 or ∞) separating the two regimes; finding it is a separate theorem, not part of the definition.',
        role: 'observation',
        reason: [{ type: 'step', ref: 'geometric' }],
        dependsOn: ['geometric'],
        highlight: ['radius'],
      },
      {
        id: 'conclude',
        title: 'So a power series is a series of scaled powers',
        claim: String.raw`
          \sum_{n=0}^{\infty} c_n (x - a)^n
        `,
        note: 'The definition names the shape. Convergence is tested by the Cauchy tail criterion at each x; the Taylor theorem in the next entry asks when the power series built from the derivatives of f actually equals f — which is a statement about the remainder, not about the definition alone.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'pattern' },
          { type: 'cite', ref: 'thm.series-cauchy-criterion' },
        ],
        dependsOn: ['pattern', 'radius'],
        highlight: ['series'],
      },
    ],
  },
};
