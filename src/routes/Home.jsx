import { useProjects } from '../hooks/useProjects.js';
import ProjectTile from '../components/ProjectTile.jsx';

export default function Home() {
  const { projects, error } = useProjects();

  return (
    <>
      <section className="intro">
        <h1>Projects</h1>
        <p className="lede">A collection of work from the Ninja Blog crew.</p>
      </section>

      <section className="tiles" aria-live="polite">
        {error && (
          <p className="error">Couldn't load projects: {error.message}</p>
        )}
        {!error && projects === null && <p className="loading">Loading projects&hellip;</p>}
        {!error && projects && projects.length === 0 && (
          <p className="empty">No projects yet.</p>
        )}
        {!error && projects && projects.map((p, i) => (
          <ProjectTile key={i} project={p} />
        ))}
      </section>
    </>
  );
}
