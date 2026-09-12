import type { Justification, Step, StepRole, Timeline } from '../types/entry';
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
}

export function StepList({ timeline, selected, onSelect }: StepListProps) {
  const positions = new Map(timeline.steps.map((s, i) => [s.id, i + 1]));

  return (
    <ol className="steps">
      {timeline.steps.map((step, i) => (
        <StepItem
          key={step.id}
          step={step}
          position={i + 1}
          positions={positions}
          state={i === selected ? 'current' : i < selected ? 'past' : 'future'}
          onSelect={() => onSelect(i)}
        />
      ))}
    </ol>
  );
}

interface StepItemProps {
  step: Step;
  position: number;
  positions: Map<string, number>;
  state: 'past' | 'current' | 'future';
  onSelect(): void;
}

function StepItem({ step, position, positions, state, onSelect }: StepItemProps) {
  const dependencies = (step.dependsOn ?? [])
    .map((id) => positions.get(id))
    .filter((n): n is number => n !== undefined);

  return (
    <li className={`step step--${state} step--role-${step.role}`} onClick={onSelect}>
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
                <ReasonItem reason={reason} positions={positions} />
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
}: {
  reason: Justification;
  positions: Map<string, number>;
}) {
  switch (reason.type) {
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
