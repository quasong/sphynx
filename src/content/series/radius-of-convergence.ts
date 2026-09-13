import type { Entry } from '../../types/entry';

/**
 * The theorem that turns the geometric series' inside/outside picture into a
 * fact about every power series: there is always a radius separating absolute
 * convergence from divergence. Endpoints are left open — they can go either way.
 */
export const radiusOfConvergence: Entry = {
  id: 'thm.radius-of-convergence',
  kind: 'theorem',
  title: 'Radius of convergence',
  statement: String.raw`
    \sum_{n=0}^{\infty} c_n (x - a)^n :
    \quad \exists\, R \in [0, \infty]
    \text{ such that the series}
    \\[4pt]
    \begin{cases}
    \text{converges absolutely} & \text{if } |x - a| < R \\
    \text{diverges} & \text{if } |x - a| > R
    \end{cases}
  `,
  informal:
    'For any power series there is a single number R — possibly 0, possibly ∞ — that draws a circle around the centre: inside, the series converges; outside, it diverges. The geometric series is the case R = 1. What happens exactly on the circle is not settled by the theorem and can go either way.',
  tags: ['analysis', 'series'],
  figureId: 'radius-of-convergence',
  hypotheses: [
    {
      id: 'complete',
      label: 'the ambient field is complete',
      statement: String.raw`\text{absolute convergence is tested in } \mathbb{R}, \text{ not merely in } \mathbb{Q}`,
      note: 'Inside the radius the proof compares with a geometric series and invokes the Cauchy criterion for the absolute series. Both need completeness of ℝ to produce a finite sum. Divergence outside needs no completeness: the terms fail to go to zero.',
      withoutIt: {
        summary: 'Inside the would-be radius, Cauchy tails need not yield a rational sum.',
        statement: String.raw`
          \sum x^n \text{ at a rational } x \text{ with } |x| < 1:
          \quad \text{the geometric comparison is Cauchy in } \mathbb{Q},
          \text{ yet need not converge in } \mathbb{Q}
        `,
        note: 'The comparison argument still shows the absolute partial sums are Cauchy. Without completeness they need not converge — so the step that upgrades the geometric bound to absolute convergence of the power series fails, even though divergence outside the radius is untouched.',
      },
    },
  ],
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 3.39' }],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [String.raw`(c_n) \text{ a sequence}, \quad a \in \mathbb{R}`],
    steps: [
      {
        id: 'set',
        title: 'Collect every distance at which the series converges',
        claim: String.raw`
          A = \bigl\{ |x - a| : \sum c_n (x - a)^n \text{ converges} \bigr\},
          \qquad R = \sup A \in [0, \infty]
        `,
        note: 'A always contains 0, because at x = a the series is just c_0. Its supremum may be finite or infinite; that number is the candidate radius. Everything after this step is checking that R really separates convergence from divergence.',
        role: 'construction',
        reason: [
          { type: 'cite', ref: 'def.power-series' },
          { type: 'cite', ref: 'def.series-convergence' },
          { type: 'cite', ref: 'def.supremum', note: 'or R = ∞ if A is unbounded' },
        ],
        highlight: ['radius', 'set'],
      },
      {
        id: 'outside',
        title: 'Past R the series cannot converge',
        claim: String.raw`
          |x - a| > R \;\Longrightarrow\;
          |x - a| \notin A \;\Longrightarrow\;
          \sum c_n (x - a)^n \text{ diverges}
        `,
        note: 'If the series converged at such an x, then |x − a| would belong to A and exceed the supremum of A — which is impossible. So every point strictly farther from a than R is a point of divergence. This direction uses only the definition of R.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'set' },
          { type: 'algebra', note: 'Nothing larger than a supremum can belong to the set.' },
        ],
        dependsOn: ['set'],
        highlight: ['outside', 'diverge'],
      },
      {
        id: 'witness',
        title: 'Inside R, borrow a farther point of convergence',
        claim: String.raw`
          |x - a| < R \;\Longrightarrow\;
          \exists\, x_0 : \; |x - a| < |x_0 - a| \le R
          \text{ and } \sum c_n (x_0 - a)^n \text{ converges}
        `,
        note: 'Because R is the least upper bound of A, some element of A sits strictly above |x − a|. At that farther point the series converges, so its terms go to zero and are therefore bounded: |c_n (x_0 − a)^n| ≤ M for every n.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'set' },
          { type: 'cite', ref: 'def.supremum', note: 'something in A exceeds every number below R' },
          { type: 'cite', ref: 'def.series-convergence', note: 'convergent ⇒ terms → 0 ⇒ bounded' },
        ],
        dependsOn: ['set'],
        highlight: ['inside', 'witness'],
      },
      {
        id: 'geometric',
        title: 'Compare with a geometric series',
        claim: String.raw`
          \rho = \frac{|x - a|}{|x_0 - a|} < 1 :
          \quad |c_n (x - a)^n| \le M \rho^n,
          \qquad \sum M \rho^n < \infty
        `,
        note: 'Rewrite each absolute term as the corresponding term at x_0 times ρ^n. The geometric series ∑ ρ^n converges because ρ < 1 — the model from the power-series entry — so the comparison series ∑ M ρ^n converges too.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'witness' },
          { type: 'cite', ref: 'def.power-series', note: 'geometric series converges for |ρ| < 1' },
          { type: 'algebra', note: '|c_n (x − a)^n| = |c_n (x_0 − a)^n| · ρ^n ≤ M ρ^n.' },
        ],
        dependsOn: ['witness'],
        highlight: ['geometric', 'inside'],
      },
      {
        id: 'absolute',
        title: 'So the series converges absolutely inside the radius',
        claim: String.raw`
          \sum |c_n (x - a)^n| \text{ converges}
          \;\Longrightarrow\;
          \sum c_n (x - a)^n \text{ converges}
        `,
        note: 'The absolute series has tails no larger than the geometric tails, so the Cauchy criterion for series applies. Absolute convergence gives ordinary convergence. Completeness of ℝ is spent here: the geometric comparison produces a Cauchy sequence of partial sums, and only completeness turns that into a real sum.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'complete' },
          { type: 'step', ref: 'geometric' },
          { type: 'cite', ref: 'thm.series-cauchy-criterion' },
        ],
        dependsOn: ['geometric'],
        highlight: ['inside', 'limit'],
      },
      {
        id: 'conclude',
        title: 'R is the radius of convergence',
        claim: String.raw`
          |x - a| < R \;\Rightarrow\; \text{absolute convergence},
          \qquad |x - a| > R \;\Rightarrow\; \text{divergence}
        `,
        note: 'The endpoints |x − a| = R are deliberately left open: the geometric series converges for |x| < 1 and diverges for |x| > 1, yet at x = −1 it converges and at x = 1 it diverges. R = 0 and R = ∞ are allowed — the zero series has infinite radius; ∑ n! x^n has radius zero. What the theorem settles is the open interval around a, not the boundary.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'outside' },
          { type: 'step', ref: 'absolute' },
        ],
        dependsOn: ['outside', 'absolute'],
        highlight: ['radius'],
      },
    ],
  },
};
