import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { LibraryPage } from './pages/LibraryPage';

const EntryPage = lazy(() => import('./pages/EntryPage').then((module) => ({ default: module.EntryPage })));

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <Link className="topbar__brand" to="/">
          Sphynx
        </Link>
        <span className="topbar__tagline">step-by-step mathematics</span>
      </header>

      <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/e/:id" element={
          <Suspense fallback={<main className="page" role="status">Loading the argument…</main>}>
            <EntryPage />
          </Suspense>
        } />
        <Route path="*" element={<LibraryPage />} />
      </Routes>

      <footer className="footer">
        <p>
          Every citation in a proof is a link, and every link goes to a full entry of
          its own.
        </p>
      </footer>
    </div>
  );
}
