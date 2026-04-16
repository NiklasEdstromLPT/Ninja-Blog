import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectSlug, projectImageUrl, isVideo } from '../lib/projects.js';

export default function ProjectTile({ project, index = 0 }) {
  const slug = projectSlug(project);
  const thumbSrc = project.tileImage || (project.images && project.images[0]) || project.video || (project.videos && project.videos[0]);
  const thumb = projectImageUrl(thumbSrc);
  const thumbIsVideo = isVideo(thumbSrc);
  const tileSummary = project.tileSummary || project.summary;

  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Only stagger tiles that appear on initial load (within 100ms of mount)
  const isInitialBatch = Date.now() - mountTime.current < 100;
  const delay = isInitialBatch ? Math.min(index * 60, 300) : 0;

  return (
    <Link
      ref={ref}
      className={`tile tile-reveal${visible ? ' tile-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      to={`/project/${slug}`}
    >
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
        {project.date && (
          <time className="tile-date" dateTime={project.date}>{project.date}</time>
        )}
      </div>
    </Link>
  );
}
