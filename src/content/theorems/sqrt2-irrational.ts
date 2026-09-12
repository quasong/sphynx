import type { Entry } from '../../types/entry';

/**
 * Proof by contradiction, with the lowest-terms normal form doing the work.
 *
 * The figure reads the same argument geometrically: a rational square root
 * would be a lattice point on the line y = x * sqrt(2), and halving it would
 * produce a smaller one, forever.
 */
export const sqrt2Irrational: Entry = {
  id: 'thm.sqrt2-irrational',
  kind: 'theorem',
  title: 'The square root of 2 is irrational',
  statement: String.raw`\sqrt{2} \notin \mathbb{Q}`,
  informal:
    'No fraction of whole numbers squares to exactly 2. The proof assumes one does, insists it be written in lowest terms, and then shows that numerator and denominator are both even — which lowest terms forbids.',
  tags: ['number theory'],
  figureId: 'sqrt2',
  references: [
    { label: 'Euclid, Elements X (appendix)' },
    { label: 'Aristotle, Prior Analytics I.23 — the earliest surviving reference' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'contradiction',
    given: [String.raw`\text{the claim to refute: } \sqrt{2} \in \mathbb{Q}`],
    steps: [
      {
        id: 'assume',
        title: 'Assume a fraction works, in lowest terms',
        claim: String.raw`\sqrt{2} = \frac{p}{q}, \quad p,q \in \mathbb{Z},\; q \neq 0,\; \gcd(p,q) = 1`,
        note: 'Any rational number can be reduced, so demanding lowest terms costs nothing. It is the extra constraint the contradiction will eventually break — without it the argument has nothing to collide with.',
        role: 'assumption',
        reason: [
          { type: 'assumption', note: 'For contradiction, suppose √2 is rational.' },
          { type: 'cite', ref: 'def.rational', note: 'every rational has a lowest-terms form' },
        ],
        highlight: ['candidate', 'line'],
      },
      {
        id: 'clear-denominator',
        title: 'Clear the denominator',
        claim: String.raw`2 = \frac{p^2}{q^2} \quad\Longrightarrow\quad p^2 = 2q^2`,
        note: 'Squaring removes the root, and multiplying through by q² removes the fraction. From here the whole argument lives in the integers.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'assume' },
          { type: 'algebra', note: 'Square both sides, then multiply by q².' },
        ],
        dependsOn: ['assume'],
        highlight: ['candidate', 'legs'],
      },
      {
        id: 'p-sq-even',
        title: 'So p² is even',
        claim: String.raw`p^2 = 2q^2 \text{ with } q^2 \in \mathbb{Z} \;\Longrightarrow\; p^2 \text{ even}`,
        note: 'p² is literally twice an integer, which is the definition.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'clear-denominator' },
          { type: 'cite', ref: 'def.parity' },
        ],
        dependsOn: ['clear-denominator'],
        highlight: ['p-even'],
      },
      {
        id: 'p-even',
        title: 'Therefore p itself is even',
        claim: String.raw`p = 2k, \quad k \in \mathbb{Z}`,
        note: 'This is the step that needs a lemma. "p² is even" says nothing obvious about p on its own — the lemma is what licenses the inference.',
        role: 'derivation',
        reason: [{ type: 'cite', ref: 'lem.even-square' }],
        dependsOn: ['p-sq-even'],
        highlight: ['p-even'],
      },
      {
        id: 'substitute',
        title: 'Substitute and cancel',
        claim: String.raw`(2k)^2 = 2q^2 \;\Longrightarrow\; 4k^2 = 2q^2 \;\Longrightarrow\; q^2 = 2k^2`,
        note: 'The same equation reappears with the roles of the two numbers swapped — that symmetry is what makes the argument close.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'p-even' },
          { type: 'algebra', note: 'Expand and divide by 2.' },
        ],
        dependsOn: ['p-even', 'clear-denominator'],
        highlight: ['q-even'],
      },
      {
        id: 'q-even',
        title: 'So q is even too',
        claim: String.raw`q^2 \text{ even} \;\Longrightarrow\; q \text{ even}`,
        note: 'Identical reasoning to p, applied to the new equation.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'substitute' },
          { type: 'cite', ref: 'def.parity' },
          { type: 'cite', ref: 'lem.even-square' },
        ],
        dependsOn: ['substitute'],
        highlight: ['q-even'],
      },
      {
        id: 'collide',
        title: 'Collide with lowest terms',
        claim: String.raw`2 \mid p \;\text{ and }\; 2 \mid q \;\Longrightarrow\; \gcd(p,q) \ge 2 \;\nleq\; 1`,
        note: 'Both are even, so 2 divides both — yet the fraction was chosen with no common factor. Geometrically: halving both coordinates produces a strictly smaller pair with the same ratio, so the pair we started from was never the smallest.',
        role: 'contradiction',
        reason: [
          { type: 'step', ref: 'p-even' },
          { type: 'step', ref: 'q-even' },
          { type: 'step', ref: 'assume' },
        ],
        dependsOn: ['p-even', 'q-even', 'assume'],
        highlight: ['halved'],
      },
      {
        id: 'conclude',
        title: 'Discharge the assumption',
        claim: String.raw`\sqrt{2} \notin \mathbb{Q}`,
        note: 'The assumption led to a contradiction, so it is false: no pair of integers has ratio √2. Equivalently, the line y = √2·x passes through no lattice point but the origin.',
        role: 'conclusion',
        reason: [{ type: 'step', ref: 'collide' }],
        dependsOn: ['collide'],
        highlight: ['descent'],
      },
    ],
  },
};
