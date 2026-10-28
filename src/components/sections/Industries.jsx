import { useRef } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { Ticker } from '../ui/Ticker.jsx';
import { industries } from '../../data/content.js';

/** Split the list so the two rows always look balanced. */
const midpoint = Math.ceil(industries.length / 2);
const rowA = industries.slice(0, midpoint);
const rowB = industries.slice(midpoint);

export function Industries() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { selector: '.section-head > *', y: 30, stagger: 0.1 });

  return (
    <section className="section section--tight" ref={sectionRef} aria-label="Industries we serve">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              Industries
            </p>
            <WordReveal as="h2" className="section-head__title" text="Built for your world." />
          </div>
          <p className="section-head__note">
            From boutique stays to high-intensity studios — visual categories we know how to
            make look inevitable.
          </p>
        </header>
      </div>

      <div className="industries__ticker">
        <Ticker items={rowA} duration={42} dot />
      </div>
      <div className="industries__ticker industries__ticker--b" style={{ borderTop: 'none' }}>
        <Ticker items={rowB} duration={38} reverse dot />
      </div>
    </section>
  );
}
