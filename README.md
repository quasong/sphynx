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

**The index is a tree.** `src/content/spine.ts` declares the trunk: the results
worth reading in order, grouped into sections. Everything else is placed
against it automatically — a supporting entry hangs off the first trunk entry
that cites it, which is where a reader working through the library would first
need it. Adding a citation moves it without anyone maintaining a second list.
Structural lines are always drawn. Citation edges are not: a line carries
information only when both of its ends are on screen, which stops being true as
soon as the library is taller than a screen. Hovering an entry highlights the
related cards that are in view and names the ones that are not, with an arrow
for the direction to scroll and a click that goes there. A card you can see is
answered by the highlight on it, so naming it as well would only cover it.

**Entries.** Theorem, lemma, definition and axiom are all one type, `Entry`
(`src/types/entry.ts`). Entries cite each other, so the library is a directed
acyclic graph of mathematical dependencies.

**Generalisation is a separate edge.** `Entry.generalizes` records that one
entry restates another with less structure to lean on — the metric-space
definition of completeness against the axiom about ℝ, say. It is kept apart
from citations on purpose: a generalisation does not rest on the special case,
it replaces it, and mixing the two would stop the library being readable in
order.

**Hypotheses are switchable.** A theorem names its conditions, its steps cite
them by name, and the reader can switch one off. The figure then draws the
counterexample instead of the theorem, and the steps that lose their justification are
marked — including the ones that never mentioned the condition but rest on a
step that did. This is the one thing the medium does that a printed proof
cannot, so entries whose conditions carry weight should be written this way.
One condition at a time, deliberately: each counterexample satisfies all the
others, which is what makes it evidence about that condition alone.
An affected step is marked "not guaranteed": it may still happen to be true
for the displayed counterexample, even though this proof no longer establishes it.

**Timelines.** An entry's explanation is an ordered list of steps. For a theorem
that list is a proof; for a definition it is the sequence of attempts and
counterexamples leading to the final wording. Both use the same type, so there
is one renderer rather than two.

**Citations are derived, never declared.** The "Rests on" list comes from the
`cite` justifications inside the steps (`citationsOf` in `src/content/index.ts`).
A hand-written dependency list drifts out of sync with the proof the moment a
step is edited. `findContentProblems` fails loudly in development when a step
cites an entry, step or hypothesis that does not exist, when a hypothesis is
stated but never used, when ids repeat, or when citations form a cycle. Local
step dependencies must point backwards, whether named in `reason` or `dependsOn`.
`npm run check` also validates the spine, figure registrations and every formula
with KaTeX. `npm run build` runs these checks before bundling. They catch
structural and rendering errors; mathematical correctness still needs review.

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
move — nothing animates anything itself.

## What is in it

The library is organised around the mechanisms that get re-instantiated as the
mathematics climbs, not around a syllabus. Completeness runs from the gap in ℚ
to the axiom that fills it, and ends by producing the number it began by
showing is missing. Sequences turn that axiom into something that produces
limits rather than merely promising them. Continuity and compactness are where
closed and bounded stop being a description and start doing work. Differentiation
uses the extreme value theorem to find a tangent parallel to a chord. Integration
traps area between Darboux sums; uniform continuity makes those sums meet for
continuous functions. The fundamental theorem then proves that integration and
differentiation undo each other, with continuity on the closed interval and
derivatives in its interior. Metric spaces
restate the whole of it with |x − y| replaced by a distance, which is the form
that carries above ℝ — all of it except closed and bounded, which has to be
replaced by the move it was being used for. Sequences of functions make the
continuous functions on a compact set into a complete metric space of their
own, and the arc ends where it was going: a differential equation, rewritten so
that its unknown is a point of that space, is solved by the fixed point theorem.
The calculus section supplies the integral equation that connects the function
space to that differential equation. There are currently 32 entries, 29 with
timelines; the remaining entries are the completeness axiom and two elementary
definitions.

Everything is on that arc. An entry that nothing in the reading order reaches,
and nothing will, does not belong here even if it is good — the index is a
path, and a disconnected node is not a stop on it.

## Adding an entry

1. Write the entry as a data module under `src/content/`, and add it to the
   array in `src/content/index.ts`.
2. If it needs a figure, write a component under `src/figures/` and register it
   in `src/figures/registry.ts` under the id the entry declares. Entries stay
   plain data and never import a component.
3. Cite other entries from the steps. If a cited entry does not exist yet, add
   it as a statement-only stub — the console will tell you about any that are
   missing.

## Verification

```bash
npm test
npm run build
```

Tests use Node's built-in test runner and the existing esbuild dependency.
They exercise tree placement, failure propagation, URL bounds and parameter
preservation, invalid content, all figure steps and single-hypothesis states,
and the numerical bounds behind the integration drawings. CI runs the tests
and production build on pushes and pull requests.

For visual review, start `npm run dev` and open
`/gallery.html?fig=mean-value`. The gallery derives real step ids, highlights
and hypothesis combinations from the content. Choose an entry in the selector;
optionally filter zero-based steps with `&steps=0,2,4` or counterexamples with
`&drop=differentiable` (`&drop=` shows only the intact theorem). The layout is
responsive and follows the system light/dark theme. The gallery is a development
entry point and is not included in the production build.

Before shipping content, inspect the new figures in both themes and on a narrow
viewport. On an entry page, verify stepping, browser Back/Forward, a reloaded
`?step=…&drop=…` link, switching and restoring hypotheses, and following a citation.
SVG render checks detect invalid geometry, but cannot detect overlapping labels
or establish that a drawing conveys the right mathematical idea.

The entry page and figures load on demand. KaTeX is a separate shared chunk so
content edits do not invalidate the math renderer's cache.

## Layout

```
src/types/      Entry, Timeline, Step, FigureProps
src/content/    The library itself, plus the derived dependency graph
src/figures/    One component per figure, over a shared set of SVG primitives
src/components/ Steps, citations, KaTeX rendering
src/pages/      The library index and the entry page
scripts/        Content/presentation checks and the Node test runner
tests/          Content, navigation, dependency and figure regression checks
```
