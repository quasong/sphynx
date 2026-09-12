import type { Entry } from '../../types/entry';

/**
 * The definition that the whole of the completeness material is built on.
 *
 * Presented as a motivation timeline rather than a proof: the point is not that
 * the definition is true but that every simpler candidate - largest element,
 * some upper bound - fails on ordinary bounded sets, and that the surviving
 * definition still does not come with a guarantee that the object exists.
 */
export const supremum: Entry = {
  id: 'def.supremum',
  kind: 'definition',
  title: 'Supremum and infimum',
  statement: String.raw`
    \alpha = \sup E
    \;\stackrel{\text{def}}{\iff}\;
    \begin{cases}
      x \le \alpha & \text{for every } x \in E, \\[2pt]
      \gamma < \alpha \implies \gamma \text{ is not an upper bound of } E.
    \end{cases}
  `,
  informal:
    'The supremum of a set is its least upper bound: a ceiling that no element exceeds, and the lowest such ceiling there is. It is not the largest element — a set can fail to have one of those and still have a perfectly good supremum, which is exactly why the notion is worth the extra clause.',
  tags: ['analysis', 'order'],
  figureId: 'supremum',
  source: { work: 'MIT 18.100B', locator: 'Lecture 1' },
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'max',
        title: 'First attempt: the largest element',
        claim: String.raw`\max E = \text{the } m \in E \text{ with } x \le m \text{ for all } x \in E`,
        note: 'For a closed interval this is exactly right: the largest element of [0, 1] is 1, and it tells you everything about where the set ends. The trouble is how often it fails to exist.',
        role: 'attempt',
        reason: [{ type: 'assumption', note: 'Start from the obvious candidate.' }],
        highlight: ['max'],
      },
      {
        id: 'no-max',
        title: 'Ordinary bounded sets have no largest element',
        claim: String.raw`E = [0, 1) : \quad x \in E \implies \tfrac{1+x}{2} \in E \text{ and } \tfrac{1+x}{2} > x`,
        note: 'Every candidate for largest is beaten by the midpoint between it and 1. Yet the set is obviously bounded, and obviously ends at 1. A notion of "where a set ends" that is undefined for [0, 1) is not usable.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'max' },
          { type: 'algebra', note: 'The midpoint of x and 1 lies strictly between them.' },
        ],
        dependsOn: ['max'],
        highlight: ['no-max'],
      },
      {
        id: 'bounds',
        title: 'Second attempt: an upper bound',
        claim: String.raw`\beta \text{ is an upper bound of } E \iff x \le \beta \text{ for all } x \in E`,
        note: 'This exists in abundance — and that is the problem. For [0, 1) the numbers 1, 1.6 and 2.2 are all upper bounds, as is every larger number. Knowing that some upper bound exists says almost nothing about the set.',
        role: 'refinement',
        reason: [{ type: 'step', ref: 'no-max' }],
        dependsOn: ['no-max'],
        highlight: ['bounds'],
      },
      {
        id: 'least',
        title: 'Take the least of them',
        claim: String.raw`
          \alpha = \sup E: \quad
          (\text{i}) \; x \le \alpha \;\; \forall x \in E,
          \qquad
          (\text{ii}) \; \gamma < \alpha \implies \gamma \text{ is not an upper bound}
        `,
        note: 'The upper bounds of a set form a ray running off to the right. Its left endpoint is the one piece of information that pins down where E ends. Clause (i) says α is a ceiling; clause (ii) says nothing lower is — together they say α is the smallest ceiling.',
        role: 'refinement',
        reason: [{ type: 'step', ref: 'bounds' }],
        dependsOn: ['bounds'],
        highlight: ['sup'],
      },
      {
        id: 'recovers-max',
        title: 'Check: it agrees with the largest element when there is one',
        claim: String.raw`m = \max E \implies \sup E = m`,
        note: 'm is an upper bound by definition, and no γ < m can be one, since m itself is an element exceeding it. So the new notion extends the old one rather than replacing it — nothing is lost by always speaking of suprema.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'least' },
          { type: 'algebra', note: 'A largest element is an upper bound belonging to the set.' },
        ],
        dependsOn: ['least'],
        highlight: ['max', 'sup'],
      },
      {
        id: 'not-in-set',
        title: 'And the price: the supremum need not belong to the set',
        claim: String.raw`\sup [0,1) = 1 \notin [0,1)`,
        note: 'This is not a defect. It is precisely what lets the supremum exist where a largest element cannot, and it is the reason the definition has to be phrased in terms of bounds rather than membership.',
        role: 'observation',
        reason: [{ type: 'step', ref: 'least' }],
        dependsOn: ['least'],
        highlight: ['sup', 'not-in-set'],
      },
      {
        id: 'existence',
        title: 'What the definition does not give you',
        claim: String.raw`
          A = \{ p \in \mathbb{Q} : p > 0,\; p^2 < 2 \} \subset \mathbb{Q}
          \text{ is bounded above, yet has no least upper bound in } \mathbb{Q}.
        `,
        note: 'Defining a word does not conjure the object. Whether every bounded set has a supremum is a property of the surrounding ordered set, not a theorem about the definition — and it is a property the rationals fail. That failure is what the next entry proves, and what forces the construction of ℝ.',
        role: 'conclusion',
        // Deliberately not a citation: the next entry proves this, so citing it
        // here would make the two depend on each other and the library would
        // stop being a graph you can read in an order.
        reason: [{ type: 'step', ref: 'least' }],
        dependsOn: ['least'],
        highlight: ['gap'],
      },
    ],
  },
};
