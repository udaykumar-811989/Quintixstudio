import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap.js';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { useReducedMotion } from '../../hooks/useMotion.jsx';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { projects, showcaseFilters } from '../../data/projects.js';

function ProjectCard({ project, reduced, finePointer }) {
  const cardRef = useRef(null);
  const mediaRef = useRef(null);

  /* Scroll parallax on the image (separate element from the tilt, so the
     two transforms never fight). */
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const card = cardRef.current;
    const media = mediaRef.current;
    if (!card || !media) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
        }
      );
    }, card);
    return () => ctx.revert();
  }, [reduced, project.id]);

  /* Subtle 3D tilt on hover (desktop pointers only) */
  const onPointerMove = (event) => {
    if (!finePointer || reduced) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: px * 8,
      rotateX: -py * 7,
      transformPerspective: 1000,
      transformOrigin: 'center',
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const onPointerLeave = () => {
    if (!finePointer || reduced) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.6)',
      overwrite: 'auto',
    });
  };

  return (
    <article
      className="project"
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="project__media" ref={mediaRef}>
        <span className="project__badge">Creative Concept</span>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.name} — visual concept board for ${project.type.toLowerCase()}`}
            loading="lazy"
            decoding="async"
            width="1200"
            height="1500"
          />
        ) : (
          <div className="webgl-fallback" aria-hidden="true">
            <div className="webgl-fallback__glow" />
            <div className="webgl-fallback__shape" />
          </div>
        )}
        <p className="project__overlay-metric">
          {project.metric}
          <small>{project.metricLabel}</small>
        </p>
      </div>

      <div className="project__body">
        <h3 className="project__name">{project.name}</h3>
        <p className="project__handle">{project.handle}</p>
        <p className="project__type">{project.type}</p>
        <p className="project__focus">
          <span>Focus:</span> {project.focus}
        </p>
      </div>
    </article>
  );
}

export function Showcase() {
  const [filter, setFilter] = useState('All');
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  useReveal(sectionRef, { selector: '.section-head > *', y: 30, stagger: 0.1 });
  useReveal(sectionRef, { selector: '.showcase__filters', y: 24 });

  /* Initial cinematic reveal (masked image rise + content fade) */
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const grid = gridRef.current;
    if (!grid) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.project__media', {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.12,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      });
      gsap.from('.project__body > *', {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      });
    }, grid);
    return () => ctx.revert();
  }, [reduced]);

  /* Re-animate cards when the filter changes */
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const grid = gridRef.current;
    if (!grid) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project',
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, clearProps: 'transform,opacity' }
      );
    }, grid);
    return () => ctx.revert();
  }, [filter, reduced]);

  return (
    <section className="section" id="work" ref={sectionRef} aria-label="Creative showcase">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              Creative Showcase
            </p>
            <WordReveal as="h2" className="section-head__title" text="Concepts, crafted." />
          </div>
          <p className="section-head__note">
            Self-initiated concept work that shows how we see each industry — the moods,
            formats and narratives we would bring to a brand.
          </p>
        </header>

        <div className="showcase__filters" role="group" aria-label="Filter projects by industry">
          {showcaseFilters.map((option) => (
            <button
              key={option}
              type="button"
              className={`filter-btn${filter === option ? ' is-active' : ''}`}
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="showcase__grid" ref={gridRef}>
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} reduced={reduced} finePointer={finePointer} />
          ))}
        </div>

        <p className="showcase__note">
          <strong>Note:</strong> the projects above are creative concepts produced by QUINTIX
          Studio to demonstrate direction and craft. They are not verified client campaigns and
          the figures shown are concept projections, not measured client results.
        </p>
      </div>
    </section>
  );
}
