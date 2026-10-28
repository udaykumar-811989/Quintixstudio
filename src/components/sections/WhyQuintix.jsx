import { useRef } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { Icon } from '../ui/Icons.jsx';
import { whyQuintix } from '../../data/content.js';

const ICONS = ['spark', 'compass', 'layers', 'headphones', 'trend', 'chart'];

export function WhyQuintix() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { selector: '.why__item', y: 40, stagger: 0.08 });
  useReveal(sectionRef, { selector: '.section-head > *', y: 30, stagger: 0.1 });

  return (
    <section className="section section--tight" aria-label="Why QUINTIX">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              Why QUINTIX
            </p>
            <WordReveal as="h2" className="section-head__title" text="Six reasons, no noise." />
          </div>
          <p className="section-head__note">
            We stay small on purpose: senior attention on every account, no rotating juniors,
            no generic playbooks.
          </p>
        </header>

        <div className="why__grid">
          {whyQuintix.map((item, index) => (
            <article className="why__item" key={item.title}>
              <Icon name={ICONS[index % ICONS.length]} size={30} className="why__icon" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
