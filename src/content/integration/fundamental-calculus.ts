import type { Entry } from '../../types/entry';

/**
 * On the trunk, and stated without proof - like the completeness axiom, which
 * is the other result the whole library rests on without deriving. There is no
 * theory of integration here yet; the theorem that needs one uses exactly the
 * three facts stated below and nothing else about integrals. When an
 * integration section exists this entry gets a timeline and a figure, and
 * nothing that cites it has to change.
 */
export const fundamentalCalculus: Entry = {
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
