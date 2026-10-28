import { useRef, useState } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { tools } from '../../data/content.js';

export function Tools() {
  const sectionRef = useRef(null);
  const [openTool, setOpenTool] = useState(null);

  useReveal(sectionRef, { selector: '.tool', y: 42, stagger: 0.08 });
  useReveal(sectionRef, { selector: '.section-head > *', y: 30, stagger: 0.1 });

  return (
    <section className="section section--tight" aria-label="Creative tool ecosystem">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              Tool Ecosystem
            </p>
            <WordReveal as="h2" className="section-head__title" text="Instruments of craft." />
          </div>
          <p className="section-head__note">
            Professional-grade tools, orchestrated by taste. Select a tool to see the role it
            plays in your content engine.
          </p>
        </header>

        <div className="tools__grid">
          {tools.map((tool) => {
            const isOpen = openTool === tool.name;
            return (
              <button
                type="button"
                key={tool.name}
                className={`tool${isOpen ? ' is-open' : ''}`}
                aria-expanded={isOpen}
                onClick={() => setOpenTool(isOpen ? null : tool.name)}
              >
                <span className="tool__glyph" aria-hidden="true">
                  {tool.glyph}
                </span>
                <span className="tool__name">{tool.name}</span>
                <span className="tool__role">{tool.role}</span>
                <span className="tool__detail">{tool.detail}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
