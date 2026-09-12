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
 * `thm.bolzano-weierstrass`, `lem.even-square`, `def.metric-space`.
 */
export type EntryId = string;

/** A step id, unique within its own timeline. */
export type StepId = string;

/** A hypothesis id, unique within its own entry. */
export type HypothesisId = string;

export type EntryKind = 'theorem' | 'lemma' | 'corollary' | 'definition' | 'axiom';

/**
 * Why a step is true. Citations are the source of truth for an entry's
 * dependencies: the "references" shown in the UI are derived from these, never
 * written by hand, so the two can't drift apart.
 */
export type Justification =
  /** Uses one of the theorem's own hypotheses. */
  | { type: 'hypothesis'; ref: HypothesisId; note?: string }
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

/**
 * What a theorem's conclusion becomes when one of its hypotheses is removed.
 *
 * This is the one thing the medium does that a printed proof cannot: a reader
 * can switch a hypothesis off and watch both the picture and the argument fail.
 * Every hypothesis worth stating should be able to answer "and what if not?",
 * and a hypothesis with no counterexample is usually a hypothesis that was not
 * needed.
 */
export interface Counterexample {
  /** One line, shown on the hypothesis itself. */
  summary: string;
  /** The concrete object that breaks the conclusion. */
  statement?: Latex;
  /** What exactly goes wrong, and why the other hypotheses do not save it. */
  note?: string;
}

export interface Hypothesis {
  id: HypothesisId;
  /** Short enough to sit on a switch: "K is closed". */
  label: string;
  statement?: Latex;
  /** What this hypothesis buys, in the proof and in the picture. */
  note?: string;
  withoutIt?: Counterexample;
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
  /**
   * The conditions the statement depends on, named so that steps can cite them
   * and the reader can switch them off one at a time.
   */
  hypotheses?: readonly Hypothesis[];
  /**
   * Entries this one abstracts: the same idea restated where less structure is
   * available. Deliberately separate from citations — a generalisation does not
   * rest on the special case, it replaces it, and the library would stop being
   * readable in order if the two were mixed.
   */
  generalizes?: readonly EntryId[];
  timeline?: Timeline;
  source?: Source;
  references?: readonly Reference[];
}
