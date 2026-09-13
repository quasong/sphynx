/** URL steps are 1-based; figures use 0-based steps and -1 for the statement. */
export const STATEMENT = -1;

export function parseStep(params: URLSearchParams, stepCount: number): number {
  const raw = Number(params.get('step'));
  return Number.isInteger(raw) && raw >= 1 && raw <= stepCount ? raw - 1 : STATEMENT;
}

export function clampStep(target: number, stepCount: number): number {
  return Number.isInteger(target)
    ? Math.min(Math.max(target, STATEMENT), stepCount - 1)
    : STATEMENT;
}

export function stepParams(params: URLSearchParams, target: number, stepCount: number): URLSearchParams {
  const next = new URLSearchParams(params);
  const index = clampStep(target, stepCount);
  if (index === STATEMENT) next.delete('step');
  else next.set('step', String(index + 1));
  return next;
}
