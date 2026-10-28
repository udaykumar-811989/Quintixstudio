import { useRef } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { capabilities } from '../../data/content.js';

export function Capabilities() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { selector: '.capability', y: 40, stagger: 0.07 });
  useReveal(sectionRef, { selector: '.section-head > *', y: 30, stagger: 0.1 });

  return (
    <section className="section section--tight" aria-label="Capabilities">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              Capabilities
            </p>
            <WordReveal as="h2" className="section-head__title" text="Full-spectrum social." />
          </div>
          <p className="section-head__note">
            A complete operating system for your presence — from the first audit to the weekly
            calibration of what performs.
          </p>
        </header>

        <div className="capabilities__list">
          {capabilities.map((item) => (
            <article className="capability" key={item.num}>
              <span className="capability__num">{item.num}</span>
              <h3 className="capability__title">
                {item.title}
                <span className="capability__subtitle">{item.subtitle}</span>
              </h3>
              <p className="capability__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
