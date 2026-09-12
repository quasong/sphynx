# Sphynx

Visual, step-by-step explanations of mathematical theorems and definitions.

Pick a theorem and its proof advances one step at a time, with the drawing
changing as the argument does and every step naming the results it leans on.
Pick a definition and you get the failed attempts that forced it into its final
shape, rather than the finished formula alone.

```bash
npm install && npm run dev
```

## How it is put together

**Entries.** Theorem, lemma, definition and axiom are all one type, `Entry`
(`src/types/entry.ts`). Entries cite each other, so the library is a directed
acyclic graph of mathematical dependencies.

**Timelines.** An entry's explanation is an ordered list of steps. For a theorem
that list is a proof; for a definition it is the sequence of attempts and
counterexamples leading to the final wording. Both use the same type, so there
is one renderer rather than two.

**Citations are derived, never declared.** The "Rests on" list comes from the
`cite` justifications inside the steps (`citationsOf` in `src/content/index.ts`).
A hand-written dependency list drifts out of sync with the proof the moment a
step is edited. `findDanglingCitations` fails loudly in development when a step
cites something that does not exist.

**The step index is the only state.** Selecting step *n* highlights its formula,
moves the figure to its *n*-th configuration, and surfaces the entries that step
uses. That index lives in the URL, so a link to a particular step is shareable
and the back button walks the argument.

**Figures are hand-written React.** Each figure is a component receiving
`FigureProps` (`stepIndex`, `stepId`, `highlight`) and deciding for itself what
to draw — there is no scene description language in between. That freedom is
what lets one figure switch between four different functions as the argument
about continuity progresses. To keep independently written figures looking like
one system, they compose from the shared primitives in
`src/figures/primitives/` and never name a colour directly: they pick a role
(`a`, `b`, `c`, `neutral`, `accent`, `warn`, `good`) which resolves to a CSS
custom property that adapts to the light and dark themes.

**Motion is a consequence, not a feature.** A figure re-renders with new
geometry when the step changes, so transitions are CSS on the elements that
move. In the Pythagorean figure the four triangles are drawn once, in their
first-packing positions, and carried to their second-packing positions by rigid
motions written as SVG transforms — rotations and translations only, no
reflections, so what the reader sees matches what the proof claims.

## Adding an entry

1. Write the entry as a data module under `src/content/`, and add it to the
   array in `src/content/index.ts`.
2. If it needs a figure, write a component under `src/figures/` and register it
   in `src/figures/registry.ts` under the id the entry declares. Entries stay
   plain data and never import a component.
3. Cite other entries from the steps. If a cited entry does not exist yet, add
   it as a statement-only stub — the console will tell you about any that are
   missing.

## Layout

```
src/types/      Entry, Timeline, Step, FigureProps
src/content/    The library itself, plus the derived dependency graph
src/figures/    One component per figure, over a shared set of SVG primitives
src/components/ Steps, citations, KaTeX rendering
src/pages/      The library index and the entry page
```
