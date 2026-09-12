import { citationsOf, entries, getEntry } from '../content';
import { spine } from '../content/spine';
import type { Entry, EntryId } from '../types/entry';

export interface TreeNode {
  entry: Entry;
  /**
   * Supporting entries that hang off this trunk node: the ones it is the first
   * point in the reading order to cite.
   */
  branches: readonly Entry[];
}

export interface TreeSection {
  id: string;
  title: string;
  blurb?: string;
  nodes: readonly TreeNode[];
}

export interface Tree {
  sections: readonly TreeSection[];
  /** Entries the trunk never reaches. Shown separately rather than hidden. */
  unplaced: readonly Entry[];
}

/**
 * Places every entry against the declared trunk.
 *
 * A supporting entry attaches to the first trunk entry that cites it, which is
 * where a reader working through the library in order would first need it.
 * Because that comes from the citations inside the proofs, adding a citation
 * moves the entry to the right place without anyone maintaining a second list.
 */
export function buildTree(): Tree {
  const trunkOrder: EntryId[] = spine.flatMap((section) => [...section.entries]);
  const trunk = new Set(trunkOrder);

  // First trunk entry, in reading order, that cites each supporting entry.
  const host = new Map<EntryId, EntryId>();
  for (const trunkId of trunkOrder) {
    const trunkEntry = getEntry(trunkId);
    if (!trunkEntry) continue;
    for (const cited of citationsOf(trunkEntry)) {
      if (trunk.has(cited) || host.has(cited)) continue;
      host.set(cited, trunkId);
    }
  }

  const sections = spine.map((section) => ({
    id: section.id,
    title: section.title,
    ...(section.blurb === undefined ? {} : { blurb: section.blurb }),
    nodes: section.entries
      .map((id) => getEntry(id))
      .filter((entry): entry is Entry => entry !== undefined)
      .map((entry) => ({
        entry,
        branches: entries.filter((candidate) => host.get(candidate.id) === entry.id),
      })),
  }));

  const placed = new Set([...trunk, ...host.keys()]);
  const unplaced = entries.filter((entry) => !placed.has(entry.id));

  return { sections, unplaced };
}

/** Trunk entries only, for the table of contents. */
export function trunkIds(): readonly EntryId[] {
  return spine.flatMap((section) => [...section.entries]);
}
