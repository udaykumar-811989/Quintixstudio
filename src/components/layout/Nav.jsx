import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap.js';
import { scrollToId } from '../../lib/scrollStore.js';
import { useReducedMotion } from '../../hooks/useMotion.jsx';
import { brand, contact } from '../../data/contact.js';
import { navLinks } from '../../data/content.js';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);
  const reduced = useReducedMotion();

  /* Condensed bar after slight scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Entrance */
  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.nav__inner > *', {
        y: -28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        delay: 2.1,
        clearProps: 'transform,opacity',
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  /* Mobile menu behaviour: escape to close, focus handling, scroll lock */
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('no-scroll');
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 320);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('no-scroll');
      clearTimeout(t);
    };
  }, [open]);

  const navigate = useCallback((event, href) => {
    event.preventDefault();
    setOpen(false);
    scrollToId(href);
  }, []);

  return (
    <>
      <header className={`nav${scrolled || open ? ' is-scrolled' : ''}`}>
        <div className="container nav__inner">
          <a
            className="nav__brand"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              scrollToId('#top');
            }}
            aria-label={`${brand.name} — back to top`}
          >
            <span className="nav__logo">{brand.name}</span>
            <span className="nav__tagline">{brand.tagline}</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="nav__link"
                href={link.href}
                onClick={(e) => navigate(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            className="btn nav__cta nav__cta-desktop"
            href="#contact"
            onClick={(e) => navigate(e, '#contact')}
          >
            <span>Let&rsquo;s Talk</span>
          </a>

          <button
            ref={toggleRef}
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu${open ? ' is-open' : ''}`} id="mobile-menu" aria-hidden={!open}>
        <nav className="menu__list" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              ref={index === 0 ? firstLinkRef : undefined}
              className="menu__link"
              href={link.href}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${0.15 + index * 0.06}s` : '0s' }}
              onClick={(e) => navigate(e, link.href)}
            >
              <span>0{index + 1}</span>
              {link.label}
            </a>
          ))}
          <a
            className="menu__link"
            href="#contact"
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? '0.39s' : '0s' }}
            onClick={(e) => navigate(e, '#contact')}
          >
            <span>05</span>
            Let&rsquo;s Talk
          </a>
        </nav>

        <div className="menu__footer">
          <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            {contact.instagram.handle}
          </a>
          <a href={contact.email.url} tabIndex={open ? 0 : -1}>
            {contact.email.address}
          </a>
        </div>
      </div>
    </>
  );
}
