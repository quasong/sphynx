import type { Entry } from '../../types/entry';

/**
 * The first space in the library whose points are functions, and the first
 * complete one that is not a piece of ℝ.
 *
 * The proof is the Cauchy criterion run one level up: build the limit point by
 * point out of completeness of ℝ, then notice that the N the Cauchy condition
 * supplied was chosen before any x, so the convergence is uniform, so the limit
 * is continuous. Each earlier entry of the section is spent exactly once.
 *
 * Both hypotheses switch off. Compactness is only buying a finite distance —
 * worth saying, because it is easy to think it is holding completeness up. The
 * values being real is what completeness is actually spent on, and the
 * counterexample for it is ℚ again, reached through the intermediate value
 * theorem.
 */
export const continuousFunctionsComplete: Entry = {
  id: 'thm.continuous-functions-complete',
  kind: 'theorem',
  title: 'The continuous functions on a compact set form a complete space',
  statement: String.raw`
    K \text{ compact}, \; K \neq \varnothing, \qquad
    C(K) = \{ f : K \to \mathbb{R} \text{ continuous} \}, \qquad
    d_\infty(f, g) = \max_{x \in K} |f(x) - g(x)|
    \\[6pt]
    \Longrightarrow\; (C(K), d_\infty) \text{ is a complete metric space}
  `,
  informal:
    'A sequence of continuous functions that bunches up in the largest-gap distance converges, and what it converges to is still continuous. So the space has no holes, and every theorem that asks for a complete metric space — the fixed point theorem first among them — can now be handed a space whose points are functions.',
  tags: ['analysis', 'sequences of functions', 'metric spaces'],
  figureId: 'continuous-complete',
  hypotheses: [
    {
      id: 'compact',
      label: 'K is compact',
      statement: String.raw`\text{every sequence in } K \text{ has a subsequence converging in } K`,
      note: 'Makes the largest gap a number. |f − g| is continuous on K, so it attains a maximum — without that the distance can be infinite, and there is no metric space to ask the question of.',
      withoutIt: {
        summary: 'The largest gap need not be a number.',
        statement: String.raw`
          K = (0, 1], \quad f(x) = \tfrac{1}{x}, \quad g(x) = 0 :
          \quad \sup_{x \in K} |f(x) - g(x)| = \infty
        `,
        note: 'Both functions are continuous on K, and there is no largest gap between them. Note what is not failing: restrict to the continuous functions that are bounded and the same proof shows they form a complete space on any K. Compactness was never holding completeness up — only the distance.',
      },
    },
    {
      id: 'real',
      label: 'the values are real numbers',
      statement: String.raw`f : K \to \mathbb{R}, \text{ and } \mathbb{R} \text{ is complete}`,
      note: 'Gives each Cauchy sequence of values somewhere to converge to. The limit function is assembled out of those limits one point at a time, so every point of K spends the completeness of ℝ once.',
      withoutIt: {
        summary: 'Functions into ℚ inherit the hole at √2.',
        statement: String.raw`
          K = [0, 1], \quad f : K \to \mathbb{Q} \text{ continuous} \;\Longrightarrow\; f \text{ constant},
          \qquad f_n \equiv 1,\ \tfrac{3}{2},\ \tfrac{7}{5},\ \tfrac{17}{12},\ \ldots
        `,
        note: 'A continuous function on an interval that took two different rational values would take every real value between them, irrationals included — so a continuous function into ℚ is constant, and the space is a copy of ℚ itself. The constant functions approximating √2 are Cauchy in d∞, and the only candidate limit is the constant √2, which is not a function into ℚ.',
      },
    },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [String.raw`(f_n) \subset C(K)`],
    steps: [
      {
        id: 'metric',
        title: 'The largest gap is a distance',
        claim: String.raw`
          |f - g| \text{ continuous on } K \;\Longrightarrow\;
          d_\infty(f, g) = \max_{x \in K} |f(x) - g(x)| \in [0, \infty)
        `,
        note: 'The extreme value theorem makes the maximum exist, so the distance is a real number. The three axioms then hold pointwise and survive the maximum: a largest gap of zero means no gap anywhere, and the triangle inequality at each x bounds it at the worst x.',
        role: 'setup',
        reason: [
          { type: 'hypothesis', ref: 'compact' },
          { type: 'cite', ref: 'thm.extreme-value', note: 'read with “compact” for “closed and bounded”' },
          { type: 'cite', ref: 'def.compact' },
          { type: 'cite', ref: 'def.metric-space' },
        ],
        highlight: ['gap'],
      },
      {
        id: 'take',
        title: 'Take a Cauchy sequence of functions',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists N \;\; \forall m, n \ge N : \;
          d_\infty(f_n, f_m) < \varepsilon
        `,
        note: 'Terms that bunch up in the largest-gap distance: from N on, any two of them are within ε of each other at every point of K at once. Nothing yet is known to be the limit — producing one is the whole task.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'def.cauchy-sequence' },
          { type: 'step', ref: 'metric' },
        ],
        dependsOn: ['metric'],
        highlight: ['bunch'],
      },
      {
        id: 'pointwise',
        title: 'At each point, a Cauchy sequence of numbers',
        claim: String.raw`
          |f_n(x) - f_m(x)| \le d_\infty(f_n, f_m)
          \;\Longrightarrow\; (f_n(x)) \text{ is Cauchy in } \mathbb{R}
        `,
        note: 'A gap at one point is no larger than the largest gap. So fixing x turns the sequence of functions into a Cauchy sequence of real numbers, with the same N serving every x.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'take' },
          { type: 'cite', ref: 'def.cauchy-sequence' },
        ],
        dependsOn: ['take'],
        highlight: ['probe'],
      },
      {
        id: 'candidate',
        title: 'Completeness of ℝ builds the limit, one point at a time',
        claim: String.raw`f(x) = \lim_{n \to \infty} f_n(x) \quad \text{for each } x \in K`,
        note: 'Every one of those sequences converges, because ℝ is complete, and the limits define a function f on K. But only point by point: so far this is exactly the kind of convergence that let xⁿ lose its continuity, and nothing says f is in C(K) or that fₙ approaches it in d∞.',
        role: 'construction',
        reason: [
          { type: 'hypothesis', ref: 'real' },
          { type: 'cite', ref: 'thm.cauchy-criterion' },
          { type: 'step', ref: 'pointwise' },
        ],
        dependsOn: ['pointwise'],
        highlight: ['candidate'],
      },
      {
        id: 'uniform',
        title: 'The N was chosen before x, so the convergence is uniform',
        claim: String.raw`
          n, m \ge N : \; |f_n(x) - f_m(x)| < \varepsilon
          \;\xrightarrow{\; m \to \infty \;}\;
          |f_n(x) - f(x)| \le \varepsilon \quad \text{for every } x \in K
        `,
        note: 'Fix x and let m run off: the inequality survives in the limit, with ≤ in place of <. The N on the left was supplied by the Cauchy condition in d∞, before any x was named, so the same N works at every x — which is the definition of uniform convergence. This is the step xⁿ could not take: its convergence at each point came with no N that ignored the point.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'take' },
          { type: 'step', ref: 'candidate' },
          { type: 'cite', ref: 'def.sequence-limit', note: 'a bound on every term past N bounds the limit' },
          { type: 'cite', ref: 'def.uniform-convergence' },
        ],
        dependsOn: ['candidate', 'take'],
        highlight: ['tube'],
      },
      {
        id: 'continuous',
        title: 'So the limit is continuous',
        claim: String.raw`f_n \in C(K), \;\; f_n \to f \text{ uniformly} \;\Longrightarrow\; f \in C(K)`,
        note: 'The previous theorem, applied without change. It is the closedness it ended on doing its job: the Cauchy sequence has not converged to somewhere outside C(K).',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'uniform' },
          { type: 'cite', ref: 'thm.uniform-limit-continuous' },
        ],
        dependsOn: ['uniform'],
        highlight: ['limit'],
      },
      {
        id: 'conclude',
        title: 'And the sequence converges in C(K)',
        claim: String.raw`
          n \ge N \;\Longrightarrow\; d_\infty(f_n, f) \le \varepsilon,
          \qquad\text{so}\qquad f_n \to f \text{ in } (C(K), d_\infty)
        `,
        note: 'The bound from the uniform step, at the worst x, is a bound on the distance; ε was arbitrary. So every Cauchy sequence in C(K) converges to a point of C(K), and the space is complete. It is the first complete space in the library whose points are not numbers — which is what the fixed point theorem needs to be pointed at a differential equation, where the unknown is a function.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'uniform' },
          { type: 'step', ref: 'continuous' },
          { type: 'cite', ref: 'def.complete-metric-space' },
        ],
        dependsOn: ['uniform', 'continuous'],
        highlight: ['limit'],
      },
    ],
  },
};
