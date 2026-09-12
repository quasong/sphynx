import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { findContentProblems } from './content';
import 'katex/dist/katex.min.css';
import './styles/global.css';

// Content bugs that the rendered page would hide rather than show.
if (import.meta.env.DEV) {
  const problems = findContentProblems();
  if (problems.length > 0) {
    console.error(`[sphynx] content problems:\n  ${problems.join('\n  ')}`);
  }
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

// HashRouter keeps deep links to individual steps working on static hosting,
// where there is no server to rewrite paths onto index.html.
createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
