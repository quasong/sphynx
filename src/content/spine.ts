import type { EntryId } from '../types/entry';

/**
 * The reading order of the library.
 *
 * Which results are load-bearing and which are supporting detail is a
 * pedagogical judgement, not something the citation graph can answer: a
 * definition cited three times can still be a footnote, and an axiom cited once
 * can be the whole foundation. So the trunk is declared here, in one place that
 * can be read as an outline, while everything else is placed against it
 * automatically by the citations already in the proofs.
 */
export interface SpineSection {
  id: string;
  title: string;
  blurb?: string;
  /** The trunk of this section, in the order it should be read. */
  entries: readonly EntryId[];
}

export const spine: readonly SpineSection[] = [
  {
    id: 'completeness',
    title: 'Completeness of ℝ',
    blurb:
      'Why the rationals are not enough, and the single property that repairs them. Ends by producing the number it began by showing is missing.',
    entries: [
      'thm.sqrt2-irrational',
      'def.supremum',
      'thm.q-incomplete',
      'ax.completeness',
      'thm.archimedean-density',
    ],
  },
  {
    id: 'sequences',
    title: 'Sequences',
    blurb:
      'What it means for terms to settle, the theorems that turn completeness into something which produces limits, and the restatement of completeness that survives the climb out of ℝ.',
    entries: [
      'def.sequence-limit',
      'thm.monotone-convergence',
      'thm.bolzano-weierstrass',
      'def.cauchy-sequence',
      'thm.cauchy-criterion',
    ],
  },
  {
    id: 'continuity',
    title: 'Continuity',
    blurb:
      'The ε–δ definition, and what it does not say: nothing stops the radius it promises from depending on where you asked.',
    entries: ['def.continuity-epsilon-delta', 'thm.intermediate-value'],
  },
  {
    id: 'compactness',
    title: 'Compactness',
    blurb:
      'Where closed and bounded stops being a description and starts doing work — attaining a maximum, and making one radius serve a whole set. Each condition here can be switched off to see what it was holding up.',
    entries: ['thm.extreme-value', 'def.uniform-continuity', 'thm.heine-cantor'],
  },
  {
    id: 'differentiation',
    title: 'Differentiation',
    blurb:
      'The slope of a chord, and what it means for the chords to settle — the continuity sentence again, for the chord slope at h = 0. Then the theorem that turns knowledge of the derivative everywhere into knowledge of the function: somewhere the tangent is parallel to the chord, which is the extreme value theorem spent on a tilted graph.',
    entries: ['def.derivative', 'thm.mean-value'],
  },
  {
    id: 'integration',
    title: 'Integration',
    blurb:
      'Area, trapped between rectangles from below and above, and defined only when the trap closes. It closes for every continuous function — one δ for the whole interval is what lets one partition be fine enough everywhere, so this is where uniform continuity is spent. And then the theorem that joins the two sections: the area under g grows at the rate g, and a function is its starting value plus the integral of its derivative.',
    entries: ['def.riemann-integral', 'thm.continuous-integrable', 'thm.fundamental-calculus'],
  },
  {
    id: 'series',
    title: 'Series',
    blurb:
      'Infinite sums read as limits of running totals — where the terms going to zero is necessary but not sufficient, and the Cauchy tail test is the sequence criterion in disguise. Power series turn the Taylor polynomial into an infinite polynomial; a single radius separates absolute convergence from divergence; Taylor\'s theorem says what is left over, in one term involving a derivative somewhere in between.',
    entries: [
      'def.series-convergence',
      'thm.series-cauchy-criterion',
      'def.power-series',
      'thm.radius-of-convergence',
      'thm.taylor-theorem',
    ],
  },

  {
    id: 'metric',
    title: 'Metric spaces',
    blurb:
      'The same definitions with |x − y| replaced by a distance, which costs nothing and buys everything above ℝ. Closed and bounded is the one description that does not survive the trip, and what replaces it is the move it was being used for. Ends with a theorem that produces its own answer rather than asserting one exists.',
    entries: [
      'def.metric-space',
      'def.complete-metric-space',
      'def.compact',
      'thm.banach-fixed-point',
    ],
  },
  {
    id: 'functions',
    title: 'Sequences of functions',
    blurb:
      'Convergence one level up, where each term is a function. Asked point by point it lets continuity fall out of the limit; the repair is the quantifier move from uniform continuity, made a second time. A summable numerical envelope then controls a whole function series at once, and uniform convergence turns functions into the points of a metric space, complete whenever the domain is compact. Equicontinuity makes the same move across a family, and Arzelà–Ascoli is Bolzano–Weierstrass for those families: a shared δ upgrades a diagonal subsequence into a uniform limit.',
    entries: [
      'def.uniform-convergence',
      'thm.weierstrass-m-test',
      'thm.uniform-limit-continuous',
      'thm.continuous-functions-complete',
      'def.equicontinuity',
      'thm.arzela-ascoli',
    ],
  },
  {
    id: 'ode',
    title: 'Differential equations',
    blurb:
      'Where the climb was going. The fundamental theorem of calculus turns a derivative into an integral, which is a map on functions; a rule for the slope at every point then determines one curve through a given point, and the proof produces the curve, by handing that map to the fixed point theorem on the complete space just built. Every theorem above is spent here exactly once.',
    entries: ['thm.picard-lindelof', 'thm.gronwall'],
  },
];

/** The next trunk entry in the course's declared reading order. */
export function nextSpineEntry(id: EntryId): EntryId | undefined {
  const order = spine.flatMap((section) => section.entries);
  const position = order.indexOf(id);
  return position >= 0 ? order[position + 1] : undefined;
}
