import type { Entry } from '../types/entry';
import type { FigureProps } from '../types/figure';

/** The same props as EntryPage, for both the gallery and render checks. */
export function figureStates(entry: Entry): FigureProps[] {
  const steps = entry.timeline?.steps ?? [];
  return [null, ...(entry.hypotheses ?? []).map((h) => h.id)].flatMap((dropped) =>
    Array.from({ length: steps.length + 1 }, (_, position) => {
      const step = steps[position - 1];
      return {
        stepIndex: position - 1,
        stepId: step?.id ?? null,
        highlight: step?.highlight ?? [],
        dropped,
      };
    }),
  );
}
