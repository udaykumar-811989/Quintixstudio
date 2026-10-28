import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from '../../lib/gsap.js';
import { splitWords } from '../../lib/utils.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';

/**
 * Fade/slide reveal for a block of content.
 * Content is visible by default; the hidden state is applied by GSAP right
 * before animating, so reduced-motion users and no-JS states stay readable.
 */
export function useReveal(
  ref,
  { y = 42, opacity = 0, duration = 1.05, stagger = 0.08, delay = 0, selector, start = 'top 84%' } = {}
) {
  const reduced = useReducedMotion();
  const deps = [reduced, y, opacity, duration, stagger, delay, selector, start];

  useEffect(() => {
    const el = ref?.current;
    if (!el || reduced) return undefined;

    const targets = selector ? el.querySelectorAll(selector) : el;
    if (selector && (!targets || targets.length === 0)) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity,
        duration,
        stagger,
        delay,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/** Standalone reveal wrapper: <Reveal>…</Reveal> */
export function Reveal({
  as: Tag = 'div',
  y = 42,
  opacity = 0,
  duration = 1.05,
  stagger = 0.08,
  delay = 0,
  selector,
  start = 'top 84%',
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  useReveal(ref, { y, opacity, duration, stagger, delay, selector, start });
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Static word masks (no animation) — for text driven by an external
 * timeline, e.g. the hero intro sequence.
 */
export function WordMask({ as: Tag = 'span', text, className, accentWords = [], ...rest }) {
  const words = useMemo(() => splitWords(text), [text]);
  const accent = useMemo(
    () => new Set(accentWords.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))),
    [accentWords]
  );

  return (
    <Tag className={className} {...rest}>
      {words.map(({ word, index }) => {
        const isAccent = accent.has(word.toLowerCase().replace(/[^a-z]/g, ''));
        return (
          <span className="word-mask" key={`${word}-${index}`}>
            <span className={isAccent ? 'accent' : undefined}>{word}</span>
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * Typography reveal: each word slides up from behind a mask.
 * Words are rendered as real spans (no runtime DOM mutation), which keeps
 * React 19 happy and text selectable.
 */
export function WordReveal({
  as: Tag = 'h2',
  text,
  className,
  delay = 0,
  stagger = 0.045,
  start = 'top 86%',
  duration = 1.05,
  accentWords = [],
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    const inner = el.querySelectorAll('.word-mask > span');
    if (!inner.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(inner, {
        yPercent: 118,
        duration,
        ease: 'power4.out',
        stagger,
        delay,
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, delay, stagger, start, duration, text]);

  return (
    <WordMask
      ref={ref}
      as={Tag}
      text={text}
      className={className}
      accentWords={accentWords}
      {...rest}
    />
  );
}
