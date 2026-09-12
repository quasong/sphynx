import type { Entry } from '../../types/entry';

/**
 * A lemma with no figure, on purpose: some arguments are about the form of a
 * symbol rather than about a picture, and the layout has to cope with that
 * rather than inventing decoration.
 */
export const evenSquare: Entry = {
  id: 'lem.even-square',
  kind: 'lemma',
  title: 'A square is even only if its root is',
  statement: String.raw`\forall n \in \mathbb{Z}: \; n^2 \text{ even} \implies n \text{ even}`,
  informal:
    'Squaring cannot turn an odd number into an even one. Proving the statement directly is awkward — knowing n² = 2k tells you little about n — so the proof flips it into the equivalent claim about odd numbers, where there is something concrete to compute with.',
  tags: ['number theory'],
  timeline: {
    kind: 'proof',
    strategy: 'contrapositive',
    given: [String.raw`n \in \mathbb{Z}`],
    steps: [
      {
        id: 'flip',
        title: 'Prove the contrapositive instead',
        claim: String.raw`n \text{ odd} \implies n^2 \text{ odd}`,
        note: 'An implication and its contrapositive are the same statement. This direction is tractable because "n is odd" hands us a formula for n, whereas "n² is even" hands us a formula only for n².',
        role: 'setup',
        reason: [
          { type: 'algebra', note: 'P ⟹ Q is logically equivalent to ¬Q ⟹ ¬P.' },
          { type: 'cite', ref: 'def.parity', note: 'not even means odd' },
        ],
      },
      {
        id: 'assume-odd',
        title: 'Assume n is odd',
        claim: String.raw`n = 2m + 1, \quad m \in \mathbb{Z}`,
        note: 'This is the definition of odd, unpacked into a form that can be squared.',
        role: 'assumption',
        reason: [{ type: 'cite', ref: 'def.parity' }],
        dependsOn: ['flip'],
      },
      {
        id: 'expand',
        title: 'Square it',
        claim: String.raw`n^2 = 4m^2 + 4m + 1 = 2\,(2m^2 + 2m) + 1`,
        note: 'The regrouping is the whole trick: it exhibits n² in the shape 2k + 1.',
        role: 'derivation',
        reason: [{ type: 'algebra', note: 'Expand, then factor 2 out of the even part.' }],
        dependsOn: ['assume-odd'],
      },
      {
        id: 'is-odd',
        title: 'Read off the parity',
        claim: String.raw`k = 2m^2 + 2m \in \mathbb{Z} \;\Longrightarrow\; n^2 = 2k+1 \text{ is odd}`,
        note: 'k is built from m by multiplication and addition, so it is an integer — which is what the definition of odd requires.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'expand' },
          { type: 'cite', ref: 'def.parity' },
        ],
        dependsOn: ['expand'],
      },
      {
        id: 'conclude',
        title: 'Return to the original statement',
        claim: String.raw`n^2 \text{ even} \implies n \text{ even}`,
        note: 'The contrapositive is proved, so the lemma is too. Note where the integers were needed: only in asserting that k is one.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'is-odd' },
          { type: 'step', ref: 'flip' },
        ],
        dependsOn: ['is-odd', 'flip'],
      },
    ],
  },
};
