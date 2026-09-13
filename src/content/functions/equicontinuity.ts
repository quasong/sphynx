import type { Entry } from '../../types/entry';

/**
 * The quantifier move from uniform continuity, made across a family of
 * functions rather than across the points of one function. One δ that every
 * member of the family must share.
 */
export const equicontinuity: Entry = {
  id: 'def.equicontinuity',
  kind: 'definition',
  title: 'Equicontinuity',
  statement: String.raw`
    \mathcal{F} \text{ a family of functions } K \to \mathbb{R}
    \\[4pt]
    \mathcal{F} \text{ is equicontinuous}
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall f \in \mathcal{F} \;\; \forall x, y \in K :
    \; |x - y| < \delta \;\Rightarrow\; |f(x) - f(y)| < \varepsilon
  `,
  informal:
    'One radius that works for every function in the family at once. Each member may be continuous on its own — even uniformly continuous — and still demand a δ that shrinks as you pass from one function to the next. Equicontinuity forbids that: δ is chosen knowing only ε, and must then serve every f in the family.',
  tags: ['analysis', 'sequences of functions', 'continuity'],
  figureId: 'equicontinuity',
  references: [
    {
      label:
        'Ascoli (1883) and Arzelà (1889); the shared-δ condition is what turns Bolzano–Weierstrass into a theorem about functions',
    },
  ],
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'each',
        title: 'Start from each function being continuous',
        claim: String.raw`
          \forall f \in \mathcal{F} \;\; \forall x_0 \in K \;\; \forall \varepsilon > 0 \;\; \exists \delta > 0 :
          \; |x - x_0| < \delta \;\Rightarrow\; |f(x) - f(x_0)| < \varepsilon
        `,
        note: 'Read the order: f and x₀ are fixed before δ is chosen. So δ may depend on which function you are looking at, as well as on where. A family of continuous functions can still have δ running away as the index grows.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.continuity-epsilon-delta' }],
        highlight: ['each'],
      },
      {
        id: 'powers',
        title: 'Watch xⁿ on [0, 1]',
        claim: String.raw`
          f_n(x) = x^n :
          \quad |f_n(1) - f_n(1 - \tfrac{1}{n})| = 1 - \bigl(1 - \tfrac{1}{n}\bigr)^n \to 1 - e^{-1}
        `,
        note: 'Every fₙ is continuous — even uniformly continuous, by Heine–Cantor on the compact interval. Yet near 1 the graphs get steeper and steeper: points distance 1/n apart have images that stay a fixed gap apart. No single δ can serve every n for ε = ½.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'each' },
          { type: 'cite', ref: 'thm.heine-cantor', note: 'each fₙ is uniformly continuous on [0, 1]' },
          { type: 'algebra', note: '(1 − 1/n)^n → e⁻¹.' },
        ],
        dependsOn: ['each'],
        highlight: ['powers', 'runaway'],
      },
      {
        id: 'demand',
        title: 'So demand one δ for the whole family',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall f \in \mathcal{F} \;\; \forall x, y \in K :
          \; |x - y| < \delta \;\Rightarrow\; |f(x) - f(y)| < \varepsilon
        `,
        note: 'Only one thing moved: the quantifier over functions now comes after ∃δ. The same move that turned continuity into uniform continuity, applied one level up — across the family instead of across the domain.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'powers' },
          { type: 'cite', ref: 'def.uniform-continuity', note: 'the same quantifier shift, one level up' },
        ],
        dependsOn: ['powers'],
        highlight: ['uniform'],
      },
      {
        id: 'lipschitz',
        title: 'Check: a shared Lipschitz bound is enough',
        claim: String.raw`
          |f(x) - f(y)| \le L\,|x - y| \text{ for every } f \in \mathcal{F}
          \;\Longrightarrow\; \delta = \varepsilon / L \text{ works for the whole family}
        `,
        note: 'If every graph is at most as steep as a fixed slope L, one δ serves them all. The family of translates of a fixed continuous function on a compact set is another source of equicontinuity — the δ comes from one function and is shared by every translate.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'demand' },
          { type: 'algebra', note: 'Choose δ = ε/L when L > 0; any δ works when L = 0.' },
        ],
        dependsOn: ['demand'],
        highlight: ['uniform'],
      },
      {
        id: 'conclude',
        title: 'Equicontinuity is a uniform continuity across the family',
        claim: String.raw`
          \mathcal{F} \text{ equicontinuous}
          \;\stackrel{\text{def}}{\iff}\;
          \text{one } \delta(\varepsilon) \text{ serves every } f \in \mathcal{F}
        `,
        note: 'Alone it does not produce convergent subsequences — a family of constants escaping to infinity is equicontinuous and has none. Together with a bound on the values at each point, it is what Arzelà–Ascoli spends to turn Bolzano–Weierstrass into a theorem about functions.',
        role: 'conclusion',
        reason: [{ type: 'step', ref: 'demand' }],
        dependsOn: ['demand'],
        highlight: ['uniform'],
      },
    ],
  },
};
