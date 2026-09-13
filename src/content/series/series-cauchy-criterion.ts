import type { Entry } from '../../types/entry';

/**
 * The Cauchy criterion for sequences, read off the partial sums. The forward
 * direction is immediate; the converse spends completeness exactly as the
 * sequence version did.
 */
export const seriesCauchyCriterion: Entry = {
  id: 'thm.series-cauchy-criterion',
  kind: 'theorem',
  title: 'Cauchy criterion for series',
  statement: String.raw`
    (a_n) \subset \mathbb{R} : \quad
    \sum_{n=1}^{\infty} a_n \text{ converges}
    \;\iff\;
    \forall \varepsilon > 0 \;\; \exists N \;\; \forall m > n \ge N :
    \; \Bigl|\sum_{k=n+1}^{m} a_k\Bigr| < \varepsilon
  `,
  informal:
    'A series converges when the tail sums can be made arbitrarily small — not merely when individual terms shrink, but when any block of terms far enough out adds up to less than any tolerance you name. Over the reals this is the same as the partial sums being Cauchy, and the same completeness hypothesis separates ℝ from ℚ.',
  tags: ['analysis', 'series'],
  figureId: 'series-cauchy-criterion',
  hypotheses: [
    {
      id: 'complete',
      label: 'the ambient field is complete',
      statement: String.raw`\text{the partial sums live in } \mathbb{R}, \text{ not merely in } \mathbb{Q}`,
      note: 'The forward direction needs no completeness. The converse asks a Cauchy sequence of partial sums to converge — which is exactly where completeness enters, as in the sequence Cauchy criterion.',
      withoutIt: {
        summary: 'Tail sums can shrink while no rational total exists.',
        statement: String.raw`
          a_1 = \sqrt{2},\quad a_n = 0 \ (n \ge 2) :
          \quad \text{every tail sum is } 0 \text{ or } \sqrt{2}, \text{ yet no rational } L \text{ receives the partial sums}
        `,
        note: 'A cruder example: partial sums jumping among rationals approaching √2 would have vanishing tail sums in ℚ while converging to nothing there. The Cauchy tail condition is unchanged; only the step that produces a limit from a Cauchy sequence fails.',
      },
    },
  ],
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 3.22' }],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`(a_n) \text{ a sequence of real numbers}`],
    steps: [
      {
        id: 'translate',
        title: 'Convergence is a statement about partial sums',
        claim: String.raw`
          S_n = \sum_{k=1}^{n} a_k,
          \qquad \sum a_n \text{ converges} \;\iff\; S_n \to L
        `,
        note: 'The definition of a convergent series is the definition of a convergent sequence in disguise. Every test for series is a test for (S_n), and the Cauchy criterion is the one that never names the limit.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.series-convergence' }],
        highlight: ['partial'],
      },
      {
        id: 'tail',
        title: 'A Cauchy partial sum is a small tail sum',
        claim: String.raw`
          |S_m - S_n| = \Bigl|\sum_{k=n+1}^{m} a_k\Bigr| < \varepsilon
          \quad \text{for } m, n \ge N
        `,
        note: 'The Cauchy condition for (S_n) asks that later partial sums differ by less than ε. That difference is exactly the sum of the terms between them — so the tail-sum condition is the Cauchy condition for partial sums, rewritten.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'translate' },
          { type: 'algebra', note: 'Telescope the finite sum.' },
        ],
        dependsOn: ['translate'],
        highlight: ['tail'],
      },
      {
        id: 'easy',
        title: 'Converging implies vanishing tails',
        claim: String.raw`
          S_n \to L \;\Longrightarrow\;
          \Bigl|\sum_{k=n+1}^{m} a_k\Bigr| = |S_m - S_n| < \varepsilon
          \ \text{ for } m > n \ge N
        `,
        note: 'Take N from convergence of (S_n) at tolerance ε. Any two partial sums past N are within ε of each other, so any tail sum between them is too. This direction uses nothing about ℝ beyond the triangle inequality.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'tail' },
          { type: 'cite', ref: 'def.sequence-limit' },
        ],
        dependsOn: ['tail'],
        highlight: ['tail', 'limit'],
      },
      {
        id: 'cauchy-partial',
        title: 'Vanishing tails make the partial sums Cauchy',
        claim: String.raw`
          \Bigl|\sum_{k=n+1}^{m} a_k\Bigr| < \tfrac{\varepsilon}{2}
          \ \text{ for } m > n \ge N
          \;\Longrightarrow\; |S_m - S_n| < \varepsilon
        `,
        note: 'The tail condition with ε/2 in place of ε is exactly the Cauchy condition for (S_n). A series whose tails shrink is a sequence of partial sums that bunch up — whether those partial sums converge is a question about the space, not about the series.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'tail' },
          { type: 'cite', ref: 'def.cauchy-sequence' },
        ],
        dependsOn: ['tail'],
        highlight: ['partial', 'tail-box'],
      },
      {
        id: 'complete',
        title: 'Over ℝ, Cauchy partial sums converge',
        claim: String.raw`
          (S_n) \text{ Cauchy} \;\Longrightarrow\; S_n \to L \in \mathbb{R}
        `,
        note: 'This is the Cauchy criterion for sequences, applied to (S_n). Completeness of ℝ is spent here and only here — the same asymmetry as in the sequence version.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'complete' },
          { type: 'cite', ref: 'thm.cauchy-criterion' },
          { type: 'step', ref: 'cauchy-partial' },
        ],
        dependsOn: ['cauchy-partial'],
        highlight: ['limit'],
      },
      {
        id: 'conclude',
        title: 'So the tail condition tests convergence',
        claim: String.raw`
          \sum a_n \text{ converges}
          \;\iff\;
          \forall \varepsilon > 0 \;\; \exists N \;\; \forall m > n \ge N :
          \; \Bigl|\sum_{k=n+1}^{m} a_k\Bigr| < \varepsilon
        `,
        note: 'The equivalence is not a fact about series but about ℝ. Stated in a incomplete space the forward direction still holds and the converse fails — which is why the Cauchy tail test is the form that survives the climb to function spaces and beyond.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'easy' },
          { type: 'step', ref: 'complete' },
          { type: 'cite', ref: 'def.series-convergence' },
        ],
        dependsOn: ['easy', 'complete'],
        highlight: ['tail', 'limit'],
      },
    ],
  },
};
