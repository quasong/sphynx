import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { StepList } from '../src/components/StepList';
import type { Timeline } from '../src/types/entry';

test('local step dependencies render as accessible jump controls', () => {
  const timeline: Timeline = {
    kind: 'proof',
    steps: [
      { id: 'first', title: 'First fact', role: 'setup', reason: [] },
      {
        id: 'second',
        title: 'Use it',
        role: 'conclusion',
        reason: [{ type: 'step', ref: 'first', note: 'the starting point' }],
        dependsOn: ['first'],
      },
    ],
  };

  const markup = renderToStaticMarkup(
    <StepList timeline={timeline} selected={1} onSelect={() => undefined} />,
  );

  assert.match(markup, /reason--step-link/);
  assert.match(markup, /step__depends-link/);
  assert.equal((markup.match(/aria-label="Go to step 1"/g) ?? []).length, 2);
});
