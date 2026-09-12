import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { KIND_LABEL, citationsOf, dependentsOf, getEntry } from '../content';
import type { TreeSection } from '../lib/tree';
import type { Entry, EntryId } from '../types/entry';
import { MathExpr } from './MathExpr';

interface Arc {
  key: string;
  path: string;
  /** Whether the related entry is something the hovered one rests on, or uses it. */
  direction: 'rests-on' | 'used-by';
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
  const [arcs, setArcs] = useState<readonly Arc[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<EntryId, HTMLElement>());

  const register = useCallback((id: EntryId, element: HTMLElement | null) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  }, []);

  // Memoised on `active`, not recomputed per render: `measure` closes over this,
  // and a fresh object each render would make the layout effect re-run forever.
  const related = useMemo(() => (active ? relationsOf(active) : null), [active]);

  // Arc geometry is measured from the rendered cards rather than computed from
  // a layout model, so the drawing stays correct as the cards reflow.
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || !active || !related) {
      setArcs([]);
      return;
    }

    const base = container.getBoundingClientRect();
    const boxOf = (id: EntryId) => {
      const element = nodeRefs.current.get(id);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        left: box.left - base.left,
        right: box.right - base.left,
        y: box.top - base.top + box.height / 2,
      };
    };

    const source = boxOf(active);
    if (!source) {
      setArcs([]);
      return;
    }

    const next: Arc[] = [];
    const add = (ids: readonly EntryId[], direction: Arc['direction']) => {
      ids.forEach((id, i) => {
        const target = boxOf(id);
        if (!target) return;

        // Each end leaves from the side that faces the other card, so a link
        // across the columns is a short hop rather than a detour back around
        // the card it started from. Cards in the same column have no facing
        // side, so both ends use the left and the curve bulges into the gutter.
        const sameColumn = Math.abs(source.left - target.left) < 40;
        const rightwards = !sameColumn && target.left > source.left;
        const reach = sameColumn ? 44 + i * 14 : 26 + i * 10;

        const from = { x: rightwards ? source.right : source.left, y: source.y };
        const to = {
          x: sameColumn || rightwards ? target.left : target.right,
          y: target.y,
        };
        const c1 = rightwards ? from.x + reach : from.x - reach;
        const c2 = sameColumn || rightwards ? to.x - reach : to.x + reach;

        next.push({
          key: `${direction}-${id}`,
          direction,
          path: `M ${from.x} ${from.y} C ${c1} ${from.y}, ${c2} ${to.y}, ${to.x} ${to.y}`,
        });
      });
    };

    add(related.restsOn, 'rests-on');
    add(related.usedBy, 'used-by');
    setArcs(next);
  }, [active, related]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    if (!active) return undefined;
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, measure]);

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
      <svg className="tree__arcs" aria-hidden="true">
        {arcs.map((arc) => (
          <path key={arc.key} className={`tree__arc tree__arc--${arc.direction}`} d={arc.path} />
        ))}
      </svg>

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

      {active ? (
        <p className="tree__legend" aria-live="polite">
          <span className="tree__legend-key tree__legend-key--rests-on" /> rests on
          <span className="tree__legend-key tree__legend-key--used-by" /> used by
        </p>
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

function relationsOf(id: EntryId): { restsOn: readonly EntryId[]; usedBy: readonly EntryId[] } {
  const entry = getEntry(id);
  if (!entry) return { restsOn: [], usedBy: [] };
  return {
    restsOn: citationsOf(entry),
    usedBy: dependentsOf(id).map((e) => e.id),
  };
}
