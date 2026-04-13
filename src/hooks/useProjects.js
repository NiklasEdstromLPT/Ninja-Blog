import { useEffect, useState } from 'react';
import { loadProjects } from '../lib/projects.js';

export function useProjects() {
  const [state, setState] = useState({ projects: null, error: null });

  useEffect(() => {
    let cancelled = false;
    loadProjects()
      .then((projects) => { if (!cancelled) setState({ projects, error: null }); })
      .catch((error) => { if (!cancelled) setState({ projects: null, error }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}
