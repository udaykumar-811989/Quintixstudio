import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap.js';
import { scrollToId } from '../../lib/scrollStore.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';
import { Ticker } from '../ui/Ticker.jsx';
import { WordMask } from '../ui/Reveal.jsx';
import { heroTicker } from '../../data/content.js';

/* 3D loads as its own chunk; the page renders instantly without waiting for it. */
const HeroScene = lazy(() => import('../three/HeroScene.jsx'));

export function Hero({ introDone }) {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  /* Intro choreography — starts once the preloader has finished */
  useLayoutEffect(() => {
    if (!introDone || reduced) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.from('.hero__title .word-mask > span', {
        yPercent: 118,
        duration: 1.25,
        stagger: 0.07,
        clearProps: 'transform',
      })
        .from(
          '.hero__lede',
          { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' },
          '-=0.75'
        )
        .from(
          '.hero__actions > *',
          { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' },
          '-=0.75'
        )
        .from(
          '.hero__scroll-cue',
          { opacity: 0, duration: 0.9, clearProps: 'opacity' },
          '-=0.6'
        )
        .from(
          '.hero__ticker',
          { yPercent: 100, opacity: 0, duration: 1, clearProps: 'transform,opacity' },
          '-=0.85'
        );

      /* Scroll-linked parallax + hand-off to the next section */
      gsap.to('.hero__content', {
        yPercent: -14,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [introDone, reduced]);

  return (
    <section className="hero" id="top" ref={rootRef} aria-label="Introduction">
      <div className="hero__scene" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="hero__veil" aria-hidden="true" />

      <div className="container hero__content">
        <h1 className="hero__title">
          <WordMask as="span" text="We make" className="hero__title-line" />
          <WordMask as="span" text="your business" className="hero__title-line" />
          <WordMask
            as="span"
            text="impossible to ignore."
            className="hero__title-line"
            accentWords={['ignore.']}
          />
        </h1>

        <div className="hero__bottom">
          <p className="hero__lede">
            The bespoke creative team turning social profiles into unforgettable brand
            experiences.
          </p>

          <div className="hero__actions">
            <button
              type="button"
              className="btn"
              onClick={() => scrollToId('#contact')}
              data-cursor="hover"
            >
              <span>Let&rsquo;s Talk</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => scrollToId('#work')}
              data-cursor="hover"
            >
              <span>View Work</span>
            </button>
          </div>

          <a className="hero__scroll-cue" href="#manifesto" onClick={(e) => {
            e.preventDefault();
            scrollToId('#manifesto');
          }}>
            <i aria-hidden="true" />
            Scroll
          </a>
        </div>
      </div>

      <div className="hero__ticker" aria-label="Services">
        <Ticker items={heroTicker} duration={38} />
      </div>
    </section>
  );
}
