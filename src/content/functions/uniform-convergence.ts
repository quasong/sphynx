import type { Entry } from '../../types/entry';

/**
 * The quantifier move from uniform continuity, made a second time.
 *
 * Written as a motivation that runs parallel to that entry on purpose: a
 * quantity chosen per point (there δ, here N) runs away as the point nears an
 * edge, and the repair is to move the quantifier over points past it. Seeing
 * the same mechanism twice is the reason the library is organised the way it
 * is.
 *
 * Ends on the sup distance rather than on continuity of the limit, because
 * that is what carries the idea up: uniform convergence is convergence in a
 * metric, and the metric-space section then applies to functions as it stands.
 */
export const uniformConvergence: Entry = {
  id: 'def.uniform-convergence',
  kind: 'definition',
  title: 'Uniform convergence',
  statement: String.raw`
    f_n \to f \text{ uniformly on } A
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 \;\; \exists N \;\; \forall n \ge N \;\; \forall x \in A :
    \; |f_n(x) - f(x)| < \varepsilon
  `,
  informal:
    'One N that works at every point. Convergence at each point separately lets N be chosen after seeing which x you are asked about; uniform convergence asks for a single N good for the whole set at once — which is the same as asking that, from N on, the entire graph of fₙ lies inside a band of height ε around f. It is the move that separated continuity from uniform continuity, made again one level up.',
  tags: ['analysis', 'sequences of functions'],
  figureId: 'uniform-convergence',
  references: [
    {
      label:
        'Cauchy (1821) asserted that limits of continuous functions are continuous; Abel (1826) gave an exception, and Seidel and Stokes (1847) isolated the missing condition',
    },
  ],
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'pointwise',
        title: 'Start from convergence at every point',
        claim: String.raw`
          \forall x \in A \;\; \forall \varepsilon > 0 \;\; \exists N \;\; \forall n \ge N :
          \; |f_n(x) - f(x)| < \varepsilon
        `,
        note: 'The obvious meaning: fix x, and f₁(x), f₂(x), … is an ordinary sequence of numbers, which should converge to f(x). Read the order — x is fixed before N is chosen, so N may be tailored to the point as well as to the tolerance.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.sequence-limit', note: 'one ordinary sequence at each x' }],
        highlight: ['pointwise'],
      },
      {
        id: 'powers',
        title: 'And watch xⁿ on [0, 1]',
        claim: String.raw`
          f_n(x) = x^n \;\longrightarrow\;
          f(x) = \begin{cases} 0 & 0 \le x < 1 \\ 1 & x = 1 \end{cases}
        `,
        note: 'Every point below 1 is sent to 0 and the point 1 stays at 1. Every fₙ is a polynomial, as continuous as a function can be, and the limit has a jump. Convergence at each point has just let continuity fall out of the limit — the first sign that it asks for too little.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'pointwise' },
          {
            type: 'cite',
            ref: 'thm.monotone-convergence',
            note: 'for 0 < x < 1, −xⁿ increases and is bounded above by 0, so xⁿ has a limit L; and xⁿ⁺¹ = x · xⁿ forces L = xL, so L = 0',
          },
        ],
        dependsOn: ['pointwise'],
        highlight: ['powers'],
      },
      {
        id: 'runaway',
        title: 'The N it needs runs away as x approaches 1',
        claim: String.raw`
          0 < x < 1 : \quad
          x^n < \varepsilon \iff n > \frac{\ln(1/\varepsilon)}{\ln(1/x)}
          \;\longrightarrow\; \infty \ \text{ as } x \to 1^-
        `,
        note: 'Take ε = ½. At x = 0.5 the second term is already inside; at x = 0.9 it takes seven terms; at x = 0.99, sixty-nine. Every point has an N, and there is no largest one. This is the failure 1/x showed for continuity — a quantity chosen per point that runs away as the point nears an edge — with N in place of δ.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'powers' },
          { type: 'algebra', note: 'Take logarithms; ln x < 0 turns the inequality round.' },
        ],
        dependsOn: ['powers'],
        highlight: ['runaway'],
      },
      {
        id: 'demand',
        title: 'So demand one N for the whole set',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists N \;\; \forall n \ge N \;\; \forall x \in A :
          \; |f_n(x) - f(x)| < \varepsilon
        `,
        note: 'Only one thing moved: the quantifier over points now comes after ∃N instead of before it. N is chosen knowing ε and nothing else, and must then serve every x in A at once.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'runaway' },
          { type: 'cite', ref: 'def.uniform-continuity', note: 'the same quantifier, moved the same way' },
        ],
        dependsOn: ['runaway'],
        highlight: ['band'],
      },
      {
        id: 'band',
        title: 'Which is a band around the whole graph',
        claim: String.raw`
          f_n \to f \text{ uniformly on } A
          \quad\iff\quad
          \sup_{x \in A} \, |f_n(x) - f(x)| \;\longrightarrow\; 0
        `,
        note: 'Draw the tolerance as a band of height ε above and below the graph of f. Convergence at each point says that on every vertical line, fₙ eventually stays inside the band; uniform convergence says that from some N on, the whole graph of fₙ does. Measured that way, one number says how far fₙ is from f — the largest gap anywhere — and uniform convergence is that number tending to 0.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'demand' },
          { type: 'cite', ref: 'def.supremum', note: 'every gap below ε puts the largest at most ε' },
          { type: 'cite', ref: 'def.sequence-limit' },
        ],
        dependsOn: ['demand'],
        highlight: ['band'],
      },
      {
        id: 'witness',
        title: 'xⁿ never gets inside',
        claim: String.raw`
          x_n = 2^{-1/n} \in [0, 1) : \quad
          x_n^{\,n} = \tfrac{1}{2}, \quad f(x_n) = 0,
          \quad\text{so}\quad \sup_{x \in [0,1]} |x^n - f(x)| \ge \tfrac{1}{2} \ \text{ for every } n
        `,
        note: 'However large n is, there is a point just left of 1 where xⁿ is still exactly ½ and the limit is 0. So the graph always reaches the edge of a band of height ½, and for ε = ½ no N works: xⁿ converges on [0, 1] at every point, and not uniformly. One example is enough to show the new definition asks for strictly more.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'band' },
          { type: 'algebra', note: 'Raising 2 to the power −1/n and then to the n gives 2⁻¹ = ½.' },
        ],
        dependsOn: ['band'],
        highlight: ['witness'],
      },
      {
        id: 'distance',
        title: 'And the largest gap is a distance',
        claim: String.raw`
          d_\infty(f, g) = \sup_{x \in A} |f(x) - g(x)|,
          \qquad
          f_n \to f \text{ uniformly} \iff d_\infty(f_n, f) \to 0
        `,
        note: 'On functions bounded on A the largest gap satisfies all three axioms — the triangle inequality holds at each x, so it holds for the supremum — and uniform convergence is word for word convergence in it. Convergence at each point has no single number of this kind to offer; it is a separate statement at every x. That is what makes the distinction worth a name: uniform convergence turns a sequence of functions into a sequence of points in a metric space, and everything the previous section said about such sequences now applies to functions.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'witness' },
          { type: 'cite', ref: 'def.metric-space' },
          { type: 'cite', ref: 'def.sequence-limit', note: 'd(aₙ, L) < ε, read with functions for points' },
        ],
        dependsOn: ['witness'],
        highlight: ['distance'],
      },
    ],
  },
};
