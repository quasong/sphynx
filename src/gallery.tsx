// Development-only entry point; Vite's production build includes index.html only.
import { createRoot } from 'react-dom/client';
import { entries } from './content';
import { getFigure } from './figures/registry';
import { figureStates } from './lib/figureStates';
import 'katex/dist/katex.min.css';
import './styles/global.css';
import './styles/gallery.css';

const params = new URLSearchParams(location.search);
const id = params.get('fig') ?? 'derivative';
const entry = entries.find((candidate) => candidate.figureId === id);
const steps = params.has('steps') ? (params.get('steps') ?? '').split(',').map(Number) : null;
const drops = params.has('drop') ? (params.get('drop') ?? '').split(',') : null;
const Figure = getFigure(id);

function Gallery() {
  const cells = entry ? figureStates(entry).filter((state) =>
    (!steps || steps.includes(state.stepIndex)) &&
    (!drops || state.dropped === null || drops.includes(state.dropped ?? '')),
  ) : [];
  return (
    <main className="gallery">
      <h1>Figure gallery</h1>
      <form className="gallery__controls">
        <label htmlFor="figure">Entry</label>
        <select id="figure" name="fig" defaultValue={id}>
          {entries.filter((candidate) => candidate.figureId).map((candidate) => (
            <option key={candidate.id} value={candidate.figureId}>{candidate.title}</option>
          ))}
        </select>
        <button type="submit">Show states</button>
        <span>{cells.length} states · light and dark follow your system theme</span>
      </form>
      {!entry || !Figure ? <p role="alert">Unknown figure: {id}</p> : (
        <div className="gallery__grid">
          {cells.map((state) => (
            <section key={`${state.stepIndex}:${state.dropped}`} className="gallery__cell">
              <h2>{state.stepIndex < 0 ? 'Statement' : `Step ${state.stepIndex + 1} · ${state.stepId}`}</h2>
              <p>{state.dropped ? `Without: ${state.dropped}` : 'All hypotheses'}</p>
              <Figure {...state} />
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Gallery />);
