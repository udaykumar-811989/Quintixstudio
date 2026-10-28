/**
 * Shared smooth-scroll state.
 * Lenis (when active) writes here every frame; Three.js scenes read it
 * cheaply inside useFrame without re-rendering React.
 */
export const scrollState = {
  y: 0,
  velocity: 0,
  /** 0..1 progress across the whole document */
  progress: 0,
  /** true while the user is actively scrolling (decays after idle) */
  active: false,
};

let lenisInstance = null;

export function setLenis(instance) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

/** Smoothly scroll to an in-page anchor (works with or without Lenis). */
export function scrollToId(id) {
  const el = document.querySelector(id);
  if (!el) return;
  const offset = -70; // fixed nav height breathing room
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/** Read + normalize document scroll (rAF-friendly, allocation free). */
export function syncScrollState() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  scrollState.y = window.scrollY;
  scrollState.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}
