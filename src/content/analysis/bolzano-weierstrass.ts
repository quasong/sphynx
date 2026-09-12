import type { Entry } from '../../types/entry';

/**
 * Proved by bisection rather than by the shorter monotone-subsequence trick.
 *
 * The shorter proof is prettier on paper; this one is the one worth drawing,
 * and the halving it draws comes back for nested intervals, for compactness of
 * a closed interval, and for the Cantor set. The figure is an investment, not
 * an illustration.
 */
export const bolzanoWeierstrass: Entry = {
  id: 'thm.bolzano-weierstrass',
  kind: 'theorem',
  title: 'Bolzano–Weierstrass',
  statement: String.raw`
    (a_n) \subset \mathbb{R} \text{ bounded}
    \;\Longrightarrow\;
    \exists\, n_1 < n_2 < \cdots \ \text{ and } \ x \in \mathbb{R} : \; a_{n_k} \to x
  `,
  informal:
    'Infinitely many points confined to a finite stretch of the line have to pile up somewhere. The proof does not find the pile — it corners it, halving the interval over and over and always keeping the half that still holds infinitely many terms.',
  tags: ['analysis', 'sequences'],
  figureId: 'bisection',
  hypotheses: [
    {
      id: 'bounded',
      label: 'the sequence is bounded',
      statement: String.raw`\exists M : \; |a_n| \le M \quad \text{for every } n`,
      note: 'Supplies the interval the halving starts from. Everything after that is bookkeeping about which half to keep.',
      withoutIt: {
        summary: 'Nothing to halve, and nowhere to pile up.',
        statement: String.raw`a_n = n : \quad |a_n - a_m| \ge 1 \ \text{ for } n \neq m`,
        note: 'The terms stay a fixed distance apart forever, so no subsequence can have its tail inside any interval of length less than 1 — and no subsequence converges. Without a finite stretch to confine them, infinitely many points need not accumulate anywhere at all.',
      },
    },
  ],
  references: [{ label: 'Bolzano (1817); Weierstraß, lectures of the 1860s' }],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [String.raw`(a_n) \subset \mathbb{R}`],
    steps: [
      {
        id: 'start',
        title: 'Start from an interval that holds everything',
        claim: String.raw`I_0 = [-M, M] \ \supset \ \{a_n : n \in \mathbb{N}\}`,
        note: 'Every term is in I_0, so I_0 contains a_n for infinitely many n — trivially, but it is that property, not the containment, that the rest of the proof passes down.',
        role: 'setup',
        reason: [{ type: 'hypothesis', ref: 'bounded' }],
        highlight: ['interval-0'],
      },
      {
        id: 'halve',
        title: 'Halve it, and keep a half that still holds infinitely many',
        claim: String.raw`
          I_0 = L \cup R \;\Longrightarrow\;
          L \text{ or } R \text{ contains } a_n \text{ for infinitely many } n
        `,
        note: 'If each half held only finitely many indices, there would be only finitely many indices in total — and there are not. So at least one half inherits the property. Pick one that does.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'start' },
          { type: 'algebra', note: 'A union of two finite sets of indices is finite.' },
        ],
        dependsOn: ['start'],
        highlight: ['interval-1'],
      },
      {
        id: 'nest',
        title: 'Repeat, forever',
        claim: String.raw`
          I_0 \supset I_1 \supset I_2 \supset \cdots,
          \qquad |I_k| = \frac{2M}{2^{\,k}},
          \qquad \text{each holding infinitely many terms}
        `,
        note: 'The same argument applies to I_1, then to I_2, and so on. Nothing new happens at any stage, which is what makes the construction legitimate: one step, applied without end.',
        role: 'construction',
        reason: [{ type: 'step', ref: 'halve' }],
        dependsOn: ['halve'],
        highlight: ['interval-2', 'interval-3'],
      },
      {
        id: 'pick',
        title: 'Pick one term from each interval, in order',
        claim: String.raw`n_1 < n_2 < \cdots \quad \text{with} \quad a_{n_k} \in I_k`,
        note: 'Here is where "infinitely many" earns its keep rather than "at least one". Having already used indices up to n_{k−1}, we still need a term of I_k with a later index — and infinitely many are available, so one exists. With only finitely many the construction would stall.',
        role: 'construction',
        reason: [{ type: 'step', ref: 'nest' }],
        dependsOn: ['nest'],
        highlight: ['picked'],
      },
      {
        id: 'point',
        title: 'The nested intervals share a point',
        claim: String.raw`x = \sup \{ \text{left endpoints of } I_k \} \; \in \; \bigcap_k I_k`,
        note: 'The left endpoints increase and are bounded above by any right endpoint, so their supremum exists and lies in every I_k. This is the only place the real numbers are needed — over ℚ the intervals could close in on a gap and share nothing.',
        role: 'derivation',
        reason: [
          { type: 'cite', ref: 'ax.completeness' },
          { type: 'cite', ref: 'def.supremum' },
          { type: 'step', ref: 'nest' },
        ],
        dependsOn: ['nest'],
        highlight: ['limit'],
      },
      {
        id: 'shrink',
        title: 'And the intervals shrink to nothing',
        claim: String.raw`|I_k| = \frac{2M}{2^{\,k}} \le \frac{2M}{k} \;\longrightarrow\; 0`,
        note: '2^k ≥ k for every k, and no real number is exceeded by no integer — so the lengths drop below any tolerance you name.',
        role: 'derivation',
        reason: [
          { type: 'cite', ref: 'thm.archimedean-density' },
          { type: 'algebra', note: '2^k ≥ k by induction.' },
        ],
        dependsOn: ['nest'],
        highlight: ['limit'],
      },
      {
        id: 'conclude',
        title: 'So the chosen terms converge to that point',
        claim: String.raw`
          |a_{n_k} - x| \le |I_k| \;\longrightarrow\; 0
          \qquad \text{hence} \qquad a_{n_k} \to x
        `,
        note: 'Both a_{n_k} and x lie in I_k, so their distance is at most its length. Given ε, take k with |I_k| < ε and every later term of the subsequence is within ε of x.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'pick' },
          { type: 'step', ref: 'point' },
          { type: 'step', ref: 'shrink' },
          { type: 'cite', ref: 'def.sequence-limit' },
        ],
        dependsOn: ['pick', 'point', 'shrink'],
        highlight: ['limit', 'picked'],
      },
    ],
  },
};
