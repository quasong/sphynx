import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LibraryTree } from '../components/LibraryTree';
import { TableOfContents } from '../components/TableOfContents';
import { entries, KIND_LABEL } from '../content';
import { spine } from '../content/spine';
import { buildTree } from '../lib/tree';
import type { Entry, EntryId } from '../types/entry';

export function LibraryPage() {
  const tree = useMemo(() => buildTree(), []);
  const [current, setCurrent] = useState<EntryId | null>(null);
  const [query, setQuery] = useState('');
  const [pendingEntry, setPendingEntry] = useState<EntryId | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const firstEntry = spine[0]?.entries[0] ?? 'thm.sqrt2-irrational';
  const guidedCount = entries.filter((entry) => entry.timeline).length;
  const filtered = useMemo(() => filterTree(tree, query), [tree, query]);
  const resultCount = query.trim() ? countEntries(filtered) : entries.length;

  const scrollToEntry = useCallback((id: EntryId) => {
    const target = document.querySelector<HTMLElement>(`[data-entry="${CSS.escape(id)}"]`);
    if (!target) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }, []);

  const navigateToEntry = useCallback((id: EntryId) => {
    if (query.trim()) {
      setPendingEntry(id);
      setQuery('');
    } else {
      scrollToEntry(id);
    }
  }, [query, scrollToEntry]);

  useEffect(() => {
    if (!pendingEntry || query.trim()) return undefined;
    const frame = requestAnimationFrame(() => {
      scrollToEntry(pendingEntry);
      setPendingEntry(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingEntry, query, scrollToEntry]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === '/' && target && !/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) && !target.isContentEditable) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="page library">
      <header className="library__head">
        <h1>Proofs you can watch happen</h1>
        <p>
          The trunk is the reading order. Supporting definitions and lemmas hang off
          the result that first needs them. Hover any entry to see what it rests on
          and what uses it; open one to step through its proof beside a figure that
          changes as the argument does.
        </p>
        <div className="library__actions">
          <Link className="button-link" to={`/e/${firstEntry}`}>
            Start at the beginning <span aria-hidden="true">→</span>
          </Link>
          <span className="library__count">{entries.length} entries · {guidedCount} guided arguments</span>
        </div>
        <div className="library__search">
          <label htmlFor="library-search">Find an entry</label>
          <div className="library__search-input">
            <input
              ref={searchRef}
              id="library-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, topics or kinds"
              autoComplete="off"
            />
            <kbd>/</kbd>
          </div>
          {query.trim() ? (
            <span className="library__search-status" role="status">
              {resultCount} matching {query.trim()}
            </span>
          ) : null}
        </div>
      </header>

      {query.trim() && resultCount === 0 ? (
        <p className="library__empty" role="status">
          No entries match “{query.trim()}”. Try a theorem name, topic, or kind.
        </p>
      ) : (
        <div className="library__body">
          <TableOfContents sections={filtered.sections} current={current} />
          <LibraryTree
            sections={filtered.sections}
            unplaced={filtered.unplaced}
            onVisibleNode={setCurrent}
            onNavigateToEntry={navigateToEntry}
          />
        </div>
      )}
    </main>
  );
}

function filterTree(tree: ReturnType<typeof buildTree>, query: string): ReturnType<typeof buildTree> {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return tree;

  const matches = (entry: Entry) =>
    [entry.title, KIND_LABEL[entry.kind], ...entry.tags].join(' ').toLocaleLowerCase().includes(needle);

  return {
    sections: tree.sections
      .map((section) => ({
        ...section,
        nodes: section.nodes
          .map((node) => ({ ...node, branches: node.branches.filter(matches) }))
          .filter((node) => matches(node.entry) || node.branches.length > 0),
      }))
      .filter((section) => section.nodes.length > 0),
    unplaced: tree.unplaced.filter(matches),
  };
}

function countEntries(tree: ReturnType<typeof buildTree>): number {
  return tree.sections.reduce(
    (total, section) => total + section.nodes.reduce((count, node) => count + 1 + node.branches.length, 0),
    tree.unplaced.length,
  );
}
