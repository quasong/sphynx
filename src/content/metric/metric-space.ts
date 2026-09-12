import type { Entry } from '../../types/entry';

/**
 * The abstraction step.
 *
 * Motivated by auditing what |x − y| was actually doing in the proofs already
 * written: not subtraction, not order, not that the points were numbers — only
 * three properties, each of which can be seen failing.
 */
export const metricSpace: Entry = {
  id: 'def.metric-space',
  kind: 'definition',
  title: 'Metric space',
  statement: String.raw`
    d : X \times X \to \mathbb{R} \text{ is a metric}
    \;\stackrel{\text{def}}{\iff}\;
    \begin{cases}
      d(x,y) \ge 0, \ \text{ and } \ d(x,y) = 0 \iff x = y, \\[2pt]
      d(x,y) = d(y,x), \\[2pt]
      d(x,z) \le d(x,y) + d(y,z).
    \end{cases}
  `,
  informal:
    'Everything proved so far about limits used |x − y| only as a measure of how far apart two things are — never that it was a subtraction, never that the points were numbers. Keeping just the three properties the proofs actually relied on leaves a definition that applies to points in a plane, to sequences, and to functions, with every earlier definition readable word for word.',
  tags: ['analysis', 'metric spaces'],
  figureId: 'metric',
  source: { work: 'Sphynx', locator: 'Metric spaces, 1' },
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'audit',
        title: 'Look back at what |x − y| was asked to do',
        claim: String.raw`
          |a_n - L| < \varepsilon, \qquad
          |f(x) - f(x_0)| < \varepsilon, \qquad
          |a_n - a_m| < \varepsilon
        `,
        note: 'Three definitions, and in every one the expression appears in the same position: a quantity to be made small. Nothing in any of the proofs opened it up and used subtraction.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'def.sequence-limit' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta' },
          { type: 'cite', ref: 'def.cauchy-sequence' },
        ],
        highlight: ['audit'],
      },
      {
        id: 'separation',
        title: 'It must tell distinct points apart',
        claim: String.raw`d(x,y) = 0 \iff x = y`,
        note: 'Drop the "only if" and two distinct points can sit at distance zero. Then a sequence converging to one converges to the other as well, and "the limit" stops being a thing you can speak of. Limits are unique precisely because nothing else is at distance zero.',
        role: 'refinement',
        reason: [{ type: 'step', ref: 'audit' }],
        dependsOn: ['audit'],
        highlight: ['separation'],
      },
      {
        id: 'symmetry',
        title: 'It must not care which point you start from',
        claim: String.raw`d(x,y) = d(y,x)`,
        note: 'Travel time in a city with one-way streets is a perfectly sensible measure and is not symmetric. Without symmetry, "the points within ε of x" and "the points that have x within ε of them" are different sets, and a neighbourhood stops being a single well-defined thing.',
        role: 'refinement',
        reason: [{ type: 'step', ref: 'separation' }],
        dependsOn: ['separation'],
        highlight: ['symmetry'],
      },
      {
        id: 'triangle',
        title: 'And a detour must never be shorter than going direct',
        claim: String.raw`d(x,z) \le d(x,y) + d(y,z)`,
        note: 'This is the axiom the proofs actually spend. Every argument that chained two estimates — a Cauchy sequence with a convergent subsequence, values pulled to a common limit, a tolerance split into halves — was this inequality. Without it, being close to something close to x tells you nothing about being close to x, and no ε/2 argument survives.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'symmetry' },
          { type: 'cite', ref: 'thm.cauchy-criterion', note: 'the ε/2 argument, twice' },
        ],
        dependsOn: ['symmetry'],
        highlight: ['triangle'],
      },
      {
        id: 'verbatim',
        title: 'Now read the old definitions again',
        claim: String.raw`
          d(a_n, L) < \varepsilon, \qquad
          d\big(f(x), f(x_0)\big) < \varepsilon, \qquad
          d(a_n, a_m) < \varepsilon
        `,
        note: 'Not analogues — the same sentences, with one symbol substituted. Every proof built from them goes through unchanged, which is why the work is not repeated here. What was a fact about the real line has become a fact about any set carrying a distance.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'triangle' },
          { type: 'cite', ref: 'def.sequence-limit' },
          { type: 'cite', ref: 'def.cauchy-sequence' },
        ],
        dependsOn: ['triangle'],
        highlight: ['verbatim'],
      },
      {
        id: 'many',
        title: 'And note that one set carries many metrics',
        claim: String.raw`
          d_2(x,y) = \sqrt{\textstyle\sum (x_i-y_i)^2}, \quad
          d_1(x,y) = \textstyle\sum |x_i - y_i|, \quad
          d_0(x,y) = \begin{cases} 0 & x = y \\ 1 & x \neq y \end{cases}
        `,
        note: 'All three satisfy the axioms, and the set of points within 1 of the origin is a disc, a diamond, and a single point. The metric is not a feature of the set — it is a choice, and which theorems hold depends on it. That is the whole reason the structure is named separately from the set.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'verbatim' },
          { type: 'algebra', note: 'Each satisfies the three axioms.' },
        ],
        dependsOn: ['verbatim'],
        highlight: ['balls'],
      },
    ],
  },
};

