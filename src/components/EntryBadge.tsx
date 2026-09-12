import { Link } from 'react-router-dom';
import { KIND_LABEL, getEntry } from '../content';
import type { EntryId } from '../types/entry';
import { MathExpr } from './MathExpr';

interface CitationBadgeProps {
  id: EntryId;
  /** Extra words explaining what the cited entry contributes here. */
  note?: string;
}

/**
 * A link to a cited entry, with the cited statement revealed on hover or focus
 * so the reader can check a reference without losing their place in the proof.
 */
export function CitationBadge({ id, note }: CitationBadgeProps) {
  const entry = getEntry(id);
  if (!entry) return <span className="badge badge--missing">unknown: {id}</span>;

  return (
    <span className="citation">
      <Link className={`badge badge--${entry.kind}`} to={`/e/${entry.id}`}>
        <span className="badge__kind">{KIND_LABEL[entry.kind]}</span>
        <span className="badge__title">{entry.title}</span>
      </Link>
      {note ? <span className="citation__note">— {note}</span> : null}
      <span className="citation__card" role="tooltip">
        <span className="citation__card-kind">{KIND_LABEL[entry.kind]}</span>
        <strong>{entry.title}</strong>
        <MathExpr tex={entry.statement} display />
      </span>
    </span>
  );
}

/** A card used in the library index and in the dependency lists. */
export function EntryCard({ id }: { id: EntryId }) {
  const entry = getEntry(id);
  if (!entry) return null;

  return (
    <Link className="entry-card" to={`/e/${entry.id}`}>
      <span className={`entry-card__kind entry-card__kind--${entry.kind}`}>
        {KIND_LABEL[entry.kind]}
      </span>
      <span className="entry-card__title">{entry.title}</span>
      <MathExpr tex={entry.statement} className="entry-card__statement" />
      {entry.timeline ? (
        <span className="entry-card__meta">
          {entry.timeline.steps.length} steps
          {entry.figureId ? ' · with figure' : ''}
        </span>
      ) : (
        <span className="entry-card__meta entry-card__meta--quiet">stated, not yet proved</span>
      )}
    </Link>
  );
}
