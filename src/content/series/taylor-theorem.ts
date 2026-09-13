import type { Entry } from '../../types/entry';

/**
 * Taylor's theorem with Lagrange remainder. The proof is Rolle's theorem
 * applied repeatedly to an auxiliary function whose first n derivatives
 * vanish at a — which is the mean value theorem in the case n = 0.
 */
export const taylorTheorem: Entry = {
  id: 'thm.taylor-theorem',
  kind: 'theorem',
  title: "Taylor's theorem",
  statement: String.raw`
    f : [a, b] \to \mathbb{R} \text{ continuous}, \quad
    f^{(k)} \text{ continuous on } [a,b] \ (1 \le k \le n), \quad
    f^{(n+1)} \text{ exists on } (a, b),
    \\[4pt]
    f(b) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(b-a)^k
    + \frac{f^{(n+1)}(c)}{(n+1)!}(b-a)^{n+1}
    \quad \text{for some } c \in (a, b)
  `,
  informal:
    'The Taylor polynomial matches f and its first n derivatives at a; the theorem says what is left over. The remainder is a single term involving one value of the (n + 1)st derivative somewhere between a and b — which is exactly what the mean value theorem says when n = 0, and what repeated applications of Rolle\u2019s theorem produce for larger n.',
  tags: ['analysis', 'series', 'differentiation'],
  figureId: 'taylor-theorem',
  hypotheses: [
    {
      id: 'derivatives',
      label: 'intermediate derivatives are continuous; next derivative exists inside',
      statement: String.raw`f^{(k)} \text{ is continuous on } [a,b] \ (1 \le k \le n), \quad f^{(n+1)}(x) \text{ exists for } x \in (a,b)`,
      note: 'Each repeated application of Rolle needs the current derivative to be continuous on its closed subinterval and the next derivative to exist inside. For n = 0 the first clause is empty and this is exactly the mean value theorem hypothesis.',
      withoutIt: {
        summary: 'A corner blocks the next derivative.',
        statement: String.raw`
          f(x) = |x| \text{ on } [-1, 1], \quad a = -1, \ b = 1, \ n = 0 :
          \quad f'(x) = \pm 1 \text{ for } x \neq 0, \text{ undefined at } 0
        `,
        note: 'The n = 0 conclusion is the mean value theorem, which already needs differentiability on (a, b). Here the chord has slope 0 but no interior point has derivative 0 — because f is not differentiable at the one place a level tangent would have to sit.',
      },
    },
    {
      id: 'continuous',
      label: 'f is continuous on [a, b]',
      statement: String.raw`f \text{ is continuous at every point of } [a, b]`,
      note: 'Rolle and the mean value theorem need continuity on the closed interval so that an interior extremum exists. Without it the auxiliary function can climb towards a jump at an endpoint.',
      withoutIt: {
        summary: 'The polynomial matches the ends; the graph jumps between them.',
        statement: String.raw`
          f(x) = \begin{cases} 0 & x \in [0, 1) \\ 1 & x = 1 \end{cases},
          \quad a = 0, \ b = 1, \ n = 0
        `,
        note: 'Differentiable on (0, 1) with derivative 0 throughout, yet f(1) − f(0) = 1. The mean value theorem fails for the same reason as in its own counterexample: continuity at the endpoint is load-bearing.',
      },
    },
  ],
  references: [
    { label: 'Taylor (1715); Lagrange (1797) for the remainder form' },
    { label: 'Rudin, Principles of Mathematical Analysis, 5.15' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [String.raw`a < b`, String.raw`n \ge 0`],
    steps: [
      {
        id: 'polynomial',
        title: 'Write the Taylor polynomial and the remainder',
        claim: String.raw`
          P_n(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^k,
          \qquad R_n(x) = f(x) - P_n(x)
        `,
        note: 'P_n is the degree-n polynomial that matches f and its first n derivatives at a. Everything the theorem claims is a statement about R_n(b): the value f(b) minus what the polynomial predicts.',
        role: 'construction',
        reason: [{ type: 'cite', ref: 'def.power-series', note: 'P_n is the initial segment of the Taylor series' }],
        highlight: ['polynomial'],
      },
      {
        id: 'auxiliary',
        title: 'Build an auxiliary function that vanishes at both ends',
        claim: String.raw`
          \varphi(x) = R_n(x) - \frac{R_n(b)}{(b-a)^{n+1}}(x-a)^{n+1},
          \qquad \varphi^{(k)}(a)=0 \ (0 \le k \le n), \quad \varphi(b)=0
        `,
        note: 'Subtract a multiple of (x − a)^{n+1}. The remainder and its first n derivatives vanish at a, so φ does too through order n; the coefficient cancels R_n(b) at b.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'polynomial' },
          { type: 'hypothesis', ref: 'derivatives' },
          { type: 'algebra', note: 'Evaluate derivatives at a and the function at b.' },
        ],
        dependsOn: ['polynomial'],
        highlight: ['auxiliary'],
      },
      {
        id: 'rolle',
        title: 'Apply Rolle repeatedly to peel off powers',
        claim: String.raw`
          \varphi^{(k)}(a)=0 \ (0 \le k \le n), \quad \varphi(b)=0
          \;\Longrightarrow\;
          \exists\, \xi \in (a,b) : \varphi^{(n+1)}(\xi)=0
        `,
        note: 'Rolle gives a zero of φ′ between a and b. Since φ′ is also zero at a, apply Rolle on [a,c₁] to get a zero of φ″; repeat. After n + 1 applications, the final zero is φ^(n+1)(ξ). When n = 0 this is one direct application of Rolle.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'derivatives' },
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.mean-value', note: 'Rolle is the case f(a) = f(b)' },
          { type: 'step', ref: 'auxiliary' },
        ],
        dependsOn: ['auxiliary'],
        highlight: ['rolle'],
      },
      {
        id: 'nth',
        title: 'At the last zero, read off the remainder',
        claim: String.raw`
          \varphi^{(n+1)}(x) = f^{(n+1)}(x) - \frac{(n+1)!}{(b-a)^{n+1}} R_n(b),
          \qquad \varphi^{(n+1)}(\xi)=0
          \;\Longrightarrow\;
          R_n(b) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(b-a)^{n+1}
        `,
        note: 'P_n is a polynomial of degree n, so its (n + 1)st derivative vanishes. Differentiating φ n + 1 times and evaluating at the zero ξ supplied by repeated Rolle gives the Lagrange remainder.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'rolle' },
          { type: 'hypothesis', ref: 'derivatives' },
          { type: 'algebra', note: 'Differentiate φ and solve at ξ.' },
        ],
        dependsOn: ['rolle'],
        highlight: ['remainder'],
      },
      {
        id: 'conclude',
        title: 'So f equals its Taylor polynomial plus one correction term',
        claim: String.raw`
          f(b) = P_n(b) + R_n(b)
          = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(b-a)^k
          + \frac{f^{(n+1)}(\xi)}{(n+1)!}(b-a)^{n+1}
        `,
        note: 'The remainder controls how far the Taylor polynomial misses f. If f^{(n+1)} is bounded on [a, b], the remainder shrinks like (b − a)^{n+1} as the interval narrows — which is why taking more terms improves the approximation, and why the power series converges when the remainders vanish.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'polynomial' },
          { type: 'step', ref: 'nth' },
        ],
        dependsOn: ['polynomial', 'nth'],
        highlight: ['polynomial', 'remainder'],
      },
    ],
  },
};
