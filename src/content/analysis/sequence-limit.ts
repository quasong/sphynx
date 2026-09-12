import type { Entry } from '../../types/entry';

/**
 * The other half of the epsilon machinery.
 *
 * Written as a motivation rather than a proof because the interesting content
 * is not that the definition is correct but that three simpler readings of
 * "approaches L" each admit something they should not - one too vague, one too
 * strong, one too weak.
 */
export const sequenceLimit: Entry = {
  id: 'def.sequence-limit',
  kind: 'definition',
  title: 'Limit of a sequence (ε–N)',
  statement: String.raw`
    a_n \to L
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 \;\; \exists N \in \mathbb{N} \;\; \forall n \ge N :
    \; |a_n - L| < \varepsilon
  `,
  informal:
    'A sequence converges to L when the terms are eventually within any tolerance you name — not merely heading in the right direction, and not merely getting there now and again. The whole weight is on "eventually": what the first thousand terms do is irrelevant, and what they all do from some point on is everything.',
  tags: ['analysis', 'sequences'],
  figureId: 'sequence-limit',
  source: { work: 'Sphynx', locator: 'Sequences, 1' },
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'closer',
        title: 'First attempt: the terms get closer and closer to L',
        claim: String.raw`|a_{n+1} - L| < |a_n - L| \quad \text{for every } n`,
        note: 'This is the picture everyone has, and it is not a definition of anything in particular: it never says where the sequence ends up. Getting closer is a comparison between consecutive terms; converging is a claim about a destination.',
        role: 'attempt',
        reason: [{ type: 'assumption', note: 'Start from the intuition.' }],
        highlight: ['closer'],
      },
      {
        id: 'closer-fails',
        title: 'It does not pin down the limit',
        claim: String.raw`
          a_n = 1 + \tfrac{1}{n}, \quad L = 0:
          \quad |a_{n+1} - 0| < |a_n - 0| \ \text{ for every } n
        `,
        note: 'Every term is strictly closer to 0 than the one before, so the criterion is satisfied — yet the sequence settles at 1 and never goes near 0. A test that cannot tell 1 from 0 is not measuring convergence.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'closer' },
          { type: 'algebra', note: '1 + 1/(n+1) < 1 + 1/n, and both are positive.' },
        ],
        dependsOn: ['closer'],
        highlight: ['closer'],
      },
      {
        id: 'equal',
        title: 'Second attempt: the terms eventually equal L',
        claim: String.raw`\exists N \;\; \forall n \ge N : \; a_n = L`,
        note: 'This does name a destination, and it is far too strong. The sequence 1/n is the standard example of convergence to 0 and no term of it is ever 0. Requiring arrival rules out almost every sequence worth the name.',
        role: 'attempt',
        reason: [{ type: 'step', ref: 'closer-fails' }],
        dependsOn: ['closer-fails'],
        highlight: ['equal'],
      },
      {
        id: 'some-term',
        title: 'Third attempt: for every tolerance, some term is within it',
        claim: String.raw`\forall \varepsilon > 0 \;\; \exists n : \; |a_n - L| < \varepsilon`,
        note: 'Now too weak, in a way that is easy to miss. It asks the sequence to visit the neighbourhood, not to stay in it.',
        role: 'attempt',
        reason: [{ type: 'step', ref: 'equal' }],
        dependsOn: ['equal'],
        highlight: ['some-term'],
      },
      {
        id: 'some-term-fails',
        title: 'Visiting is not converging',
        claim: String.raw`a_n = (-1)^n, \quad L = 1: \quad a_n = 1 \text{ for every even } n`,
        note: 'Infinitely many terms are exactly 1, so every tolerance is met by some term — and the sequence converges to nothing at all, bouncing between 1 and −1 forever. What is missing is a demand about all the terms after a point, not merely one of them.',
        role: 'counterexample',
        reason: [{ type: 'step', ref: 'some-term' }],
        dependsOn: ['some-term'],
        highlight: ['some-term', 'violation'],
      },
      {
        id: 'final',
        title: 'Ask for a point past which every term is inside',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists N \;\; \forall n \ge N :
          \; |a_n - L| < \varepsilon
        `,
        note: 'Three quantifiers, and each repairs one of the failures above: ∀ε makes the tolerance arbitrary, ∃N names the point of no return, and ∀n≥N demands that everything after it stays inside. Read the order carefully — N comes after ε, so it may depend on it, and usually must.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'some-term-fails' },
          { type: 'step', ref: 'closer-fails' },
        ],
        dependsOn: ['some-term-fails'],
        highlight: ['final'],
      },
      {
        id: 'check',
        title: 'Check: 1/n converges to 0',
        claim: String.raw`
          \varepsilon > 0 \;\Longrightarrow\; \exists N > \tfrac{1}{\varepsilon},
          \quad n \ge N \Rightarrow \left|\tfrac{1}{n} - 0\right| \le \tfrac{1}{N} < \varepsilon
        `,
        note: 'The N is produced from ε by a formula, which is what ∃N asks for. That such an N exists at all is the Archimedean property — no real number, however large 1/ε is, outruns every integer. Halve ε and N roughly doubles: the threshold moves, which is exactly why it is quantified after ε.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'final' },
          { type: 'cite', ref: 'thm.archimedean-density', note: 'supplies an integer beyond 1/ε' },
        ],
        dependsOn: ['final'],
        highlight: ['final', 'threshold'],
      },
    ],
  },
};
