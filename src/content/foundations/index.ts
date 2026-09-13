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

/**
 * Stated without proof, unlike the two definitions above which have nothing
 * to prove. There is no theory of integration in the library yet, and the one
 * theorem that needs one uses exactly the three facts stated here and nothing
 * else about integrals - so this is the honest leaf, the way the completeness
 * axiom is. When an integration section exists this entry gets a timeline and
 * nothing that cites it has to change.
 */
const fundamentalCalculus: Entry = {
  id: 'thm.fundamental-calculus',
  kind: 'theorem',
  title: 'Fundamental theorem of calculus',
  statement: String.raw`
    g : [a, b] \to \mathbb{R} \text{ continuous}
    \;\Longrightarrow\;
    G(t) = \int_a^{t} g(s)\,ds \ \text{ is differentiable, with } G' = g,
    \qquad
    \Bigl| \int_a^{t} g(s)\,ds \Bigr| \le (t - a) \max_{[a,b]} |g|
    \\[6pt]
    \text{and if } y \text{ is differentiable with } y' = g \text{ on } [a, b], \text{ then }
    y(t) = y(a) + \int_a^{t} g(s)\,ds
  `,
  informal:
    'Integration undoes differentiation, and for continuous integrands the other way round too. Stated for continuous functions only, because that is all that gets used: the integral of a continuous function exists, is continuous in its upper limit, is no larger than the length of the interval times the largest value, and differentiates back to the integrand. The last line is what turns a differential equation into an equation about integrals — a derivative is a limit at a point, which nothing in the library takes limits of, while an integral is a map on functions, and the library has a complete space of those.',
  tags: ['analysis', 'integration'],
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 6.20 and 6.21' }],
};

export const foundationEntries: readonly Entry[] = [rational, parity, fundamentalCalculus];
