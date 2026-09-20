import type { Entry } from '../../types/entry';

/**
 * A numerical tail used as one uniform budget for a whole family of function
 * tails. This is the bridge from ordinary series to series of functions: the
 * proof is the Cauchy criterion plus the triangle inequality, with the order of
 * the quantifiers doing all the real work.
 */
export const weierstrassMTest: Entry = {
  id: 'thm.weierstrass-m-test',
  kind: 'theorem',
  title: 'Weierstrass M-test',
  statement: String.raw`
    |f_n(x)| \le M_n \ \text{ for every } x \in A,
    \qquad \sum_{n=1}^{\infty} M_n < \infty
    \quad\Longrightarrow\quad
    \sum_{n=1}^{\infty} f_n(x)
    \text{ converges uniformly and absolutely on } A
  `,
  informal:
    'Put every function term inside a numerical envelope, then add the envelopes. If their total is finite, their tails become small without asking which point x is under inspection. The same numerical tail therefore controls the whole graph of the function series at once.',
  tags: ['analysis', 'series', 'sequences of functions', 'uniform convergence'],
  figureId: 'weierstrass-m-test',
  hypotheses: [
    {
      id: 'uniform-majorant',
      label: 'the same Mₙ bounds every x',
      statement: String.raw`\forall n\;\forall x \in A : \ |f_n(x)| \le M_n`,
      note: 'Lets the numerical tail be chosen before x is known. Pointwise envelopes may each have finite total while their mass keeps moving to a new point, so no single N controls the whole domain.',
      withoutIt: {
        summary: 'A unit spike can move to a fresh point at every index.',
        statement: String.raw`
          A=\mathbb{N}, \qquad
          f_n(x)=\begin{cases}1 & x=n\\0 & x\ne n\end{cases}:
          \quad \sum_n |f_n(x)|=1 \text{ for each fixed }x,
          \quad \sup_x\left|\sum_{k> N}f_k(x)\right|=1
        `,
        note: 'Every point sees only one nonzero term, so its own absolute series is harmless. But after any proposed N, the point x=N+1 still sees a full-height term. The bound has to be shared across x, not rebuilt separately at each point.',
      },
    },
    {
      id: 'summable-majorant',
      label: 'the majorant series converges',
      statement: String.raw`M_n \ge 0, \qquad \sum_{n=1}^{\infty}M_n < \infty`,
      note: 'Makes the numerical tail shrink to zero. A uniform bound whose series has an infinite tail supplies no finite error budget for the function series.',
      withoutIt: {
        summary: 'A bound can be uniform and still have an infinite total.',
        statement: String.raw`
          f_n(x)=M_n=\frac1n \quad \text{for every }x\in[0,1]:
          \qquad \sum_{n=1}^{\infty}f_n(x)=\sum_{n=1}^{\infty}\frac1n=\infty
        `,
        note: 'The same number 1/n bounds every point perfectly, but its tails never become small. Uniformity cannot repair a numerical series that does not converge.',
      },
    },
  ],
  references: [
    { label: 'Karl Weierstrass, lectures on the theory of functions, c. 1860s' },
    { label: 'Rudin, Principles of Mathematical Analysis, Theorem 7.10' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'direct',
    given: [
      String.raw`f_n:A\to\mathbb{R}`,
      String.raw`M_n\ge0`,
      String.raw`|f_n(x)|\le M_n \text{ for every }n\text{ and }x`,
    ],
    steps: [
      {
        id: 'partial-sums',
        title: 'Name the two kinds of running total',
        claim: String.raw`
          S_n(x)=\sum_{k=1}^{n}f_k(x),
          \qquad B_n=\sum_{k=1}^{n}M_k
        `,
        note: 'The function series is a sequence of functions Sₙ; the majorant is an ordinary sequence of numbers Bₙ. The proof will spend convergence of the second sequence to control the first one everywhere at once.',
        role: 'setup',
        reason: [
          { type: 'cite', ref: 'def.series-convergence', note: 'an infinite series is its sequence of partial sums' },
        ],
        highlight: ['terms'],
      },
      {
        id: 'numerical-tail',
        title: 'Make every late numerical tail small',
        claim: String.raw`
          \forall\varepsilon>0\;\exists N\;\forall m>n\ge N:
          \qquad \sum_{k=n+1}^{m}M_k<\varepsilon
        `,
        note: 'The majorant series converges, so its partial sums satisfy the Cauchy criterion. N is chosen from ε alone; no point x has appeared, which is exactly why this number will be reusable across the whole domain.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'summable-majorant' },
          { type: 'cite', ref: 'thm.series-cauchy-criterion' },
          { type: 'step', ref: 'partial-sums' },
        ],
        dependsOn: ['partial-sums'],
        highlight: ['majorant-tail'],
      },
      {
        id: 'dominate-tail',
        title: 'Put every function tail under that same budget',
        claim: String.raw`
          |S_m(x)-S_n(x)|
          =\left|\sum_{k=n+1}^{m}f_k(x)\right|
          \le\sum_{k=n+1}^{m}|f_k(x)|
          \le\sum_{k=n+1}^{m}M_k<\varepsilon
        `,
        note: 'The triangle inequality turns a tail of signed function values into a tail of magnitudes, and the majorant bounds those term by term. Nothing in the estimate depends on x.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'numerical-tail' },
          { type: 'hypothesis', ref: 'uniform-majorant' },
          { type: 'algebra', note: 'Apply the triangle inequality to the finite tail sum.' },
        ],
        dependsOn: ['numerical-tail'],
        highlight: ['function-tail'],
      },
      {
        id: 'uniform-cauchy',
        title: 'One N now controls every point',
        claim: String.raw`
          \forall\varepsilon>0\;\exists N\;\forall m>n\ge N\;\forall x\in A:
          \qquad |S_m(x)-S_n(x)|<\varepsilon
        `,
        note: 'Read the order: N was fixed before x was named. So the sequence of partial-sum functions is uniformly Cauchy, rather than merely Cauchy at each point with a different starting index.',
        role: 'observation',
        reason: [{ type: 'step', ref: 'dominate-tail' }],
        dependsOn: ['dominate-tail'],
        highlight: ['uniform'],
      },
      {
        id: 'pointwise-limit',
        title: 'Completeness produces a sum at each point',
        claim: String.raw`
          \forall x\in A:\quad (S_n(x)) \text{ is Cauchy in }\mathbb{R}
          \quad\Longrightarrow\quad S_n(x)\to S(x)
        `,
        note: 'Freeze any x. The uniform Cauchy estimate is in particular an ordinary Cauchy estimate for the real numbers Sₙ(x), so completeness supplies their limit. Doing this for every x defines the candidate sum function S.',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'uniform-cauchy' },
          { type: 'cite', ref: 'thm.cauchy-criterion', note: 'Cauchy sequences of real numbers converge' },
        ],
        dependsOn: ['uniform-cauchy'],
        highlight: ['limit'],
      },
      {
        id: 'uniform-limit',
        title: 'Let the far endpoint run to the limit',
        claim: String.raw`
          n\ge N\;\Longrightarrow\;
          |S(x)-S_n(x)|
          \le\sum_{k=n+1}^{\infty}M_k
          \le\sum_{k=N+1}^{\infty}M_k<\varepsilon
          \quad\text{for every }x\in A
        `,
        note: 'Let m tend to infinity in the finite-tail estimate. The remaining error is bounded by one numerical tail, and that tail is below ε for every x. This is uniform convergence word for word.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'dominate-tail' },
          { type: 'step', ref: 'pointwise-limit' },
          { type: 'cite', ref: 'def.uniform-convergence' },
        ],
        dependsOn: ['dominate-tail', 'pointwise-limit'],
        highlight: ['band'],
      },
      {
        id: 'absolute',
        title: 'The same envelope also gives absolute convergence',
        claim: String.raw`
          0\le\sum_{k=1}^{n}|f_k(x)|\le\sum_{k=1}^{n}M_k
          \le\sum_{k=1}^{\infty}M_k
          \quad\Longrightarrow\quad
          \sum_{k=1}^{\infty}|f_k(x)|<\infty
        `,
        note: 'For each fixed x, the absolute partial sums increase and stay below the finite majorant total, so they converge. The theorem therefore gives both conclusions promised: uniform convergence of the function series and absolute convergence at every point.',
        role: 'conclusion',
        reason: [
          { type: 'hypothesis', ref: 'uniform-majorant' },
          { type: 'hypothesis', ref: 'summable-majorant' },
          { type: 'cite', ref: 'thm.monotone-convergence' },
        ],
        dependsOn: ['uniform-limit'],
        highlight: ['absolute'],
      },
    ],
  },
};
