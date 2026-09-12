import type { Entry } from '../../types/entry';

/**
 * Completeness restated in a form that survives the climb.
 *
 * Supremum is an order notion: it does not follow the subject into the plane,
 * into spaces of functions, or anywhere else without a "<". "Every Cauchy
 * sequence converges" says the same thing using only distance, which is why it
 * is the version that generalises - and why this definition is worth the
 * trouble of not mentioning the limit.
 */
export const cauchySequence: Entry = {
  id: 'def.cauchy-sequence',
  kind: 'definition',
  title: 'Cauchy sequence',
  statement: String.raw`
    (a_n) \text{ is Cauchy}
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 \;\; \exists N \;\; \forall m, n \ge N :
    \; |a_n - a_m| < \varepsilon
  `,
  informal:
    'A convergence test that never names the limit. Instead of asking how close the terms get to a destination, it asks how close they get to each other — which can be checked with nothing but the sequence in hand.',
  tags: ['analysis', 'sequences'],
  figureId: 'cauchy',
  source: { work: 'Sphynx', locator: 'Sequences, 4' },
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'need',
        title: 'Why look for a test that avoids the limit',
        claim: String.raw`
          a_n \to L: \quad \text{to apply it you must already have } L
        `,
        note: 'The ε–N definition is a statement about a pair — the sequence and its limit. That is useless whenever the limit is the thing you are trying to produce: a numerical scheme, a series with no closed form, or the construction of the real numbers themselves. What is wanted is a property of the sequence alone.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.sequence-limit' }],
        highlight: ['need'],
      },
      {
        id: 'consecutive',
        title: 'First attempt: consecutive terms bunch up',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists N \;\; \forall n \ge N :
          \; |a_{n+1} - a_n| < \varepsilon
        `,
        note: 'It mentions no limit, which is the point, and it is easy to check. It is also not enough.',
        role: 'attempt',
        reason: [{ type: 'step', ref: 'need' }],
        dependsOn: ['need'],
        highlight: ['consecutive'],
      },
      {
        id: 'harmonic',
        title: 'Steps can shrink while the sequence walks away',
        claim: String.raw`
          H_n = \sum_{k=1}^{n} \frac{1}{k} : \quad
          H_{n+1} - H_n = \frac{1}{n+1} \to 0
          \quad\text{and}\quad H_n \to \infty
        `,
        note: 'Each step is smaller than the last and the total is unbounded. Controlling one step at a time says nothing about what many steps add up to — and convergence is a claim about the many.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'consecutive' },
          { type: 'algebra', note: 'The harmonic sum exceeds every bound.' },
        ],
        dependsOn: ['consecutive'],
        highlight: ['consecutive', 'violation'],
      },
      {
        id: 'all-pairs',
        title: 'Ask it of every later pair, not just neighbours',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists N \;\; \forall m, n \ge N :
          \; |a_n - a_m| < \varepsilon
        `,
        note: 'Past N the terms are not merely taking small steps — they are all within ε of one another. The whole tail is confined to a strip of width ε, however narrow you ask for.',
        role: 'refinement',
        reason: [{ type: 'step', ref: 'harmonic' }],
        dependsOn: ['harmonic'],
        highlight: ['tail-box'],
      },
      {
        id: 'no-limit',
        title: 'And notice what the definition does not contain',
        claim: String.raw`
          \text{no } L \text{ appears anywhere in } \; \forall \varepsilon \; \exists N \; \forall m,n \ge N : |a_n - a_m| < \varepsilon
        `,
        note: 'Only the terms and the distance between them. This is the form that outlives the real line: replace |x − y| by any notion of distance and the definition still reads, which is how it reaches sequences of points, of vectors, and of functions. The supremum could not make that journey — it needs an order.',
        role: 'observation',
        reason: [{ type: 'step', ref: 'all-pairs' }],
        dependsOn: ['all-pairs'],
        highlight: ['tail-box'],
      },
      {
        id: 'worth',
        title: 'Whether it is equivalent to converging depends on where you are',
        note: 'In ℝ the two are the same condition, and the next entry proves it. In ℚ they are not: a sequence can bunch up around a number that the set does not contain. So this definition does not replace convergence — it separates the part of convergence that is about the sequence from the part that is about the space it lives in.',
        role: 'conclusion',
        reason: [{ type: 'step', ref: 'no-limit' }],
        dependsOn: ['no-limit'],
        highlight: ['tail-box'],
      },
    ],
  },
};

/**
 * The theorem where the hypothesis being switched off is not a property of the
 * object but of the space it sits in - and where switching it off leaves half
 * an equivalence standing.
 */
