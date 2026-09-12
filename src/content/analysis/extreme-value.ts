import type { Entry } from '../../types/entry';

/**
 * The first entry with switchable hypotheses.
 *
 * Chosen for that job because its three conditions are independent: each one
 * has a counterexample that satisfies the other two, so switching any of them
 * off isolates exactly what that condition was holding up. The proof cites them
 * by name, which is what lets the page mark the steps that stop working.
 */
export const extremeValue: Entry = {
  id: 'thm.extreme-value',
  kind: 'theorem',
  title: 'Extreme value theorem',
  statement: String.raw`
    K \subset \mathbb{R} \text{ closed and bounded},\; K \neq \varnothing,\;
    f : K \to \mathbb{R} \text{ continuous}
    \\[4pt]
    \Longrightarrow\;
    \exists\, p, q \in K : \; f(q) \le f(x) \le f(p) \quad \text{for all } x \in K
  `,
  informal:
    'A continuous function on a closed bounded set does not merely stay within bounds — it actually reaches its highest and lowest values, at points of the set. The gap between "has a supremum" and "attains a maximum" is the whole content of the theorem, and each of the three conditions is holding that gap shut on its own.',
  tags: ['analysis', 'compactness'],
  figureId: 'extreme-value',
  hypotheses: [
    {
      id: 'closed',
      label: 'K is closed',
      statement: String.raw`K \text{ contains all its limit points}`,
      note: 'Keeps the limit of a sequence from K inside K. Without it a sequence can converge to a point where f was never defined, and the value the function was climbing towards belongs to nobody.',
      withoutIt: {
        summary: 'The supremum sits at a missing endpoint.',
        statement: String.raw`K = (0,1), \quad f(x) = x, \quad \sup f(K) = 1 \notin f(K)`,
        note: 'Bounded and continuous, but the point where the maximum would be is not in K. The function climbs towards 1 and there is no last value: for every x there is a larger one still inside. Both ends fail at once — the minimum is missing too.',
      },
    },
    {
      id: 'bounded',
      label: 'K is bounded',
      statement: String.raw`\exists\, M : |x| \le M \text{ for all } x \in K`,
      note: 'Gives Bolzano–Weierstrass something to work with: a sequence confined to a finite stretch has to accumulate. Without it a sequence can walk off to infinity and never pile up anywhere.',
      withoutIt: {
        summary: 'Room to approach a bound forever without reaching it.',
        statement: String.raw`K = [0,\infty), \quad f(x) = \frac{x}{1+x}, \quad \sup f(K) = 1 \notin f(K)`,
        note: 'Note what is not going wrong here: f is continuous, K is closed, and f is even bounded. Only the set is infinite, and that alone is enough — the function approaches 1 along the whole of K and arrives nowhere.',
      },
    },
    {
      id: 'continuous',
      label: 'f is continuous',
      statement: String.raw`\forall \varepsilon > 0 \; \exists \delta > 0 : |x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon`,
      note: 'Transfers convergence from the domain to the values: if the points converge, so do their images. Without it the function can be climbing at every point of a convergent sequence and still be something else entirely at the limit.',
      withoutIt: {
        summary: 'The value at the limit point is not what the function was approaching.',
        statement: String.raw`K = [0,1], \quad f(x) = \begin{cases} x & x < 1 \\ 0 & x = 1 \end{cases}`,
        note: 'K is closed and bounded, so the sequence chasing the supremum converges to a point of K — but f throws the value away on arrival. The supremum is still 1 and no point of K is sent to it.',
      },
    },
  ],
  references: [{ label: 'Also called the Weierstrass extreme value theorem' }],
  timeline: {
    kind: 'proof',
    strategy: 'contradiction',
    given: [String.raw`K \neq \varnothing`],
    steps: [
      {
        id: 'target',
        title: 'What has to be produced',
        claim: String.raw`\text{a point } p \in K \text{ with } f(x) \le f(p) \;\; \forall x \in K`,
        note: 'Two separate things are needed: the values must be bounded above at all, and the least bound must be a value the function actually takes. They fail independently, and the proof establishes them in that order.',
        role: 'setup',
        reason: [{ type: 'construction', note: 'Split the claim into boundedness and attainment.' }],
        highlight: ['set'],
      },
      {
        id: 'suppose-unbounded',
        title: 'Suppose the values run off to infinity',
        claim: String.raw`\forall n \in \mathbb{N} \;\; \exists\, x_n \in K : \; f(x_n) > n`,
        note: 'If no real number bounds f above, then in particular no integer does — that is the Archimedean property doing quiet work. Choosing one such point for each n builds a sequence inside K.',
        role: 'assumption',
        reason: [
          { type: 'assumption', note: 'For contradiction, suppose f is unbounded above on K.' },
          { type: 'cite', ref: 'thm.archimedean-density', note: 'no real number exceeds every integer' },
        ],
        highlight: ['escape'],
      },
      {
        id: 'subsequence',
        title: 'Boundedness traps a subsequence',
        claim: String.raw`(x_n) \subset K \text{ bounded} \;\Longrightarrow\; x_{n_k} \to x`,
        note: 'The sequence may wander, but it cannot leave a finite stretch of the line, so some part of it has to settle down.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'bounded' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass' },
        ],
        dependsOn: ['suppose-unbounded'],
        highlight: ['escape'],
      },
      {
        id: 'limit-inside',
        title: 'Closedness keeps the limit in K',
        claim: String.raw`x \in K`,
        note: 'Without this the limit could sit just outside the set, where f says nothing at all and the next step would have nothing to evaluate.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'closed' },
          { type: 'cite', ref: 'def.closed-set' },
        ],
        dependsOn: ['subsequence'],
        highlight: ['limit'],
      },
      {
        id: 'collide',
        title: 'Continuity collides with the escape',
        claim: String.raw`f(x_{n_k}) \to f(x) \in \mathbb{R}
          \quad\text{but}\quad f(x_{n_k}) > n_k \to \infty`,
        note: 'A sequence of values cannot converge to a real number and exceed every integer at the same time. So the assumption was false: f is bounded above on K.',
        role: 'contradiction',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'step', ref: 'limit-inside' },
        ],
        dependsOn: ['limit-inside', 'suppose-unbounded'],
        highlight: ['escape', 'limit'],
      },
      {
        id: 'sup-exists',
        title: 'So the supremum exists',
        claim: String.raw`M = \sup f(K) \in \mathbb{R}`,
        note: 'A non-empty set of reals bounded above has a least upper bound. This is the point where completeness enters — over ℚ the argument would stop here.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'collide' },
          { type: 'cite', ref: 'ax.completeness' },
          { type: 'cite', ref: 'def.supremum' },
        ],
        dependsOn: ['collide'],
        highlight: ['sup'],
      },
      {
        id: 'chase',
        title: 'Chase the supremum',
        claim: String.raw`\forall n \;\; \exists\, y_n \in K : \; M - \tfrac{1}{n} < f(y_n) \le M`,
        note: 'M − 1/n is below the least upper bound, so it is not an upper bound: some value of f overtakes it. Clause (ii) of the definition is what makes this possible, and it is the only thing that distinguishes a supremum from any old bound.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'sup-exists' },
          { type: 'cite', ref: 'def.supremum', note: 'clause (ii): nothing below M bounds the set' },
        ],
        dependsOn: ['sup-exists'],
        highlight: ['sup', 'chase'],
      },
      {
        id: 'converge-again',
        title: 'The same two hypotheses, again',
        claim: String.raw`y_{n_k} \to q \quad\text{and}\quad q \in K`,
        note: 'Bounded gives the convergent subsequence, closed puts its limit back in K. Exactly the pair used to rule out the escape, now used to locate where the maximum must be.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'bounded' },
          { type: 'hypothesis', ref: 'closed' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass' },
        ],
        dependsOn: ['chase'],
        highlight: ['chase', 'limit'],
      },
      {
        id: 'attained',
        title: 'Continuity delivers the value',
        claim: String.raw`f(q) = \lim_k f(y_{n_k}) = M`,
        note: 'The values were squeezed up against M, so their limit is M; continuity says that limit is the value at the limit point. The supremum is not merely approached — it is taken, at q.',
        role: 'conclusion',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'step', ref: 'converge-again' },
          { type: 'step', ref: 'chase' },
        ],
        dependsOn: ['converge-again', 'chase'],
        highlight: ['max'],
      },
      {
        id: 'minimum',
        title: 'And the minimum, for free',
        claim: String.raw`-f \text{ is continuous on } K \;\Longrightarrow\; -f \text{ attains a maximum at some } p`,
        note: 'Flipping the sign turns the minimum of f into the maximum of −f, and −f satisfies exactly the same hypotheses. No second argument is needed.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'attained' },
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'algebra', note: 'min f = −max(−f).' },
        ],
        dependsOn: ['attained'],
        highlight: ['max', 'min'],
      },
    ],
  },
};
