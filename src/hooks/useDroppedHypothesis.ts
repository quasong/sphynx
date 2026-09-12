import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { HypothesisId } from '../types/entry';

export interface DroppedState {
  /** The hypothesis currently switched off, or null while the theorem stands. */
  dropped: HypothesisId | null;
  toggle(id: HypothesisId): void;
  restore(): void;
}

/**
 * Which hypothesis the reader has switched off.
 *
 * At most one at a time, and not as a limitation: each hypothesis carries a
 * counterexample that satisfies all the others, which is exactly what makes it
 * evidence that *this* condition was the one doing the work. Switch off two and
 * there is no such object to show, only an unspecified weaker theorem.
 *
 * Held in the URL like the step, so a link can point at a theorem with a
 * particular condition removed.
 */
export function useDroppedHypothesis(available: readonly HypothesisId[]): DroppedState {
  const [params, setParams] = useSearchParams();
  const raw = params.get('drop');
  const dropped = raw && available.includes(raw) ? raw : null;

  const set = useCallback(
    (next: HypothesisId | null) => {
      setParams(
        (prev) => {
          const copy = new URLSearchParams(prev);
          if (next === null) copy.delete('drop');
          else copy.set('drop', next);
          return copy;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const toggle = useCallback(
    (id: HypothesisId) => set(dropped === id ? null : id),
    [dropped, set],
  );

  const restore = useCallback(() => set(null), [set]);

  return { dropped, toggle, restore };
}
