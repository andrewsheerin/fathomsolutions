import React, { useEffect, useMemo, useRef, useState } from 'react';

function IconChart(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 19V5M8 19v-6m4 6v-9m4 9v-4m4 4V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMapPin(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLayout(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4 4h16v16H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 10h16M10 4v16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDroplet(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 2s7 7.3 7 13a7 7 0 0 1-14 0c0-5.7 7-13 7-13Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLeaf(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M21 3s-7.4 1-11.2 4.8C6 11.6 6 18 6 18s6.4 0 10.2-3.8C20 10.4 21 3 21 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15c2-2 4.5-3.9 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const solutions = [
  {
    title: 'Data Analytics',
    icon: IconChart,
    body: 'Turn complex datasets into clear, decision-ready outputs. I build analytical workflows that support scenario testing, infrastructure planning, regulatory reporting, and long-term environmental strategy, not just static dashboards.',
  },
  {
    title: 'GIS & Spatial Analysis',
    icon: IconMapPin,
    body: 'Spatial modeling, raster and vector workflows, and environmental overlays that quantify place-based impacts. From watershed-scale analysis to street-level resolution, I use geospatial tools to connect data to geography.',
  },
  {
    title: 'Web Application Development',
    icon: IconLayout,
    body: 'Custom, lightweight tools that make environmental models accessible and usable. I design and develop focused applications that are fast, maintainable, and built around real workflows, not generic software.',
  },
  {
    title: 'Hydrological Modeling',
    icon: IconDroplet,
    body: 'Surface runoff, groundwater flow, pollutant transport, and climate-driven hydrologic change. I build models that help evaluate infrastructure performance and environmental risk under real-world conditions.',
  },
  {
    title: 'Life Cycle Assessment',
    icon: IconLeaf,
    body: 'Infrastructure and materials analysis across the full life cycle, from extraction and construction through maintenance and end-of-life. I develop LCA tools that support transparent comparison and sustainable decision-making.',
  },
];

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpointPx);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();

    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, [breakpointPx]);

  return isMobile;
}

export default function Solutions({ id }) {
  const isMobile = useIsMobile(768);
  const prefersReducedMotion = useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const cardRefs = useRef([]);
  const [visibleMap, setVisibleMap] = useState(() => ({}));

  useEffect(() => {
    if (!isMobile) return;
    if (prefersReducedMotion) return;

    const nodes = cardRefs.current.filter(Boolean);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        setVisibleMap((prev) => {
          const next = { ...prev };
          for (const e of entries) {
            const key = e.target.getAttribute('data-key');
            if (!key) continue;
            next[key] = e.isIntersecting;
          }
          return next;
        });
      },
      {
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.18,
      }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [isMobile, prefersReducedMotion]);

  return (
    <section id={id} className="section section-light solutions-section">
      <div className="container">
        <header className="section-lead">
          <h2>Solutions We Deliver</h2>
          <p className="lead-sub">Practical expertise to move projects from data to decision.</p>
        </header>

        {/* Desktop / tablet grid */}
        {!isMobile && (
          <div className="solutions-grid" aria-label="Solutions list">
            {solutions.map((s) => {
              const SolutionIcon = s.icon;
              return (
                <article className="solution-card" key={s.title}>
                  <div className="solution-head">
                    <span className="solution-icon" aria-hidden="true">
                      <SolutionIcon className="solution-icon-svg" />
                    </span>
                    <h3>{s.title}</h3>
                  </div>
                  <p>{s.body}</p>
                </article>
              );
            })}
          </div>
        )}

        {/* Mobile: IntersectionObserver scroll reveal */}
        {isMobile && (
          <div className="solutions-mobile" aria-label="Solutions list">
            {solutions.map((s, idx) => {
              const SolutionIcon = s.icon;
              const isVisible = prefersReducedMotion ? true : Boolean(visibleMap[s.title]);
              return (
                <article
                  key={s.title}
                  className={isVisible ? 'solution-card is-visible' : 'solution-card'}
                  data-key={s.title}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                >
                  <div className="solution-head">
                    <span className="solution-icon" aria-hidden="true">
                      <SolutionIcon className="solution-icon-svg" />
                    </span>
                    <h3>{s.title}</h3>
                  </div>
                  <p>{s.body}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
