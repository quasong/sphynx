import { useMemo, useState } from 'react';
import { LibraryTree } from '../components/LibraryTree';
import { TableOfContents } from '../components/TableOfContents';
import { buildTree } from '../lib/tree';
import type { EntryId } from '../types/entry';

export function LibraryPage() {
  const tree = useMemo(() => buildTree(), []);
  const [current, setCurrent] = useState<EntryId | null>(null);

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
      </header>

      <div className="library__body">
        <TableOfContents sections={tree.sections} current={current} />
        <LibraryTree
          sections={tree.sections}
          unplaced={tree.unplaced}
          onVisibleNode={setCurrent}
        />
      </div>
    </main>
  );
}
