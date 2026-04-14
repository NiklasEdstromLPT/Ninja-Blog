import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.js';
import { projectSlug, projectImageUrl, isVideo } from '../lib/projects.js';

export default function Project() {
  const { slug } = useParams();
  const { projects, error } = useProjects();
  const [slide, setSlide] = useState(0);

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

  // Build media array: tile image first, then supporting images, then videos
  const media = [];
  if (project.tileImage) {
    const t = String(project.tileImage).trim();
    if (t) media.push({ src: projectImageUrl(t), type: isVideo(t) ? 'video' : 'image' });
  }
  const rawSupporting = Array.isArray(project.supportingImages)
    ? project.supportingImages
    : project.images;
  if (Array.isArray(rawSupporting)) {
    rawSupporting.forEach((src) => {
      const trimmed = String(src || '').trim();
      if (!trimmed) return;
      media.push({ src: projectImageUrl(trimmed), type: isVideo(trimmed) ? 'video' : 'image' });
    });
  }
  const rawVideos = Array.isArray(project.videos)
    ? project.videos
    : project.video ? [project.video] : [];
  rawVideos.forEach((src) => {
    const v = String(src || '').trim();
    if (v) media.push({ src: projectImageUrl(v), type: 'video' });
  });

  // Collect numbered fields: longSummary, longSummary1, longSummary2, ...
  const collectFields = (prefix) => {
    const parts = [];
    if (project[prefix]) parts.push(project[prefix]);
    for (let i = 1; project[`${prefix}${i}`]; i++) {
      parts.push(project[`${prefix}${i}`]);
    }
    return parts;
  };

  const summaryParts = collectFields('longSummary').length
    ? collectFields('longSummary')
    : project.summary ? [project.summary] : [];
  const challengeParts = collectFields('challenges');

  const current = Math.min(slide, media.length - 1);
  const prev = () => setSlide((s) => (s - 1 + media.length) % media.length);
  const next = () => setSlide((s) => (s + 1) % media.length);

  return (
    <article className="project">
      <h1>{project.title}</h1>

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
        <div className="carousel">
          <div className="carousel-slide">
            {media[current].type === 'image' ? (
              <img src={media[current].src} alt={`${project.title} screenshot ${current + 1}`} />
            ) : (
              <video src={media[current].src} controls preload="metadata" playsInline />
            )}
          </div>
          {media.length > 1 && (
            <>
              <button className="carousel-btn carousel-prev" onClick={prev} aria-label="Previous">&#8249;</button>
              <button className="carousel-btn carousel-next" onClick={next} aria-label="Next">&#8250;</button>
              <div className="carousel-dots">
                {media.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot${i === current ? ' active' : ''}`}
                    onClick={() => setSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {summaryParts.length > 0 && (
        <div className="summary">
          <h2>Summary</h2>
          {summaryParts.map((text, i) => <p key={i}>{text}</p>)}
        </div>
      )}

      {challengeParts.length > 0 && (
        <div className="challenges">
          <h2>Challenges</h2>
          {challengeParts.map((text, i) => <p key={i}>{text}</p>)}
        </div>
      )}
    </article>
  );
}
