import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { KIND_LABEL, citationsOf, dependentsOf, getEntry } from '../content';
import type { TreeSection } from '../lib/tree';
import type { Entry, EntryId } from '../types/entry';
import { MathExpr } from './MathExpr';

interface Anchor {
  /** Position of the hovered card within the tree, for placing the panel. */
  x: number;
  y: number;
  /** Which side of the card the panel sits on. */
  side: 'left' | 'right';
  /** Hang the panel upwards, when the card is low on the screen. */
  flip: boolean;
}

interface LibraryTreeProps {
  sections: readonly TreeSection[];
  unplaced: readonly Entry[];
  /** Called as the reader scrolls, so the table of contents can follow along. */
  onVisibleNode?(id: EntryId | null): void;
}

/**
 * The library as a vertical tree.
 *
 * The trunk is the reading order; supporting entries hang off the node that
 * first needs them. Structural lines are always drawn, because they are what
 * the reader is navigating by. The citation edges are not: drawn all at once
 * for ten entries they are already a thicket, so they appear only for the entry
 * under the pointer, which turns "what connects to what" into something you ask
 * about one node at a time.
 */
export function LibraryTree({ sections, unplaced, onVisibleNode }: LibraryTreeProps) {
  const [active, setActive] = useState<EntryId | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<EntryId, HTMLElement>());

  const register = useCallback((id: EntryId, element: HTMLElement | null) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  }, []);

  // Memoised on `active`, not recomputed per render: the layout effect below
  // closes over this, and a fresh object each render would make it re-run.
  const related = useMemo(() => (active ? relationsOf(active) : null), [active]);

  // Place the panel beside the hovered card, on whichever side has room.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const element = active ? nodeRefs.current.get(active) : null;
    if (!container || !element) {
      setAnchor(null);
      return;
    }
    const base = container.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    const side = base.right - box.right > 300 ? 'right' : 'left';
    // Low on the screen the panel would run off the fold, so hang it from the
    // card's lower edge instead of its upper one.
    const flip = box.bottom > window.innerHeight * 0.6;
    setAnchor({
      x: side === 'right' ? box.right - base.left + 14 : box.left - base.left - 14,
      y: (flip ? box.bottom : box.top) - base.top,
      side,
      flip,
    });
  }, [active]);

  // Tell the table of contents which trunk entry is currently in view.
  //
  // Deliberately a scroll position calculation rather than an
  // IntersectionObserver band: what the contents should point at is the last
  // node the reader has scrolled past, and an element only has to overlap a
  // band to count as intersecting, so a previous card still half on screen wins
  // over the one actually being read.
  useEffect(() => {
    if (!onVisibleNode) return undefined;
    const order = sections.flatMap((section) => section.nodes.map((node) => node.entry.id));
    let frame = 0;

    const update = () => {
      frame = 0;
      // Proportional rather than a fixed offset: on a tall viewport a fixed
      // line near the top marks a card as current when it has almost entirely
      // scrolled away and the next one fills the screen.
      const line = window.innerHeight * 0.35;
      let current: EntryId | null = order[0] ?? null;
      for (const id of order) {
        const element = nodeRefs.current.get(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      onVisibleNode(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections, onVisibleNode]);

  const stateOf = (id: EntryId): string => {
    if (!related) return '';
    if (id === active) return 'is-active';
    if (related.restsOn.includes(id)) return 'is-rests-on';
    if (related.usedBy.includes(id)) return 'is-used-by';
    return 'is-dimmed';
  };

  return (
    <div
      className={`tree ${active ? 'tree--focused' : ''}`}
      ref={containerRef}
      onMouseLeave={() => setActive(null)}
    >
      {sections.map((section) => (
        <section className="tree__section" key={section.id} data-section={section.id}>
          <header className="tree__section-head">
            <h2>{section.title}</h2>
            {section.blurb ? <p>{section.blurb}</p> : null}
          </header>

          <ol className="tree__nodes">
            {section.nodes.map((node) => (
              <li className="tree__node" key={node.entry.id}>
                <NodeCard
                  entry={node.entry}
                  variant="trunk"
                  state={stateOf(node.entry.id)}
                  register={register}
                  onEnter={setActive}
                />
                {node.branches.length > 0 ? (
                  <ul className="tree__branches">
                    {node.branches.map((branch) => (
                      <li key={branch.id}>
                        <NodeCard
                          entry={branch}
                          variant="branch"
                          state={stateOf(branch.id)}
                          register={register}
                          onEnter={setActive}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ))}

      {unplaced.length > 0 ? (
        <section className="tree__section">
          <header className="tree__section-head">
            <h2>Not on the path</h2>
            <p>Nothing in the reading order reaches these yet.</p>
          </header>
          <ul className="tree__loose">
            {unplaced.map((entry) => (
              <li key={entry.id}>
                <NodeCard
                  entry={entry}
                  variant="branch"
                  state={stateOf(entry.id)}
                  register={register}
                  onEnter={setActive}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* A line is only informative when both of its ends are on screen, which
          stops being true as soon as the library is taller than a screen. Names
          stay readable at any distance, and clicking one goes there - which is
          what the line was gesturing at anyway. */}
      {active && related && anchor ? (
        <RelationPanel
          anchor={anchor}
          restsOn={related.restsOn}
          usedBy={related.usedBy}
          from={active}
          nodes={nodeRefs.current}
        />
      ) : null}
    </div>
  );
}

interface NodeCardProps {
  entry: Entry;
  variant: 'trunk' | 'branch';
  state: string;
  register(id: EntryId, element: HTMLElement | null): void;
  onEnter(id: EntryId): void;
}

function NodeCard({ entry, variant, state, register, onEnter }: NodeCardProps) {
  return (
    <Link
      className={`node node--${variant} node--${entry.kind} ${state}`}
      to={`/e/${entry.id}`}
      data-entry={entry.id}
      ref={(element) => register(entry.id, element)}
      onMouseEnter={() => onEnter(entry.id)}
      onFocus={() => onEnter(entry.id)}
    >
      <span className="node__kind">{KIND_LABEL[entry.kind]}</span>
      <span className="node__title">{entry.title}</span>
      {variant === 'trunk' ? (
        <MathExpr tex={entry.statement} className="node__statement" />
      ) : null}
      <span className="node__meta">
        {entry.timeline
          ? `${entry.timeline.steps.length} steps${entry.figureId ? ' · figure' : ''}`
          : 'stated, not proved'}
      </span>
    </Link>
  );
}

interface RelationPanelProps {
  anchor: Anchor;
  restsOn: readonly EntryId[];
  usedBy: readonly EntryId[];
  from: EntryId;
  nodes: Map<EntryId, HTMLElement>;
}

/**
 * What the hovered entry connects to, by name.
 *
 * The arrow says which way the reader would have to scroll, which is the only
 * part of the spatial information a line was carrying that survives at this
 * size; clicking takes them there, which is more than a line could do.
 */
function RelationPanel({ anchor, restsOn, usedBy, from, nodes }: RelationPanelProps) {
  const jump = (id: EntryId) => {
    nodes.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const direction = (id: EntryId): string => {
    const source = nodes.get(from)?.getBoundingClientRect();
    const target = nodes.get(id)?.getBoundingClientRect();
    if (!source || !target) return '';
    return target.top < source.top ? '↑' : '↓';
  };

  const group = (label: string, ids: readonly EntryId[], tone: string) =>
    ids.length === 0 ? null : (
      <div className={`relations__group relations__group--${tone}`}>
        <p>{label}</p>
        <ul>
          {ids.map((id) => (
            <li key={id}>
              <button type="button" onClick={() => jump(id)}>
                <span className="relations__arrow">{direction(id)}</span>
                {getEntry(id)?.title ?? id}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <aside
      className={`relations relations--${anchor.side} ${anchor.flip ? 'relations--flip' : ''}`}
      style={{ left: anchor.x, top: anchor.y }}
      aria-live="polite"
    >
      {group('Rests on', restsOn, 'rests-on')}
      {group('Used by', usedBy, 'used-by')}
      {restsOn.length === 0 && usedBy.length === 0 ? (
        <p className="relations__empty">Nothing cites it, and it cites nothing.</p>
      ) : null}
    </aside>
  );
}

function relationsOf(id: EntryId): { restsOn: readonly EntryId[]; usedBy: readonly EntryId[] } {
  const entry = getEntry(id);
  if (!entry) return { restsOn: [], usedBy: [] };
  return {
    restsOn: citationsOf(entry),
    usedBy: dependentsOf(id).map((e) => e.id),
  };
}
