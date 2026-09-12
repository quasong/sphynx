import type { Entry } from '../../types/entry';

/**
 * The other great theorem about continuous functions on an interval, and the
 * one where the domain being all in one piece is a hypothesis rather than
 * scenery. Proved through the supremum rather than through connectedness,
 * which keeps it inside the machinery this library has already built.
 */
export const intermediateValue: Entry = {
  id: 'thm.intermediate-value',
  kind: 'theorem',
  title: 'Intermediate value theorem',
  statement: String.raw`
    f : [a,b] \to \mathbb{R} \text{ continuous}, \quad f(a) < c < f(b)
    \;\Longrightarrow\;
    \exists\, s \in (a,b) : \; f(s) = c
  `,
  informal:
    'A continuous function that starts below a level and ends above it has to take that level somewhere. The proof does not find the crossing by following the graph — it takes the last place the function is still below c and shows that continuity leaves it nowhere to be but exactly at c.',
  tags: ['analysis', 'continuity'],
  figureId: 'intermediate-value',
  hypotheses: [
    {
      id: 'continuous',
      label: 'f is continuous',
      statement: String.raw`f \text{ is continuous at every point of } [a,b]`,
      note: 'Stops the function changing level without passing through the levels between. Both halves of the proof are continuity arguments: one rules out f(s) < c, the other f(s) > c.',
      withoutIt: {
        summary: 'A jump steps over the level entirely.',
        statement: String.raw`
          f(x) = \begin{cases} 0 & x < 1 \\ 2 & x \ge 1 \end{cases}
          \quad \text{on } [0,2], \quad c = 1
        `,
        note: 'It starts below 1 and ends above it and is never equal to 1. The supremum of the points where f < 1 is still there — it is 1 — but f jumps across at exactly that point, which is what continuity was forbidding.',
      },
    },
    {
      id: 'interval',
      label: 'the domain is one interval',
      statement: String.raw`\text{the domain is } [a,b], \text{ not a union of separated pieces}`,
      note: 'Puts the supremum back inside the domain, and guarantees there are points of the domain immediately to its right. Both are used, and neither is available on a domain with a hole in it.',
      withoutIt: {
        summary: 'The level falls in the gap between the pieces.',
        statement: String.raw`
          D = [0,1] \cup [2,3], \quad
          f(x) = \begin{cases} 0 & x \in [0,1] \\ 2 & x \in [2,3] \end{cases},
          \quad c = 1
        `,
        note: 'Perfectly continuous on its domain — each piece is constant, and there is no point where it fails the ε–δ test. It starts below 1, ends above it, and never takes the value. The function is not at fault; the domain is.',
      },
    },
  ],
  source: { work: 'Sphynx', locator: 'Continuity, 2' },
  references: [{ label: 'Bolzano (1817), in the paper that also introduced Cauchy sequences' }],
  timeline: {
    kind: 'proof',
    strategy: 'contradiction',
    given: [String.raw`f(a) < c < f(b)`],
    steps: [
      {
        id: 'set',
        title: 'Take the points where f is still below c',
        claim: String.raw`S = \{ x \in [a,b] : f(x) \le c \}, \qquad a \in S, \quad S \le b`,
        note: 'Non-empty because f(a) < c, and bounded above by b. The crossing, if there is one, must be at the far edge of this set — so the proof looks there.',
        role: 'setup',
        reason: [{ type: 'construction', note: 'Collect the points still below the level.' }],
        highlight: ['below-set'],
      },
      {
        id: 'sup',
        title: 'It has a last point, and that point is in the domain',
        claim: String.raw`s = \sup S \in [a, b]`,
        note: 'Completeness supplies the supremum; the domain being one unbroken interval is what puts it back inside, where f can be evaluated. On a domain in two pieces the supremum of the lower piece is still a real number, but need not be a place where f is defined at all.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'interval' },
          { type: 'cite', ref: 'ax.completeness' },
          { type: 'cite', ref: 'def.supremum' },
        ],
        dependsOn: ['set'],
        highlight: ['below-set', 'sup'],
      },
      {
        id: 'not-below',
        title: 'It cannot be that f(s) < c',
        claim: String.raw`
          f(s) < c \;\Longrightarrow\; \exists \delta > 0 : \; f < c \text{ on } (s-\delta, s+\delta)
          \;\Longrightarrow\; s + \tfrac{\delta}{2} \in S
        `,
        note: 'Continuity with ε = c − f(s) keeps f below c on a whole neighbourhood. Since s < b, there are points of the domain just to the right of s — and they would belong to S, so s was not an upper bound after all.',
        role: 'contradiction',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'hypothesis', ref: 'interval', note: 'there are domain points just past s' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta' },
          { type: 'step', ref: 'sup' },
        ],
        dependsOn: ['sup'],
        highlight: ['sup', 'below-probe'],
      },
      {
        id: 'not-above',
        title: 'And it cannot be that f(s) > c',
        claim: String.raw`
          f(s) > c \;\Longrightarrow\; \exists \delta > 0 : \; f > c \text{ on } (s-\delta, s+\delta)
          \;\Longrightarrow\; s - \delta \text{ bounds } S
        `,
        note: 'Continuity with ε = f(s) − c keeps f above c nearby, so no point of S lies within δ of s. Then s − δ is an upper bound smaller than s, which the least upper bound forbids.',
        role: 'contradiction',
        reason: [
          { type: 'hypothesis', ref: 'continuous' },
          { type: 'cite', ref: 'def.continuity-epsilon-delta' },
          { type: 'cite', ref: 'def.supremum', note: 'clause (ii): nothing below s bounds S' },
          { type: 'step', ref: 'sup' },
        ],
        dependsOn: ['sup'],
        highlight: ['sup', 'above-probe'],
      },
      {
        id: 'conclude',
        title: 'So f(s) is exactly c',
        claim: String.raw`f(s) = c, \qquad s \in (a,b)`,
        note: 'The two cases are exhaustive for a real number, and both are impossible. Note that the proof never located the crossing by following the graph — it named a candidate using the supremum and let continuity close off every alternative.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'not-below' },
          { type: 'step', ref: 'not-above' },
        ],
        dependsOn: ['not-below', 'not-above'],
        highlight: ['crossing'],
      },
    ],
  },
};
