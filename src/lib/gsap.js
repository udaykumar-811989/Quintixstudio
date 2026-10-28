import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Global defaults — content is visible by default; GSAP sets hidden states
   right before animating so nothing flashes or disappears without JS motion. */
gsap.defaults({ ease: 'power3.out', duration: 1 });

export { gsap, ScrollTrigger };

/** Kill every ScrollTrigger (used on hot-reload / teardown safety sweeps). */
export function killAllTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
