import type { Entry } from '../../types/entry';

/**
 * Entries the library leans on but does not yet prove.
 *
 * Keeping them as real entries rather than inline prose means a citation
 * always resolves to something the reader can open, and the dependency graph
 * has honest leaves.
 */

const areaAdditivity: Entry = {
  id: 'ax.area-additivity',
  kind: 'axiom',
  title: 'Area is additive and motion-invariant',
  statement: String.raw`
    \text{If } R = R_1 \cup \dots \cup R_n \text{ with pairwise disjoint interiors, then }
    |R| = \sum_{i=1}^{n} |R_i|,
    \\[4pt]
    \text{and } |g(R)| = |R| \text{ for every rigid motion } g.
  `,
  informal:
    'Cutting a region into non-overlapping pieces and adding up their areas gives back the area you started with, and sliding or turning a piece does not change its area. Every dissection proof rests on exactly this.',
  tags: ['geometry', 'measure'],
};

const triangleAngleSum: Entry = {
  id: 'thm.triangle-angle-sum',
  kind: 'theorem',
  title: 'Angles of a triangle sum to a straight angle',
  statement: String.raw`\alpha + \beta + \gamma = \pi`,
  informal:
    'The three interior angles of any Euclidean triangle add up to 180°. In a right triangle this forces the two non-right angles to be complementary — they add to 90° — which is the fact the dissection proofs actually use.',
  tags: ['geometry'],
  references: [{ label: 'Euclid, Elements I.32' }],
};

const rational: Entry = {
  id: 'def.rational',
  kind: 'definition',
  title: 'Rational number',
  statement: String.raw`
    \mathbb{Q} = \left\{ \tfrac{p}{q} \;\middle|\; p, q \in \mathbb{Z},\; q \neq 0 \right\}
  `,
  informal:
    'A number is rational when it is a ratio of two integers. Every rational number has a representation in lowest terms: one where the numerator and denominator share no common factor. That normal form is what makes the number usable in a proof.',
  tags: ['number theory'],
};

const parity: Entry = {
  id: 'def.parity',
  kind: 'definition',
  title: 'Even and odd',
  statement: String.raw`
    n \text{ is even} \iff \exists k \in \mathbb{Z}: n = 2k,
    \qquad
    n \text{ is odd} \iff \exists k \in \mathbb{Z}: n = 2k + 1
  `,
  informal:
    'Every integer is exactly one of the two: the two cases are exhaustive and mutually exclusive. Both halves of that sentence get used — exhaustiveness lets a proof split into cases, exclusiveness turns "not odd" into "even".',
  tags: ['number theory'],
};

export const foundationEntries: readonly Entry[] = [
  areaAdditivity,
  triangleAngleSum,
  rational,
  parity,
];
