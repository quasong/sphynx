import { citationsOf, dependentsOf, generalizationsOf } from '../content';
import type { Entry } from '../types/entry';
import { EntryCard } from './EntryBadge';

/**
 * Both directions of the dependency graph for one entry. "Rests on" is derived
 * from the citations inside the argument, so it cannot disagree with the proof.
 */
export function ReferencePanel({ entry }: { entry: Entry }) {
  const rests = citationsOf(entry);
  const used = dependentsOf(entry.id);
  const abstracts = entry.generalizes ?? [];
  const abstractedBy = generalizationsOf(entry.id);

  return (
    <aside className="references">
      <section>
        <h2>Rests on</h2>
        {rests.length > 0 ? (
          <div className="references__grid">
            {rests.map((id) => (
              <EntryCard key={id} id={id} />
            ))}
          </div>
        ) : (
          <p className="references__empty">
            Nothing — this entry is taken as a starting point.
          </p>
        )}
      </section>

      <section>
        <h2>Used by</h2>
        {used.length > 0 ? (
          <div className="references__grid">
            {used.map((e) => (
              <EntryCard key={e.id} id={e.id} />
            ))}
          </div>
        ) : (
          <p className="references__empty">Nothing in the library cites it yet.</p>
        )}
      </section>

      {/* Kept apart from the citation lists: a generalisation is not something
          this entry rests on, it is the same idea one floor up or down. */}
      {abstracts.length > 0 ? (
        <section>
          <h2>Generalises</h2>
          <div className="references__grid">
            {abstracts.map((id) => (
              <EntryCard key={id} id={id} />
            ))}
          </div>
        </section>
      ) : null}

      {abstractedBy.length > 0 ? (
        <section>
          <h2>Generalised by</h2>
          <div className="references__grid">
            {abstractedBy.map((e) => (
              <EntryCard key={e.id} id={e.id} />
            ))}
          </div>
        </section>
      ) : null}

      {entry.references && entry.references.length > 0 ? (
        <section>
          <h2>Further reading</h2>
          <ul className="references__list">
            {entry.references.map((ref) => (
              <li key={ref.label}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noreferrer noopener">
                    {ref.label}
                  </a>
                ) : (
                  ref.label
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
