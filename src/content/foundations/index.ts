import type { Entry } from '../../types/entry';

/**
 * Entries the library leans on but does not yet prove.
 *
 * Keeping them as real entries rather than inline prose means a citation
 * always resolves to something the reader can open, and the dependency graph
 * has honest leaves.
 */

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

export const foundationEntries: readonly Entry[] = [rational, parity];
