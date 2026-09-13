import type { TreeSection } from '../lib/tree';
import type { EntryId } from '../types/entry';

interface TableOfContentsProps {
  sections: readonly TreeSection[];
  /** The trunk entry currently in view. */
  current: EntryId | null;
}

/**
 * The trunk, and only the trunk.
 *
 * Listing every entry would reproduce the tree and defeat the point; the
 * contents exist so a reader can see the shape of the whole course at a glance
 * and jump into it.
 *
 * Navigation is by scrolling an element into view rather than by anchor links,
 * because the app is served from a hash route and a fragment href would be read
 * as a change of page.
 */
export function TableOfContents({ sections, current }: TableOfContentsProps) {
  const jump = (id: string) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector(`[data-entry="${CSS.escape(id)}"]`)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <nav className="toc" aria-label="Contents">
      <h2>Contents</h2>
      <label className="toc__mobile-label" htmlFor="toc-mobile">Jump to an entry</label>
      <select
        className="toc__mobile-select"
        id="toc-mobile"
        defaultValue=""
        onChange={(event) => {
          if (event.target.value) jump(event.target.value);
        }}
      >
        <option value="">Jump to an entry…</option>
        {sections.map((section) => (
          <optgroup key={section.id} label={section.title}>
            {section.nodes.flatMap((node) => [
              <option key={node.entry.id} value={node.entry.id}>{node.entry.title}</option>,
              ...node.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>↳ {branch.title}</option>
              )),
            ])}
          </optgroup>
        ))}
      </select>
      {sections.map((section) => (
        <div className="toc__section" key={section.id}>
          <p className="toc__section-title">{section.title}</p>
          <ol>
            {section.nodes.map((node) => (
              <li key={node.entry.id}>
                <button
                  type="button"
                  className={`toc__link ${current === node.entry.id ? 'is-current' : ''}`}
                  onClick={() => jump(node.entry.id)}
                  aria-current={current === node.entry.id}
                >
                  {node.entry.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </nav>
  );
}
