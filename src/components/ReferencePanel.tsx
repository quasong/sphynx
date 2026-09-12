import { citationsOf, dependentsOf } from '../content';
import type { Entry } from '../types/entry';
import { EntryCard } from './EntryBadge';

/**
 * Both directions of the dependency graph for one entry. "Rests on" is derived
 * from the citations inside the argument, so it cannot disagree with the proof.
 */
export function ReferencePanel({ entry }: { entry: Entry }) {
  const rests = citationsOf(entry);
  const used = dependentsOf(entry.id);

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
