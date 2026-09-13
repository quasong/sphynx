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
  /**
   * Furthest the page may be scrolled while the figure stays pinned. Centring
   * the last steps would otherwise scroll past the end of the figure's column
   * and drag it off the top of the screen.
   */
  scrollCeiling?: () => number;
}

export function StepList({
  timeline,
  selected,
  onSelect,
  hypotheses = [],
  dropped = null,
  broken,
  scrollCeiling,
}: StepListProps) {
  const positions = new Map(timeline.steps.map((s, i) => [s.id, i + 1]));
  const labels = new Map(hypotheses.map((h) => [h.id, h.label]));
  const cards = useRef(new Map<number, HTMLLIElement>());

  // Line the selected step up with the figure, which is centred in the
  // viewport - so the step is centred too and the pair meets on the same line
  // whatever the height of the card.
  //
  // Scrolled by hand rather than through scrollIntoView so the target can be
  // capped. The closing steps cannot be centred without scrolling past the foot
  // of the figure's column, which unpins the figure and cuts off the top of the
  // drawing; the alternative was padding every page with a screenful of empty
  // space to scroll against. Those steps settle a little below centre instead,
  // which costs nothing a reader would notice.
  useEffect(() => {
    const card = cards.current.get(selected);
    if (!card) return;

    const box = card.getBoundingClientRect();
    const centred = window.scrollY + box.top + box.height / 2 - window.innerHeight / 2;
    const ceiling = scrollCeiling?.() ?? Number.POSITIVE_INFINITY;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // A browser's native smooth scroll cannot be retargeted gracefully: a
    // quick second click interrupts the first animation and the page appears
    // to lurch. Keep the animation here so its previous frame can be cancelled
    // cleanly whenever the selected step changes again.
    const target = Math.max(0, Math.min(centred, ceiling));
    if (still || Math.abs(target - window.scrollY) < 1) {
      window.scrollTo({ top: target, behavior: 'auto' });
      return undefined;
    }

    const start = window.scrollY;
    const distance = target - start;
    const duration = Math.min(680, Math.max(280, 280 + Math.abs(distance) * 0.25));
    let began = 0;
    let frame = 0;

    const tick = (now: number) => {
      if (!began) began = now;
      const progress = Math.min(1, (now - began) / duration);
      // Ease out quickly, then settle gently into the target instead of
      // stopping with the browser's abrupt native-scroll finish.
      const eased = 1 - (1 - progress) ** 3;
      window.scrollTo({ top: start + distance * eased, behavior: 'auto' });
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [selected, scrollCeiling]);

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
  const bodyRef = useRef<HTMLDivElement>(null);
  const dependencies = (step.dependsOn ?? [])
    .map((id) => positions.get(id))
    .filter((n): n is number => n !== undefined);

  useEffect(() => {
    bodyRef.current?.toggleAttribute('inert', state !== 'current');
  }, [state]);

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
        {broken ? <span className="step__broken-tag">not guaranteed</span> : null}
      </button>

      {/* Collapsed steps keep their heading so the shape of the argument stays
          visible; only the detail is withheld until a step is selected. */}
      <div
        ref={bodyRef}
        className={`step__body ${state === 'current' ? 'step__body--open' : ''}`}
        aria-hidden={state !== 'current'}
      >
        <div className="step__body-inner">
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
