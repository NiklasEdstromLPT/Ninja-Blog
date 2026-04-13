import { Link } from 'react-router-dom';
import { projectSlug } from '../lib/projects.js';

export default function ProjectTile({ project }) {
  const slug = projectSlug(project);
  const thumb = project.images && project.images[0];

  return (
    <Link className="tile" to={`/project/${slug}`}>
      {thumb ? (
        <div
          className="tile-thumb"
          style={{ backgroundImage: `url('${thumb}')` }}
        />
      ) : (
        <div className="tile-thumb placeholder" aria-hidden="true">&#x1F977;</div>
      )}
      <div className="tile-body">
        <h2 className="tile-title">{project.title}</h2>
        {project.summary && <p className="tile-summary">{project.summary}</p>}
      </div>
    </Link>
  );
}
