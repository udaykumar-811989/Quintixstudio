export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Damping factor independent of frame-rate (exponential smoothing). */
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/**
 * Split a string into word masks for staggered reveals.
 * Returns an array of { word, index } — render each as:
 *   <span class="word-mask"><span>{word}</span></span>
 * Whitespace is preserved with a trailing non-breaking space.
 */
export function splitWords(text) {
  return String(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => ({ word, index }));
}
