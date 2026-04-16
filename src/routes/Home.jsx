import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useProjects } from '../hooks/useProjects.js';
import ProjectTile from '../components/ProjectTile.jsx';

const KEY = 'ninja-home-prefs';
const loadPrefs = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; }
};
const savePrefs = (patch) => {
  const prefs = { ...loadPrefs(), ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(prefs));
  return prefs;
};

export default function Home() {
  const { projects, error } = useProjects();
  const saved = loadPrefs();
  const [sort, setSort] = useState(saved.sort || 'none');
  const [dateSort, setDateSort] = useState(saved.dateSort ?? 'newest');
  const [view, setView] = useState(saved.view || 'all');


  const cycleSort = () => {
    setSort((s) => {
      const next = s === 'none' ? 'az' : s === 'az' ? 'za' : 'none';
      savePrefs({ sort: next, dateSort: null });
      return next;
    });
    setDateSort(null);
  };

  const cycleDateSort = () => {
    setDateSort((d) => {
      const next = d === null ? 'newest' : d === 'newest' ? 'oldest' : null;
      savePrefs({ dateSort: next, sort: 'none' });
      return next;
    });
    setSort('none');
  };

  const normalize = (t) => t.trim().toLowerCase();

  // Parse "MM-DD-YYYY" reliably (Safari/mobile rejects dashes in that format)
  const parseDate = (d) => {
    const [m, day, y] = d.split('-');
    return new Date(y, m - 1, day);
  };

  const filtered = projects && view === 'showcase'
    ? projects.filter((p) => p.showcase)
    : projects;

  let sorted = filtered;
  // dateSort takes precedence when active
  if (filtered && dateSort === 'newest') {
    sorted = [...filtered].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  } else if (filtered && dateSort === 'oldest') {
    sorted = [...filtered].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  } else if (filtered && sort === 'az') {
    sorted = [...filtered].sort((a, b) => normalize(a.title).localeCompare(normalize(b.title)));
  } else if (filtered && sort === 'za') {
    sorted = [...filtered].sort((a, b) => normalize(b.title).localeCompare(normalize(a.title)));
  }

  return (
    <>
      <section className="intro">
        <span className="badge">Project Showcase</span>
        <h1><span
          className="shuriken-text"
          onClick={(e) => {
            const el = e.currentTarget;
            if (el.classList.contains('shuriken-play')) return;
            el.classList.add('shuriken-play');
            setTimeout(() => el.classList.remove('shuriken-play'), 1750);
          }}
        >Ninja <span className="accent">Blog</span></span></h1>
        <p className="lede">A collection of work from the Ninja Code crew.</p>
        <div className="view-toggle">
          <button
            className={`view-btn${view === 'showcase' ? ' active' : ''}`}
            onClick={() => { setView('showcase'); savePrefs({ view: 'showcase' }); }}
          >Showcase</button>
          <button
            className={`view-btn${view === 'all' ? ' active' : ''}`}
            onClick={() => { setView('all'); savePrefs({ view: 'all' }); }}
          >All</button>
        </div>
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
          <button
            className={`sort-btn${dateSort ? ' active' : ''}`}
            onClick={cycleDateSort}
            aria-label={
              dateSort === 'newest'
                ? 'Sort by date, newest first'
                : dateSort === 'oldest'
                ? 'Sort by date, oldest first'
                : 'Enable date sort (newest first)'
            }
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{' '}
            {dateSort === 'newest' ? 'Newest' : dateSort === 'oldest' ? 'Oldest' : 'Date'}
            {dateSort === 'newest' && <ChevronUp size={14} style={{marginLeft:2}} />}
            {dateSort === 'oldest' && <ChevronDown size={14} style={{marginLeft:2}} />}
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
