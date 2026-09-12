import type { Entry, EntryId, EntryKind, Timeline } from '../types/entry';
import { archimedean } from './analysis/archimedean';
import { completeness } from './analysis/completeness';
import { qIncomplete } from './analysis/q-incomplete';
import { supremum } from './analysis/supremum';
import { foundationEntries } from './foundations';
import { continuity } from './definitions/continuity';
import { evenSquare } from './theorems/even-square';
import { pythagoras } from './theorems/pythagoras';
import { sqrt2Irrational } from './theorems/sqrt2-irrational';

/** Every entry in the library, in the order the index page presents them. */
export const entries: readonly Entry[] = [
  // The completeness thread, in the order the course develops it.
  supremum,
  qIncomplete,
  completeness,
  archimedean,
  sqrt2Irrational,
  continuity,
  evenSquare,
  pythagoras,
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

const KIND_ORDER: readonly EntryKind[] = ['theorem', 'lemma', 'corollary', 'definition', 'axiom'];

export const KIND_LABEL: Record<EntryKind, string> = {
  theorem: 'Theorem',
  lemma: 'Lemma',
  corollary: 'Corollary',
  definition: 'Definition',
  axiom: 'Axiom',
};

/** Entries grouped by kind for the library index, in a stable reading order. */
export function entriesByKind(): readonly { kind: EntryKind; items: readonly Entry[] }[] {
  return KIND_ORDER.map((kind) => ({
    kind,
    items: entries.filter((e) => e.kind === kind),
  })).filter((group) => group.items.length > 0);
}

/**
 * Fails loudly during development if a step cites an entry that does not
 * exist. A dangling citation is a content bug that is easy to introduce and
 * invisible in the rendered page, since the badge simply would not appear.
 */
export function findDanglingCitations(): readonly string[] {
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
      }
      for (const dep of step.dependsOn ?? []) {
        if (!entry.timeline?.steps.some((s) => s.id === dep)) {
          problems.push(`${entry.id} / ${step.id} depends on unknown step "${dep}"`);
        }
      }
    }
  }
  return problems;
}
