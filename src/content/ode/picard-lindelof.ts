import type { Entry } from '../../types/entry';

/**
 * Where the climb was going.
 *
 * The two theorems the library ended on are both spent here, once each: the
 * continuous functions on a compact interval are a complete metric space, and
 * a contraction on a complete metric space has exactly one fixed point. The
 * only new move is the first step, which trades the derivative for an
 * integral so that the unknown becomes a point of that space.
 *
 * Both hypotheses switch off. Without the Lipschitz condition the map is not a
 * contraction and two solutions pass through the same point; existence
 * survives, which is worth seeing, since it shows exactly what the condition
 * was holding up. Without continuity the integral equation still has a fixed
 * point, but it cannot be differentiated back into a solution.
 */
export const picardLindelof: Entry = {
  id: 'thm.picard-lindelof',
  kind: 'theorem',
  title: 'Picard–Lindelöf: a differential equation has exactly one local solution',
  statement: String.raw`
    R = [t_0 - a,\, t_0 + a] \times [y_0 - b,\, y_0 + b], \qquad
    F : R \to \mathbb{R} \text{ continuous}, \qquad
    |F(t, y) - F(t, z)| \le L\,|y - z| \ \text{ on } R
    \\[6pt]
    \Longrightarrow\;
    \exists\, h > 0 \;\; \exists!\; y : [t_0 - h,\, t_0 + h] \to \mathbb{R} \text{ differentiable} : \quad
    y'(t) = F(t, y(t)), \quad y(t_0) = y_0
  `,
  informal:
    'A rule for the slope at every point, and a point to start from, determine one curve — at least for a while. The proof produces the curve rather than asserting it: rewrite the equation so that the unknown is a function rather than a number, notice that the rewritten equation says a certain map leaves the unknown alone, and hand the map to the fixed point theorem. Everything the library built is spent exactly once, and the answer comes with a recipe for computing it.',
  tags: ['analysis', 'differential equations', 'metric spaces'],
  figureId: 'picard',
  hypotheses: [
    {
      id: 'continuous',
      label: 'F is continuous',
      statement: String.raw`F \text{ is continuous on } R`,
      note: 'Does two jobs. It keeps the map inside the space of continuous functions, since the integral of a continuous function is continuous; and it is what lets the fixed point be differentiated back into a solution. Without it the integral equation and the differential equation part company.',
      withoutIt: {
        summary: 'The integral equation has a solution; the differential equation does not.',
        statement: String.raw`
          y' = \operatorname{sgn} t, \quad y(0) = 0 :
          \qquad T y = \int_0^{t} \operatorname{sgn} s \, ds = |t| \ \text{ for every } y,
          \quad\text{and } |t| \text{ has no derivative at } 0
        `,
        note: 'F does not depend on y at all, so it is Lipschitz with L = 0, and T is a contraction with factor 0: one application lands on the fixed point |t|, whatever the starting function. But a solution would have to satisfy y′ = sgn t on both sides of 0, which forces y = |t|, and |t| has no derivative there. The fixed point exists and is not a solution — the step that differentiates the integral needs a continuous integrand, and this is what happens without one.',
      },
    },
    {
      id: 'lipschitz',
      label: 'F is Lipschitz in y',
      statement: String.raw`\exists\, L : \; |F(t, y) - F(t, z)| \le L\,|y - z| \quad \text{for all } (t, y), (t, z) \in R`,
      note: 'Makes the map a contraction: two candidates within d of each other everywhere are, after one pass, within Lh·d of each other everywhere, and h can be chosen to make Lh < 1. It is the quantifier move one more time — a single L for the whole rectangle, fixed before any pair of points is named.',
      withoutIt: {
        summary: 'Two solutions through the same point.',
        statement: String.raw`
          y' = 2\sqrt{|y|}, \quad y(0) = 0 :
          \qquad y \equiv 0 \quad\text{and}\quad
          y(t) = \begin{cases} t^2 & t \ge 0 \\ 0 & t < 0 \end{cases}
          \quad \text{both solve it}
        `,
        note: 'F(t, y) = 2√|y| is continuous, and the equation has a solution — it has infinitely many, one for every moment the curve chooses to leave zero. Near y = 0 the ratio |F(t, y) − F(t, 0)| / |y| = 2/√|y| is unbounded, so no single L serves, and the map does not shrink distances there. What fails is only the step that separates two fixed points: existence survives, and it is uniqueness that this hypothesis was holding up.',
      },
    },
  ],
  references: [
    { label: 'Picard (1890), Lindelöf (1894); also called the Cauchy–Lipschitz theorem' },
    { label: 'Rudin, Principles of Mathematical Analysis, exercises 5.27 and 7.25 — uniqueness and existence, proved separately' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [String.raw`M = \max_R |F|`],
    steps: [
      {
        id: 'integral',
        title: 'Trade the derivative for an integral',
        claim: String.raw`
          y' = F(t, y), \;\; y(t_0) = y_0
          \quad\iff\quad
          y(t) = y_0 + \int_{t_0}^{t} F(s, y(s))\,ds
          \qquad (y \text{ continuous})
        `,
        note: 'A derivative is a limit at a point, and nothing in the library takes limits of those. An integral is a map on functions, and the library has a complete space of functions. The fundamental theorem of calculus is what permits the exchange: differentiate the right side and F(t, y(t)) comes out; integrate the left from t₀ and y(t) − y₀ comes out. Both directions need the integrand to be continuous, which it is when F and y are.',
        role: 'setup',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.fundamental-calculus' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta', note: 's ↦ F(s, y(s)) is continuous when F and y are' },
        ],
        highlight: ['field'],
      },
      {
        id: 'map',
        title: 'The right-hand side is a map on functions',
        claim: String.raw`
          (Ty)(t) = y_0 + \int_{t_0}^{t} F(s, y(s))\,ds,
          \qquad\text{so a solution is exactly a } y \text{ with } Ty = y
        `,
        note: 'T takes a continuous function and returns one: the integral of a continuous function is continuous in its upper limit. So "does the equation have a solution" has become "does T have a fixed point" — and the library has one theorem that answers questions of that shape, provided T lives on a complete metric space and shrinks distances by a fixed factor.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'integral' },
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.fundamental-calculus', note: 'the integral is continuous in its upper limit' },
        ],
        dependsOn: ['integral'],
        highlight: ['map'],
      },
      {
        id: 'interval',
        title: 'Choose the interval short',
        claim: String.raw`
          h = \min\!\Bigl( a,\ \tfrac{b}{M},\ \tfrac{1}{2L} \Bigr), \qquad I = [t_0 - h,\, t_0 + h]
        `,
        note: 'Three things are about to be asked of h, and each one shrinks it: stay inside the rectangle where F is defined, keep T from throwing candidates out of the band |y − y₀| ≤ b, and make the contraction factor Lh at most ½. M exists because a continuous function on a compact rectangle is bounded. The theorem is local because of the last two demands, and the observation at the end shows that it has to be.',
        role: 'construction',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.extreme-value', note: 'for a continuous function on a compact rectangle; stated on ℝ here, with the same proof' },
          { type: 'construction', note: 'Fix h once, before any candidate is named.' },
        ],
        dependsOn: ['map'],
        highlight: ['interval'],
      },
      {
        id: 'space',
        title: 'The space: continuous functions that stay in the band',
        claim: String.raw`
          X = \{\, y \in C(I) : |y(t) - y_0| \le b \ \text{ for all } t \in I \,\},
          \qquad d_\infty(y, z) = \max_{I} |y - z|,
          \qquad X \text{ is complete}
        `,
        note: 'C(I) is complete because I is compact — the previous theorem, applied to a closed bounded interval. X is the part of it within b of the constant y₀. A Cauchy sequence in X converges in C(I), and its limit is still within b of y₀ at every t, because every term was and a bound on every term past N bounds the limit. So X is complete: a closed part of a complete space is complete, which is the sequence form of closedness with functions as the points.',
        role: 'construction',
        reason: [
          { type: 'cite', ref: 'thm.continuous-functions-complete' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass', note: 'a closed bounded interval is compact' },
          { type: 'cite', ref: 'def.closed-set', note: 'the sequence form, one level up' },
          { type: 'cite', ref: 'def.sequence-limit', note: 'a bound on every term past N bounds the limit' },
          { type: 'cite', ref: 'def.complete-metric-space' },
        ],
        dependsOn: ['interval'],
        highlight: ['band'],
      },
      {
        id: 'into',
        title: 'T keeps X inside X',
        claim: String.raw`
          y \in X \;\Longrightarrow\;
          |(Ty)(t) - y_0| = \Bigl| \int_{t_0}^{t} F(s, y(s))\,ds \Bigr| \le M\,|t - t_0| \le M h \le b
        `,
        note: 'For y in X the points (s, y(s)) lie in R, so F is defined there and no larger than M. The integral over a stretch of length at most h is then at most Mh, and h was chosen to make that at most b. Without this the fixed point theorem has nowhere to be stated: T would be a map from X to somewhere larger, and its fixed point could be a function the argument never controlled.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'interval' },
          { type: 'step', ref: 'space' },
          { type: 'cite', ref: 'thm.fundamental-calculus', note: 'length of the interval times the largest value' },
        ],
        dependsOn: ['map', 'interval', 'space'],
        highlight: ['band', 'map'],
      },
      {
        id: 'contraction',
        title: 'Lipschitz makes T a contraction',
        claim: String.raw`
          |(Ty)(t) - (Tz)(t)| \le \int_{t_0}^{t} |F(s, y(s)) - F(s, z(s))|\,ds
          \le L\,h\, d_\infty(y, z),
          \qquad\text{so}\qquad d_\infty(Ty, Tz) \le \tfrac12\, d_\infty(y, z)
        `,
        note: 'Two candidates within d of each other everywhere are, after one pass through T, within Lh·d of each other everywhere — and Lh ≤ ½. The single L for the whole rectangle is what makes this one factor rather than a factor that depends on the pair; the fixed point theorem\u2019s own counterexample shows what happens when it does.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'lipschitz' },
          { type: 'step', ref: 'interval' },
          { type: 'cite', ref: 'thm.fundamental-calculus', note: 'length of the interval times the largest value, again' },
        ],
        dependsOn: ['into', 'interval'],
        highlight: ['shrink'],
      },
      {
        id: 'banach',
        title: 'So T has exactly one fixed point, and iteration finds it',
        claim: String.raw`
          \exists!\, y^\ast \in X : \; T y^\ast = y^\ast,
          \qquad
          y_{n+1} = T y_n \;\longrightarrow\; y^\ast \ \text{ uniformly on } I
        `,
        note: 'Everything the fixed point theorem asks for has been supplied: a complete metric space, a map of it into itself, a factor below 1. It hands back one fixed point and a sequence converging to it — and because the distance is d∞, the convergence is uniform. The iteration is Picard\u2019s: start from the constant y₀, feed it through the integral, repeat. For y′ = y the iterates are the partial sums of the exponential series.',
        role: 'derivation',
        reason: [
          { type: 'cite', ref: 'thm.banach-fixed-point' },
          { type: 'step', ref: 'space' },
          { type: 'step', ref: 'into' },
          { type: 'step', ref: 'contraction' },
          { type: 'cite', ref: 'def.uniform-convergence', note: 'convergence in d∞ is uniform convergence' },
        ],
        dependsOn: ['space', 'into', 'contraction'],
        highlight: ['iterate'],
      },
      {
        id: 'solution',
        title: 'The fixed point is the solution, and the only one',
        claim: String.raw`
          y^\ast(t) = y_0 + \int_{t_0}^{t} F(s, y^\ast(s))\,ds
          \;\Longrightarrow\;
          (y^\ast)' = F(t, y^\ast), \quad y^\ast(t_0) = y_0
        `,
        note: 'Run the first step backwards: y* is continuous, so F(s, y*(s)) is, so the integral is differentiable with that derivative. Conversely any solution on I is continuous, satisfies the integral equation, and stays within Mh ≤ b of y₀ by the same estimate that kept T inside X — so it lies in X, is a fixed point of T, and is y*. Existence and uniqueness, both.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'banach' },
          { type: 'step', ref: 'integral' },
          { type: 'step', ref: 'into', note: 'the same bound puts every solution inside X' },
          { type: 'cite', ref: 'thm.fundamental-calculus' },
        ],
        dependsOn: ['banach', 'integral', 'into'],
        highlight: ['solution', 'field'],
      },
      {
        id: 'local',
        title: 'Why only near t₀',
        claim: String.raw`
          y' = y^2, \;\; y(0) = 1
          \quad\Longrightarrow\quad
          y(t) = \frac{1}{1 - t},
          \qquad \text{which leaves every rectangle before } t = 1
        `,
        note: 'F(t, y) = y² is continuous and Lipschitz on every rectangle, so the theorem applies at every point — and the solution still cannot be continued past t = 1. The proof was not being wasteful: a solution can run out of the rectangle on which F has Lipschitz constant L, and on a larger rectangle L is larger and h smaller. Existence near a point is all a local condition can buy. It is also, applied point after point, exactly enough to follow a solution as far as it goes.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'solution' },
          { type: 'algebra', note: 'Separate the variables and integrate.' },
        ],
        dependsOn: ['solution'],
        highlight: ['blowup'],
      },
    ],
  },
};
