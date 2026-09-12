import type { Entry } from '../../types/entry';

/**
 * The vocabulary two theorems were already leaning on.
 *
 * "K is closed" is a hypothesis of both the extreme value theorem and
 * Heine–Cantor, and until now its statement referred to limit points that
 * nothing defined. Limit point and closed set are one entry rather than two
 * because the second is a single line given the first, and splitting them would
 * leave the first cited only by the second - reachable from nothing a reader
 * walks through.
 */
export const closedSet: Entry = {
  id: 'def.closed-set',
  kind: 'definition',
  title: 'Limit points and closed sets',
  statement: String.raw`
    x \text{ is a limit point of } E
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 : \; \big( (x-\varepsilon,\, x+\varepsilon) \setminus \{x\} \big) \cap E \neq \varnothing
    \\[6pt]
    E \text{ is closed}
    \;\stackrel{\text{def}}{\iff}\;
    E \text{ contains every one of its limit points}
  `,
  informal:
    'A set is closed when nothing can leak out of it by taking limits. That is the property two theorems above have been quietly using: a sequence inside K converges, and closedness is what stops the place it converges to from being somewhere the function was never defined.',
  tags: ['analysis', 'topology'],
  figureId: 'closed-set',
  source: { work: 'Sphynx', locator: 'Compactness, 0' },
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'need',
        title: 'What the proofs actually need',
        claim: String.raw`
          (x_n) \subset K, \quad x_n \to x \quad\Longrightarrow\quad x \in K
        `,
        note: 'Twice already an argument has produced a convergent sequence inside a set and then needed its limit to be in that set, so that a function defined on the set could be evaluated there. The word for a set that cannot leak in this way is what has to be pinned down.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.sequence-limit' }],
        highlight: ['leak'],
      },
      {
        id: 'not-open',
        title: 'First attempt: closed means not open',
        claim: String.raw`[0, 1) \text{ is neither open nor closed}`,
        note: 'The everyday reading of the word, and it is wrong in a way that causes lasting confusion. Open and closed are not opposites: the half-open interval is neither, and ℝ itself is both. The two words are not even about the same question.',
        role: 'attempt',
        reason: [{ type: 'assumption', note: 'Take the word at face value.' }],
        dependsOn: ['need'],
        highlight: ['half-open'],
      },
      {
        id: 'endpoints',
        title: 'Second attempt: closed means it contains its endpoints',
        claim: String.raw`E = \left\{ \tfrac{1}{n} : n \in \mathbb{N} \right\}`,
        note: 'Right for intervals and useless for anything else. This set has no endpoints in any workable sense — it has a largest element and no smallest — yet it is plainly leaking, in a way the first attempt cannot name either.',
        role: 'attempt',
        reason: [{ type: 'step', ref: 'not-open' }],
        dependsOn: ['not-open'],
        highlight: ['harmonic-set'],
      },
      {
        id: 'limit-point',
        title: 'Name the places a set is crowding against',
        claim: String.raw`
          \forall \varepsilon > 0 : \;
          \big( (x - \varepsilon,\, x + \varepsilon) \setminus \{x\} \big) \cap E \neq \varnothing
        `,
        note: 'x is a limit point of E when E comes arbitrarily close to it — every window around x, however narrow, catches a point of E. The exclusion of x itself is what stops the notion being empty: without it every point of a set would trivially qualify, and the definition would say nothing about anything.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'endpoints' },
          { type: 'cite', ref: 'def.sequence-limit', note: 'the same ε, read around a point rather than along a sequence' },
        ],
        dependsOn: ['endpoints'],
        highlight: ['windows'],
      },
      {
        id: 'examples',
        title: 'Read it off the two examples',
        claim: String.raw`
          \{ \tfrac{1}{n} \} : \ \text{one limit point}, \ 0 \notin E
          \qquad
          (0,1) : \ \text{limit points } [0,1], \ 0, 1 \notin E
        `,
        note: 'Neither set contains all the places it crowds against, and both leak. Adding the missing points repairs both: {1/n} ∪ {0} and [0,1] are closed. Note that a limit point need not be in the set — that is exactly the case the word is there to rule out.',
        role: 'observation',
        reason: [{ type: 'step', ref: 'limit-point' }],
        dependsOn: ['limit-point'],
        highlight: ['repaired'],
      },
      {
        id: 'sequences',
        title: 'And the form the proofs use',
        claim: String.raw`
          E \text{ closed} \;\iff\;
          \big( (x_n) \subset E, \ x_n \to x \;\Rightarrow\; x \in E \big)
        `,
        note: 'A limit point is precisely the limit of some sequence of other points of the set, so the two readings are the same condition. Every argument in this library reaches for the second one — it never checks windows, it converges a sequence and then needs the limit to still be somewhere useful.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'examples' },
          { type: 'cite', ref: 'def.sequence-limit' },
        ],
        dependsOn: ['examples'],
        highlight: ['leak'],
      },
    ],
  },
};
