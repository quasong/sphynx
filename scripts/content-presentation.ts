import katex from 'katex';
import { entries } from '../src/content';
import { spine, type SpineSection } from '../src/content/spine';
import { getFigure } from '../src/figures/registry';
import type { Entry } from '../src/types/entry';

export function findPresentationProblems(library: readonly Entry[] = entries, sections: readonly SpineSection[] = spine): string[] {
  const problems: string[] = [];
  const known = new Set(library.map((entry) => entry.id));
  const placed = new Set<string>();
  const sectionIds = new Set<string>();
  for (const section of sections) {
    if (sectionIds.has(section.id)) problems.push(`duplicate section "${section.id}"`);
    sectionIds.add(section.id);
    for (const id of section.entries) {
      if (!known.has(id)) problems.push(`spine cites unknown entry "${id}"`);
      if (placed.has(id)) problems.push(`spine repeats entry "${id}"`);
      placed.add(id);
    }
  }
  for (const entry of library) {
    if (entry.figureId && !getFigure(entry.figureId)) problems.push(`${entry.id}: unknown figure "${entry.figureId}"`);
    const formulas = [
      entry.statement,
      ...(entry.timeline?.given ?? []),
      ...(entry.timeline?.steps ?? []).map((step) => step.claim),
      ...(entry.hypotheses ?? []).flatMap((h) => [h.statement, h.withoutIt?.statement]),
    ];
    for (const tex of formulas) {
      if (!tex) continue;
      try {
        katex.renderToString(tex, { throwOnError: true, strict: 'ignore', displayMode: true });
      } catch (error) {
        problems.push(`${entry.id}: invalid formula: ${String(error)}`);
      }
    }
  }
  return problems;
}

export { entries, findContentProblems } from '../src/content';
