import { useCallback, useEffect, useState } from 'react';
import { MotionContext, reducedMotionAtBoot } from './hooks/useMotion.jsx';
import { useLenis } from './hooks/useLenis.js';
import { ScrollTrigger } from './lib/gsap.js';

import { Preloader } from './components/layout/Preloader.jsx';
import { Nav } from './components/layout/Nav.jsx';
import { Footer } from './components/layout/Footer.jsx';

import { Hero } from './components/sections/Hero.jsx';
import { Manifesto } from './components/sections/Manifesto.jsx';
import { About } from './components/sections/About.jsx';
import { Services } from './components/sections/Services.jsx';
import { Capabilities } from './components/sections/Capabilities.jsx';
import { Methodology } from './components/sections/Methodology.jsx';
import { Showcase } from './components/sections/Showcase.jsx';
import { WhyQuintix } from './components/sections/WhyQuintix.jsx';
import { Tools } from './components/sections/Tools.jsx';
import { Industries } from './components/sections/Industries.jsx';
import { FinalCTA } from './components/sections/FinalCTA.jsx';
import { Contact } from './components/sections/Contact.jsx';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  useLenis();

  const handleIntroDone = useCallback(() => {
    setIntroDone(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  /* ScrollTrigger geometry can shift as fonts, canvases and images settle. */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t1 = window.setTimeout(refresh, 1200);
    const t2 = window.setTimeout(refresh, 3200);
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <MotionContext.Provider value={{ reduced: reducedMotionAtBoot }}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grain" aria-hidden="true" />

      <Preloader onDone={handleIntroDone} />
      <Nav />

      <main id="main">
        <Hero introDone={introDone} />
        <Manifesto />
        <About />
        <Services />
        <Capabilities />
        <Methodology />
        <Showcase />
        <WhyQuintix />
        <Tools />
        <Industries />
        <FinalCTA />
        <Contact />
      </main>

      <Footer />
    </MotionContext.Provider>
  );
}
