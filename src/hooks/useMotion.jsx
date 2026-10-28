import { createContext, useContext } from 'react';
import { prefersReducedMotion } from '../lib/webgl.js';

/** Single source of truth for motion preferences (also read at module init
 *  so non-React code — e.g. Lenis — can respect it). */
export const reducedMotionAtBoot = prefersReducedMotion();

export const MotionContext = createContext({ reduced: reducedMotionAtBoot });

export function useMotion() {
  return useContext(MotionContext);
}

/** True when heavy animation should be skipped entirely. */
export function useReducedMotion() {
  return useContext(MotionContext).reduced;
}
