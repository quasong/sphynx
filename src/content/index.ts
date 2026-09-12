import type { Entry, EntryId, EntryKind, Timeline } from '../types/entry';
import { archimedean } from './analysis/archimedean';
import { bolzanoWeierstrass } from './analysis/bolzano-weierstrass';
import { cauchyCriterion, cauchySequence } from './analysis/cauchy';
import { extremeValue } from './analysis/extreme-value';
import { heineCantor } from './analysis/heine-cantor';
import { intermediateValue } from './analysis/intermediate-value';
import { banachFixedPoint } from './metric/banach-fixed-point';
import { completeMetricSpace, metricSpace } from './metric/metric-space';
import { monotoneConvergence } from './analysis/monotone-convergence';
import { sequenceLimit } from './analysis/sequence-limit';
import { uniformContinuity } from './analysis/uniform-continuity';
import { completeness } from './analysis/completeness';
import { qIncomplete } from './analysis/q-incomplete';
import { supremum } from './analysis/supremum';
import { foundationEntries } from './foundations';
import { continuity } from './definitions/continuity';
import { evenSquare } from './theorems/even-square';
import { sqrt2Irrational } from './theorems/sqrt2-irrational';

/** Every entry in the library, in the order the index page presents them. */
export const entries: readonly Entry[] = [
  // The completeness thread, in the order the course develops it.
  supremum,
  qIncomplete,
  completeness,
  archimedean,
  sequenceLimit,
  monotoneConvergence,
  bolzanoWeierstrass,
  cauchySequence,
  cauchyCriterion,
  continuity,
  intermediateValue,
  extremeValue,
  uniformContinuity,
  heineCantor,
  metricSpace,
  completeMetricSpace,
  banachFixedPoint,
  sqrt2Irrational,
  evenSquare,
  ...foundationEntries,
];

const index = new Map<EntryId, Entry>(entries.map((e) => [e.id, e]));

export function getEntry(id: EntryId | undefined): Entry | undefined {
  return id ? index.get(id) : undefined;
}

/**
 * The entries an argument leans on, derived from its steps' citations.
 *
 * Deriving rather than declaring is deliberate: a hand-written dependency list
 * drifts out of sync with the proof the moment a step is edited.
 */
export function citationsOf(entry: Entry): readonly EntryId[] {
  const seen = new Set<EntryId>();
  for (const step of entry.timeline?.steps ?? []) {
    for (const reason of step.reason) {
      if (reason.type === 'cite') seen.add(reason.ref);
    }
  }
  return [...seen];
}

/** Entries that restate this one with less structure to lean on. */
export function generalizationsOf(id: EntryId): readonly Entry[] {
  return entries.filter((e) => e.generalizes?.includes(id));
}

/** The reverse edge: entries whose arguments cite this one. */
export function dependentsOf(id: EntryId): readonly Entry[] {
  return entries.filter((e) => citationsOf(e).includes(id));
}

/** Citations introduced by one specific step, for the per-step reference list. */
export function citationsOfStep(timeline: Timeline, stepId: string): readonly EntryId[] {
  const step = timeline.steps.find((s) => s.id === stepId);
  if (!step) return [];
  const out: EntryId[] = [];
  for (const reason of step.reason) {
    if (reason.type === 'cite' && !out.includes(reason.ref)) out.push(reason.ref);
  }
  return out;
}

export const KIND_LABEL: Record<EntryKind, string> = {
  theorem: 'Theorem',
  lemma: 'Lemma',
  corollary: 'Corollary',
  definition: 'Definition',
  axiom: 'Axiom',
};

/**
 * Fails loudly during development if a step cites an entry that does not
 * exist. A dangling citation is a content bug that is easy to introduce and
 * invisible in the rendered page, since the badge simply would not appear.
 */
export function findContentProblems(): readonly string[] {
  const problems: string[] = [];
  for (const entry of entries) {
    for (const step of entry.timeline?.steps ?? []) {
      for (const reason of step.reason) {
        if (reason.type === 'cite' && !index.has(reason.ref)) {
          problems.push(`${entry.id} / ${step.id} cites unknown entry "${reason.ref}"`);
        }
        if (reason.type === 'step' && !entry.timeline?.steps.some((s) => s.id === reason.ref)) {
          problems.push(`${entry.id} / ${step.id} cites unknown step "${reason.ref}"`);
        }
        if (reason.type === 'hypothesis' && !entry.hypotheses?.some((h) => h.id === reason.ref)) {
          problems.push(`${entry.id} / ${step.id} cites unknown hypothesis "${reason.ref}"`);
        }
      }
      for (const dep of step.dependsOn ?? []) {
        if (!entry.timeline?.steps.some((s) => s.id === dep)) {
          problems.push(`${entry.id} / ${step.id} depends on unknown step "${dep}"`);
        }
      }
    }
    for (const ref of entry.generalizes ?? []) {
      if (!index.has(ref)) {
        problems.push(`${entry.id} generalizes unknown entry "${ref}"`);
      }
      if (ref === entry.id) {
        problems.push(`${entry.id} generalizes itself`);
      }
    }
    // A hypothesis no step ever invokes is either decoration or a gap in the
    // proof; both are worth knowing about while writing.
    for (const hypothesis of entry.hypotheses ?? []) {
      const used = entry.timeline?.steps.some((step) =>
        step.reason.some((r) => r.type === 'hypothesis' && r.ref === hypothesis.id),
      );
      if (!used) {
        problems.push(`${entry.id} states hypothesis "${hypothesis.id}" but no step uses it`);
      }
    }
  }
  problems.push(...findCitationCycles());
  return problems;
}

/**
 * Citation cycles.
 *
 * Two entries citing each other reads fine in prose - one is a forward pointer
 * to the other - but it means there is no order in which the library can be
 * read, and the reading order is laid out as a tree on the index page. Cheaper
 * to catch here than to notice as a strange edge in the drawing.
 */
function findCitationCycles(): readonly string[] {
  const problems: string[] = [];
  const state = new Map<EntryId, 'visiting' | 'done'>();

  const walk = (id: EntryId, path: readonly EntryId[]): void => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      const from = path.indexOf(id);
      problems.push(`citation cycle: ${[...path.slice(from), id].join(' → ')}`);
      return;
    }
    const entry = index.get(id);
    if (!entry) return;
    state.set(id, 'visiting');
    for (const cited of citationsOf(entry)) walk(cited, [...path, id]);
    state.set(id, 'done');
  };

  for (const entry of entries) walk(entry.id, []);
  return problems;
}