export const cauchyCriterion: Entry = {
  id: 'thm.cauchy-criterion',
  kind: 'theorem',
  title: 'Cauchy criterion',
  statement: String.raw`
    (a_n) \subset \mathbb{R} : \quad
    a_n \text{ converges} \;\iff\; (a_n) \text{ is Cauchy}
  `,
  informal:
    'Over the reals, bunching up and converging are the same condition — so a sequence can be certified convergent without anyone producing its limit. The forward direction is three lines and holds anywhere; the converse is where completeness is spent, and it is false over ℚ.',
  tags: ['analysis', 'sequences'],
  figureId: 'cauchy-criterion',
  hypotheses: [
    {
      id: 'complete',
      label: 'the ambient field is complete',
      statement: String.raw`\text{the sequence lives in } \mathbb{R}, \text{ not merely in } \mathbb{Q}`,
      note: 'Unlike the other switches in this library this is a condition on the surroundings rather than on the sequence. That is the point: whether bunching up amounts to converging is not a fact about the terms at all.',
      withoutIt: {
        summary: 'The same sequence, read in ℚ, bunches up around nothing.',
        statement: String.raw`
          a_n = \text{the first } n \text{ decimals of } \sqrt{2} :
          \quad |a_n - a_m| \le 10^{-\min(m,n)}, \quad a_n \not\to q \ \text{ for any } q \in \mathbb{Q}
        `,
        note: 'Every term is rational and the tail is confined to a strip as narrow as you like, so the sequence is Cauchy in ℚ by the definition as written. It converges to nothing in ℚ, because the number it is closing in on is not there. Watch which steps survive: the easy direction is untouched, and only the converse falls.',
      },
    },
  ],
  source: { work: 'Sphynx', locator: 'Sequences, 5' },
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`(a_n) \text{ a sequence}`],
    steps: [
      {
        id: 'split',
        title: 'Two directions, of very different weight',
        note: 'One is a triangle inequality and holds in any setting where distance makes sense. The other needs to produce a limit out of nothing, and is exactly as strong as the completeness of the space. Taking them in that order makes the asymmetry visible.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'def.sequence-limit' },
          { type: 'cite', ref: 'def.cauchy-sequence' },
        ],
        highlight: ['tail-box'],
      },
      {
        id: 'easy',
        title: 'Converging implies bunching up',
        claim: String.raw`
          |a_n - a_m| \le |a_n - L| + |L - a_m| < \tfrac{\varepsilon}{2} + \tfrac{\varepsilon}{2}
        `,
        note: 'Take the N that convergence supplies for ε/2; past it every term is within ε/2 of L, so any two of them are within ε of each other. Nothing about ℝ was used — this direction holds over ℚ, and over any space with a distance.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'split' },
          { type: 'algebra', note: 'Triangle inequality, with ε split in half.' },
        ],
        dependsOn: ['split'],
        highlight: ['tail-box'],
      },
      {
        id: 'bounded',
        title: 'The converse: a Cauchy sequence is bounded',
        claim: String.raw`
          \varepsilon = 1 \;\Longrightarrow\; \exists N : \; |a_n - a_N| < 1 \ \text{ for } n \ge N
        `,
        note: 'Past N the terms sit within 1 of a single term, and before N there are only finitely many of them. A finite set together with a bounded tail is bounded.',
        role: 'derivation',
        reason: [
          { type: 'cite', ref: 'def.cauchy-sequence' },
          { type: 'algebra', note: 'Take the largest of finitely many bounds.' },
        ],
        dependsOn: ['split'],
        highlight: ['bounded'],
      },
      {
        id: 'subsequence',
        title: 'So some part of it converges',
        claim: String.raw`a_{n_k} \to L \quad \text{for some subsequence}`,
        note: 'This is where the whole weight of the theorem sits. Bolzano–Weierstrass produces a limit from boundedness alone, and it does so by cornering the terms with the supremum — which is to say, by spending completeness.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'complete' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass' },
        ],
        dependsOn: ['bounded'],
        highlight: ['limit'],
      },
      {
        id: 'whole',
        title: 'And bunching up drags the rest along',
        claim: String.raw`
          |a_n - L| \le |a_n - a_{n_k}| + |a_{n_k} - L| < \tfrac{\varepsilon}{2} + \tfrac{\varepsilon}{2}
        `,
        note: 'Choose N so that all later terms are within ε/2 of each other, then choose a member of the subsequence with index past N that is also within ε/2 of L. Every later term is then within ε of L. A Cauchy sequence cannot have one part settling somewhere and another part elsewhere.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'subsequence' },
          { type: 'cite', ref: 'def.cauchy-sequence' },
          { type: 'algebra', note: 'Triangle inequality through a nearby term of the subsequence.' },
        ],
        dependsOn: ['subsequence'],
        highlight: ['limit', 'tail-box'],
      },
      {
        id: 'conclude',
        title: 'So over ℝ the two conditions coincide',
        claim: String.raw`a_n \text{ converges} \iff (a_n) \text{ is Cauchy}`,
        note: 'The equivalence is not a fact about sequences but about ℝ. Stated for a general space it becomes the definition of completeness — and that is the form that goes on to define Banach and Hilbert spaces, where no supremum is available to define anything.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'easy' },
          { type: 'step', ref: 'whole' },
          { type: 'cite', ref: 'def.sequence-limit' },
        ],
        dependsOn: ['easy', 'whole'],
        highlight: ['limit'],
      },
    ],
  },
};
