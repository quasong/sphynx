import type { Entry } from '../../types/entry';

/**
 * The word the compactness section has been using without a definition.
 *
 * On ℝ "compact" could stand for "closed and bounded", and the extreme value
 * theorem and Heine–Cantor were written that way. Carried into a metric space
 * the pair stops working, and each half fails on its own — so the entry is a
 * motivation with one counterexample per half, ending on the move the two
 * proofs were actually making.
 *
 * Sequential rather than by open covers: in a metric space the two agree, and
 * this is the form the proofs already in the library reach for.
 */
export const compact: Entry = {
  id: 'def.compact',
  kind: 'definition',
  title: 'Compact set',
  statement: String.raw`
    K \text{ is compact}
    \;\stackrel{\text{def}}{\iff}\;
    \text{every sequence in } K \text{ has a subsequence converging to a point of } K
  `,
  informal:
    'Bolzano–Weierstrass, turned from a theorem about bounded sets of reals into a property a set in any metric space may or may not have. On the line it says nothing new — compact is closed and bounded — but above the line that pair stops being enough, and this is what the theorems that used it were really asking for. In a metric space it agrees with the definition by open covers, which is the one that survives when there is no distance at all.',
  tags: ['analysis', 'metric spaces', 'compactness'],
  figureId: 'compact',
  generalizes: ['thm.bolzano-weierstrass'],
  references: [{ label: 'Fréchet (1906), who introduced the word together with metric spaces' }],
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'need',
        title: 'What closed and bounded was spent on',
        claim: String.raw`
          (x_n) \subset K \;\Longrightarrow\; x_{n_k} \to x \ \text{ for some subsequence, with } x \in K
        `,
        note: 'Every time the extreme value theorem or Heine–Cantor used the two conditions, it used them together and for the same move: bounded, so Bolzano–Weierstrass gives a convergent subsequence; closed, so its limit is still in K. Neither proof used either condition for anything else.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'thm.extreme-value' },
          { type: 'cite', ref: 'thm.heine-cantor' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass', note: 'bounded gives the subsequence' },
          { type: 'cite', ref: 'def.closed-set', note: 'closed keeps its limit in K' },
        ],
        highlight: ['settle'],
      },
      {
        id: 'attempt',
        title: 'First attempt: compact means closed and bounded',
        claim: String.raw`
          \text{bounded: } \exists\, p, M : \; d(x, p) \le M \ \ \forall x \in K
          \qquad
          \text{closed: } (x_n) \subset K,\ x_n \to x \Rightarrow x \in K
        `,
        note: 'Both words already make sense in any metric space — bounded is a ball that holds the set, and closed is word for word the sequence form the library uses — so the natural thing is to carry the pair up unchanged and call it compact. It fails, and each half fails separately.',
        role: 'attempt',
        reason: [
          { type: 'step', ref: 'need' },
          { type: 'cite', ref: 'def.metric-space' },
          { type: 'cite', ref: 'def.closed-set' },
        ],
        dependsOn: ['need'],
        highlight: ['settle'],
      },
      {
        id: 'bounded-fails',
        title: 'Bounded stops forcing anything to pile up',
        claim: String.raw`
          d(x, y) = \min\big(|x - y|,\, 1\big),
          \qquad K = \mathbb{N},
          \qquad d(m, n) = 1 \ \text{ for } m \neq n
        `,
        note: 'Cap the ordinary distance at 1. It is still a metric, and it agrees with |x − y| on every distance below 1, so exactly the same sequences converge and exactly the same sets are closed. ℕ is closed, as before — and now bounded, since nothing is further than 1 from anything. But 1, 2, 3, … is the sequence Bolzano–Weierstrass could not handle, unchanged: every term is 1 from every other, and no subsequence settles. Bounded was only ever a stand-in for piling up, and on ℝ with |·| it happened to be a good one.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'attempt' },
          { type: 'cite', ref: 'def.metric-space', note: 'one set carries many metrics' },
          { type: 'algebra', note: 'Truncating a metric at 1 keeps all three axioms.' },
        ],
        dependsOn: ['attempt'],
        highlight: ['capped'],
      },
      {
        id: 'closed-fails',
        title: 'Closed stops keeping the limit in',
        claim: String.raw`
          X = \mathbb{Q}, \qquad K = [0, 2] \cap \mathbb{Q},
          \qquad 1,\ 1.4,\ 1.41,\ 1.414,\ \ldots \;\to\; \sqrt{2} \notin \mathbb{Q}
        `,
        note: 'Inside ℚ this set is closed — a sequence in it that converges to a rational converges to one between 0 and 2 — and it is bounded. But the decimal approximations to √2 bunch up at a place that is not in the space, and every subsequence bunches up at the same place. Closed only ever meant closed in the surrounding space; if the space has a hole, the set can sit right against it without breaking the definition.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'attempt' },
          { type: 'cite', ref: 'thm.sqrt2-irrational' },
          { type: 'cite', ref: 'def.complete-metric-space', note: 'the same gap that stops ℚ being complete' },
        ],
        dependsOn: ['attempt'],
        highlight: ['rationals'],
      },
      {
        id: 'definition',
        title: 'Keep the move, not the description',
        claim: String.raw`
          K \text{ compact}
          \;\stackrel{\text{def}}{\iff}\;
          \text{every sequence in } K \text{ has a subsequence converging to a point of } K
        `,
        note: 'Neither condition was the point; the move they produced together was. So make the move the definition. Both counterexamples fail it, as they should — and nothing outside K is mentioned any more. Whether a set is compact is a question about its own points and distances, so a hole in the surrounding space has nowhere to hide.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'bounded-fails' },
          { type: 'step', ref: 'closed-fails' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass', note: 'its conclusion, promoted to a definition' },
        ],
        dependsOn: ['bounded-fails', 'closed-fails'],
        highlight: ['settle'],
      },
      {
        id: 'reals',
        title: 'On the line, nothing is lost',
        claim: String.raw`
          K \subset \mathbb{R}: \quad K \text{ compact} \iff K \text{ closed and bounded}
        `,
        note: 'One direction is Bolzano–Weierstrass followed by closedness — the two lines the proofs already had. For the other: an unbounded K holds points with |xₙ| > n, and no subsequence of those is bounded, let alone convergent; a K that is not closed holds a sequence converging to a point outside it, and every subsequence converges to that same point. So on ℝ the old description was right, and nothing proved under it needs revisiting.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'definition' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass' },
          { type: 'cite', ref: 'def.closed-set' },
          { type: 'cite', ref: 'def.sequence-limit', note: 'a subsequence has the same limit' },
        ],
        dependsOn: ['definition'],
        highlight: ['reals'],
      },
      {
        id: 'verbatim',
        title: 'And the two theorems climb with it',
        claim: String.raw`
          K \text{ compact}, \; f : K \to \mathbb{R} \text{ continuous}
          \;\Longrightarrow\;
          f \text{ attains its bounds, and is uniformly continuous}
        `,
        note: 'Read both proofs again with “compact” in place of “closed and bounded”, and d in place of |·|. Every use of the pair was the one move, and that move is now the definition, so neither proof changes a word. Two conditions that happened to work together on the line have become one property that means the same thing in every metric space.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'reals' },
          { type: 'cite', ref: 'thm.extreme-value' },
          { type: 'cite', ref: 'thm.heine-cantor' },
        ],
        dependsOn: ['reals'],
        highlight: ['settle'],
      },
    ],
  },
};
