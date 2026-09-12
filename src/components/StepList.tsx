import { useEffect, useRef } from 'react';
import type {
  Hypothesis,
  HypothesisId,
  Justification,
  Step,
  StepId,
  StepRole,
  Timeline,
} from '../types/entry';
import { CitationBadge } from './EntryBadge';
import { MathExpr } from './MathExpr';

const ROLE_LABEL: Record<StepRole, string> = {
  setup: 'Setup',
  assumption: 'Assume',
  derivation: 'Derive',
  construction: 'Construct',
  observation: 'Observe',
  attempt: 'Attempt',
  counterexample: 'Counterexample',
  refinement: 'Refine',
  contradiction: 'Contradiction',
  conclusion: 'Conclude',
};

interface StepListProps {
  timeline: Timeline;
  selected: number;
  onSelect(index: number): void;
  hypotheses?: readonly Hypothesis[];
  /** The hypothesis currently switched off, if any. */
  dropped?: HypothesisId | null;
  /** Steps that no longer hold without it. */
  broken?: ReadonlySet<StepId>;
}

export function StepList({
  timeline,
  selected,
  onSelect,
  hypotheses = [],
  dropped = null,
  broken,
}: StepListProps) {
  const positions = new Map(timeline.steps.map((s, i) => [s.id, i + 1]));
  const labels = new Map(hypotheses.map((h) => [h.id, h.label]));
  const cards = useRef(new Map<number, HTMLLIElement>());

  // Line the selected step up with the figure. `start` puts the card's top at
  // its scroll-margin, which is set to the same offset the figure is pinned at,
  // so the two always sit on one line and the reader's eye does not have to
  // hunt for which step the drawing is showing.
  useEffect(() => {
    const card = cards.current.get(selected);
    if (!card) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  }, [selected]);

  return (
    <ol className="steps">
      {timeline.steps.map((step, i) => (
        <StepItem
          key={step.id}
          step={step}
          register={(element) => {
            if (element) cards.current.set(i, element);
            else cards.current.delete(i);
          }}
          position={i + 1}
          positions={positions}
          labels={labels}
          dropped={dropped}
          broken={broken?.has(step.id) ?? false}
          state={i === selected ? 'current' : i < selected ? 'past' : 'future'}
          onSelect={() => onSelect(i)}
        />
      ))}
    </ol>
  );
}

interface StepItemProps {
  step: Step;
  register(element: HTMLLIElement | null): void;
  position: number;
  positions: Map<string, number>;
  labels: Map<HypothesisId, string>;
  dropped: HypothesisId | null;
  broken: boolean;
  state: 'past' | 'current' | 'future';
  onSelect(): void;
}

function StepItem({
  step,
  register,
  position,
  positions,
  labels,
  dropped,
  broken,
  state,
  onSelect,
}: StepItemProps) {
  const dependencies = (step.dependsOn ?? [])
    .map((id) => positions.get(id))
    .filter((n): n is number => n !== undefined);

  return (
    <li
      ref={register}
      className={`step step--${state} step--role-${step.role} ${broken ? 'step--broken' : ''}`}
      onClick={onSelect}
    >
      <button
        className="step__header"
        type="button"
        aria-current={state === 'current'}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        <span className="step__number">{position}</span>
        <span className="step__role">{ROLE_LABEL[step.role]}</span>
        <span className="step__title">{step.title}</span>
        {broken ? <span className="step__broken-tag">no longer holds</span> : null}
      </button>

      {/* Collapsed steps keep their heading so the shape of the argument stays
          visible; only the detail is withheld until a step is selected. */}
      <div className="step__body" hidden={state !== 'current'}>
        {step.claim ? <MathExpr tex={step.claim} display /> : null}
        {step.note ? <p className="step__note">{step.note}</p> : null}

        <div className="step__reasons">
          <span className="step__reasons-label">Because</span>
          <ul>
            {step.reason.map((reason, idx) => (
              <li key={idx}>
                <ReasonItem
                  reason={reason}
                  positions={positions}
                  labels={labels}
                  dropped={dropped}
                />
              </li>
            ))}
          </ul>
        </div>

        {dependencies.length > 0 ? (
          <p className="step__depends">
            Builds on {dependencies.length === 1 ? 'step' : 'steps'}{' '}
            {dependencies.join(', ')}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function ReasonItem({
  reason,
  positions,
  labels,
  dropped,
}: {
  reason: Justification;
  positions: Map<string, number>;
  labels: Map<HypothesisId, string>;
  dropped: HypothesisId | null;
}) {
  switch (reason.type) {
    case 'hypothesis': {
      const off = reason.ref === dropped;
      return (
        <span className={`reason reason--hypothesis ${off ? 'is-off' : ''}`}>
          {labels.get(reason.ref) ?? reason.ref}
          {off ? ' — switched off' : ''}
        </span>
      );
    }
    case 'cite':
      return <CitationBadge id={reason.ref} note={reason.note} />;
    case 'step': {
      const at = positions.get(reason.ref);
      return (
        <span className="reason reason--step">
          step {at ?? '?'}
          {reason.note ? ` — ${reason.note}` : ''}
        </span>
      );
    }
    case 'algebra':
      return <span className="reason reason--algebra">{reason.note}</span>;
    case 'assumption':
      return <span className="reason reason--assumption">{reason.note}</span>;
    case 'construction':
      return <span className="reason reason--construction">{reason.note}</span>;
    default:
      return null;
  }
}
