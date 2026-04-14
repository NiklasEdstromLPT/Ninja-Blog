import { Link } from 'react-router-dom';
import { projectSlug, projectImageUrl, isVideo } from '../lib/projects.js';

export default function ProjectTile({ project }) {
  const slug = projectSlug(project);
  const thumbSrc = project.tileImage || (project.images && project.images[0]) || project.video || (project.videos && project.videos[0]);
  const thumb = projectImageUrl(thumbSrc);
  const thumbIsVideo = isVideo(thumbSrc);
  const tileSummary = project.tileSummary || project.summary;

  return (
    <Link className="tile" to={`/project/${slug}`}>
      {project.showcase && <span className="tile-ribbon">Showcase</span>}
      {thumb ? (
        thumbIsVideo ? (
          <video className="tile-thumb" src={thumb} muted loop playsInline autoPlay />
        ) : (
          <div
            className="tile-thumb"
            style={{ backgroundImage: `url('${thumb}')` }}
          />
        )
      ) : (
        <div className="tile-thumb placeholder" aria-hidden="true">&#x1F977;</div>
      )}
      <div className="tile-body">
        <h2 className="tile-title">{project.title}</h2>
        {tileSummary && <p className="tile-summary">{tileSummary}</p>}
      </div>
    </Link>
  );
}
