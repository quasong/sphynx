import type { Entry } from '../../types/entry';

/**
 * Grönwall's inequality: the integral estimate that turns a local error bound
 * into an exponential one. It is the comparison principle behind uniqueness
 * and continuous dependence for differential equations.
 */
export const gronwall: Entry = {
  id: 'thm.gronwall',
  kind: 'theorem',
  title: "Grönwall's inequality",
  statement: String.raw`
    a < b, \quad u : [a,b] \to \mathbb{R} \text{ continuous}, \quad C,L \ge 0,
    \\[4pt]
    |u(t)| \le C + L \int_a^t |u(s)|\,ds \quad (t \in [a,b])
    \;\Longrightarrow\;
    |u(t)| \le C\,e^{L(t-a)} \quad (t \in [a,b])
  `,
  informal:
    'If an error is no larger than a fixed starting error plus a constant times the accumulated error so far, it can grow at most exponentially. When the starting error is zero, the error stays zero — the estimate that turns an integral equation into uniqueness and stability for an ODE.',
  tags: ['analysis', 'integration', 'differential equations'],
  figureId: 'gronwall',
  hypotheses: [
    {
      id: 'continuous',
      label: 'u is continuous on [a, b]',
      statement: String.raw`u \text{ is continuous at every point of } [a,b]`,
      note: 'Makes |u| integrable and the comparison function differentiable. Without it the integral used to define the comparison function may not exist in the Riemann theory developed here.',
      withoutIt: {
        summary: 'The comparison function cannot be formed from a non-integrable error.',
        statement: String.raw`
          u(t) = \begin{cases} 1 & t \in \mathbb{Q} \\ 0 & t \notin \mathbb{Q} \end{cases}
          \quad\text{on } [0,1] :
          \qquad \int_0^t |u(s)|\,ds \text{ is not defined in the Riemann sense}
        `,
        note: 'The estimate is an integral estimate, so the proof needs |u| to be integrable. This bounded function is discontinuous everywhere and its upper and lower sums never meet; the comparison function v(t) = C + L∫₀ᵗ|u| cannot be introduced by the theory available here.',
      },
    },
  ],
  references: [
    { label: 'Grönwall (1919), "Note on the derivatives with respect to a parameter of the solutions of a system of differential equations"' },
    { label: 'Jiří Lebl, Basic Analysis, §7.6', url: 'https://www.jirka.org/ra/html/sec_metpicard.html' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`a < b`, String.raw`C,L \ge 0`, String.raw`t \in [a,b]`],
    steps: [
      {
        id: 'comparison',
        title: 'Replace the unknown by its accumulated bound',
        claim: String.raw`
          v(t) = C + L\int_a^t |u(s)|\,ds,
          \qquad |u(t)| \le v(t), \qquad v(a)=C
        `,
        note: 'The hypothesis already says |u| lies below this new function v. Continuity of u makes |u| continuous, so the fundamental theorem says v is differentiable in the interior and v′(t)=L|u(t)|.',
        role: 'construction',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.fundamental-calculus' },
          { type: 'algebra', note: 'Name the right-hand side of the assumed inequality v.' },
        ],
        highlight: ['comparison'],
      },
      {
        id: 'factor',
        title: 'Remove the possible exponential growth',
        claim: String.raw`
          w(t) = e^{-L(t-a)}v(t),
          \qquad
          w'(t) = e^{-L(t-a)}L\bigl(|u(t)|-v(t)\bigr) \le 0
        `,
        note: 'The factor e^{-L(t−a)} is chosen to cancel the Lv term when the product is differentiated. Since |u|≤v, the derivative of w is non-positive: after discounting exponential growth, the comparison function can only fall.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'comparison' },
          { type: 'cite', ref: 'def.derivative', note: 'product and chain rules are routine differentiation' },
          { type: 'cite', ref: 'thm.fundamental-calculus', note: 'v′ = L|u|' },
        ],
        dependsOn: ['comparison'],
        highlight: ['factor'],
      },
      {
        id: 'monotone',
        title: 'A non-positive derivative makes w decrease',
        claim: String.raw`
          w'(t) \le 0 \text{ on } (a,b)
          \;\Longrightarrow\;
          w(t) \le w(a) = C
        `,
        note: 'Apply the mean value theorem to w on [a,t]. For some c between a and t, w(t)−w(a)=w′(c)(t−a)≤0. The derivative estimate has become a global comparison with the initial value.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'factor' },
          { type: 'cite', ref: 'thm.mean-value' },
        ],
        dependsOn: ['factor'],
        highlight: ['monotone'],
      },
      {
        id: 'bound',
        title: 'Undo the factor',
        claim: String.raw`
          e^{-L(t-a)}v(t) \le C
          \;\Longrightarrow\;
          v(t) \le C e^{L(t-a)}
        `,
        note: 'The integrating factor is positive, so multiplying the comparison back by e^{L(t−a)} preserves the inequality. This is the exponential envelope forced by the differential inequality.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'monotone' },
          { type: 'algebra', note: 'Multiply by the positive factor e^{L(t−a)}.' },
        ],
        dependsOn: ['monotone'],
        highlight: ['bound'],
      },
      {
        id: 'conclude',
        title: 'The original error lies under the same envelope',
        claim: String.raw`
          |u(t)| \le v(t) \le C e^{L(t-a)}
          \qquad (t \in [a,b])
        `,
        note: 'The comparison function was built above |u|, so the estimate for v is automatically an estimate for u. If C=0, then |u(t)|≤0 and u vanishes everywhere: equal initial data cannot separate while this integral inequality holds.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'comparison' },
          { type: 'step', ref: 'bound' },
        ],
        dependsOn: ['comparison', 'bound'],
        highlight: ['bound', 'zero'],
      },
    ],
  },
};
