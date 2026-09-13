import type { HypothesisId, StepId, Timeline } from '../types/entry';

/**
 * The steps that stop working when a hypothesis is removed.
 *
 * Derived from the citations inside the proof rather than declared: a step
 * breaks if it invokes the hypothesis, or if it rests on a step that does. The
 * second half is what makes the failure honest — a proof does not fail only at
 * the line that used the condition, it fails everywhere downstream of it.
 *
 * Steps are written in dependency order, so one pass forwards is enough.
 */
export function stepsBrokenWithout(
  timeline: Timeline,
  dropped: HypothesisId | null,
): ReadonlySet<StepId> {
  const broken = new Set<StepId>();
  if (!dropped) return broken;

  for (const step of timeline.steps) {
    const usesIt = step.reason.some(
      (reason) => reason.type === 'hypothesis' && reason.ref === dropped,
    );
    const restsOnBroken = (step.dependsOn ?? []).some((id) => broken.has(id)) ||
      step.reason.some((reason) => reason.type === 'step' && broken.has(reason.ref));
    if (usesIt || restsOnBroken) broken.add(step.id);
  }

  return broken;
}
