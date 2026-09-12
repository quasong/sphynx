import { Link, Route, Routes } from 'react-router-dom';
import { EntryPage } from './pages/EntryPage';
import { LibraryPage } from './pages/LibraryPage';

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
        <Route path="/e/:id" element={<EntryPage />} />
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
