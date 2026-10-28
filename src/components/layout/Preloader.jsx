import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';
import { brand } from '../../data/contact.js';

/** Cinematic first-load screen: progress line, then a vertical wipe. */
export function Preloader({ onDone }) {
  const rootRef = useRef(null);
  const [finished, setFinished] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  useEffect(() => {
    let ctx;

    const finish = () => {
      setFinished(true);
      document.body.classList.remove('no-scroll');
      onDone?.();
    };

    if (reduced) {
      const t = window.setTimeout(finish, 350);
      return () => clearTimeout(t);
    }

    ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo('.preloader__fill', { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: 'power2.inOut' })
        .fromTo(
          '.preloader__meta-value',
          { textContent: 0 },
          {
            textContent: 100,
            duration: 1.05,
            ease: 'power2.inOut',
            snap: { textContent: 1 },
          },
          0
        )
        .to('.preloader__mark', { opacity: 0.35, duration: 0.5 }, 0.2)
        .to(rootRef.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '+=0.12');
    }, rootRef);

    return () => ctx?.revert();
  }, [reduced, onDone]);

  if (finished) return null;

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <div className="preloader__inner">
        <div className="preloader__mark">{brand.name}</div>
        <div className="preloader__bar">
          <div className="preloader__fill" />
        </div>
        <div className="preloader__meta">
          <span>Creative • Social • Digital</span>
          <span className="preloader__meta-value">0</span>
        </div>
      </div>
    </div>
  );
}
