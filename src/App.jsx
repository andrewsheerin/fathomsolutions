import React, { useEffect, useMemo, useState } from 'react';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Solutions from './components/Solutions.jsx';
import Projects from './components/Projects.jsx';
import Footer from './components/Footer.jsx';

const SECTION_IDS = {
  home: 'home',
  about: 'about',
  solutions: 'solutions',
  projects: 'projects',
  contact: 'contact',
};

export default function App() {
  const prefersReducedMotion = useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Header shows once we’ve scrolled past hero.
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById(SECTION_IDS.home);
    if (!heroEl) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // If hero is intersecting, hide header.
        setHeaderVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-20% 0px -1px 0px' }
    );

    io.observe(heroEl);
    return () => io.disconnect();
  }, []);

  const requestScrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <Header
        visible={headerVisible}
        onNavigate={(id) => requestScrollTo(id)}
        sectionIds={SECTION_IDS}
      />

      <main>
        <Hero
          id={SECTION_IDS.home}
          onPrimary={() => requestScrollTo(SECTION_IDS.projects)}
          onSecondary={() => requestScrollTo(SECTION_IDS.contact)}
        />

        <About id={SECTION_IDS.about} />
        <Solutions id={SECTION_IDS.solutions} />
        <Projects id={SECTION_IDS.projects} />
      </main>

      <Footer id={SECTION_IDS.contact} />
    </>
  );
}
