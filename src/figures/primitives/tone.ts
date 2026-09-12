/**
 * Figure colour roles.
 *
 * Figures never name a colour directly; they pick a role, and the role resolves
 * to a CSS custom property that adapts to the light and dark themes. Keeping
 * this indirection is what lets every hand-written figure look like part of the
 * same system.
 */
export type Tone =
  /** First of a pair of comparable quantities - e.g. the shorter leg. */
  | 'a'
  /** Second of that pair - e.g. the longer leg. */
  | 'b'
  /** The quantity the result is about - e.g. the hypotenuse. */
  | 'c'
  /** Structural scaffolding: construction lines, grids, frames. */
  | 'neutral'
  /** The object currently under discussion. */
  | 'accent'
  /** Something broken: a counterexample, a violated constraint. */
  | 'warn'
  /** Something verified. */
  | 'good';

export function stroke(tone: Tone): string {
  return `var(--fig-${tone})`;
}

export function fill(tone: Tone): string {
  return `var(--fig-${tone}-fill)`;
}

/** Dimmed styling for parts of a figure outside the current step's focus. */
export const MUTED_OPACITY = 0.28;
