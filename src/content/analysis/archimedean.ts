import type { Entry } from '../../types/entry';

/**
 * The first real dividend of completeness.
 *
 * Both halves are elementary-sounding claims that are false in some ordered
 * fields, and neither can be proved without the supremum. Kept as one entry
 * because the second half is three lines once the first is available, and the
 * course states them together.
 */
export const archimedean: Entry = {
  id: 'thm.archimedean-density',
  kind: 'theorem',
  title: 'Archimedean property, and ℚ is dense in ℝ',
  statement: String.raw`
    \textbf{(a)}\;\; x > 0 \implies \exists\, n \in \mathbb{N}: nx > y
    \qquad
    \textbf{(b)}\;\; x < y \implies \exists\, p \in \mathbb{Q}: x < p < y
  `,
  informal:
    'Part (a): no real number is so large that repeated steps of a fixed positive size cannot pass it — there are no infinite elements. Part (b): between any two distinct reals, however close, sits a rational. Both look self-evident and neither is: they are consequences of completeness, and they fail in ordered fields that lack it.',
  tags: ['analysis', 'order'],
  figureId: 'archimedean',
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 1.20' }],
  timeline: {
    kind: 'proof',
    strategy: 'contradiction',
    given: [String.raw`x, y \in \mathbb{R}, \quad x > 0`],
    steps: [
      {
        id: 'assume',
        title: '(a) Suppose the multiples never pass y',
        claim: String.raw`A = \{ nx : n \in \mathbb{N} \}, \qquad nx \le y \;\; \forall n`,
        note: 'The negation of what is to be proved says precisely that y is an upper bound for the whole set of multiples of x. A is not empty, so it is a set of the kind completeness speaks about.',
        role: 'assumption',
        reason: [{ type: 'assumption', note: 'For contradiction, suppose no n works.' }],
        highlight: ['multiples'],
      },
      {
        id: 'sup-exists',
        title: 'So the multiples have a supremum',
        claim: String.raw`\alpha = \sup A \in \mathbb{R}`,
        note: 'This is the only place the real numbers are used rather than the rationals, and it is where the proof would break over ℚ. Everything after it is arithmetic.',
        role: 'derivation',
        reason: [
          { type: 'cite', ref: 'ax.completeness' },
          { type: 'cite', ref: 'def.supremum' },
          { type: 'step', ref: 'assume' },
        ],
        dependsOn: ['assume'],
        highlight: ['multiples', 'sup'],
      },
      {
        id: 'step-back',
        title: 'Step back from the supremum by x',
        claim: String.raw`x > 0 \implies \alpha - x < \alpha \implies \exists\, m: \; \alpha - x < mx`,
        note: 'Because α is the *least* upper bound, anything smaller fails to be an upper bound — so some multiple overtakes α − x. This is clause (ii) of the definition doing the work; a merely-some-upper-bound would give nothing here.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'sup-exists' },
          { type: 'cite', ref: 'def.supremum', note: 'clause (ii): nothing below α bounds A' },
        ],
        dependsOn: ['sup-exists'],
        highlight: ['sup', 'step-back'],
      },
      {
        id: 'overshoot',
        title: 'Then the next multiple overshoots',
        claim: String.raw`\alpha - x < mx \implies \alpha < (m+1)x \in A`,
        note: 'An element of A strictly above α, which α was supposed to bound. The assumption is therefore false, and some multiple of x does pass y.',
        role: 'contradiction',
        reason: [
          { type: 'step', ref: 'step-back' },
          { type: 'algebra', note: 'Add x to both sides.' },
        ],
        dependsOn: ['step-back'],
        highlight: ['overshoot'],
      },
      {
        id: 'choose-n',
        title: '(b) Choose a step size smaller than the gap',
        claim: String.raw`y - x > 0 \implies \exists\, n \in \mathbb{N}: \; n(y - x) > 1
          \quad\text{i.e.}\quad \tfrac{1}{n} < y - x`,
        note: 'Part (a) applied to the gap itself. A grid of spacing 1/n is now finer than the interval, which is the whole idea: a step short enough cannot stride over the gap.',
        role: 'construction',
        reason: [{ type: 'step', ref: 'overshoot', note: 'part (a), now available' }],
        dependsOn: ['overshoot'],
        highlight: ['gap-xy', 'grid'],
      },
      {
        id: 'trap',
        title: 'Trap nx between consecutive integers',
        claim: String.raw`m = \min \{ k \in \mathbb{Z} : k > nx \}
          \quad\Longrightarrow\quad m - 1 \le nx < m`,
        note: 'Part (a) again, in both directions, puts nx between two integers, so only finitely many integers exceed nx from below and the least one exists. By its minimality m − 1 fails to exceed nx.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'overshoot', note: 'part (a), bounding nx on both sides' },
          { type: 'construction', note: 'Take the least integer above nx.' },
        ],
        dependsOn: ['overshoot', 'choose-n'],
        highlight: ['grid', 'trap'],
      },
      {
        id: 'squeeze',
        title: 'The trapped integer lands inside',
        claim: String.raw`m \le nx + 1 < nx + n(y-x) = ny
          \qquad\Longrightarrow\qquad nx < m < ny`,
        note: 'The left inequality is minimality, the middle one is the choice of n. Together they place the integer m strictly between nx and ny — the grid was fine enough that a multiple had to land in the gap.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'trap' },
          { type: 'step', ref: 'choose-n' },
          { type: 'algebra', note: 'Chain the two inequalities.' },
        ],
        dependsOn: ['trap', 'choose-n'],
        highlight: ['landed'],
      },
      {
        id: 'conclude',
        title: 'Divide through',
        claim: String.raw`x < \frac{m}{n} < y, \qquad \frac{m}{n} \in \mathbb{Q}`,
        note: 'n is a positive integer, so dividing preserves the inequalities. The rational produced depends on x and y only through the gap between them — the closer they are, the larger the n the argument demands, but one always exists.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'squeeze' },
          { type: 'algebra', note: 'Divide by n > 0.' },
        ],
        dependsOn: ['squeeze'],
        highlight: ['landed'],
      },
    ],
  },
};
