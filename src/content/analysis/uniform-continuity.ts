import type { Entry } from '../../types/entry';

/**
 * The same three quantifiers as continuity, with one of them moved.
 *
 * Written as a motivation because the definition looks almost identical to the
 * one it strengthens, and the entire content is in the difference: whether the
 * radius is allowed to know where it is being asked about.
 */
export const uniformContinuity: Entry = {
  id: 'def.uniform-continuity',
  kind: 'definition',
  title: 'Uniform continuity',
  statement: String.raw`
    f \text{ is uniformly continuous on } A
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall x, y \in A :
    \; |x - y| < \delta \;\Rightarrow\; |f(x) - f(y)| < \varepsilon
  `,
  informal:
    'One radius that works everywhere. Ordinary continuity lets you choose δ after seeing which point you are asked about; uniform continuity asks for a single δ good for the whole set at once. The two definitions differ by the position of one quantifier, and that position is the whole subject.',
  tags: ['analysis', 'continuity'],
  figureId: 'uniform-continuity',
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'pointwise',
        title: 'Start from continuity at every point',
        claim: String.raw`
          \forall x_0 \in A \;\; \forall \varepsilon > 0 \;\; \exists \delta > 0 :
          \; |x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon
        `,
        note: 'Read the order: x₀ is fixed before δ is chosen, so δ may be tailored to the point as well as to the tolerance. Nothing so far says the same δ has to work twice.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.continuity-epsilon-delta' }],
        highlight: ['pointwise'],
      },
      {
        id: 'shrinking',
        title: 'And notice that the radius can depend on the point',
        claim: String.raw`
          f(x) = \tfrac{1}{x} : \quad
          \delta_{\max}(x_0) = \frac{\varepsilon\, x_0^{\,2}}{1 + \varepsilon\, x_0}
          \;\longrightarrow\; 0 \ \text{ as } x_0 \to 0
        `,
        note: 'The graph gets steeper towards 0, so holding the output inside a fixed band demands an ever narrower input window. Halve x₀ and the usable δ drops by roughly a factor of four. Every point has one; there is no smallest one.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'pointwise' },
          { type: 'algebra', note: 'Solve 1/(x₀ − δ) − 1/x₀ < ε for δ.' },
        ],
        dependsOn: ['pointwise'],
        highlight: ['shrinking'],
      },
      {
        id: 'demand',
        title: 'So demand one radius for the whole set',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall x, y \in A :
          \; |x - y| < \delta \Rightarrow |f(x) - f(y)| < \varepsilon
        `,
        note: 'Only one thing moved: the quantifier over points now comes after ∃δ instead of before it. So δ is chosen knowing ε and nothing else, and must then survive every pair of points in A.',
        role: 'refinement',
        reason: [{ type: 'step', ref: 'shrinking' }],
        dependsOn: ['shrinking'],
        highlight: ['uniform'],
      },
      {
        id: 'strictly-stronger',
        title: 'This is a genuine strengthening',
        claim: String.raw`
          x = \tfrac{1}{n}, \; y = \tfrac{1}{n+1} \ \text{ on } (0,1):
          \quad |x - y| = \tfrac{1}{n(n+1)} \to 0,
          \quad |f(x) - f(y)| = 1
        `,
        note: 'The two points can be brought as close together as you please and their images stay exactly 1 apart. So for ε = 1 no δ works at all, and 1/x is continuous on (0,1) without being uniformly continuous there. One example is enough to show the new definition asks for strictly more.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'demand' },
          { type: 'algebra', note: '1/(1/n) − 1/(1/(n+1)) = n − (n+1).' },
        ],
        dependsOn: ['demand'],
        highlight: ['uniform', 'violation'],
      },
      {
        id: 'one-way',
        title: 'The implication runs one way',
        claim: String.raw`\text{uniformly continuous on } A \;\Longrightarrow\; \text{continuous at every } x_0 \in A`,
        note: 'Take the uniform δ and use it at whichever point you are handed — a radius that works everywhere works in particular at x₀. The converse is what the previous step refutes.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'demand' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta' },
        ],
        dependsOn: ['demand'],
        highlight: ['uniform'],
      },
      {
        id: 'why',
        title: 'Why the distinction is worth a name',
        note: 'Where δ may depend on the point, a proof that works at each point separately need not assemble into a proof about the set — which is what integration and uniform convergence arguments constantly need. The distinction is also not permanent: on a closed bounded set it collapses, and every continuous function there is automatically uniformly continuous. That is the next entry, and it is the reason compactness earns its keep.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'strictly-stronger' },
          { type: 'step', ref: 'one-way' },
        ],
        dependsOn: ['strictly-stronger', 'one-way'],
        highlight: ['uniform'],
      },
    ],
  },
};
