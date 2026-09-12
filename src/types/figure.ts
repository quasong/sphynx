import type { StepId } from './entry';

/**
 * The contract every figure component implements.
 *
 * A figure is a plain React component rendering SVG. It receives the reader's
 * current position in the timeline and decides for itself what to draw; there
 * is deliberately no scene description language in between. Because a figure
 * re-renders with new geometry on every step change, transitions come from CSS
 * on the elements that move.
 */
export interface FigureProps {
  /** Index into the entry's steps, or -1 when the reader is on the statement. */
  stepIndex: number;
  /** Id of the current step, or null on the statement. */
  stepId: StepId | null;
  /** Emphasis keys requested by the current step. */
  highlight: readonly string[];
}
