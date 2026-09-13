import type { Entry } from '../../types/entry';

/**
 * The derivative, arrived at the way the continuity definition was: an
 * intuition about a picture, a quantity that measures it, and then the
 * ε–δ sentence that says what "the chords settle" means. The definition is
 * written without a separate notion of the limit of a function, because the
 * library does not have one: it is continuity of the difference quotient at
 * h = 0, and it cites the continuity definition to say so.
 */
export const derivative: Entry = {
  id: 'def.derivative',
  kind: 'definition',
  title: 'The derivative',
  statement: String.raw`
    f : I \to \mathbb{R}, \quad I \text{ an open interval}, \quad c \in I,
    \\[4pt]
    f'(c) = L
    \;\stackrel{\text{def}}{\iff}\;
    \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall h :
    \; 0 < |h| < \delta \;\Rightarrow\; \Bigl| \frac{f(c+h) - f(c)}{h} - L \Bigr| < \varepsilon
  `,
  informal:
    'The slope of the chord from (c, f(c)) to a nearby point of the graph, as the nearby point is brought in. The chord slopes need not settle on anything; when they do, the number they settle on is the derivative, and the line through (c, f(c)) with that slope is the tangent. Written out, the definition is the ε–δ sentence for continuity, applied to the chord slope as a function of h at h = 0 — where it has no value of its own, and the derivative is the value that would make it continuous.',
  tags: ['analysis', 'differentiation'],
  figureId: 'derivative',
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 5.1' }],
  timeline: {
    kind: 'motivation',
    given: [String.raw`f : I \to \mathbb{R}, \quad I \text{ open}, \quad c \in I`],
    steps: [
      {
        id: 'chord',
        title: 'First attempt: the slope of a chord',
        claim: String.raw`\frac{f(c+h) - f(c)}{h} \qquad (h \neq 0)`,
        note: 'The rate at which f changes between c and c + h: rise over run, for one particular run. It is a perfectly good number, but it depends on h, and it says as much about the far end of the chord as about c. The steepness of f at c itself is what is wanted, and a chord has two ends.',
        role: 'attempt',
        reason: [{ type: 'assumption', note: 'Start from the average rate of change.' }],
        highlight: ['chord'],
      },
      {
        id: 'shrink',
        title: 'Bring the far end in',
        claim: String.raw`h = 1,\ \tfrac12,\ \tfrac14,\ \ldots \qquad \text{the chords turn towards one line}`,
        note: 'For a smooth curve the chords through (c, f(c)) settle as h shrinks: their slopes stop changing appreciably, and the lines pile up on one another. That line is what the eye calls the tangent. The definition has to say what "settle" means without appealing to the eye.',
        role: 'observation',
        reason: [{ type: 'step', ref: 'chord' }],
        dependsOn: ['chord'],
        highlight: ['chords'],
      },
      {
        id: 'define',
        title: 'Say it with ε and δ',
        claim: String.raw`
          f'(c) = L \;\stackrel{\text{def}}{\iff}\;
          \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall h :
          \; 0 < |h| < \delta \;\Rightarrow\; \Bigl| \frac{f(c+h) - f(c)}{h} - L \Bigr| < \varepsilon
        `,
        note: 'An adversary names a tolerance ε; you must answer with a δ so that every chord shorter than δ has slope within ε of L. Choose δ small enough that c + h stays in I. This is the continuity sentence for the chord slope at h = 0: L fills its hole continuously. The clause 0 < |h| excludes the hole itself. At an endpoint of a closed interval only one side is available; restricting h to that side defines a one-sided derivative.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'shrink' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta', note: 'the same sentence, for the chord slope at h = 0' },
        ],
        dependsOn: ['shrink'],
        highlight: ['tangent'],
      },
      {
        id: 'tangent',
        title: 'What the derivative buys: a line that fits to first order',
        claim: String.raw`
          f(c + h) = f(c) + f'(c)\,h + r(h), \qquad \frac{r(h)}{h} \longrightarrow 0
        `,
        note: 'Rearranging the definition: the graph differs from the line f(c) + f′(c)h by an amount r(h) that is small even compared with h. Any other line through (c, f(c)) has an error proportional to h. That is what makes the tangent the tangent, and it is the form in which the derivative gets used — replace the function by its tangent line and control the error.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'define' },
          { type: 'algebra', note: 'Multiply the definition through by h.' },
        ],
        dependsOn: ['define'],
        highlight: ['tangent', 'error'],
      },
      {
        id: 'continuous',
        title: 'Differentiable at c means continuous at c',
        claim: String.raw`
          |f(c+h) - f(c)| = |h| \cdot \Bigl| \frac{f(c+h) - f(c)}{h} \Bigr|
          \le |h| \,(|f'(c)| + \varepsilon) \longrightarrow 0
        `,
        note: 'For |h| < δ the chord slope is within ε of f′(c), so it is bounded, and a bounded slope times a run tending to zero is a rise tending to zero. So a function with a derivative at c has no jump at c: differentiability is the stronger condition. The next step shows it is strictly stronger.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'define' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta' },
        ],
        dependsOn: ['define'],
        highlight: ['tangent'],
      },
      {
        id: 'corner',
        title: 'Check: it rejects a corner',
        claim: String.raw`
          f(x) = |x|, \; c = 0 : \qquad
          \frac{f(h) - f(0)}{h} = \begin{cases} 1 & h > 0 \\ -1 & h < 0 \end{cases}
        `,
        note: 'Continuous everywhere, and at 0 the chords from the right all have slope 1 while the chords from the left all have slope −1. No L is within ½ of both, so no δ answers ε = ½, and f has no derivative at 0. Continuity does not give differentiability; the graph can be unbroken and still have no single direction at a point.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'define' },
          { type: 'algebra', note: 'Compute the chord slopes on either side of 0.' },
        ],
        dependsOn: ['define'],
        highlight: ['corner'],
      },
    ],
  },
};
