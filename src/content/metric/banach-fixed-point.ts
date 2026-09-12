import type { Entry } from '../../types/entry';

/**
 * What the abstraction buys.
 *
 * The statement needs a complete metric space to be made at all, the proof
 * constructs its own Cauchy sequence rather than assuming one, and both
 * hypotheses fail in instructive ways - one of them in a way that is easy to
 * get wrong, since shrinking every distance is not the same as being a
 * contraction.
 */
export const banachFixedPoint: Entry = {
  id: 'thm.banach-fixed-point',
  kind: 'theorem',
  title: 'Banach fixed point theorem',
  statement: String.raw`
    (X,d) \text{ complete}, \; T : X \to X, \;
    d(Tx, Ty) \le k\, d(x,y) \ \text{ with } \ 0 \le k < 1
    \\[4pt]
    \Longrightarrow\;
    \exists!\, x^\ast \in X : \; T x^\ast = x^\ast,
    \quad\text{and}\quad T^n x_0 \to x^\ast \ \text{ for every } x_0
  `,
  informal:
    'A map that always shrinks distances by at least a fixed factor has exactly one point it leaves alone, and iterating from anywhere finds it. The proof is unusual in producing its answer rather than merely asserting it — start anywhere, apply the map repeatedly, and the orbit is forced to be Cauchy.',
  tags: ['analysis', 'metric spaces'],
  figureId: 'fixed-point',
  hypotheses: [
    {
      id: 'complete',
      label: 'the space is complete',
      statement: String.raw`\text{every Cauchy sequence in } X \text{ converges in } X`,
      note: 'The proof builds a Cauchy sequence out of the iterates and then needs somewhere for it to land. Without completeness it has manufactured a perfectly good sequence with nothing at the end of it.',
      withoutIt: {
        summary: 'The orbit converges on a point the space does not contain.',
        statement: String.raw`
          X = (0, 1], \quad T x = \tfrac{x}{2}, \quad k = \tfrac{1}{2},
          \quad \text{fixed point would be } 0 \notin X
        `,
        note: 'A genuine contraction, on a space that is simply missing one point. The iterates halve towards 0 and are Cauchy, and nothing in X is fixed. The same thing happens over ℚ with a map whose fixed point is irrational — which is the gap this library opened with, met again.',
      },
    },
    {
      id: 'contraction',
      label: 'distances shrink by a fixed factor',
      statement: String.raw`\exists\, k < 1 : \; d(Tx, Ty) \le k\, d(x,y) \quad \text{for all } x, y`,
      note: 'Not merely that T shortens every distance — that the factor is one constant, chosen before any pair of points is named. It is the same quantifier move as uniform continuity, and it is what makes the errors fall geometrically rather than merely decrease.',
      withoutIt: {
        summary: 'Shrinking every distance is not enough.',
        statement: String.raw`
          X = [1, \infty), \quad T x = x + \tfrac{1}{x} :
          \quad |Tx - Ty| < |x - y| \ \text{ always}, \ \text{ yet } \ Tx > x \ \text{ always}
        `,
        note: 'Complete, and T strictly shortens every distance — but the factor creeps up to 1 as x grows, so no single k < 1 covers the whole space. The orbit climbs away without bound and there is no fixed point at all. The uniformity is doing the work, not the shrinking.',
      },
    },
  ],
  references: [{ label: 'Banach (1922); the contraction mapping principle' }],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [String.raw`x_0 \in X \text{ arbitrary}`],
    steps: [
      {
        id: 'iterate',
        title: 'Start anywhere and apply T over and over',
        claim: String.raw`x_{n+1} = T x_n, \qquad n = 0, 1, 2, \dots`,
        note: 'No cleverness in the choice of x₀ — the theorem promises the same destination from every starting point, so the proof had better not depend on where it starts.',
        role: 'construction',
        reason: [{ type: 'construction', note: 'Iterate the map from an arbitrary point.' }],
        highlight: ['orbit'],
      },
      {
        id: 'geometric',
        title: 'Consecutive steps shrink geometrically',
        claim: String.raw`
          d(x_{n+1}, x_n) \le k\, d(x_n, x_{n-1}) \le \cdots \le k^{\,n} d(x_1, x_0)
        `,
        note: 'Each application of T scales the gap by at most k, and the same k every time. That is what turns a sequence of shrinking steps into a sequence of steps shrinking at a known rate.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'contraction' },
          { type: 'algebra', note: 'Induction on n.' },
        ],
        dependsOn: ['iterate'],
        highlight: ['orbit', 'steps'],
      },
      {
        id: 'cauchy',
        title: 'Which makes the orbit Cauchy',
        claim: String.raw`
          m > n : \quad d(x_m, x_n) \le \sum_{i=n}^{m-1} k^{\,i} d(x_1,x_0)
          \le \frac{k^{\,n}}{1-k}\, d(x_1, x_0) \;\longrightarrow\; 0
        `,
        note: 'The triangle inequality chains the steps together and the geometric series sums them. Here is where k < 1 is indispensable rather than merely convenient: at k = 1 the bound is a divergent sum, and the harmonic example from the Cauchy entry shows exactly how that can fail.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'contraction' },
          { type: 'cite', ref: 'def.metric-space', note: 'the triangle inequality, m − n times' },
          { type: 'cite', ref: 'def.cauchy-sequence' },
        ],
        dependsOn: ['geometric'],
        highlight: ['orbit', 'steps'],
      },
      {
        id: 'lands',
        title: 'And completeness gives it somewhere to land',
        claim: String.raw`x_n \to x^\ast \in X`,
        note: 'The proof has manufactured a Cauchy sequence out of nothing but the map. Whether that sequence has a limit is not a question about T at all — it is a question about the space, and this is the hypothesis that answers it.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'complete' },
          { type: 'cite', ref: 'def.complete-metric-space' },
        ],
        dependsOn: ['cauchy'],
        highlight: ['limit'],
      },
      {
        id: 'fixed',
        title: 'The limit is fixed by T',
        claim: String.raw`
          d(T x^\ast, x^\ast) \le d(T x^\ast, x_{n+1}) + d(x_{n+1}, x^\ast)
          \le k\, d(x^\ast, x_n) + d(x_{n+1}, x^\ast) \;\longrightarrow\; 0
        `,
        note: 'A contraction is continuous — it moves points less than they were moved to begin with — so it carries the orbit’s limit to the limit of the shifted orbit, which is the same point. A distance that is at most something tending to zero is zero, and only equal points are at distance zero.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'contraction' },
          { type: 'cite', ref: 'def.metric-space', note: 'axiom (i): distance zero means equal' },
          { type: 'step', ref: 'lands' },
        ],
        dependsOn: ['lands'],
        highlight: ['limit', 'fixed'],
      },
      {
        id: 'unique',
        title: 'And it is the only one',
        claim: String.raw`
          Tx = x, \; Ty = y \;\Longrightarrow\;
          d(x,y) = d(Tx, Ty) \le k\, d(x,y) \;\Longrightarrow\; (1-k)\, d(x,y) \le 0
        `,
        note: 'Since k < 1 the factor (1 − k) is positive, so the distance is zero and the two points coincide. Note that uniqueness needs no completeness and no iteration — it is one line, and it is where k < 1 rather than k ≤ 1 is doing visible work.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'contraction' },
          { type: 'cite', ref: 'def.metric-space', note: 'axiom (i) again' },
        ],
        dependsOn: ['fixed'],
        highlight: ['fixed'],
      },
      {
        id: 'conclude',
        title: 'So the map has exactly one fixed point, and iteration finds it',
        claim: String.raw`
          \exists!\, x^\ast : T x^\ast = x^\ast,
          \qquad d(x_n, x^\ast) \le \frac{k^{\,n}}{1-k}\, d(x_1, x_0)
        `,
        note: 'Unusually for this library, the proof is a recipe: it does not merely assert that a fixed point exists, it tells you how to compute one and how far off you are after n steps. That is why this theorem, rather than any of the existence results above it, is the one that gets used to solve differential equations.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'fixed' },
          { type: 'step', ref: 'unique' },
          { type: 'step', ref: 'cauchy' },
        ],
        dependsOn: ['fixed', 'unique'],
        highlight: ['fixed', 'orbit'],
      },
    ],
  },
};
