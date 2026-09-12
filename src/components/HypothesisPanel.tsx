import type { Entry, HypothesisId } from '../types/entry';
import { MathExpr } from './MathExpr';

interface HypothesisPanelProps {
  entry: Entry;
  dropped: HypothesisId | null;
  onToggle(id: HypothesisId): void;
}

/**
 * The conditions, as switches.
 *
 * A reader who can only read the hypotheses tends to treat them as paperwork
 * attached to the statement. Switching one off and watching the picture fail is
 * the difference between knowing a theorem has three conditions and knowing
 * what each of them is for.
 */
export function HypothesisPanel({ entry, dropped, onToggle }: HypothesisPanelProps) {
  const hypotheses = entry.hypotheses;
  if (!hypotheses || hypotheses.length === 0) return null;

  const active = hypotheses.find((h) => h.id === dropped);

  return (
    <section className={`hypotheses ${dropped ? 'hypotheses--broken' : ''}`}>
      <h2>Hypotheses</h2>
      <p className="hypotheses__hint">
        Switch one off to see what it was holding up. Each counterexample keeps the
        other conditions intact, so what fails is down to that condition alone.
      </p>

      <ul className="hypotheses__list">
        {hypotheses.map((hypothesis) => {
          const off = hypothesis.id === dropped;
          return (
            <li key={hypothesis.id}>
              <button
                type="button"
                className={`hypothesis ${off ? 'is-off' : ''}`}
                onClick={() => onToggle(hypothesis.id)}
                aria-pressed={!off}
              >
                <span className="hypothesis__switch" aria-hidden="true" />
                <span className="hypothesis__body">
                  <span className="hypothesis__label">{hypothesis.label}</span>
                  {hypothesis.statement ? (
                    <MathExpr tex={hypothesis.statement} className="hypothesis__statement" />
                  ) : null}
                  {hypothesis.note ? (
                    <span className="hypothesis__note">{hypothesis.note}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {active?.withoutIt ? (
        <div className="counterexample" role="status">
          <p className="counterexample__head">
            Without “{active.label}”: {active.withoutIt.summary}
          </p>
          {active.withoutIt.statement ? (
            <MathExpr tex={active.withoutIt.statement} display />
          ) : null}
          {active.withoutIt.note ? <p>{active.withoutIt.note}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
