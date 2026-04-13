import { Routes, Route, Link } from 'react-router-dom';
import Home from './routes/Home.jsx';
import Project from './routes/Project.jsx';
import NotFound from './routes/NotFound.jsx';

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">&#x1F977;</span>
            <span className="brand-name">Ninja Blog</span>
          </Link>
          <nav>
            <Link to="/">Projects</Link>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:slug" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <small>&copy; Ninja Blog</small>
        </div>
      </footer>
    </>
  );
}
