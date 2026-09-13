import type { Entry } from '../../types/entry';

/**
 * Bolzano–Weierstrass one level up: from a bounded equicontinuous family of
 * continuous functions, extract a uniformly convergent subsequence. The proof
 * is a diagonal argument on a dense set, upgraded to uniform Cauchy by the
 * shared δ, then handed to completeness of C(K).
 */
export const arzelaAscoli: Entry = {
  id: 'thm.arzela-ascoli',
  kind: 'theorem',
  title: 'Arzelà–Ascoli',
  statement: String.raw`
    K = [a,b] \subset \mathbb{R}, \; a < b, \quad
    (f_n) \subset C(K)
    \\[4pt]
    \bigl\{ f_n : n \in \mathbb{N} \bigr\} \text{ equicontinuous and pointwise bounded}
    \;\Longrightarrow\;
    \exists\, (f_{n_k}) : \; f_{n_k} \to f \text{ uniformly on } K
    \text{ for some } f \in C(K)
  `,
  informal:
    'A sequence of continuous functions on a compact interval that stays equicontinuous and does not blow up at any point has a subsequence whose graphs settle into a tube around a continuous limit. It is Bolzano–Weierstrass for functions: the shared δ upgrades convergence on a dense countable set into uniform Cauchy, and completeness of C(K) finishes the job.',
  tags: ['analysis', 'sequences of functions', 'compactness'],
  figureId: 'arzela-ascoli',
  hypotheses: [
    {
      id: 'equicontinuous',
      label: 'the family is equicontinuous',
      statement: String.raw`
        \forall \varepsilon > 0 \;\; \exists \delta > 0 \;\; \forall n \;\; \forall x, y \in K :
        \; |x - y| < \delta \;\Rightarrow\; |f_n(x) - f_n(y)| < \varepsilon
      `,
      note: 'Supplies one δ that every term shares. Without it, convergence on a dense set need not control the gaps between the dense points — and uniform Cauchy fails.',
      withoutIt: {
        summary: 'xⁿ is pointwise bounded with no uniformly convergent subsequence.',
        statement: String.raw`
          f_n(x) = x^n \text{ on } [0, 1]:
          \quad 0 \le f_n \le 1,
          \quad \text{pointwise limit discontinuous at } 1
        `,
        note: 'Every subsequence converges pointwise to the same jump function, so none can converge uniformly — a uniform limit would be continuous. Equicontinuity is exactly what xⁿ lacks near 1.',
      },
    },
    {
      id: 'bounded',
      label: 'the family is pointwise bounded',
      statement: String.raw`
        \forall x \in K \;\; \exists M_x : \; |f_n(x)| \le M_x \text{ for every } n
      `,
      note: 'Hands Bolzano–Weierstrass a bounded sequence of numbers at each point of a dense set. Without a bound the diagonal argument has nothing to extract.',
      withoutIt: {
        summary: 'Constants escaping to infinity are equicontinuous and have no convergent subsequence.',
        statement: String.raw`
          f_n(x) = n \text{ on } [0, 1]:
          \quad |f_n(x) - f_n(y)| = 0,
          \quad d_\infty(f_n, f_m) = |n - m|
        `,
        note: 'As equicontinuous as a family can be — every graph is flat — and the distances between distinct terms refuse to shrink. Pointwise boundedness is what was missing.',
      },
    },
  ],
  references: [
    { label: 'Ascoli (1883); Arzelà (1889)' },
    { label: 'Rudin, Principles of Mathematical Analysis, 7.25' },
  ],
  timeline: {
    kind: 'proof',
    strategy: 'construction',
    given: [String.raw`a < b, \quad K=[a,b]`, String.raw`(f_n) \subset C(K)`],
    steps: [
      {
        id: 'dense',
        title: 'Pick a countable dense set in K',
        claim: String.raw`
          D = \{ q_1, q_2, q_3, \ldots \} \subset K,
          \qquad \overline{D} = K
        `,
        note: 'The rationals in [a,b] give a countable dense set. The subsequence will be built to converge on D first, then equicontinuity will spread that convergence to the whole interval. Restricting the statement to an interval keeps this construction inside the results proved in the library; a general compact metric space needs a separate separability lemma.',
        role: 'construction',
        reason: [
          { type: 'cite', ref: 'def.compact' },
          { type: 'cite', ref: 'thm.archimedean-density', note: 'ℚ is dense in ℝ, so ℚ ∩ [a,b] is dense in the interval' },
        ],
        highlight: ['dense'],
      },
      {
        id: 'diagonal',
        title: 'Extract a subsequence that converges at every point of D',
        claim: String.raw`
          \exists\, (f_{n_k}) : \;
          f_{n_k}(q_j) \text{ converges for every } j
        `,
        note: 'At q₁ the values fₙ(q₁) are bounded, so Bolzano–Weierstrass gives a convergent subsequence. At q₂ extract a further subsequence; continue. The diagonal subsequence — the k-th term of the k-th extraction — converges at every qⱼ, because from the j-th extraction on it is a subsequence of one that converges at qⱼ.',
        role: 'construction',
        reason: [
          { type: 'hypothesis', ref: 'bounded' },
          { type: 'cite', ref: 'thm.bolzano-weierstrass' },
          { type: 'step', ref: 'dense' },
        ],
        dependsOn: ['dense'],
        highlight: ['diagonal', 'dense'],
      },
      {
        id: 'cauchy-net',
        title: 'Equicontinuity upgrades D-convergence to uniform Cauchy',
        claim: String.raw`
          \forall \varepsilon > 0 \;\; \exists N \;\; \forall k, \ell \ge N \;\; \forall x \in K :
          \; |f_{n_k}(x) - f_{n_\ell}(x)| < \varepsilon
        `,
        note: 'Take δ from equicontinuity for ε/3. Compactness covers K by finitely many balls of radius δ, each centred at some qⱼ. On the finite set of those centres the diagonal subsequence is eventually Cauchy within ε/3. For any x, pick a centre within δ: the shared δ bounds the two outer gaps by ε/3, and the centre gap is already small — three legs, as in the uniform-limit argument.',
        role: 'derivation',
        reason: [
          { type: 'hypothesis', ref: 'equicontinuous' },
          { type: 'cite', ref: 'def.equicontinuity' },
          { type: 'cite', ref: 'def.compact', note: 'finite δ-net from sequential compactness' },
          { type: 'step', ref: 'diagonal' },
          { type: 'algebra', note: 'Triangle inequality through a nearby point of D.' },
        ],
        dependsOn: ['diagonal'],
        highlight: ['tube', 'equi'],
      },
      {
        id: 'complete',
        title: 'Completeness of C(K) produces the uniform limit',
        claim: String.raw`
          (f_{n_k}) \text{ uniformly Cauchy}
          \;\Longrightarrow\;
          f_{n_k} \to f \text{ uniformly}, \quad f \in C(K)
        `,
        note: 'A uniformly Cauchy sequence is Cauchy in d∞. The continuous functions on a compact set form a complete space, so the sequence converges to a continuous limit. Equicontinuity was spent getting to Cauchy; completeness is spent getting to a point of C(K).',
        role: 'derivation',
        reason: [
          { type: 'step', ref: 'cauchy-net' },
          { type: 'cite', ref: 'thm.continuous-functions-complete' },
          { type: 'cite', ref: 'def.uniform-convergence' },
        ],
        dependsOn: ['cauchy-net'],
        highlight: ['limit', 'tube'],
      },
      {
        id: 'conclude',
        title: 'So every such sequence has a uniformly convergent subsequence',
        claim: String.raw`
          \mathcal{F} \subset C(K) \text{ equicontinuous and pointwise bounded}
          \;\Longrightarrow\;
          \text{every sequence in } \mathcal{F} \text{ has a subsequence convergent in } d_\infty
        `,
        note: 'Read as a compactness statement: the closure of F in C(K) is sequentially compact, hence compact. That is why the theorem is the Bolzano–Weierstrass of function space — and why existence proofs that produce an equicontinuous bounded sequence of candidates can pass to a uniformly convergent subsequence without constructing the limit by hand.',
        role: 'conclusion',
        reason: [
          { type: 'step', ref: 'complete' },
          { type: 'cite', ref: 'def.compact', note: 'sequential compactness in (C(K), d∞)' },
        ],
        dependsOn: ['complete'],
        highlight: ['limit'],
      },
    ],
  },
};
