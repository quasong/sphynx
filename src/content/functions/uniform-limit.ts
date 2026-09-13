import type { Entry } from '../../types/entry';

/**
 * What the definition before it was for.
 *
 * The ε/3 argument, written so that the order of choices is visible: N from ε
 * alone, then δ from the one function N picks out, then x. That order is why
 * the convergence has to be uniform — a pointwise N would need to know x, and x
 * is not chosen until after δ, which already depends on N.
 *
 * Both hypotheses switch off. Dropping "uniform" is xⁿ again, and breaks the
 * step that bounds the outer gaps; dropping "each fₙ continuous" breaks the step
 * that borrows a radius. Each counterexample keeps the other condition.
 */
export const uniformLimit: Entry = {
  id: 'thm.uniform-limit-continuous',
  kind: 'theorem',
  title: 'A uniform limit of continuous functions is continuous',
  statement: String.raw`
    f_n : A \to \mathbb{R} \text{ continuous}, \;
    f_n \to f \text{ uniformly on } A
    \;\Longrightarrow\;
    f \text{ is continuous on } A
  `,
  informal:
    'Continuity survives a limit, provided the limit is taken all at once. f is known only through the fₙ, so the proof borrows its continuity from one of them — a single fₙ close to f everywhere — and that single n is exactly what convergence at each point cannot supply. It is why xⁿ lost its continuity in the limit, and the only reason.',
  tags: ['analysis', 'sequences of functions', 'continuity'],
  figureId: 'uniform-limit',
  hypotheses: [
    {
      id: 'continuous',
      label: 'every fₙ is continuous',
      statement: String.raw`f_n \text{ is continuous at every point of } A, \text{ for every } n`,
      note: 'Supplies the one radius in the proof. f has no continuity of its own to appeal to yet, so the δ has to come from some fₙ — and the argument needs that fₙ to have one.',
      withoutIt: {
        summary: 'Uniform convergence hands on continuity; it cannot create it.',
        statement: String.raw`
          f_n(x) = \begin{cases} \tfrac{1}{n} & x < 0 \\ 1 + \tfrac{1}{n} & x \ge 0 \end{cases}
          \;\longrightarrow\;
          f(x) = \begin{cases} 0 & x < 0 \\ 1 & x \ge 0 \end{cases},
          \qquad d_\infty(f_n, f) = \tfrac{1}{n}
        `,
        note: 'The approach could not be more uniform — every fₙ is the limit lifted by exactly 1/n — and every fₙ has the same jump the limit has. With no continuous term to borrow a radius from, there is nothing for the convergence to pass on.',
      },
    },
    {
      id: 'uniform',
      label: 'the convergence is uniform',
      statement: String.raw`
        \forall \varepsilon > 0 \;\; \exists N \;\; \forall n \ge N \;\; \forall x \in A : \;
        |f_n(x) - f(x)| < \varepsilon
      `,
      note: 'Picks one n that is close to f at every point at once — in particular at points near x₀ that have not been chosen yet. Without it the n that works at x₀ need not work anywhere near it.',
      withoutIt: {
        summary: 'Converging at each point lets the jump in.',
        statement: String.raw`
          f_n(x) = x^n \text{ on } [0, 1] \;\longrightarrow\;
          f(x) = \begin{cases} 0 & x < 1 \\ 1 & x = 1 \end{cases}
        `,
        note: 'Every xⁿ is continuous, and the sequence converges at every point, to a limit with a jump at 1. The proof dies where it picks N: at x₀ = 1 any n will do, but the points just left of 1 need n larger than any bound, and they are exactly the points the radius has to cover.',
      },
    },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [String.raw`x_0 \in A`, String.raw`\varepsilon > 0`],
    steps: [
      {
        id: 'target',
        title: 'What has to be found',
        claim: String.raw`
          \exists \delta > 0 \;\; \forall x \in A : \;
          |x - x_0| < \delta \;\Rightarrow\; |f(x) - f(x_0)| < \varepsilon
        `,
        note: 'Continuity of f at x₀, for the ε already given. The difficulty is that nothing is known about f directly: it is defined as a limit, and every fact about it has to be fetched from the functions converging to it.',
        role: 'setup',
        reason: [{ type: 'cite', ref: 'def.continuity-epsilon-delta' }],
        highlight: ['target'],
      },
      {
        id: 'detour',
        title: 'Go round by way of one fₙ',
        claim: String.raw`
          |f(x) - f(x_0)| \;\le\;
          \underbrace{|f(x) - f_n(x)|}_{1}
          + \underbrace{|f_n(x) - f_n(x_0)|}_{2}
          + \underbrace{|f_n(x_0) - f(x_0)|}_{3}
        `,
        note: 'The direct route from f(x) to f(x₀) is unknown ground. The detour goes down to fₙ at x, along fₙ to x₀, and back up to f — three legs, each of which one of the hypotheses can bound. Make each less than ε/3 and the whole trip is less than ε.',
        role: 'construction',
        reason: [
          { type: 'step', ref: 'target' },
          { type: 'algebra', note: 'The triangle inequality, twice.' },
        ],
        dependsOn: ['target'],
        highlight: ['legs'],
      },
      {
        id: 'outer',
        title: 'Uniform convergence bounds both ends with one N',
        claim: String.raw`
          \exists N : \;\; |f_N(y) - f(y)| < \tfrac{\varepsilon}{3} \quad \text{for every } y \in A
          \quad\Longrightarrow\quad \text{legs 1 and 3} < \tfrac{\varepsilon}{3}
        `,
        note: 'Leg 3 is at x₀, which is known. Leg 1 is at x, which is not: x will be any point within δ of x₀, and δ has not been found yet. So the n chosen here has to be close to f at points nobody has named — which is precisely what "for every y at once" provides.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'uniform' },
          { type: 'cite', ref: 'def.uniform-convergence' },
          { type: 'step', ref: 'detour' },
        ],
        dependsOn: ['detour'],
        highlight: ['tube'],
      },
      {
        id: 'middle',
        title: 'And f_N lends its radius to the middle leg',
        claim: String.raw`
          \exists \delta > 0 : \;\; |x - x_0| < \delta \;\Rightarrow\; |f_N(x) - f_N(x_0)| < \tfrac{\varepsilon}{3}
        `,
        note: 'With N now fixed, f_N is one particular continuous function, and continuity at x₀ with tolerance ε/3 gives a δ. This δ depends on N — which is why N had to be settled first, and settled without reference to x.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta' },
          { type: 'step', ref: 'outer' },
        ],
        dependsOn: ['outer'],
        highlight: ['window'],
      },
      {
        id: 'assemble',
        title: 'Add up the three legs',
        claim: String.raw`
          |x - x_0| < \delta \;\Longrightarrow\;
          |f(x) - f(x_0)| < \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} = \varepsilon
        `,
        note: 'For any x within δ of x₀, leg 1 is small because N was chosen for every point, leg 2 because δ was chosen for f_N, and leg 3 because N was chosen for x₀ too. That is the δ the target asked for.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'outer' },
          { type: 'step', ref: 'middle' },
          { type: 'step', ref: 'detour' },
        ],
        dependsOn: ['outer', 'middle'],
        highlight: ['legs', 'window'],
      },
      {
        id: 'order',
        title: 'The order of the choices is the proof',
        claim: String.raw`
          \varepsilon \;\longrightarrow\; N \;\longrightarrow\; \delta \;\longrightarrow\; x
        `,
        note: 'Each quantity is chosen knowing only what is to its left. Convergence at each point would give N depending on x — but x comes after δ, and δ after N, so the choice would have to see into its own future. For xⁿ at x₀ = 1 this is not a technicality: the points just left of 1 need N larger than any bound, and every δ contains them.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'assemble' },
          { type: 'cite', ref: 'def.uniform-continuity', note: 'the same question: may the choice know where it is being used?' },
        ],
        dependsOn: ['assemble'],
        highlight: ['order'],
      },
      {
        id: 'conclude',
        title: 'So f is continuous, and continuity does not leak out',
        claim: String.raw`
          f_n \text{ continuous}, \;\; d_\infty(f_n, f) \to 0
          \;\Longrightarrow\; f \text{ continuous}
        `,
        note: 'x₀ was arbitrary, so f is continuous on A. Read with d∞ as the distance, this is a closedness statement one level up: take a sequence of points in the set of continuous functions, let it converge, and the limit is still in the set. That is the shape of the next result — a closed part of a complete space is complete.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'assemble' },
          { type: 'cite', ref: 'def.closed-set', note: 'the sequence form, with functions as the points' },
        ],
        dependsOn: ['assemble'],
        highlight: ['legs'],
      },
    ],
  },
};
