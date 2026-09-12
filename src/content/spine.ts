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
    id: 'continuity',
    title: 'Continuity',
    blurb:
      'The ε–δ definition. Still unattached: the metric spaces and sequences that belong between it and the foundations are not written yet.',
    entries: ['def.continuity-epsilon-delta'],
  },
  {
    id: 'geometry',
    title: 'Geometry',
    blurb: 'Off the analysis thread, kept for what a dissection proof lets a figure do.',
    entries: ['thm.pythagoras'],
  },
];
