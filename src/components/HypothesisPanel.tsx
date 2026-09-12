import type { Entry, Hypothesis, HypothesisId } from '../types/entry';
import { MathExpr } from './MathExpr';

interface SwitchesProps {
  hypotheses: readonly Hypothesis[];
  dropped: HypothesisId | null;
  onToggle(id: HypothesisId): void;
}

/**
 * The switches, kept compact enough to sit directly under the figure.
 *
 * Adjacency is the whole point: flipping a condition and seeing the drawing
 * answer has to happen in one glance, so the switches live in the same pinned
 * column as the figure and carry nothing but their labels. The prose about what
 * each condition buys, and what breaks without it, appears beside the proof at
 * the moment it becomes relevant.
 */
export function HypothesisSwitches({ hypotheses, dropped, onToggle }: SwitchesProps) {
  if (hypotheses.length === 0) return null;

  return (
    <section className={`switches ${dropped ? 'switches--broken' : ''}`}>
      <h2>
        Hypotheses
        <span className="switches__hint">switch one off to see what it holds up</span>
      </h2>
      <ul>
        {hypotheses.map((hypothesis) => {
          const off = hypothesis.id === dropped;
          return (
            <li key={hypothesis.id}>
              <button
                type="button"
                className={`switch ${off ? 'is-off' : ''}`}
                onClick={() => onToggle(hypothesis.id)}
                aria-pressed={!off}
              >
                <span className="switch__track" aria-hidden="true" />
                <span className="switch__label">{hypothesis.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface BreakdownProps {
  entry: Entry;
  dropped: HypothesisId | null;
  onRestore(): void;
}

/**
 * What the reader gets back for switching a condition off: the object that
 * breaks the theorem, and notice that the argument below has stopped being one.
 * Both belong at the head of the proof, which is what they are about.
 */
export function HypothesisBreakdown({ entry, dropped, onRestore }: BreakdownProps) {
  const hypothesis = entry.hypotheses?.find((h) => h.id === dropped);
  const counterexample = hypothesis?.withoutIt;
  if (!hypothesis || !counterexample) return null;

  return (
    <section className="breakdown" role="status">
      <p className="breakdown__head">
        Without “{hypothesis.label}”: {counterexample.summary}
      </p>

      {counterexample.statement ? <MathExpr tex={counterexample.statement} display /> : null}
      {counterexample.note ? <p>{counterexample.note}</p> : null}

      {hypothesis.note ? (
        <p className="breakdown__buys">
          <span>What it was buying</span> {hypothesis.note}
        </p>
      ) : null}

      <p className="breakdown__void">
        The greyed steps below are the ones that fail, and everything resting on them
        falls with them.{' '}
        <button type="button" onClick={onRestore}>
          Put it back
        </button>
      </p>
    </section>
  );
}
