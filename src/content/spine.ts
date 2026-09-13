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
      'Convergence one level up, where each term is a function. Asked point by point it lets continuity fall out of the limit; the repair is the quantifier move from uniform continuity, made a second time — and it turns functions into the points of a metric space.',
    entries: ['def.uniform-convergence'],
  },
];
