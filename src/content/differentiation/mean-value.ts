import type { Entry } from '../../types/entry';

/**
 * The theorem that lets a statement about the derivative at every point be
 * turned into a statement about the function on the whole interval. It is
 * what the fundamental theorem of calculus needs to get from "these two
 * functions have the same derivative" to "they differ by a constant".
 *
 * The proof is the extreme value theorem plus one observation about what a
 * derivative can be at an interior extremum, so compactness is spent again,
 * this time on a set that is nothing more than a closed bounded interval.
 * Both hypotheses switch off, each with a picture that the other keeps.
 */
export const meanValue: Entry = {
  id: 'thm.mean-value',
  kind: 'theorem',
  title: 'Mean value theorem',
  statement: String.raw`
    a < b, \quad f : [a, b] \to \mathbb{R} \text{ continuous}, \;
    f \text{ differentiable on } (a, b)
    \;\Longrightarrow\;
    \exists\, c \in (a, b) : \; f'(c) = \frac{f(b) - f(a)}{b - a}
  `,
  informal:
    'Somewhere between a and b the graph has a tangent parallel to the chord joining its ends: at some moment the instantaneous rate equals the average rate. The content is not the value of c, which the theorem does not locate, but the consequence — if the derivative is known everywhere, the function is known up to a constant, because two functions with the same derivative have a chord of slope zero between any two points of their difference.',
  tags: ['analysis', 'differentiation'],
  figureId: 'mean-value',
  hypotheses: [
    {
      id: 'continuous',
      label: 'f is continuous on [a, b]',
      statement: String.raw`f \text{ is continuous at every point of } [a, b], \text{ the endpoints included}`,
      note: 'Hands the tilted function to the extreme value theorem, which is what produces the point c. Without continuity at the endpoints in particular, the function can be steep everywhere inside and still return to where it started by jumping.',
      withoutIt: {
        summary: 'The chord is level; the graph never is.',
        statement: String.raw`
          f(x) = \begin{cases} x & 0 \le x < 1 \\ 0 & x = 1 \end{cases}
          \qquad \frac{f(1) - f(0)}{1 - 0} = 0, \quad f'(x) = 1 \text{ on } (0, 1)
        `,
        note: 'Differentiable at every interior point, with derivative 1 throughout — and the chord from (0, 0) to (1, 0) has slope 0, because the function drops back to 0 by a jump at the very end. The tilted function has no maximum: it climbs towards 1 and is thrown to 0 on arrival, exactly the failure the extreme value theorem\u2019s own counterexample shows.',
      },
    },
    {
      id: 'differentiable',
      label: 'f is differentiable on (a, b)',
      statement: String.raw`f'(x) \text{ exists for every } x \in (a, b)`,
      note: 'Gives the interior extremum something to say: at a maximum the chords from the left slope up and the chords from the right slope down, and only if both families converge to the same number can that number be forced to zero.',
      withoutIt: {
        summary: 'A corner where the tangent would have to be.',
        statement: String.raw`
          f(x) = |x| \text{ on } [-1, 1] :
          \qquad \frac{f(1) - f(-1)}{2} = 0, \quad f'(x) = \pm 1 \text{ for } x \neq 0
        `,
        note: 'Continuous, with a level chord, and the only place a level tangent could be is the one point where there is no tangent at all. The extreme value theorem still delivers the extremum, at 0 — but the step that reads the derivative off it has nothing to read.',
      },
    },
  ],
  references: [
    { label: 'Lagrange (1797); Rolle (1691) for the case f(a) = f(b)' },
    { label: 'Rudin, Principles of Mathematical Analysis, 5.8 and 5.10' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`a < b`],
    steps: [
      {
        id: 'tilt',
        title: 'Subtract the chord',
        claim: String.raw`
          \varphi(x) = f(x) - \Bigl[ f(a) + \frac{f(b) - f(a)}{b - a}\,(x - a) \Bigr],
          \qquad \varphi(a) = \varphi(b) = 0
        `,
        note: 'Subtract the line through the endpoints. The resulting function is continuous on [a, b] and zero at both ends. These facts only need continuity; differentiability will enter when we read the slope at an interior extremum. The subtraction turns the search for a tangent parallel to the chord into a search for a level tangent.',
        role: 'construction',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'algebra', note: 'Subtract a continuous line and evaluate at a and b.' },
        ],
        highlight: ['chord', 'tilt'],
      },
      {
        id: 'extremes',
        title: 'φ has a maximum and a minimum',
        claim: String.raw`\exists\, p, q \in [a, b] : \; \varphi(q) \le \varphi(x) \le \varphi(p) \quad \forall x \in [a, b]`,
        note: 'A closed bounded interval is closed and bounded, and φ is continuous on it, so the extreme value theorem applies as it stands. This is the step that produces a point; everything after it is reading off what the derivative has to be there.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'thm.extreme-value' },
          { type: 'step', ref: 'tilt' },
        ],
        dependsOn: ['tilt'],
        highlight: ['extremum'],
      },
      {
        id: 'flat',
        title: 'If both extremes sit at the ends, φ is constant',
        claim: String.raw`
          \varphi(p) = \varphi(q) = 0 \;\Longrightarrow\; \varphi \equiv 0 \;\Longrightarrow\; \varphi'(c) = 0 \text{ for every } c \in (a, b)
        `,
        note: 'φ is zero at both endpoints, so if the maximum and the minimum are both endpoint values then the largest and smallest values of φ are both 0, and φ is 0 everywhere. A constant function has derivative 0, and any interior point serves as c. The interesting case is the other one.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'extremes' },
          { type: 'cite', ref: 'def.derivative', note: 'every chord of a constant has slope 0' },
        ],
        dependsOn: ['extremes'],
        highlight: ['flat'],
      },
      {
        id: 'fermat',
        title: 'Otherwise, an interior extremum has derivative zero',
        claim: String.raw`
          c \in (a, b) \text{ a maximum of } \varphi :
          \quad \frac{\varphi(c+h) - \varphi(c)}{h} \;
          \begin{cases} \le 0 & h > 0 \\ \ge 0 & h < 0 \end{cases}
          \;\Longrightarrow\; \varphi'(c) = 0
        `,
        note: 'If φ is not identically zero, its positive maximum or negative minimum cannot be at an endpoint, so an extremum c lies inside. Here differentiability enters: subtracting the chord subtracts its slope from each difference quotient, so φ′ exists. At a maximum those quotients are ≤ 0 for h > 0 and ≥ 0 for h < 0. Their common limit can only be 0. At a minimum the signs reverse and the same conclusion follows.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'differentiable' },
          { type: 'cite', ref: 'def.derivative', note: 'L must be within ε of chord slopes on both sides' },
          { type: 'step', ref: 'extremes' },
        ],
        dependsOn: ['extremes'],
        highlight: ['extremum', 'tangent'],
      },
      {
        id: 'conclude',
        title: 'So the tangent at c is parallel to the chord',
        claim: String.raw`
          0 = \varphi'(c) = f'(c) - \frac{f(b) - f(a)}{b - a}
          \;\Longrightarrow\;
          f'(c) = \frac{f(b) - f(a)}{b - a}
        `,
        note: 'In either case a c in (a, b) has φ′(c) = 0, and φ′ is f′ minus the chord\u2019s slope. Read with f(a) = f(b) this is Rolle\u2019s theorem; read with f′ ≡ 0 it says f is constant, which is the form the fundamental theorem of calculus will spend it in: two functions with the same derivative differ by a constant.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'flat' },
          { type: 'step', ref: 'fermat' },
          { type: 'step', ref: 'tilt' },
        ],
        dependsOn: ['flat', 'fermat', 'tilt'],
        highlight: ['tangent', 'chord'],
      },
    ],
  },
};
