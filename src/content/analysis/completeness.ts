import type { Entry } from '../../types/entry';

/**
 * Taken as given, like the other foundational entries in the library.
 *
 * The construction from Dedekind cuts is a genuine theorem, but it is not what
 * the course does anything with: what gets used, over and over, is the single
 * property stated here.
 */
export const completeness: Entry = {
  id: 'ax.completeness',
  kind: 'axiom',
  title: 'Completeness of the real numbers',
  statement: String.raw`
    \text{There is an ordered field } \mathbb{R} \supset \mathbb{Q}
    \text{ in which every non-empty set bounded above has a supremum.}
  `,
  informal:
    'ℝ is the ordered field that repairs exactly the defect the rationals have. This can be proved rather than assumed — ℝ can be built from ℚ by Dedekind cuts — but nothing later depends on how it was built, only on the property itself. Every theorem in analysis that fails over ℚ and holds over ℝ is ultimately cashing in this one sentence.',
  tags: ['analysis', 'foundations'],
  references: [
    { label: 'Rudin, Principles of Mathematical Analysis, 1.19 and the Appendix to Chapter 1' },
  ],
};
