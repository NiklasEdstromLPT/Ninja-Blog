import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.js';
import { projectSlug, projectImageUrl, isVideo } from '../lib/projects.js';

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

  const rawSupporting = Array.isArray(project.supportingImages)
    ? project.supportingImages
    : project.images;
  const media = [];
  if (Array.isArray(rawSupporting)) {
    rawSupporting.forEach((src) => {
      const trimmed = String(src || '').trim();
      if (!trimmed) return;
      media.push({ src: projectImageUrl(trimmed), type: isVideo(trimmed) ? 'video' : 'image' });
    });
  }
  // Include videos — supports both `video` (string) and `videos` (array)
  const rawVideos = Array.isArray(project.videos)
    ? project.videos
    : project.video ? [project.video] : [];
  rawVideos.forEach((src) => {
    const v = String(src || '').trim();
    if (v) media.push({ src: projectImageUrl(v), type: 'video' });
  });
  const fullSummary = project.longSummary || project.summary;

  return (
    <article className="project">
      <h1>{project.title}</h1>
      {fullSummary && <p className="summary">{fullSummary}</p>}

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

      {media.length > 0 && (
        <div className="gallery">
              {media.map((m, i) => (
                m.type === 'image' ? (
                  <img key={i} src={m.src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
                ) : (
                  <video
                    key={i}
                    src={m.src}
                    controls
                    preload="metadata"
                    playsInline
                    style={{ maxWidth: '100%' }}
                  />
                )
              ))}
        </div>
      )}
    </article>
  );
}
