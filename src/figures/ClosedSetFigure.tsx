import type { FigureProps } from '../types/figure';
import { FigureFrame } from './primitives/Figure';
import {
  LineAxis,
  LineInterval,
  LineMark,
  createNumberLine,
} from './primitives/numberline';
import { Label } from './primitives/shapes';

/**
 * Leaking, and being repaired.
 *
 * Each stage is the same axis with a different set on it, so the question
 * stays put: is there anywhere this set crowds against that it does not
 * contain?
 */

const line = createNumberLine({
  width: 430,
  height: 280,
  domain: [-0.35, 1.45],
  baselineAt: 0.62,
  laneGap: 30,
});

/** 1/n, which crowds against 0 without ever reaching it. */
const HARMONIC = [1, 0.5, 0.3333, 0.25, 0.2, 0.1667, 0.1429, 0.125, 0.1111, 0.1];
/** A sequence inside (0,1) whose limit is not inside (0,1). */
const ESCAPING = [0.62, 0.34, 0.19, 0.11, 0.06, 0.035];

export function ClosedSetFigure({ stepIndex }: FigureProps) {
  const i = stepIndex;

  return (
    <FigureFrame
      viewBox={line.viewBox}
      title="Sets on the number line, and the points they crowd against"
      caption={captionFor(i)}
    >
      {/* No tick at 0: every stage labels that point itself, and the two
          collide. */}
      <LineAxis line={line} ticks={[0.5, 1]} format={(v) => (v === 0.5 ? '½' : String(v))} />

      {i <= 0 || i >= 5 ? <Leak /> : null}
      {i === 1 ? <HalfOpen /> : null}
      {i === 2 ? <Discrete windows={false} /> : null}
      {i === 3 ? <Discrete windows /> : null}
      {i === 4 ? <Repaired /> : null}
    </FigureFrame>
  );
}

/** A sequence inside an open interval, converging to a point outside it. */
function Leak() {
  return (
    <g>
      <LineInterval line={line} from={0} to={1} openLeft openRight tone="a" label="(0, 1)" />
      {ESCAPING.map((v, k) => (
        <LineMark key={k} line={line} at={v} tone="accent" muted={k < 2} />
      ))}
      <LineMark line={line} at={0} tone="warn" hollow active />
      <Label at={[line.x(0), line.baseline + 26]} tone="warn" size={13} weight={600}>
        the limit escapes
      </Label>
    </g>
  );
}

/** Neither open nor closed, which is the point. */
function HalfOpen() {
  return (
    <g>
      <LineInterval line={line} from={0} to={1} openRight tone="a" label="[0, 1)" />
      <LineMark line={line} at={1} tone="warn" hollow active />
      <Label at={[line.x(1) + 10, line.baseline + 26]} tone="warn" size={13} anchor="start">
        1 is missing
      </Label>
      {/* Any window around 0 sticks out of the set, so it is not open either. */}
      <LineInterval line={line} from={-0.18} to={0.18} tone="warn" lane={1} muted />
      <Label at={[line.x(0), line.lane(1) - 18]} tone="warn" size={13}>
        no window at 0 fits inside
      </Label>
    </g>
  );
}

/** A set with no endpoints worth the name, still leaking. */
function Discrete({ windows }: { windows: boolean }) {
  const radii = [0.3, 0.16, 0.075];

  return (
    <g>
      {HARMONIC.map((v, k) => (
        <LineMark key={k} line={line} at={v} tone="a" />
      ))}
      <Label at={[line.x(0.62), line.baseline - 34]} tone="a" size={14} weight={600}>
        {'E = { 1/n }'}
      </Label>

      {windows ? (
        <>
          {radii.map((r, k) => (
            <LineInterval
              key={k}
              line={line}
              from={-r}
              to={r}
              tone="c"
              lane={k}
              openLeft
              openRight
              active={k === radii.length - 1}
            />
          ))}
          <Label at={[line.x(0.72), line.lane(2) - 16]} tone="c" size={13} anchor="start">
            every window still catches one
          </Label>
        </>
      ) : (
        <Label at={[line.x(0.5), line.baseline + 34]} tone="neutral" size={13}>
          which point here is the endpoint?
        </Label>
      )}

      <LineMark line={line} at={0} tone="warn" hollow active />
      <Label at={[line.x(0), line.baseline + 26]} tone="warn" size={13} weight={600}>
        0 ∉ E
      </Label>
    </g>
  );
}

/** The same sets with the missing points put back. */
function Repaired() {
  return (
    <g>
      {HARMONIC.map((v, k) => (
        <LineMark key={k} line={line} at={v} tone="a" />
      ))}
      <LineMark line={line} at={0} tone="good" active />
      <Label at={[line.x(0), line.baseline + 26]} tone="good" size={13} weight={600}>
        0 ∈ E — closed
      </Label>
      <LineInterval line={line} from={0} to={1} tone="good" lane={1} label="[0, 1] — closed" />
    </g>
  );
}

function captionFor(i: number): string {
  if (i <= 0) return 'Twice already: a sequence inside a set, converging to a point outside it.';
  if (i === 1) return 'Open and closed are not opposites — this interval is neither.';
  if (i === 2) return 'And “contains its endpoints” has nothing to say about a set like this.';
  if (i === 3) return 'A limit point is one the set crowds against: every window catches a point of E other than it.';
  if (i === 4) return 'Put the limit points back and the leak is sealed.';
  return 'Which is the form every proof here reaches for: converge a sequence, and the limit is still inside.';
}
