import { useRef } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { Icon } from '../ui/Icons.jsx';
import { services } from '../../data/content.js';

export function Services() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { selector: '.service', y: 44, stagger: 0.08 });
  useReveal(sectionRef, { selector: '.section-head > *', y: 30, stagger: 0.1 });

  return (
    <section className="section" id="services" ref={sectionRef} aria-label="Core services">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              Core Services
            </p>
            <WordReveal as="h2" className="section-head__title" text="What we do best." />
          </div>
          <p className="section-head__note">
            Six disciplines, one team. Everything a modern brand needs to look inevitable on
            social — designed, produced and managed under one roof.
          </p>
        </header>

        <div className="services__grid">
          {services.map((service, index) => (
            <article className="service" key={service.id} tabIndex={0}>
              <span className="service__index">/{String(index + 1).padStart(2, '0')}</span>
              <Icon name={service.icon} size={44} className="service__icon" />
              <h3 className="service__title">{service.title}</h3>
              <p className="service__text">{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
