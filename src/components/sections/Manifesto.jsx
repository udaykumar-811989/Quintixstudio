import { useRef } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { Ticker } from '../ui/Ticker.jsx';
import { manifestoTickers } from '../../data/content.js';

export function Manifesto() {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);

  useReveal(sectionRef, { selector: '.manifesto__tickers', y: 30 });
  useReveal(statementRef, { selector: '.manifesto__statement > *', y: 36, stagger: 0.12 });

  return (
    <section className="section manifesto" id="manifesto" ref={sectionRef} aria-label="Studio manifesto">
      <div className="container">
        <p className="eyebrow" style={{ marginBottom: '1.6rem' }}>
          The Manifesto
        </p>

        <WordReveal
          as="h2"
          className="manifesto__heading"
          text="Creative Thinking. Social Growth. Real Connections."
          stagger={0.05}
        />

        <div className="manifesto__tickers">
          <Ticker
            items={manifestoTickers.primary}
            duration={46}
            className="manifesto__ticker-a"
            dot={false}
          />
          <Ticker
            items={manifestoTickers.secondary}
            duration={34}
            reverse
            className="manifesto__ticker-b"
          />
        </div>

        <div className="manifesto__statement" ref={statementRef}>
          <p className="eyebrow">Why we exist</p>
          <p>
            Attention is the currency of modern business. We build social presence with the
            discipline of a studio and the instincts of a trend desk — so the brands we partner
            with are not merely seen, they are remembered, sought out and shared.
          </p>
        </div>
      </div>
    </section>
  );
}
