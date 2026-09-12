import type { Entry } from '../../types/entry';

/**
 * Stated, not proved. It is cited twice by the extreme value theorem, and a
 * citation should always resolve to something the reader can open.
 */
export const bolzanoWeierstrass: Entry = {
  id: 'thm.bolzano-weierstrass',
  kind: 'theorem',
  title: 'Bolzano–Weierstrass',
  statement: String.raw`
    \text{Every bounded sequence in } \mathbb{R}
    \text{ has a convergent subsequence.}
  `,
  informal:
    'Infinitely many points confined to a finite stretch of the line have to pile up somewhere. This is where boundedness turns into something usable: it does not stop a sequence from wandering, but it stops it from escaping, and a sequence that cannot escape must accumulate.',
  tags: ['analysis', 'sequences'],
  references: [{ label: 'A consequence of completeness, by repeated bisection' }],
};
