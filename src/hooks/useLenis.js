import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { setLenis, syncScrollState, scrollState } from '../lib/scrollStore.js';
import { useReducedMotion } from './useMotion.jsx';

/**
 * Boot Lenis smooth scrolling, wire it to GSAP ScrollTrigger, and keep the
 * shared scroll store fresh for the 3D scenes. Falls back to native scroll
 * (plus a lightweight rAF listener) when reduced motion is preferred.
 */
export function useLenis() {
  const reduced = useReducedMotion();

  useEffect(() => {
    let rafId = 0;
    let lenis = null;

    if (reduced) {
      const onScroll = () => {
        syncScrollState();
        scrollState.active = true;
        clearTimeout(rafId);
        rafId = window.setTimeout(() => (scrollState.active = false), 180);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      syncScrollState();
      return () => {
        window.removeEventListener('scroll', onScroll);
        clearTimeout(rafId);
      };
    }

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      scrollState.y = e.scroll;
      scrollState.velocity = e.velocity;
      scrollState.progress = e.progress;
      scrollState.active = Math.abs(e.velocity) > 0.05;
    });

    // Drive Lenis from GSAP's ticker so everything stays on one clock.
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    syncScrollState();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Keep trigger geometry correct across resizes/orientation changes.
  useEffect(() => {
    const onChange = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onChange);
    const t = window.setTimeout(onChange, 600);
    return () => {
      window.removeEventListener('resize', onChange);
      clearTimeout(t);
    };
  }, []);
}
