import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Index used when the reader is on the statement rather than inside the argument. */
export const STATEMENT = -1;

export interface StepState {
  /** Current step index, or STATEMENT. */
  index: number;
  select(index: number): void;
  next(): void;
  previous(): void;
  atStart: boolean;
  atEnd: boolean;
}

/** The query parameter is 1-based because readers see it; the index is 0-based. */
function parseStep(params: URLSearchParams, stepCount: number): number {
  const raw = Number(params.get('step'));
  return Number.isInteger(raw) && raw >= 1 && raw <= stepCount ? raw - 1 : STATEMENT;
}

/**
 * The reader's position in an argument, held in the URL.
 *
 * The URL is the only source of truth: a link to a specific step is shareable,
 * the back button walks the argument, and opening a different entry starts at
 * its statement without any state to reset. Mirroring the position into React
 * state as well looks tempting for fast input, but then a navigation has two
 * sources disagreeing about the current step and whichever effect runs last
 * wins.
 *
 * Fast input is handled instead by `pending`, which tracks the latest requested
 * index synchronously. Router state does not settle within a tick, so several
 * arrow presses in quick succession would otherwise all compute their next
 * index from the same not-yet-updated URL and the reader would lose steps.
 */
export function useStepState(stepCount: number): StepState {
  const [params, setParams] = useSearchParams();
  const index = parseStep(params, stepCount);

  const pending = useRef(index);
  // Re-anchor on anything the reader did not do here: a navigation to another
  // entry, the back button, a pasted link.
  useEffect(() => {
    pending.current = index;
  }, [index]);

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.min(Math.max(target, STATEMENT), stepCount - 1);
      pending.current = clamped;
      setParams(
        (prev) => {
          const copy = new URLSearchParams(prev);
          if (clamped === STATEMENT) copy.delete('step');
          else copy.set('step', String(clamped + 1));
          return copy;
        },
        { replace: true },
      );
    },
    [setParams, stepCount],
  );

  const move = useCallback((delta: number) => goTo(pending.current + delta), [goTo]);
  const next = useCallback(() => move(1), [move]);
  const previous = useCallback(() => move(-1), [move]);

  // Arrow keys walk the argument; Home and End jump to its ends.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          move(1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          move(-1);
          break;
        case 'Home':
          event.preventDefault();
          goTo(STATEMENT);
          break;
        case 'End':
          event.preventDefault();
          goTo(stepCount - 1);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo, move, stepCount]);

  return {
    index,
    select: goTo,
    next,
    previous,
    atStart: index === STATEMENT,
    atEnd: index === stepCount - 1,
  };
}
