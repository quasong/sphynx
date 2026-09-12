import type { Entry } from '../../types/entry';

/**
 * The gap in the rationals, worked out rather than asserted.
 *
 * That no rational squares to 2 is already in the library; this entry is the
 * sharper statement that follows from it - the rationals below sqrt(2) have no
 * least upper bound *in the rationals*, so Q fails the property that all of
 * analysis will be built on.
 */
export const qIncomplete: Entry = {
  id: 'thm.q-incomplete',
  kind: 'theorem',
  title: 'The rationals have no least-upper-bound property',
  statement: String.raw`\mathbb{Q} \text{ does not have the least-upper-bound property.}`,
  informal:
    'Knowing that √2 is not rational says a number is missing. This says something stronger and more useful: the rationals below it have no least ceiling among the rationals, so the ordered set ℚ itself is defective. Every candidate ceiling can be lowered, forever, without ever reaching one that works.',
  tags: ['analysis', 'order'],
  figureId: 'q-incomplete',
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 1.1' }],
  timeline: {
    kind: 'proof',
    strategy: 'contradiction',
    given: [
      String.raw`A = \{ p \in \mathbb{Q} : p > 0,\; p^2 < 2 \}`,
      String.raw`B = \{ p \in \mathbb{Q} : p > 0,\; p^2 > 2 \}`,
    ],
    steps: [
      {
        id: 'setup',
        title: 'The two sets exhaust the positive rationals',
        claim: String.raw`p \in \mathbb{Q},\; p > 0 \implies p \in A \text{ or } p \in B`,
        note: 'There is no third case, because no rational satisfies p² = 2. A is not empty (1 ∈ A) and is bounded above (if p ≥ 2 then p² ≥ 4 > 2, so 2 is an upper bound). So A is exactly the kind of set a supremum is supposed to exist for.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'thm.sqrt2-irrational', note: 'rules out the case p² = 2' },
          { type: 'cite', ref: 'def.supremum' },
        ],
        highlight: ['sets'],
      },
      {
        id: 'b-bounds-a',
        title: 'Every element of B is an upper bound of A',
        claim: String.raw`p \in A,\; b \in B \implies p^2 < 2 < b^2 \implies p < b`,
        note: 'Both are positive, so comparing squares compares the numbers. This means the upper bounds of A are found inside B — and pinning down the least upper bound becomes a question about the smallest element of B.',
        role: 'observation',
        reason: [{ type: 'algebra', note: 'On positive numbers, squaring preserves order.' }],
        dependsOn: ['setup'],
        highlight: ['sets'],
      },
      {
        id: 'map',
        title: 'A map that nudges a rational toward the gap',
        claim: String.raw`
          q = p - \frac{p^2 - 2}{p + 2} = \frac{2p + 2}{p + 2},
          \qquad
          q^2 - 2 = \frac{2\,(p^2 - 2)}{(p+2)^2}
        `,
        note: 'A rational built from p by rational operations, so it is rational too. The second identity is the one that matters: q² − 2 carries the same sign as p² − 2, so q stays on whichever side of the gap p was on. The first shows how far it moved.',
        role: 'construction',
        reason: [
          { type: 'algebra', note: 'Put over a common denominator, then expand (2p+2)² − 2(p+2)².' },
        ],
        highlight: ['map'],
      },
      {
        id: 'no-largest',
        title: 'A has no largest element',
        claim: String.raw`p \in A \implies q > p \ \text{ and } \ q \in A`,
        note: 'If p² < 2 then −(p²−2)/(p+2) is positive, so q > p; and q² − 2 has the sign of p² − 2, so q² < 2 and q is still in A. Whatever element of A you name, this produces a larger one that is also in A.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'map' },
          { type: 'algebra', note: 'p² − 2 < 0 makes both displayed quantities negative.' },
        ],
        dependsOn: ['map', 'setup'],
        highlight: ['climb-a'],
      },
      {
        id: 'no-smallest',
        title: 'B has no smallest element',
        claim: String.raw`p \in B \implies q < p \ \text{ and } \ q \in B`,
        note: 'The same two identities read with the opposite sign. Whatever element of B you name, this produces a smaller one still in B — so the upper bounds of A can always be lowered.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'map' },
          { type: 'algebra', note: 'p² − 2 > 0 makes both displayed quantities positive.' },
        ],
        dependsOn: ['map', 'setup'],
        highlight: ['climb-b'],
      },
      {
        id: 'collide',
        title: 'Suppose a supremum existed',
        claim: String.raw`
          \alpha = \sup A \in \mathbb{Q}
          \;\Longrightarrow\;
          \alpha \in B
          \;\Longrightarrow\;
          \exists\, q \in B,\; q < \alpha
        `,
        note: 'α is an upper bound, so it cannot lie in A — anything in A is beaten by a larger element of A. Being a positive rational that is not in A, it lies in B. But B has no smallest element, so some q ∈ B is smaller than α, and by the second step that q is an upper bound of A as well.',
        role: 'contradiction',
        reason: [
          { type: 'assumption', note: 'For contradiction, suppose sup A exists in ℚ.' },
          { type: 'step', ref: 'no-largest' },
          { type: 'step', ref: 'no-smallest' },
          { type: 'step', ref: 'b-bounds-a' },
        ],
        dependsOn: ['no-largest', 'no-smallest', 'b-bounds-a'],
        highlight: ['collide'],
      },
      {
        id: 'conclude',
        title: 'So ℚ fails the least-upper-bound property',
        claim: String.raw`\sup A \notin \mathbb{Q}`,
        note: 'An upper bound strictly below the least upper bound is a contradiction, so no such α exists. A is bounded above and has no supremum — the defect is in ℚ, not in A. Repairing it is what the completeness axiom does.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'collide' },
          { type: 'cite', ref: 'def.supremum', note: 'clause (ii) is what is violated' },
        ],
        dependsOn: ['collide'],
        highlight: ['gap'],
      },
    ],
  },
};
