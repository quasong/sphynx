import type { Entry } from '../../types/entry';

/**
 * The second entry with switchable hypotheses, and a cleaner test of the idea
 * than the first: two conditions, each with a counterexample that satisfies the
 * other exactly, so neither can be blamed for the other's failure.
 */
export const monotoneConvergence: Entry = {
  id: 'thm.monotone-convergence',
  kind: 'theorem',
  title: 'Monotone convergence',
  statement: String.raw`
    (a_n) \text{ increasing and bounded above}
    \;\Longrightarrow\;
    a_n \to \sup \{ a_n : n \in \mathbb{N} \}
  `,
  informal:
    'An increasing sequence that cannot go past a ceiling has to settle, and it settles at the lowest ceiling there is. Nothing here computes a limit — the supremum is handed over by completeness, and the two conditions are what force the sequence onto it.',
  tags: ['analysis', 'sequences'],
  figureId: 'monotone',
  hypotheses: [
    {
      id: 'monotone',
      label: 'the sequence is increasing',
      statement: String.raw`a_n \le a_{n+1} \quad \text{for every } n`,
      note: 'Turns one term near the supremum into a whole tail near it. Without it a sequence can approach the ceiling and then walk away again, as often as it likes.',
      withoutIt: {
        summary: 'The terms keep coming back.',
        statement: String.raw`a_n = (-1)^n, \quad \sup \{a_n\} = 1, \quad a_n \not\to 1`,
        note: 'Bounded above by 1, and the value 1 is attained infinitely often — so the supremum is approached as closely as you like, over and over. It is still not a limit, because the sequence keeps returning to −1. Reaching a level repeatedly is not the same as staying at it.',
      },
    },
    {
      id: 'bounded',
      label: 'it is bounded above',
      statement: String.raw`\exists M \in \mathbb{R} : \; a_n \le M \quad \text{for every } n`,
      note: 'Gives completeness something to act on. Without it there is no supremum, and so no candidate for the limit to be.',
      withoutIt: {
        summary: 'There is no ceiling to settle against.',
        statement: String.raw`a_n = n, \quad \sup \{a_n\} \text{ does not exist in } \mathbb{R}`,
        note: 'Perfectly increasing, and it leaves every bound behind. Note what the proof loses here: not the last step but the first — without a supremum the argument has nothing to name as the limit, so it never starts.',
      },
    },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`(a_n) \subset \mathbb{R}`],
    steps: [
      {
        id: 'candidate',
        title: 'The limit can only be the supremum',
        claim: String.raw`L = \sup \{ a_n : n \in \mathbb{N} \}`,
        note: 'An increasing sequence never comes back down, so it cannot converge to anything below a term it has already passed, and it cannot pass its own least upper bound. That leaves exactly one candidate — and the proof is the work of showing the candidate is reached.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.supremum' }],
        highlight: ['sup'],
      },
      {
        id: 'exists',
        title: 'And it exists',
        claim: String.raw`\{a_n\} \neq \varnothing \text{ and bounded above} \;\Longrightarrow\; L \in \mathbb{R}`,
        note: 'This is the whole contribution of the second hypothesis, and the one place the real numbers are used rather than the rationals.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'bounded' },
          { type: 'cite', ref: 'ax.completeness' },
          { type: 'cite', ref: 'def.supremum' },
        ],
        dependsOn: ['candidate'],
        highlight: ['sup'],
      },
      {
        id: 'one-term',
        title: 'Some term already beats L − ε',
        claim: String.raw`\varepsilon > 0 \;\Longrightarrow\; \exists N : \; a_N > L - \varepsilon`,
        note: 'L − ε is strictly below the least upper bound, so it is not an upper bound at all: some term overtakes it. Clause (ii) of the definition is doing the work — a merely-some-upper-bound would give nothing here.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'exists' },
          { type: 'cite', ref: 'def.supremum', note: 'clause (ii): nothing below L bounds the set' },
        ],
        dependsOn: ['exists'],
        highlight: ['epsilon', 'threshold'],
      },
      {
        id: 'tail',
        title: 'Monotonicity carries the whole tail with it',
        claim: String.raw`n \ge N \;\Longrightarrow\; a_n \ge a_N > L - \varepsilon`,
        note: 'One term above the line becomes every later term above the line. This is the step that converts a fact about a single index into a fact about an eventual state, which is what convergence asks for.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'monotone' },
          { type: 'step', ref: 'one-term' },
        ],
        dependsOn: ['one-term'],
        highlight: ['epsilon', 'tail'],
      },
      {
        id: 'above',
        title: 'And L holds them down from above',
        claim: String.raw`a_n \le L \quad \text{for every } n`,
        note: 'By definition of upper bound. So from N onwards the terms are trapped in the strip (L − ε, L].',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'exists' },
          { type: 'cite', ref: 'def.supremum', note: 'clause (i): L is an upper bound' },
        ],
        dependsOn: ['exists'],
        highlight: ['epsilon', 'tail'],
      },
      {
        id: 'conclude',
        title: 'Which is convergence, written out',
        claim: String.raw`
          n \ge N \;\Longrightarrow\; |a_n - L| < \varepsilon
          \qquad \text{for every } \varepsilon > 0
        `,
        note: 'The ε was arbitrary and the N was produced from it, so the definition is satisfied exactly as stated. Nothing was computed: the limit was named by completeness and cornered by the two hypotheses.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'tail' },
          { type: 'step', ref: 'above' },
          { type: 'cite', ref: 'def.sequence-limit' },
        ],
        dependsOn: ['tail', 'above'],
        highlight: ['epsilon', 'tail', 'sup'],
      },
    ],
  },
};
