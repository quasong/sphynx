import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { entries } from '../src/content';
import { getFigure } from '../src/figures/registry';
import { figureStates } from '../src/lib/figureStates';
import { integrand, integrandRange, integral, slopeBound } from '../src/figures/models/integration';

for (const entry of entries.filter((entry) => entry.figureId)) {
  test(`${entry.id}: all steps and single-hypothesis states render finite SVG geometry`, () => {
    const Figure = getFigure(entry.figureId)!;
    const states = figureStates(entry);
    assert.equal(states.length, ((entry.timeline?.steps.length ?? 0) + 1) * ((entry.hypotheses?.length ?? 0) + 1));
    for (const state of states) {
      const markup = renderToStaticMarkup(<Figure {...state} />);
      assert.match(markup, /<svg[^>]*aria-label="[^"]+"/);
      assert.doesNotMatch(markup, /(?:points|d|x|y|cx|cy|width|height)="[^"]*(?:NaN|Infinity)/, JSON.stringify(state));
    }
  });
}

test('Darboux rectangles bound the curve, tighten under refinement and contain its integral', () => {
  let previousLower = -Infinity;
  let previousUpper = Infinity;
  for (const n of [1, 2, 4, 8, 16, 32]) {
    let lower = 0;
    let upper = 0;
    for (let k = 0; k < n; k += 1) {
      const lo = 3 * k / n;
      const hi = 3 * (k + 1) / n;
      const { min, max, pMin, pMax } = integrandRange(lo, hi);
      assert.ok(pMin >= lo && pMin <= hi && pMax >= lo && pMax <= hi);
      for (let s = 0; s <= 30; s += 1) {
        const value = integrand(lo + (hi - lo) * s / 30);
        assert.ok(value >= min - 1e-12 && value <= max + 1e-12);
      }
      lower += min * (hi - lo);
      upper += max * (hi - lo);
    }
    assert.ok(lower >= previousLower - 1e-12 && upper <= previousUpper + 1e-12);
    assert.ok(lower <= integral(3) && integral(3) <= upper);
    previousLower = lower;
    previousUpper = upper;
  }
});

test('the area function differentiates to the shared curve from both directions', () => {
  assert.equal(integral(0), 0);
  for (const t of [0.2, 0.8, 1.9, 2.8]) {
    for (const h of [-1e-5, 1e-5]) {
      assert.ok(Math.abs((integral(t + h) - integral(t)) / h - integrand(t)) < 1e-5);
    }
  }
  for (let x = 0; x <= 3; x += 0.1) {
    const y = Math.min(3, x + 0.29);
    assert.ok(Math.abs(integrand(y) - integrand(x)) <= slopeBound * Math.abs(y - x) + 1e-12);
  }
});
