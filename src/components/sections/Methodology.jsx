import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap.js';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { useReducedMotion } from '../../hooks/useMotion.jsx';
import { methodology } from '../../data/content.js';

export function Methodology() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useReveal(sectionRef, { selector: '.section-head > *', y: 30, stagger: 0.1 });

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const steps = el.querySelectorAll('.journey__step');

    if (reduced) {
      el.querySelector('.journey__progress')?.style.setProperty('transform', 'scaleY(1)');
      steps.forEach((step) => step.classList.add('is-active'));
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from(steps, {
        y: 52,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.journey', start: 'top 78%', once: true },
      });

      // Scroll-linked progress rail (no pinning, no scroll-jacking)
      gsap.fromTo(
        '.journey__progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.journey',
            start: 'top 68%',
            end: 'bottom 78%',
            scrub: 0.5,
          },
        }
      );

      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          end: 'bottom 42%',
          onToggle: (self) => step.classList.toggle('is-active', self.isActive),
        });
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <section className="section methodology" ref={sectionRef} aria-label="Our methodology">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.2rem' }}>
              Methodology
            </p>
            <WordReveal as="h2" className="section-head__title" text="The journey, mapped." />
          </div>
          <p className="section-head__note">
            A repeatable five-step cycle. Discover, define, produce, publish, refine — then run
            it again with sharper intelligence.
          </p>
        </header>

        <div className="journey">
          <div className="journey__rail" aria-hidden="true">
            <div className="journey__progress" />
          </div>

          {methodology.map((item) => (
            <article className="journey__step" key={item.step}>
              <div className="journey__step-num" aria-hidden="true">
                {item.step}
              </div>
              <div className="journey__step-body">
                <h3>
                  <span className="sr-only">Step {item.step} — </span>
                  {item.title}
                </h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
