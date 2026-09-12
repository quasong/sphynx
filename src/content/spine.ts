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
      'What it means for terms to settle, and the two theorems that turn completeness into something that produces limits rather than merely promising them.',
    entries: ['def.sequence-limit', 'thm.monotone-convergence', 'thm.bolzano-weierstrass'],
  },
  {
    id: 'continuity',
    title: 'Continuity',
    blurb:
      'The ε–δ definition, and what it does not say: nothing stops the radius it promises from depending on where you asked.',
    entries: ['def.continuity-epsilon-delta'],
  },
  {
    id: 'compactness',
    title: 'Compactness',
    blurb:
      'Where closed and bounded stops being a description and starts doing work — attaining a maximum, and making one radius serve a whole set. Each condition here can be switched off to see what it was holding up.',
    entries: ['thm.extreme-value', 'def.uniform-continuity', 'thm.heine-cantor'],
  },
  {
    id: 'geometry',
    title: 'Geometry',
    blurb: 'Off the analysis thread, kept for what a dissection proof lets a figure do.',
    entries: ['thm.pythagoras'],
  },
];
