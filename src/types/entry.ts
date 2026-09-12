/**
 * The content model for Sphynx.
 *
 * Every piece of mathematics in the library - theorem, lemma, definition,
 * axiom - is an `Entry`. Entries cite each other, so the library as a whole is
 * a directed acyclic graph of mathematical dependencies.
 *
 * An entry's explanation is a `Timeline`: an ordered list of steps. For a
 * theorem the timeline is a proof; for a definition it is the sequence of
 * attempts and counterexamples that forces the definition into its final
 * shape. Both shapes render through the same machinery, which is why they
 * share a type.
 */

/** A LaTeX source string, rendered with KaTeX. */
export type Latex = string;

/**
 * A stable, human-readable entry id, namespaced by kind:
 * `thm.pythagoras`, `lem.even-square`, `def.continuity-epsilon-delta`.
 */
export type EntryId = string;

/** A step id, unique within its own timeline. */
export type StepId = string;

export type EntryKind = 'theorem' | 'lemma' | 'corollary' | 'definition' | 'axiom';

/**
 * Why a step is true. Citations are the source of truth for an entry's
 * dependencies: the "references" shown in the UI are derived from these, never
 * written by hand, so the two can't drift apart.
 */
export type Justification =
  /** Follows from another entry in the library. */
  | { type: 'cite'; ref: EntryId; note?: string }
  /** Follows from an earlier step of this same timeline. */
  | { type: 'step'; ref: StepId; note?: string }
  /** Routine symbolic manipulation, not worth an entry of its own. */
  | { type: 'algebra'; note: string }
  /** Something assumed for the sake of argument (and usually later refuted). */
  | { type: 'assumption'; note: string }
  /** A construction or choice the prover is free to make. */
  | { type: 'construction'; note: string };

/**
 * The role a step plays in its argument. This is presentation-relevant (it
 * drives the badge and accent colour of a step) but also documentation: a
 * reader can see the shape of the argument from the roles alone.
 */
export type StepRole =
  | 'setup'
  | 'assumption'
  | 'derivation'
  | 'construction'
  | 'observation'
  /** A definition candidate that is about to be shown inadequate. */
  | 'attempt'
  /** The example that breaks the current candidate. */
  | 'counterexample'
  /** A repair of the previous attempt. */
  | 'refinement'
  | 'contradiction'
  | 'conclusion';

export interface Step {
  id: StepId;
  /** Short imperative or declarative heading, e.g. "Assume a rational root". */
  title: string;
  /** The mathematical content of the step, if it has a formal statement. */
  claim?: Latex;
  /** Prose: what just happened and why it matters. */
  note?: string;
  role: StepRole;
  reason: readonly Justification[];
  /**
   * Earlier steps this one rests on. A proof is therefore a DAG even though it
   * is read top to bottom; the UI uses this to highlight what a step builds on.
   */
  dependsOn?: readonly StepId[];
  /**
   * Opaque keys handed to the figure so it can emphasise the matching parts of
   * the drawing. The figure component defines their meaning.
   */
  highlight?: readonly string[];
}

export interface Timeline {
  kind: 'proof' | 'motivation';
  /** How the argument proceeds; shown to the reader before they start. */
  strategy?: 'direct' | 'contradiction' | 'contrapositive' | 'induction' | 'construction' | 'cases';
  /** Everything the argument takes as given before step 1. */
  given?: readonly Latex[];
  steps: readonly Step[];
}

/** An external source for further reading. */
export interface Reference {
  label: string;
  url?: string;
}

/**
 * Where an entry sits in the course or text the library is following. Distinct
 * from `references`, which points outward for further reading: this says which
 * lecture a reader would have met the entry in.
 */
export interface Source {
  /** The course or text, e.g. "MIT 18.100B". */
  work: string;
  /** Where in it, e.g. "Lecture 2". */
  locator?: string;
}

export interface Entry {
  id: EntryId;
  kind: EntryKind;
  title: string;
  /** The formal statement, in LaTeX. */
  statement: Latex;
  /** A plain-English gloss of the statement, for orientation before the formalism. */
  informal?: string;
  /** Broad subject areas, used for grouping in the library index. */
  tags: readonly string[];
  /**
   * Key into the figure registry. Entries without a figure render their
   * timeline full-width rather than leaving an empty canvas.
   */
  figureId?: string;
  timeline?: Timeline;
  source?: Source;
  references?: readonly Reference[];
}
