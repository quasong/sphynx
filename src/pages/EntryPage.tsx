import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { KIND_LABEL, citationsOfStep, getEntry } from '../content';
import { EntryCard } from '../components/EntryBadge';
import { HypothesisPanel } from '../components/HypothesisPanel';
import { MathExpr } from '../components/MathExpr';
import { ReferencePanel } from '../components/ReferencePanel';
import { StepList } from '../components/StepList';
import { getFigure } from '../figures/registry';
import { STATEMENT, useStepState } from '../hooks/useStepState';
import { useDroppedHypothesis } from '../hooks/useDroppedHypothesis';
import { stepsBrokenWithout } from '../lib/hypotheses';

const STRATEGY_LABEL: Record<string, string> = {
  direct: 'Direct proof',
  contradiction: 'Proof by contradiction',
  contrapositive: 'Proof by contrapositive',
  induction: 'Proof by induction',
  construction: 'Proof by construction',
  cases: 'Proof by cases',
};

export function EntryPage() {
  const { id } = useParams();
  const entry = getEntry(id);
  const steps = entry?.timeline?.steps ?? [];
  const step = useStepState(steps.length);
  const hypotheses = entry?.hypotheses ?? [];
  const hypothesis = useDroppedHypothesis(hypotheses.map((h) => h.id));

  // Opening a different entry should start at the top of it, not wherever the
  // previous entry was scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!entry) {
    return (
      <main className="page page--narrow">
        <h1>Not in the library</h1>
        <p>
          No entry has the id <code>{id}</code>. <Link to="/">Back to the library</Link>.
        </p>
      </main>
    );
  }

  const timeline = entry.timeline;
  const Figure = getFigure(entry.figureId);
  const current = step.index >= 0 ? steps[step.index] : undefined;
  const stepCitations = timeline && current ? citationsOfStep(timeline, current.id) : [];
  const broken = timeline
    ? stepsBrokenWithout(timeline, hypothesis.dropped)
    : new Set<string>();

  // The stepper sits under the figure when there is one, and above the steps
  // when there is not - but an entry without a figure still needs the controls.
  const stepper = (
    <nav className="stepper" aria-label="Walk through the argument">
      <button type="button" onClick={step.previous} disabled={step.atStart}>
        ← Back
      </button>
      <span className="stepper__position">
        {step.index === STATEMENT ? 'Statement' : `Step ${step.index + 1} of ${steps.length}`}
      </span>
      <button type="button" onClick={step.next} disabled={step.atEnd}>
        {step.index === STATEMENT ? 'Start →' : 'Next →'}
      </button>
    </nav>
  );

  return (
    <main className={`page entry ${Figure ? '' : 'entry--no-figure'}`}>
      <header className="entry__head">
        <p className="entry__kind">
          {KIND_LABEL[entry.kind]}
          {timeline?.strategy ? ` · ${STRATEGY_LABEL[timeline.strategy] ?? timeline.strategy}` : ''}
        </p>
        <h1>{entry.title}</h1>
        {entry.source ? (
          <p className="entry__source">
            {entry.source.work}
            {entry.source.locator ? ` · ${entry.source.locator}` : ''}
          </p>
        ) : null}
        <MathExpr tex={entry.statement} display className="entry__statement" />
        {entry.informal ? <p className="entry__informal">{entry.informal}</p> : null}
        {timeline?.given && timeline.given.length > 0 ? (
          <div className="entry__given">
            <h2>Given</h2>
            <ul>
              {timeline.given.map((g) => (
                <li key={g}>
                  <MathExpr tex={g} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </header>

      <HypothesisPanel entry={entry} dropped={hypothesis.dropped} onToggle={hypothesis.toggle} />

      {timeline ? (
        <div className="entry__body">
          {Figure ? (
            <div className="entry__figure">
              <div className="entry__figure-sticky">
                <Figure
                  stepIndex={step.index}
                  stepId={current?.id ?? null}
                  highlight={current?.highlight ?? []}
                  dropped={hypothesis.dropped}
                />
                {stepper}
                {stepCitations.length > 0 ? (
                  <div className="entry__step-cites">
                    <h2>This step uses</h2>
                    <div className="references__grid">
                      {stepCitations.map((cid) => (
                        <EntryCard key={cid} id={cid} />
                      ))}
                    </div>
                  </div>
                ) : null}
                <p className="entry__hint">Arrow keys move between steps.</p>
              </div>
            </div>
          ) : null}

          <div className="entry__steps">
            <h2 className="entry__steps-title">
              {timeline.kind === 'proof' ? 'Proof' : 'Why the definition looks like this'}
            </h2>
            {hypothesis.dropped ? (
              <p className="entry__proof-void">
                With that condition removed the argument below no longer proves anything:
                the greyed steps are the ones that fail, and everything resting on them
                falls with them.{' '}
                <button type="button" onClick={hypothesis.restore}>
                  Put it back
                </button>
              </p>
            ) : null}
            {Figure ? null : (
              <div className="entry__steps-controls">
                {stepper}
                <p className="entry__hint">Arrow keys move between steps.</p>
              </div>
            )}
            <StepList
              timeline={timeline}
              selected={step.index}
              onSelect={step.select}
              hypotheses={hypotheses}
              dropped={hypothesis.dropped}
              broken={broken}
            />
          </div>
        </div>
      ) : (
        <p className="entry__stub">
          This entry is stated but not yet proved here. It is included because other
          arguments in the library cite it.
        </p>
      )}

      <ReferencePanel entry={entry} />
    </main>
  );
}