/**
 * The point of the whole abstraction, stated in one line: completeness stops
 * being an axiom about ℝ and becomes a property a space may or may not have.
 */
export const completeMetricSpace: Entry = {
  id: 'def.complete-metric-space',
  kind: 'definition',
  title: 'Complete metric space',
  statement: String.raw`
    (X, d) \text{ is complete}
    \;\stackrel{\text{def}}{\iff}\;
    \text{every Cauchy sequence in } X \text{ converges to a point of } X
  `,
  informal:
    'The Cauchy criterion, turned from a theorem about ℝ into a question one can ask of any space. ℝ answers yes, ℚ answers no, and so does the open interval (0,1) — which shows that completeness is not inherited by the parts of a complete space.',
  tags: ['analysis', 'metric spaces'],
  figureId: 'complete-metric',
  generalizes: ['ax.completeness', 'thm.cauchy-criterion'],
  source: { work: 'Sphynx', locator: 'Metric spaces, 2' },
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'restate',
        title: 'Take the criterion and ask it as a question',
        claim: String.raw`
          \text{In } \mathbb{R}: \ \text{Cauchy} \iff \text{convergent}
          \qquad\longrightarrow\qquad
          \text{In } X: \ \text{does Cauchy imply convergent?}
        `,
        note: 'One direction always holds, in any metric space, by the triangle inequality alone. The other was where completeness was spent — so making it the definition turns a theorem about one space into a property that distinguishes spaces.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'thm.cauchy-criterion' },
          { type: 'cite', ref: 'def.metric-space' },
        ],
        highlight: ['reals'],
      },
      {
        id: 'answers',
        title: 'The same sequence, three different answers',
        claim: String.raw`
          \mathbb{R}: \text{ complete}, \qquad
          \mathbb{Q}: \text{ not}, \qquad
          (0,1): \text{ not}
        `,
        note: 'The rationals fail at √2, which is the gap this library opened with. The open interval fails at its own endpoints: 1/n is Cauchy in (0,1) and its limit is not there. Neither failure is about the sequences — both are about what the space is missing.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'restate' },
          { type: 'cite', ref: 'thm.q-incomplete' },
        ],
        dependsOn: ['restate'],
        highlight: ['rationals', 'interval'],
      },
      {
        id: 'not-inherited',
        title: 'So completeness is not inherited downwards',
        claim: String.raw`
          (0,1) \subset \mathbb{R} \text{ complete}, \quad (0,1) \text{ not} ;
          \qquad
          [0,1] \subset \mathbb{R} \text{ complete}
        `,
        note: 'A subset of a complete space is complete exactly when it is closed — a Cauchy sequence inside it still converges in the big space, and closedness is what keeps the limit from escaping. The same word "closed" that made the extreme value theorem work is doing the same job here.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'answers' },
          { type: 'cite', ref: 'def.closed-set' },
        ],
        dependsOn: ['answers'],
        highlight: ['interval'],
      },
      {
        id: 'upward',
        title: 'And this is the form that keeps going',
        note: 'No supremum appears in the definition, so nothing stops it being asked of spaces with no order at all: sequences of vectors, of matrices, of functions. Add a vector structure and a norm to a complete metric space and the result is a Banach space; add an inner product and it is a Hilbert space. Both are this definition with extra furniture.',
        role: 'conclusion',
        reason: [{ type: 'step', ref: 'not-inherited' }],
        dependsOn: ['not-inherited'],
        highlight: ['reals'],
      },
    ],
  },
};
