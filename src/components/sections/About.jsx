import { lazy, Suspense, useRef } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { aboutText } from '../../data/content.js';

const MonolithViewer = lazy(() => import('../three/MonolithViewer.jsx'));

export function About() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { selector: '.about__copy > *', y: 36, stagger: 0.09 });

  return (
    <section className="section" id="about" ref={sectionRef} aria-label="About QUINTIX Studio">
      <div className="container about__grid">
        <div className="about__copy">
          <p className="eyebrow">About QUINTIX</p>
          <WordReveal as="h2" className="about__title" text="A studio built for attention." />

          <p className="about__text">{aboutText}</p>

          <div className="about__meta">
            <div className="about__meta-item">
              <strong>Bespoke</strong>
              <span>Every brand, its own language</span>
            </div>
            <div className="about__meta-item">
              <strong>Agile</strong>
              <span>Freelance collective, studio standards</span>
            </div>
            <div className="about__meta-item">
              <strong>Full-Suite</strong>
              <span>Strategy to publishing, handled</span>
            </div>
          </div>
        </div>

        <div className="about__viewer">
          <Suspense fallback={null}>
            <MonolithViewer />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
