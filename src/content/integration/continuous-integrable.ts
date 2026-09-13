import type { Entry } from '../../types/entry';

/**
 * The theorem that makes the integral usable: every continuous function has
 * one. The proof is uniform continuity spent exactly once - one δ for the
 * whole interval is what lets one partition work on every piece at the same
 * time - and it is the reason the Heine–Cantor theorem was worth proving.
 *
 * The single hypothesis switches off to the Dirichlet function, which is
 * bounded, so the sums exist, and not integrable, so the definition is doing
 * something.
 */
export const continuousIntegrable: Entry = {
  id: 'thm.continuous-integrable',
  kind: 'theorem',
  title: 'A continuous function is integrable',
  statement: String.raw`
    a < b, \quad f : [a, b] \to \mathbb{R} \text{ continuous}
    \;\Longrightarrow\;
    f \text{ is Riemann integrable on } [a, b]
  `,
  informal:
    'The upper and lower sums of a continuous function can be squeezed together as tightly as asked. The squeezing is done by one partition fine enough everywhere at once, and that is a demand about the whole interval rather than about each point — which is why it is uniform continuity, not continuity, that the proof spends, and compactness that supplies it.',
  tags: ['analysis', 'integration', 'compactness'],
  figureId: 'continuous-integrable',
  hypotheses: [
    {
      id: 'continuous',
      label: 'f is continuous',
      statement: String.raw`f \text{ is continuous at every point of } [a, b]`,
      note: 'On a closed bounded interval, continuity is uniform continuity, and uniform continuity is what makes the gap between the top and bottom of every rectangle small at once. It also makes f bounded, so that the sums exist to be compared.',
      withoutIt: {
        summary: 'Every rectangle is as tall as it can be, however thin.',
        statement: String.raw`
          f(x) = \begin{cases} 1 & x \in \mathbb{Q} \\ 0 & x \notin \mathbb{Q} \end{cases}
          \ \text{ on } [0, 1] :
          \qquad U(P, f) - L(P, f) = 1 \ \text{ for every } P
        `,
        note: 'Bounded, so every upper and lower sum is a number, and discontinuous at every point. Each piece of each partition contains points where f is 1 and points where f is 0, so each rectangle has height 1 above and 0 below, and refining changes nothing. The gap the proof squeezes to zero is stuck at 1.',
      },
    },
  ],
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 6.6 and 6.8' }],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`a < b`, String.raw`\varepsilon > 0`],
    steps: [
      {
        id: 'target',
        title: 'It is enough to find one partition with a small gap',
        claim: String.raw`
          \exists P : \; U(P, f) - L(P, f) < \varepsilon
          \;\Longrightarrow\;
          0 \le \overline{\int_a^b} f - \underline{\int_a^b} f \le U(P, f) - L(P, f) < \varepsilon
        `,
        note: 'The upper integral is at most any upper sum and the lower integral at least any lower sum, so one partition with gap below ε forces the two integrals within ε of each other. If that can be done for every ε they are equal, which is the definition of integrable. The sums exist because a continuous function on a closed bounded interval is bounded — the extreme value theorem, in its weakest form.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'def.riemann-integral' },
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.extreme-value', note: 'f is bounded, so the sums are numbers' },
        ],
        highlight: ['gap'],
      },
      {
        id: 'uniform',
        title: 'One δ for the whole interval',
        claim: String.raw`
          \exists \delta > 0 \;\; \forall x, y \in [a, b] : \;
          |x - y| < \delta \;\Rightarrow\; |f(x) - f(y)| < \frac{\varepsilon}{b - a}
        `,
        note: 'Continuity gives a radius at each point, and different points may need different radii; a partition is one set of cuts for the whole interval and cannot adapt to each point. On a closed bounded interval, though, one radius serves everywhere — that is the Heine–Cantor theorem, and this is the moment it was for. The tolerance is chosen as ε/(b − a) so that it comes out to ε once multiplied by the total length.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.heine-cantor' },
          { type: 'cite', ref: 'def.uniform-continuity' },
        ],
        dependsOn: ['target'],
        highlight: ['delta'],
      },
      {
        id: 'partition',
        title: 'Cut into pieces shorter than δ',
        claim: String.raw`
          n > \frac{b - a}{\delta}, \qquad x_i = a + \frac{i}{n}(b - a), \qquad \Delta x_i = \frac{b - a}{n} < \delta
        `,
        note: 'Equal pieces, enough of them. There is such an n because no real number exceeds every integer. Any partition with every piece shorter than δ would do; equal pieces are only the simplest way to write one down.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'uniform' },
          { type: 'cite', ref: 'thm.archimedean-density', note: 'some integer exceeds (b − a)/δ' },
        ],
        dependsOn: ['uniform'],
        highlight: ['partition'],
      },
      {
        id: 'pieces',
        title: 'On every piece, top and bottom are close',
        claim: String.raw`
          M_i = f(p_i), \;\; m_i = f(q_i), \;\; p_i, q_i \in [x_{i-1}, x_i]
          \;\Longrightarrow\; M_i - m_i = |f(p_i) - f(q_i)| < \frac{\varepsilon}{b - a}
        `,
        note: 'Each piece is itself a closed bounded interval, so f attains its largest and smallest value on it, at points p_i and q_i. Those two points lie in a piece shorter than δ, so they are within δ of each other, and the one δ from the previous step applies to the pair — on every piece, with no piece needing anything of its own.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'uniform' },
          { type: 'step', ref: 'partition' },
          { type: 'cite', ref: 'thm.extreme-value', note: 'on each closed piece, the sup and inf are values' },
        ],
        dependsOn: ['uniform', 'partition'],
        highlight: ['pieces'],
      },
      {
        id: 'sum',
        title: 'Add the gaps up',
        claim: String.raw`
          U(P, f) - L(P, f) = \sum_{i=1}^{n} (M_i - m_i)\,\Delta x_i
          < \frac{\varepsilon}{b - a} \sum_{i=1}^{n} \Delta x_i = \varepsilon
        `,
        note: 'The difference between the upper and lower sum is the total area of the thin strips between the tall rectangles and the short ones. Each strip is shorter than ε/(b − a), and their widths add up to b − a. So the total is less than ε — which is what the first step asked for.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'pieces' },
          { type: 'algebra', note: 'The widths of the pieces sum to b − a.' },
        ],
        dependsOn: ['pieces'],
        highlight: ['gap', 'pieces'],
      },
      {
        id: 'conclude',
        title: 'So f is integrable',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists P : \; U(P, f) - L(P, f) < \varepsilon
          \;\Longrightarrow\; \underline{\int_a^b} f = \overline{\int_a^b} f
        `,
        note: 'ε was arbitrary. Note where compactness entered: not in the sums, which exist for any bounded function, but in the single δ that let one partition be fine enough everywhere. A function continuous at each point of an open interval can need radii that shrink without bound towards an end, and then no finite set of cuts is fine enough for all of them.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'target' },
          { type: 'step', ref: 'sum' },
        ],
        dependsOn: ['target', 'sum'],
        highlight: ['gap'],
      },
    ],
  },
};
