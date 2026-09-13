import assert from 'node:assert/strict';
import test from 'node:test';
import { entries, citationsOf, findContentProblems, getEntry } from '../src/content';
import { findPresentationProblems } from '../scripts/content-presentation';
import { stepsBrokenWithout } from '../src/lib/hypotheses';
import { buildTree, trunkIds } from '../src/lib/tree';
import { parseStep, stepParams, clampStep, STATEMENT } from '../src/lib/stepUrl';
import type { Entry, Timeline } from '../src/types/entry';

test('the current library has valid references, formulas and figure registrations', () => {
  assert.deepEqual(findContentProblems(), []);
  assert.deepEqual(findPresentationProblems(), []);
});

test('every entry is placed once and support hangs off its first trunk citation', () => {
  const tree = buildTree();
  assert.deepEqual(tree.unplaced, []);
  const nodes = tree.sections.flatMap((section) => section.nodes);
  const placed = nodes.flatMap((node) => [node.entry.id, ...node.branches.map((branch) => branch.id)]);
  assert.equal(placed.length, entries.length);
  assert.equal(new Set(placed).size, entries.length);
  const order = trunkIds();
  for (const [position, node] of nodes.entries()) {
    for (const ref of citationsOf(node.entry)) {
      const earlier = order.indexOf(ref);
      assert.ok(earlier < 0 || earlier < position, `${node.entry.id} needs later trunk entry ${ref}`);
    }
    for (const branch of node.branches) {
      assert.ok(citationsOf(node.entry).includes(branch.id));
      assert.ok(nodes.slice(0, position).every((prior) => !citationsOf(prior.entry).includes(branch.id)));
    }
  }
});

const fixture = (id: string, steps: Timeline['steps'] = []): Entry => ({
  id, kind: 'theorem', title: id, statement: 'x=x', tags: [],
  timeline: { kind: 'proof', steps },
});

test('duplicate ids and forward/self dependencies cannot silently corrupt the graph', () => {
  const entry = fixture('test', [
    { id: 'first', title: '', role: 'setup', reason: [{ type: 'step', ref: 'later' }] },
    { id: 'later', title: '', role: 'conclusion', reason: [], dependsOn: ['later'] },
    { id: 'later', title: '', role: 'conclusion', reason: [] },
  ]);
  const problems = findContentProblems([entry, entry]).join('\n');
  assert.match(problems, /entries: duplicate id/);
  assert.match(problems, /steps: duplicate id/);
  assert.match(problems, /first must depend on an earlier step/);
  assert.match(problems, /later must depend on an earlier step/);
});

test('dangling references, unused hypotheses and citation cycles are rejected', () => {
  const a = fixture('a', [{ id: 's', title: '', role: 'setup', reason: [
    { type: 'cite', ref: 'b' }, { type: 'cite', ref: 'missing' },
    { type: 'step', ref: 'absent' }, { type: 'hypothesis', ref: 'absent' },
  ] }]);
  const b = fixture('b', [{ id: 's', title: '', role: 'setup', reason: [{ type: 'cite', ref: 'a' }] }]);
  a.hypotheses = [{ id: 'unused', label: '' }];
  const problems = findContentProblems([a, b]).join('\n');
  for (const expected of [/unknown entry/, /unknown step/, /unknown hypothesis/, /no step uses it/, /citation cycle/]) {
    assert.match(problems, expected);
  }
});

test('presentation checks reject unknown figures, malformed math and broken spine entries', () => {
  const a = { ...fixture('a'), figureId: 'missing', statement: String.raw`\notACommand{` };
  const problems = findPresentationProblems([a], [{ id: 's', title: '', entries: ['a', 'a', 'absent'] }]).join('\n');
  for (const expected of [/unknown figure/, /invalid formula/, /repeats entry/, /unknown entry/]) assert.match(problems, expected);
});

test('failure propagates through cited steps and dependsOn, leaving independent claims intact', () => {
  const timeline: Timeline = { kind: 'proof', steps: [
    { id: 'root', title: '', role: 'setup', reason: [{ type: 'hypothesis', ref: 'h' }] },
    { id: 'citation', title: '', role: 'derivation', reason: [{ type: 'step', ref: 'root' }] },
    { id: 'dependency', title: '', role: 'conclusion', reason: [], dependsOn: ['citation'] },
    { id: 'independent', title: '', role: 'observation', reason: [] },
  ] };
  assert.deepEqual([...stepsBrokenWithout(timeline, 'h')], ['root', 'citation', 'dependency']);
  assert.equal(stepsBrokenWithout(timeline, null).size, 0);
  const mvt = getEntry('thm.mean-value')!.timeline!;
  assert.deepEqual([...stepsBrokenWithout(mvt, 'differentiable')], ['fermat', 'conclude']);
});

test('step deep links reject invalid values, clamp navigation and preserve the hypothesis', () => {
  for (const value of ['', '0', '-1', '2.5', 'bad', 'Infinity', '8']) {
    assert.equal(parseStep(new URLSearchParams({ step: value }), 7), STATEMENT);
  }
  assert.equal(parseStep(new URLSearchParams('step=1'), 7), 0);
  assert.equal(parseStep(new URLSearchParams('step=7'), 7), 6);
  const original = new URLSearchParams('step=2&drop=continuous&extra=kept');
  const last = stepParams(original, 999, 7);
  assert.equal(last.get('step'), '7');
  assert.equal(last.get('drop'), 'continuous');
  assert.equal(last.get('extra'), 'kept');
  assert.equal(original.get('step'), '2');
  assert.equal(stepParams(last, -3, 7).has('step'), false);
  assert.equal(stepParams(last, 0, 0).has('step'), false);
  assert.equal(clampStep(Number.NaN, 7), STATEMENT);
});
