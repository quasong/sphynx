import { useCallback, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { KIND_LABEL, getEntry } from '../content';
import { HypothesisBreakdown, HypothesisSwitches } from '../components/HypothesisPanel';
import { MathExpr } from '../components/MathExpr';
import { ReferencePanel } from '../components/ReferencePanel';
import { StepList } from '../components/StepList';
import { getFigure } from '../figures/registry';
import { STATEMENT, useStepState } from '../hooks/useStepState';
import { useCenteredSticky } from '../hooks/useCenteredSticky';
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

/**
 * Two columns, and which side a thing lands on is decided by whether the reader
 * acts on it or reads it.
 *
 * The left column is pinned and holds the figure with the controls that drive
 * it - the stepper and the hypothesis switches - because the value of a switch
 * is entirely in seeing the drawing answer it. The right column scrolls and
 * holds everything that is read rather than operated: the statement, what the
 * proof assumes, the steps, and the consequences of having switched something
 * off.
 */
export function EntryPage() {
  const { id } = useParams();
  const entry = getEntry(id);
  const steps = entry?.timeline?.steps ?? [];
  const step = useStepState(steps.length);
  const hypotheses = entry?.hypotheses ?? [];
  const hypothesis = useDroppedHypothesis(hypotheses.map((h) => h.id));
  const rail = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const railTop = useCenteredSticky(rail);

  // The figure is pinned inside the two-column body and stops being pinned once
  // that column runs out. Stepping must not scroll past that point, or the
  // drawing slides off the top just as the argument concludes.
  const scrollCeiling = useCallback(() => {
    const railElement = rail.current;
    const bodyElement = body.current;
    if (!railElement || !bodyElement) return Number.POSITIVE_INFINITY;
    const bottom = bodyElement.getBoundingClientRect().bottom + window.scrollY;
    return bottom - railElement.offsetHeight - railTop;
  }, [railTop]);

  // Opening a different entry should start at the top of it, not wherever the
  // previous entry was scrolled to - unless the link named a step, in which
  // case the reader asked for that step and the step list is already scrolling
  // it into view. Child effects run first, so without this check the jump to
  // the top would silently undo that.
  useEffect(() => {
    if (step.index === STATEMENT) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const broken = timeline ? stepsBrokenWithout(timeline, hypothesis.dropped) : new Set<string>();

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

      <div className="entry__body" ref={body}>
        {Figure ? (
          <div className="entry__figure">
            {/* Pinned at a measured offset so it settles into the middle of
                the screen, rather than inside a viewport-tall box that would
                leave a band of nothing above it before anything is scrolled. */}
            <div className="entry__figure-sticky" ref={rail} style={{ top: railTop }}>
              <Figure
                stepIndex={step.index}
                stepId={current?.id ?? null}
                highlight={current?.highlight ?? []}
                dropped={hypothesis.dropped}
              />
              {timeline ? stepper : null}
              <HypothesisSwitches
                hypotheses={hypotheses}
                dropped={hypothesis.dropped}
                onToggle={hypothesis.toggle}
              />
              {timeline ? (
                <p className="entry__hint">Arrow keys move between steps.</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="entry__reading">
          {/* Kept in this column rather than the header: switching a condition
              off must not resize the block above the figure, or the figure
              would jump every time a switch is thrown. */}
          <HypothesisBreakdown
            entry={entry}
            dropped={hypothesis.dropped}
            onRestore={hypothesis.restore}
          />

          {timeline ? (
            <div className="entry__steps">
              <h2 className="entry__steps-title">
                {timeline.kind === 'proof' ? 'Proof' : 'Why the definition looks like this'}
              </h2>
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
                scrollCeiling={scrollCeiling}
              />
            </div>
          ) : (
            <p className="entry__stub">
              This entry is stated but not yet proved here. It is included because other
              arguments in the library cite it.
            </p>
          )}

        </div>
      </div>

      <ReferencePanel entry={entry} />
    </main>
  );
}
