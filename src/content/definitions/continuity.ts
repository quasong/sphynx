import type { Entry } from '../../types/entry';

/**
 * A definition entry: the timeline is not a proof but the sequence of failed
 * attempts that forces the definition into its final shape. Reading it in
 * order should make the quantifier order feel inevitable rather than arbitrary.
 */
export const continuity: Entry = {
  id: 'def.continuity-epsilon-delta',
  kind: 'definition',
  title: 'Continuity at a point (ε–δ)',
  statement: String.raw`
    f \text{ is continuous at } x_0
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall x :
    \; |x - x_0| < \delta \;\Rightarrow\; |f(x) - f(x_0)| < \varepsilon
  `,
  informal:
    'Read it as a game. An adversary names a tolerance ε around f(x₀); you must answer with a radius δ around x₀ small enough that the whole piece of graph above it stays inside the tolerance. f is continuous at x₀ exactly when you can always answer. The steps below show what goes wrong in every simpler formulation. Stated here for real functions of a real variable; the course gives it for maps between metric spaces, where |x − x₀| becomes a distance and nothing else changes.',
  tags: ['analysis'],
  figureId: 'epsilon-delta',
  references: [
    { label: 'Bolzano (1817) and Cauchy (1821) — the first ε-style arguments' },
    { label: 'Weierstraß — the modern formulation' },
  ],
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'pen',
        title: 'First attempt: draw it without lifting the pen',
        claim: String.raw`\text{“the graph of } f \text{ is unbroken”}`,
        note: 'This is the right intuition and a useless definition. It appeals to an act of drawing rather than to a property of f, it says nothing about a single point, and most functions cannot be drawn at all. Still, it tells us what to capture: no sudden jumps.',
        role: 'attempt',
        reason: [{ type: 'assumption', note: 'Start from the naive picture.' }],
        highlight: ['pen'],
      },
      {
        id: 'closeness',
        title: 'Second attempt: make it about closeness',
        claim: String.raw`x \text{ close to } x_0 \;\Longrightarrow\; f(x) \text{ close to } f(x_0)`,
        note: 'Now it is a statement about f at a point, which is progress. But "close" is not a mathematical relation — a pair of numbers is not close or far on its own, only closer than some stated amount. The fix has to be to quantify the amounts.',
        role: 'refinement',
        reason: [{ type: 'step', ref: 'pen' }],
        highlight: ['pen'],
      },
      {
        id: 'wrong-order',
        title: 'Third attempt: quantify — but in the wrong order',
        claim: String.raw`
          \exists \delta > 0 \;\; \forall \varepsilon > 0 \;\; \forall x :
          \; |x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon
        `,
        note: 'Both amounts are quantified now, so the statement is at least precise. Reading it aloud: there is one radius δ that works for every tolerance ε, no matter how small.',
        role: 'attempt',
        reason: [{ type: 'step', ref: 'closeness' }],
        highlight: ['wrong-order'],
      },
      {
        id: 'too-strong',
        title: 'That attempt rules out almost everything',
        claim: String.raw`
          \text{Take } f(x) = x,\; x_0 = 0. \text{ For any } \delta, \text{ choose }
          \varepsilon = \tfrac{\delta}{2} \text{ and } x = \tfrac{3\delta}{4}.
        `,
        note: 'Then |x − 0| < δ but |f(x) − f(0)| = 3δ/4 > ε. One δ can never serve every ε unless f is constant on the whole neighbourhood — so this version rejects even the identity function. The quantifier order is the bug: δ must be allowed to depend on ε.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'wrong-order' },
          { type: 'algebra', note: 'Exhibit an ε that defeats every fixed δ.' },
        ],
        dependsOn: ['wrong-order'],
        highlight: ['wrong-order', 'violation'],
      },
      {
        id: 'final',
        title: 'Swap the quantifiers — and that is the definition',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall x :
          \; |x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon
        `,
        note: 'ε comes first, so δ is chosen with ε already known and may depend on it. That single reordering is the entire content of the definition — everything else was already in the second attempt.',
        role: 'conclusion',
        reason: [{ type: 'step', ref: 'too-strong' }],
        dependsOn: ['too-strong'],
        highlight: ['final'],
      },
      {
        id: 'rejects-jump',
        title: 'Check: it rejects a jump',
        claim: String.raw`
          f(x) = \begin{cases} 0 & x < 0 \\ 1 & x \ge 0 \end{cases},
          \quad x_0 = 0, \quad \varepsilon = \tfrac{1}{2}
        `,
        note: 'Every δ-neighbourhood of 0 contains negative points, where f is 0 while f(0) = 1 — a gap of 1, well outside a tolerance of ½. No δ answers this ε, so the definition correctly calls f discontinuous at 0. The adversary only needed one ε to win.',
        role: 'counterexample',
        reason: [{ type: 'step', ref: 'final' }],
        dependsOn: ['final'],
        highlight: ['jump', 'violation'],
      },
      {
        id: 'accepts-smooth',
        title: 'Check: it accepts a parabola',
        claim: String.raw`
          f(x) = x^2,\; x_0 = 1: \quad \delta = \min\!\left(1, \tfrac{\varepsilon}{3}\right)
          \;\Longrightarrow\; |x^2 - 1| = |x-1|\,|x+1| < 3\delta \le \varepsilon
        `,
        note: 'Here δ is produced from ε by a formula, which is what "∃δ" asks for. Note the factor 3: it comes from bounding |x + 1| on the δ-neighbourhood, so the answer depends on where x₀ sits, not just on ε.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'final' },
          { type: 'algebra', note: 'Bound |x + 1| < 3 using δ ≤ 1, then force 3δ ≤ ε.' },
        ],
        dependsOn: ['final'],
        highlight: ['parabola'],
      },
      {
        id: 'why',
        title: 'Why the definition looks the way it does',
        note: 'Each clause earns its place: "∀ε" makes the guarantee arbitrarily tight, "∃δ" lets the answer adapt to the demand, and the implication restricts attention to a neighbourhood so that only local behaviour matters. Drop any one of them and the definition either admits jumps or excludes every non-constant function.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'rejects-jump' },
          { type: 'step', ref: 'accepts-smooth' },
        ],
        dependsOn: ['rejects-jump', 'accepts-smooth'],
        highlight: ['final'],
      },
    ],
  },
};
