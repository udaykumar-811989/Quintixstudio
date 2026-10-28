import { lazy, Suspense, useRef } from 'react';
import { scrollToId } from '../../lib/scrollStore.js';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';

const CtaScene = lazy(() => import('../three/CtaScene.jsx'));

export function FinalCTA() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { selector: '.final-cta__inner > *', y: 44, stagger: 0.12 });

  return (
    <section className="section final-cta" ref={sectionRef} aria-label="Start a project">
      <div className="final-cta__scene" aria-hidden="true">
        <Suspense fallback={null}>
          <CtaScene />
        </Suspense>
      </div>
      <div className="final-cta__veil" aria-hidden="true" />

      <div className="container final-cta__inner">
        <p className="eyebrow">Start a project</p>

        <WordReveal
          as="h2"
          className="final-cta__title"
          text="Let's grow your business on social media."
          accentWords={['grow']}
          stagger={0.04}
        />

        <p className="final-cta__text">
          No complicated long-term locks. Genuine creative partnership engineered for real
          business returns.
        </p>

        <button
          type="button"
          className="btn btn--lg"
          onClick={() => scrollToId('#contact')}
          data-cursor="hover"
        >
          <span>Let&rsquo;s Talk</span>
        </button>
      </div>
    </section>
  );
}
