import { useState } from 'react';
import { useProjects } from '../hooks/useProjects.js';
import ProjectTile from '../components/ProjectTile.jsx';

export default function Home() {
  const { projects, error } = useProjects();
  const [sort, setSort] = useState('none'); // 'none' | 'az' | 'za'

  const cycleSort = () =>
    setSort((s) => (s === 'none' ? 'az' : s === 'az' ? 'za' : 'none'));

  const normalize = (t) => t.trim().toLowerCase();

  let sorted = projects;
  if (projects && sort === 'az') {
    sorted = [...projects].sort((a, b) => normalize(a.title).localeCompare(normalize(b.title)));
  } else if (projects && sort === 'za') {
    sorted = [...projects].sort((a, b) => normalize(b.title).localeCompare(normalize(a.title)));
  }

  return (
    <>
      <section className="intro">
        <span className="badge">Project Showcase</span>
        <h1>Ninja <span className="accent">Blog</span></h1>
        <p className="lede">A collection of work from the Ninja Blog crew.</p>
      </section>

      {!error && projects && projects.length > 0 && (
        <div className="sort-bar">
          <button
            className={`sort-btn${sort !== 'none' ? ' active' : ''}`}
            onClick={cycleSort}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>{' '}
            {sort === 'az' ? 'A–Z' : sort === 'za' ? 'Z–A' : 'A–Z'}
          </button>
        </div>
      )}

      <section className="tiles" aria-live="polite">
        {error && (
          <p className="error">Couldn't load projects: {error.message}</p>
        )}
        {!error && projects === null && <p className="loading">Loading projects&hellip;</p>}
        {!error && projects && projects.length === 0 && (
          <p className="empty">No projects yet.</p>
        )}
        {!error && sorted && sorted.map((p, i) => (
          <ProjectTile key={i} project={p} />
        ))}
      </section>
    </>
  );
}
