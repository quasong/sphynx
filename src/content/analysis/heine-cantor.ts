import type { Entry } from '../../types/entry';

/**
 * What compactness buys, stated as plainly as it can be: on a closed bounded
 * set the difference between continuity and uniform continuity disappears.
 *
 * The proof is by contradiction through Bolzano–Weierstrass, so it leans on the
 * sequences module rather than restating it - and each of the three hypotheses
 * enters at a different, visible point.
 */
export const heineCantor: Entry = {
  id: 'thm.heine-cantor',
  kind: 'theorem',
  title: 'Continuous on a compact set is uniformly continuous',
  statement: String.raw`
    K \subset \mathbb{R} \text{ closed and bounded}, \;
    f : K \to \mathbb{R} \text{ continuous}
    \;\Longrightarrow\;
    f \text{ is uniformly continuous on } K
  `,
  informal:
    'The gap the previous entry opened closes again as soon as the domain is compact. Nothing about f changes — the same function that needs ever smaller radii on an open interval needs only one on a closed bounded one, because there is nowhere left for the bad points to escape to.',
  tags: ['analysis', 'compactness', 'continuity'],
  figureId: 'heine-cantor',
  hypotheses: [
    {
      id: 'closed',
      label: 'K is closed',
      statement: String.raw`K \text{ contains all its limit points}`,
      note: 'Keeps the point the bad pairs are converging on inside K, where f is defined and continuous. Without it they can crowd towards a place the function never reaches.',
      withoutIt: {
        summary: 'The bad pairs pile up at a point that is not there.',
        statement: String.raw`K = (0, 2), \quad f(x) = \tfrac{1}{x}`,
        note: 'Bounded and continuous, and the radius that works collapses as x₀ approaches 0. The trouble is at a point the set does not contain, so there is no continuity at that point to appeal to — the proof would converge on a hole.',
      },
    },
    {
      id: 'bounded',
      label: 'K is bounded',
      statement: String.raw`\exists M : \; |x| \le M \text{ for all } x \in K`,
      note: 'Gives Bolzano–Weierstrass something to work with, so the bad pairs have to accumulate somewhere rather than walking away.',
      withoutIt: {
        summary: 'The bad pairs escape instead of accumulating.',
        statement: String.raw`K = [0, \infty), \quad f(x) = x^2, \quad |x^2 - y^2| = |x - y|\,|x + y|`,
        note: 'Closed and continuous. But taking x and y a fixed small distance apart and sliding both off to infinity makes |x + y| arbitrarily large, so the outputs separate however close the inputs are. The failure is at the far end rather than at a missing point.',
      },
    },
    {
      id: 'continuous',
      label: 'f is continuous',
      statement: String.raw`f \text{ is continuous at every point of } K`,
      note: 'Transfers convergence of the points to convergence of the values, which is what collapses the gap the contradiction needs.',
      withoutIt: {
        summary: 'Nothing to collapse: a jump defeats every radius at once.',
        statement: String.raw`K = [\tfrac{1}{2}, 2], \quad f(x) = \begin{cases} 1 & x < 1 \\ 2 & x \ge 1 \end{cases}`,
        note: 'This is the one hypothesis whose removal is not a surprise: uniform continuity is a strengthening of continuity, so dropping continuity cannot leave it standing. Worth switching off anyway — it shows which single step of the proof is carrying that weight, and it is not the one most readers would guess.',
      },
    },
  ],
  source: { work: 'Sphynx', locator: 'Compactness, 3' },
  references: [{ label: 'Heine (1872), after Dirichlet; also called the Heine–Cantor theorem' }],
  timeline: {
    kind: 'proof',
    strategy: 'contradiction',
    given: [String.raw`K \neq \varnothing`],
    steps: [
      {
        id: 'negate',
        title: 'Suppose one radius never suffices',
        claim: String.raw`
          \exists\, \varepsilon_0 > 0 \;\; \forall \delta > 0 \;\; \exists\, x, y \in K :
          \; |x - y| < \delta \ \text{ and } \ |f(x) - f(y)| \ge \varepsilon_0
        `,
        note: 'The negation of uniform continuity, written out. Note where the existential lands: one bad tolerance ε₀, and for every candidate radius a pair of points that defeats it.',
        role: 'assumption',
        reason: [
          { type: 'assumption', note: 'For contradiction, suppose f is not uniformly continuous.' },
          { type: 'cite', ref: 'def.uniform-continuity' },
        ],
        highlight: ['pairs'],
      },
      {
        id: 'sequences',
        title: 'Take δ = 1/n and collect the pairs',
        claim: String.raw`
          x_n, y_n \in K : \quad |x_n - y_n| < \tfrac{1}{n}
          \quad\text{and}\quad |f(x_n) - f(y_n)| \ge \varepsilon_0
        `,
        note: 'Every radius fails, so in particular every 1/n does. That turns a statement about all δ into two sequences — which is the move that makes the machinery of the previous section applicable.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'negate' },
          { type: 'cite', ref: 'def.sequence-limit', note: '1/n → 0, so the pairs close up' },
        ],
        dependsOn: ['negate'],
        highlight: ['pairs'],
      },
      {
        id: 'subsequence',
        title: 'Boundedness makes them accumulate',
        claim: String.raw`(x_n) \subset K \text{ bounded} \;\Longrightarrow\; x_{n_k} \to x`,
        note: 'The bad points cannot all run away, so some part of them settles.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'bounded' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass' },
        ],
        dependsOn: ['sequences'],
        highlight: ['accumulate'],
      },
      {
        id: 'inside',
        title: 'Closedness puts the limit in K',
        claim: String.raw`x \in K`,
        note: 'Without this the argument converges on a point where f says nothing, and the next step has no continuity to invoke.',
        role: 'derivation',
        reason: [{ type: 'hypothesis', ref: 'closed' }],
        dependsOn: ['subsequence'],
        highlight: ['accumulate'],
      },
      {
        id: 'partner',
        title: 'The partners follow',
        claim: String.raw`
          |y_{n_k} - x| \le |y_{n_k} - x_{n_k}| + |x_{n_k} - x| < \tfrac{1}{n_k} + |x_{n_k} - x| \to 0
        `,
        note: 'The two sequences were built to close up on each other, so whatever one converges to the other converges to as well. Both are now bearing down on the same point of K.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'sequences' },
          { type: 'step', ref: 'subsequence' },
          { type: 'cite', ref: 'def.sequence-limit' },
        ],
        dependsOn: ['subsequence', 'sequences'],
        highlight: ['accumulate'],
      },
      {
        id: 'values',
        title: 'Continuity drags both sets of values to the same place',
        claim: String.raw`f(x_{n_k}) \to f(x) \quad \text{and} \quad f(y_{n_k}) \to f(x)`,
        note: 'Given ε, continuity at x supplies a δ, and convergence supplies a point past which both sequences are within δ of x — so both sets of values are eventually within ε of f(x). This is the ε–δ definition and the ε–N definition used together, one after the other.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta' },
          { type: 'step', ref: 'inside' },
          { type: 'step', ref: 'partner' },
        ],
        dependsOn: ['inside', 'partner'],
        highlight: ['values'],
      },
      {
        id: 'collide',
        title: 'Which the pairs were forbidden to do',
        claim: String.raw`
          |f(x_{n_k}) - f(y_{n_k})| \le |f(x_{n_k}) - f(x)| + |f(x) - f(y_{n_k})| \;\longrightarrow\; 0
          \quad\text{yet}\quad \ge \varepsilon_0
        `,
        note: 'A quantity pinned at or above ε₀ cannot also tend to zero. The assumption is therefore false.',
        role: 'contradiction',
        reason: [
          { type: 'step', ref: 'values' },
          { type: 'step', ref: 'sequences' },
          { type: 'algebra', note: 'Triangle inequality, then let k grow.' },
        ],
        dependsOn: ['values', 'sequences'],
        highlight: ['values', 'violation'],
      },
      {
        id: 'conclude',
        title: 'So one radius does suffice',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall x, y \in K :
          \; |x - y| < \delta \Rightarrow |f(x) - f(y)| < \varepsilon
        `,
        note: 'Note what the proof never does: it does not produce the δ. It shows that no ε can defeat every candidate, which is enough — and is why the theorem says nothing about how small the radius has to be.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'collide' },
          { type: 'cite', ref: 'def.uniform-continuity' },
        ],
        dependsOn: ['collide'],
        highlight: ['uniform'],
      },
    ],
  },
};
