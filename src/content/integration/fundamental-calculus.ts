import type { Entry } from '../../types/entry';

/**
 * The two halves of the theorem, proved in the order they depend on each
 * other: first that integrating and then differentiating gives the integrand
 * back, which is the crudest estimate of the integral on a shrinking
 * interval; then that differentiating and then integrating gives the function
 * back, which is the mean value theorem applied to the difference of two
 * functions with the same derivative.
 *
 * Everything the two sections before it built is spent here: integrability of
 * continuous functions, the two consequences stated with the definition of
 * the integral, the extreme value theorem twice more, and the mean value
 * theorem once. The single hypothesis switches off to a step function, whose
 * integral has a corner exactly where the integrand jumps.
 */
export const fundamentalCalculus: Entry = {
  id: 'thm.fundamental-calculus',
  kind: 'theorem',
  title: 'Fundamental theorem of calculus',
  statement: String.raw`
    a < b, \quad g : [a, b] \to \mathbb{R} \text{ continuous}
    \;\Longrightarrow\;
    G(t) = \int_a^{t} g(s)\,ds \ \text{ is continuous on } [a,b],
    \\[4pt]
    G'(t) = g(t) \quad (a < t < b), \qquad
    \Bigl| \int_u^{v} g(s)\,ds \Bigr| \le |v-u| \max_{[a,b]} |g| \quad (u,v \in [a,b])
    \\[6pt]
    y \text{ continuous on } [a,b], \quad y'=g \text{ on } (a,b)
    \;\Longrightarrow\; y(t) = y(a) + \int_a^{t} g(s)\,ds \quad (t \in [a,b])
  `,
  informal:
    'Integration undoes differentiation, and for continuous integrands the other way round too. The first half says that the area under g, as a function of its right-hand end, grows at exactly the rate g: push the end out by a little, and the sliver of new area is very nearly a rectangle of height g(t). The second half says that a function is recovered from its derivative up to its starting value. The last line is what turns a differential equation into an equation about integrals — a derivative is a limit at a point, while an integral is a map on functions, and the library has a complete space of those.',
  tags: ['analysis', 'integration', 'differentiation'],
  figureId: 'fundamental-calculus',
  hypotheses: [
    {
      id: 'continuous',
      label: 'g is continuous',
      statement: String.raw`g \text{ is continuous at every point of } [a, b]`,
      note: 'Makes g integrable, so that G exists at all; and at the one point t, it is what makes the largest and smallest value of g on a short interval around t both close to g(t), which is what squeezes the difference quotient of G onto g(t).',
      withoutIt: {
        summary: 'The area function has a corner where the integrand jumps.',
        statement: String.raw`
          g(s) = \begin{cases} 0 & s < 0 \\ 1 & s \ge 0 \end{cases}
          \quad\text{on } [-1, 1] :
          \qquad G(t) = \int_{-1}^{t} g = \max(0, t), \quad G'(0) \text{ does not exist}
        `,
        note: 'The step function is integrable — its sums can be squeezed by putting one cut near the jump — so G is defined. But G is 0 up to the jump and climbs with slope 1 after it: the chords from the left have slope 0, the chords from the right slope 1, and no number is within ½ of both. The squeeze fails because on every short interval around 0 the largest value of g is 1 and the smallest is 0, however short the interval.',
      },
    },
  ],
  references: [
    { label: 'Jiří Lebl, Basic Analysis, §5.3', url: 'https://www.jirka.org/ra/html/sec_ftc.html' },
    { label: 'Newton and Leibniz, independently, c. 1670–1680; Barrow for the geometric form' },
    { label: 'Rudin, Principles of Mathematical Analysis, 6.20 and 6.21' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`a < b`, String.raw`t \in (a, b)`, String.raw`\varepsilon > 0`],
    steps: [
      {
        id: 'exists',
        title: 'The integral exists, so G is a function',
        claim: String.raw`
          g \text{ continuous on } [a, t] \;\Longrightarrow\; G(t) = \int_a^{t} g \ \text{ is a number, for every } t \in [a, b]
        `,
        note: 'Every continuous function on a closed bounded interval is integrable, and [a, t] is one. So the area under g from a to t is a well-defined number for each t, and G is a function of t. Nothing is yet known about how it varies.',
        role: 'setup',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.continuous-integrable' },
        ],
        highlight: ['area'],
      },
      {
        id: 'bounds',
        title: 'The crudest estimate: length times value',
        claim: String.raw`
          \Bigl( \min_{[a,t]} g \Bigr)(t - a) \le \int_a^{t} g \le \Bigl( \max_{[a,t]} g \Bigr)(t - a),
          \qquad\text{so}\qquad
          \Bigl| \int_a^{t} g \Bigr| \le (t - a) \max_{[a,b]} |g|
        `,
        note: 'The partition with no interior cut traps the integral between the minimum and maximum times the length; the extreme value theorem supplies those values. The same estimate on the interval between any u and v gives |∫ᵤᵛ g| ≤ |v − u| max|g|. Reversing the endpoints changes the sign, not the absolute value. For equal endpoints the integral is zero by convention.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'exists' },
          { type: 'cite', ref: 'def.riemann-integral', note: 'the partition {a, t}' },
          { type: 'cite', ref: 'thm.extreme-value', note: 'the sup and inf of g are attained' },
        ],
        dependsOn: ['exists'],
        highlight: ['coarse'],
      },
      {
        id: 'increment',
        title: 'Push the end out by h',
        claim: String.raw`G(t + h) - G(t) = \int_a^{t+h} g - \int_a^{t} g = \int_t^{t+h} g`,
        note: 'Take h ≠ 0 with t + h in [a, b]. Additivity gives the new sliver, with negative h removing area. Together with the preceding estimate this gives |G(v) − G(u)| ≤ |v − u| max|g| for all u, v in [a, b]. Thus G is continuous on the entire closed interval, including its endpoints, before we differentiate it.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'exists' },
          { type: 'cite', ref: 'def.riemann-integral', note: 'additivity, with the sign convention for h < 0' },
        ],
        dependsOn: ['exists'],
        highlight: ['sliver'],
      },
      {
        id: 'squeeze',
        title: 'The sliver is nearly a rectangle',
        claim: String.raw`
          J_h = [\min(t,t+h),\,\max(t,t+h)], \quad h \ne 0,
          \\[4pt]
          \min_{J_h} g = g(q_h) \;\le\; \frac{G(t + h) - G(t)}{h} \;\le\; g(p_h) = \max_{J_h} g,
          \quad p_h,q_h \in J_h
        `,
        note: 'The crudest estimate, applied to the sliver: its area lies between h times the lowest value of g on [t, t + h] and h times the highest. Divide by h and the difference quotient of G is trapped between two values that g actually takes, at points p_h and q_h within |h| of t. For h < 0 the interval is [t + h, t] and the same two inequalities come out after dividing by a negative number.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'increment' },
          { type: 'step', ref: 'bounds' },
          { type: 'cite', ref: 'thm.extreme-value', note: 'on the closed interval between t and t + h' },
        ],
        dependsOn: ['increment', 'bounds'],
        highlight: ['sliver', 'squeeze'],
      },
      {
        id: 'derivative',
        title: 'Continuity closes the trap: G′(t) = g(t)',
        claim: String.raw`
          0 < |h| < \delta \;\Longrightarrow\;
          |g(p_h) - g(t)| < \varepsilon, \;\; |g(q_h) - g(t)| < \varepsilon
          \;\Longrightarrow\;
          \Bigl| \frac{G(t + h) - G(t)}{h} - g(t) \Bigr| < \varepsilon
        `,
        note: 'g is continuous at the interior point t. Choose δ small enough that t ± δ remain in [a, b] and values within δ of t differ from g(t) by less than ε. Both p_h and q_h are that close, so the difference quotient trapped between their values is within ε of g(t). Thus G′(t) = g(t) on (a, b). At a the same argument allows only h > 0, and at b only h < 0: it gives the one-sided derivatives G′₊(a) = g(a) and G′₋(b) = g(b).',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'step', ref: 'squeeze' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta', note: 'of g at t, with tolerance ε' },
          { type: 'cite', ref: 'def.derivative' },
        ],
        dependsOn: ['squeeze'],
        highlight: ['tangent'],
      },
      {
        id: 'constant',
        title: 'Two functions with the same derivative differ by a constant',
        claim: String.raw`
          y' = g = G' \text{ on } (a, b)
          \;\Longrightarrow\; (y - G)' = 0
          \;\Longrightarrow\; (y - G)(t) - (y - G)(a) = 0 \cdot (t - a) = 0
        `,
        note: 'For the second half, assume y is continuous on [a, b] with derivative g in the interior. For any a < t ≤ b, y − G is continuous on [a, t] and has derivative zero on (a, t). The mean value theorem makes its chord slope zero, so its values at a and t agree. Derivatives subtract because their difference quotients subtract. Continuity at the endpoints is supplied by the stated assumption on y and the increment estimate for G.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'derivative' },
          { type: 'cite', ref: 'thm.mean-value', note: 'on [a, t], for the function y − G' },
          { type: 'step', ref: 'increment', note: 'G is continuous up to both endpoints' },
          { type: 'assumption', note: 'For this half, y is continuous on [a, b] and y′ = g in its interior.' },
          { type: 'cite', ref: 'def.derivative', note: 'difference quotients subtract, so derivatives subtract' },
        ],
        dependsOn: ['derivative', 'increment'],
        highlight: ['shift'],
      },
      {
        id: 'conclude',
        title: 'So integrating the derivative recovers the function',
        claim: String.raw`
          y(t) - G(t) = y(a) - G(a) = y(a)
          \;\Longrightarrow\;
          y(t) = y(a) + \int_a^{t} g(s)\,ds
        `,
        note: 'G(a) is the integral over an interval of length zero, which is zero. Both halves are now in hand: differentiate the integral and the integrand comes back; integrate the derivative and the function comes back, shifted to start where it started. Read together they say that, for continuous g, "y′ = g" and "y = y(a) + ∫g" are the same statement — one about a limit at each point, the other about a map on functions. The last section of the library is built on that exchange.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'constant' },
          { type: 'step', ref: 'derivative' },
          { type: 'algebra', note: 'The integral over [a, a] is 0.' },
        ],
        dependsOn: ['constant', 'derivative'],
        highlight: ['shift', 'tangent'],
      },
    ],
  },
};
