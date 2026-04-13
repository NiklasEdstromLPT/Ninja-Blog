import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.js';
import { projectSlug } from '../lib/projects.js';

export default function Project() {
  const { slug } = useParams();
  const { projects, error } = useProjects();

  const project = projects?.find((p) => projectSlug(p) === slug);

  useEffect(() => {
    document.title = project ? `${project.title} \u00B7 Ninja Blog` : 'Ninja Blog';
    return () => { document.title = 'Ninja Blog'; };
  }, [project]);

  if (error) {
    return <p className="error">Couldn't load project: {error.message}</p>;
  }
  if (projects === null) {
    return <p className="loading">Loading&hellip;</p>;
  }
  if (!project) {
    return (
      <p className="error">
        Project "{slug}" not found. <Link to="/">Back to projects</Link>.
      </p>
    );
  }

  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <article className="project">
      <h1>{project.title}</h1>
      {project.summary && <p className="summary">{project.summary}</p>}

      {(project.live || project.repo) && (
        <div className="links">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              Live site &#x2197;
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              Repository &#x2197;
            </a>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="gallery">
          {images.map((src, i) => (
            <img key={i} src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
          ))}
        </div>
      )}
    </article>
  );
}
