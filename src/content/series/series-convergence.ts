import type { Entry } from '../../types/entry';

/**
 * A series is not a new kind of limit but the limit of a sequence built from
 * it — the partial sums. The interesting content is that the terms going to
 * zero is not enough, which the harmonic series shows at once.
 */
export const seriesConvergence: Entry = {
  id: 'def.series-convergence',
  kind: 'definition',
  title: 'Convergent series',
  statement: String.raw`
    (a_n) \text{ a sequence}, \quad S_n = \sum_{k=1}^{n} a_k
    \\[4pt]
    \sum_{n=1}^{\infty} a_n = L
    \;\stackrel{\text{def}}{\iff}\;
    S_n \to L
  `,
  informal:
    'An infinite sum means the limit of what you get by stopping after one term, then two, then three. The whole question is whether those running totals settle — not whether the terms themselves shrink, which is necessary but far from sufficient.',
  tags: ['analysis', 'series'],
  figureId: 'series-convergence',
  references: [{ label: 'Rudin, Principles of Mathematical Analysis, 3.1' }],
  timeline: {
    kind: 'motivation',
    steps: [
      {
        id: 'intuition',
        title: 'First attempt: add the terms forever',
        claim: String.raw`\sum_{n=1}^{\infty} a_n \;\stackrel{?}{=}\; a_1 + a_2 + a_3 + \cdots`,
        note: 'The notation suggests a single number obtained by an endless addition. Before that can mean anything, "forever" has to be defined — and the library already has a definition for when a process settles: the limit of a sequence.',
        role: 'attempt',
        reason: [{ type: 'assumption', note: 'Start from the notation.' }],
        highlight: ['sum'],
      },
      {
        id: 'partial',
        title: 'Watch the running totals instead',
        claim: String.raw`
          S_n = a_1 + a_2 + \cdots + a_n,
          \qquad \sum_{n=1}^{\infty} a_n = L \;\stackrel{\text{def}}{\iff}\; S_n \to L
        `,
        note: 'Each S_n is a finite sum and an ordinary number. The infinite sum is defined to be the limit of this sequence — nothing more. Every question about convergence becomes a question about (S_n), which is the sequence limit machinery from the first section.',
        role: 'refinement',
        reason: [
          { type: 'step', ref: 'intuition' },
          { type: 'cite', ref: 'def.sequence-limit', note: 'S_n is an ordinary sequence' },
        ],
        dependsOn: ['intuition'],
        highlight: ['partial'],
      },
      {
        id: 'terms-vanish',
        title: 'Second attempt: the terms going to zero is enough',
        claim: String.raw`a_n \to 0 \;\Longrightarrow\; \sum a_n \text{ converges}`,
        note: 'If the terms shrink, each new one disturbs the total less and less — so the running totals ought to settle. The condition is necessary: if S_n → L then S_n − S_{n−1} = a_n → 0. The question is whether it is sufficient.',
        role: 'attempt',
        reason: [{ type: 'step', ref: 'partial' }],
        dependsOn: ['partial'],
        highlight: ['terms'],
      },
      {
        id: 'harmonic',
        title: 'The terms shrink; the totals do not',
        claim: String.raw`
          a_n = \tfrac{1}{n} \to 0,
          \quad S_n = H_n = 1 + \tfrac12 + \cdots + \tfrac1n \to \infty
        `,
        note: 'Each term is smaller than the last, yet the partial sums grow without bound. Controlling one term at a time says nothing about what many terms add up to — the same failure the Cauchy definition was written to repair, now for sums instead of differences.',
        role: 'counterexample',
        reason: [
          { type: 'step', ref: 'terms-vanish' },
          { type: 'algebra', note: 'Group the terms in blocks whose size doubles; each block contributes at least ½.' },
        ],
        dependsOn: ['terms-vanish'],
        highlight: ['harmonic', 'diverge'],
      },
      {
        id: 'geometric',
        title: 'Check: a series that does settle',
        claim: String.raw`
          |x| < 1 : \quad
          S_n = \sum_{k=0}^{n-1} x^k = \frac{1 - x^n}{1 - x} \;\longrightarrow\; \frac{1}{1 - x}
        `,
        note: 'The running totals have a closed form, and x^n → 0 drives it to a finite limit. This is the model of convergence the definition captures: not that individual terms vanish, but that the partial sums eventually stay within any tolerance of a number.',
        role: 'observation',
        reason: [
          { type: 'step', ref: 'partial' },
          { type: 'cite', ref: 'def.sequence-limit' },
          { type: 'algebra', note: 'Multiply S_n by (1 − x) and telescope.' },
        ],
        dependsOn: ['partial'],
        highlight: ['geometric', 'limit'],
      },
      {
        id: 'conclude',
        title: 'So a series converges when its partial sums do',
        claim: String.raw`
          \sum_{n=1}^{\infty} a_n = L
          \;\stackrel{\text{def}}{\iff}\;
          S_n = \sum_{k=1}^{n} a_k \to L
        `,
        note: 'The definition adds no new limit theory — it names a sequence (S_n) and asks whether it converges. What follows is applying the tests already built for sequences, starting with the Cauchy criterion, which never needs to produce the sum explicitly.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'harmonic' },
          { type: 'step', ref: 'geometric' },
        ],
        dependsOn: ['harmonic', 'geometric'],
        highlight: ['partial', 'limit'],
      },
    ],
  },
};
