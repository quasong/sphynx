import type { Entry } from '../../types/entry';

/**
 * The integral by upper and lower sums, in Riemann's form as Darboux wrote
 * it. The definition is arrived at the way the others are: an intuition about
 * area, the one kind of area anyone can compute, and then the question of
 * what to do when the two estimates refuse to meet - which they can, and the
 * Dirichlet function shows it.
 *
 * Two facts that are consequences of the definition rather than theorems
 * about it are stated here as closing observations, because the fundamental
 * theorem of calculus needs exactly them: the integral is squeezed between
 * the smallest and largest value times the length, and it adds over adjacent
 * intervals.
 */
export const riemannIntegral: Entry = {
  id: 'def.riemann-integral',
  kind: 'definition',
  title: 'The Riemann integral',
  statement: String.raw`
    a < b, \quad f : [a, b] \to \mathbb{R} \text{ bounded}, \qquad
    P = \{ a = x_0 < x_1 < \cdots < x_n = b \},
    \\[4pt]
    L(P, f) = \sum_{i=1}^{n} \Bigl( \inf_{[x_{i-1}, x_i]} f \Bigr)\,\Delta x_i, \qquad
    U(P, f) = \sum_{i=1}^{n} \Bigl( \sup_{[x_{i-1}, x_i]} f \Bigr)\,\Delta x_i,
    \\[6pt]
    f \text{ is integrable}
    \;\stackrel{\text{def}}{\iff}\;
    \sup_P L(P, f) = \inf_P U(P, f) \;=\; \int_a^b f
  `,
  informal:
    'Cut the interval into pieces; on each piece the graph lies between its lowest and highest value, so the region under it lies between a short rectangle and a tall one. Adding up the short rectangles gives a lower sum, the tall ones an upper sum, and the region has area — if it has an area — between them. Cutting finer squeezes both estimates towards each other. The function is integrable when they can be squeezed to a single number, and that number is the integral. Whether they can be is a property of f, and the definition is honest enough to say no when they cannot.',
  tags: ['analysis', 'integration'],
  figureId: 'riemann-integral',
  references: [
    { label: 'Riemann (1854); Darboux (1875) for the upper and lower sums' },
    { label: 'Rudin, Principles of Mathematical Analysis, 6.1 to 6.5' },
  ],
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'area',
        title: 'First attempt: the area under the graph',
        claim: String.raw`\int_a^b f = \text{“the area between the graph of } f \text{ and the axis”}`,
        note: 'The right picture and no definition at all. Area is what is being defined; the only regions whose area anyone knows are rectangles, and the region under a curve is not one. So the definition has to be built out of rectangles, and the question becomes which ones.',
        role: 'attempt',
        reason: [{ type: 'assumption', note: 'Start from the picture.' }],
        highlight: ['area'],
      },
      {
        id: 'sums',
        title: 'Second attempt: trap it between rectangles',
        claim: String.raw`
          L(P, f) = \sum_i m_i\,\Delta x_i \;\le\; \text{“area”} \;\le\; \sum_i M_i\,\Delta x_i = U(P, f),
          \qquad m_i = \inf_{[x_{i-1}, x_i]} f, \quad M_i = \sup_{[x_{i-1}, x_i]} f
        `,
        note: 'Cut [a, b] at finitely many points. On each piece the graph lies between the lowest and highest value f takes there — these exist as numbers because f is bounded, which is completeness doing quiet work — so the region lies between a short rectangle and a tall one. Whatever area means, it is at least the lower sum and at most the upper sum. Neither sum is the area; they are two estimates of it, one from each side.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'area' },
          { type: 'cite', ref: 'def.supremum' },
          { type: 'cite', ref: 'ax.completeness', note: 'a bounded set of values has a supremum and an infimum' },
        ],
        dependsOn: ['area'],
        highlight: ['lower', 'upper'],
      },
      {
        id: 'refine',
        title: 'Cutting finer tightens both estimates',
        claim: String.raw`
          P^\ast \supset P \;\Longrightarrow\; L(P, f) \le L(P^\ast, f) \le U(P^\ast, f) \le U(P, f)
        `,
        note: 'Add one cut inside a piece. The infimum over each half is at least the infimum over the whole, so the lower sum can only rise; the supremum over each half is at most the supremum over the whole, so the upper sum can only fall. Repeat for each added point. Refining never loosens either estimate — so the natural move is to refine without end and see whether the two meet.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'sums' },
          { type: 'algebra', note: 'inf over a set ≤ inf over a subset; sup the other way.' },
        ],
        dependsOn: ['sums'],
        highlight: ['refine'],
      },
      {
        id: 'compare',
        title: 'Every lower sum is below every upper sum',
        claim: String.raw`
          L(P_1, f) \le L(P_1 \cup P_2, f) \le U(P_1 \cup P_2, f) \le U(P_2, f)
        `,
        note: 'Two unrelated partitions are compared through their common refinement, which contains both. So the lower sums, taken over all partitions, form a set bounded above — by any upper sum whatever — and the upper sums a set bounded below. Each set therefore has a supremum or an infimum, and those two numbers are what the definition is about.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'refine' },
          { type: 'cite', ref: 'ax.completeness' },
        ],
        dependsOn: ['refine'],
        highlight: ['lower', 'upper'],
      },
      {
        id: 'define',
        title: 'The definition: the two estimates meet',
        claim: String.raw`
          \underline{\int_a^b} f = \sup_P L(P, f) \;\le\; \inf_P U(P, f) = \overline{\int_a^b} f,
          \qquad
          f \text{ integrable} \;\stackrel{\text{def}}{\iff}\; \underline{\int_a^b} f = \overline{\int_a^b} f
        `,
        note: 'The best estimate from below and the best estimate from above. When they agree, the common value is the integral, and it is the only number every lower sum is below and every upper sum is above. When they disagree, f is not integrable: no single number is trapped, and the definition declines to name one. Whether a given f is integrable is now a theorem to be proved about f — the next entry proves it for every continuous function.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'compare' },
          { type: 'cite', ref: 'def.supremum' },
        ],
        dependsOn: ['compare'],
        highlight: ['meet'],
      },
      {
        id: 'dirichlet',
        title: 'Check: the definition can say no',
        claim: String.raw`
          f(x) = \begin{cases} 1 & x \in \mathbb{Q} \\ 0 & x \notin \mathbb{Q} \end{cases}
          \ \text{ on } [0, 1] :
          \qquad L(P, f) = 0, \quad U(P, f) = 1 \quad \text{for every } P
        `,
        note: 'Every piece of every partition contains rationals and irrationals both, because each is dense. So every infimum is 0 and every supremum is 1, whatever the cuts: the lower sums are all 0, the upper sums are all 1, and refining does nothing. The lower integral is 0, the upper integral is 1, and f has no integral. A definition that accepted this function would not be measuring anything.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'define' },
          { type: 'cite', ref: 'thm.archimedean-density', note: 'the rationals are dense; so are the irrationals, by shifting them by √2' },
        ],
        dependsOn: ['define'],
        highlight: ['dirichlet'],
      },
      {
        id: 'bounds',
        title: 'Consequence: the integral is trapped by the coarsest partition',
        claim: String.raw`
          \Bigl( \inf_{[a,b]} f \Bigr)(b - a) \;\le\; \int_a^b f \;\le\; \Bigl( \sup_{[a,b]} f \Bigr)(b - a),
          \qquad \Bigl| \int_a^b f \Bigr| \le (b - a) \sup_{[a,b]} |f|
        `,
        note: 'The partition with no interior cuts has one lower sum and one upper sum, and the integral lies between them like every other. It is the crudest estimate there is, and it is the one the fundamental theorem of calculus uses: on a very short interval the integral is very nearly the length times the value.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'define' },
          { type: 'algebra', note: 'Take P = {a, b}.' },
        ],
        dependsOn: ['define'],
        highlight: ['coarse'],
      },
      {
        id: 'additive',
        title: 'Consequence: the integral adds over adjacent intervals',
        claim: String.raw`
          a < b < c, \quad f \text{ integrable on both pieces} :
          \quad \int_a^c f = \int_a^b f + \int_b^c f,
          \\[4pt]
          \int_b^a f = -\int_a^b f, \qquad \int_a^a f = 0
        `,
        note: 'A partition of [a, b] and one of [b, c] together make a partition of [a, c] whose lower and upper sums are the two pairs added; and any partition of [a, c] refines to one containing b, which only tightens its sums. So the best estimates add, from both sides, and the integrals add. The sign convention makes the identity hold in whatever order the three points come — which is what lets a difference G(t + h) − G(t) be written as one integral whether h is positive or negative.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'define' },
          { type: 'step', ref: 'refine' },
          { type: 'algebra', note: 'Sums over [a, b] and [b, c] concatenate to a sum over [a, c].' },
        ],
        dependsOn: ['define', 'refine'],
        highlight: ['split'],
      },
    ],
  },
};
