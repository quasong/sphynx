import { EntryCard } from '../components/EntryBadge';
import { KIND_LABEL, entriesByKind } from '../content';

export function LibraryPage() {
  const groups = entriesByKind();

  return (
    <main className="page library">
      <header className="library__head">
        <h1>Proofs you can watch happen</h1>
        <p>
          Pick a theorem to see its proof advance one step at a time, with the drawing
          changing as the argument does, and every step saying which other result it
          leans on. Pick a definition to see the failed attempts that forced it into its
          final shape.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.kind} className="library__group">
          <h2>{KIND_LABEL[group.kind]}s</h2>
          <div className="library__grid">
            {group.items.map((entry) => (
              <EntryCard key={entry.id} id={entry.id} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
