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

function IconRecycle(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M7.5 7.5 10 3h4l2.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 10.5 22 14l-2 3.5h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 13.5 2 10l2-3.5h5"
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
    title: 'Data analytics',
    icon: IconChart,
    body: 'Turn complex datasets into clear, actionable insights for planning and policy.',
  },
  {
    title: 'GIS specialist',
    icon: IconMapPin,
    body: 'Spatial analysis, mapping, and geoprocessing to understand place-based impacts.',
  },
  {
    title: 'Web-app development',
    icon: IconLayout,
    body: 'Lightweight, purpose-built tools that put your data to work for stakeholders.',
  },
  {
    title: 'Hydrological modeling',
    icon: IconDroplet,
    body: 'Simulate water and pollutant transport through runoff, drainage networks, and groundwater flow.',
  },
  {
    title: 'Life cycle assessment',
    icon: IconRecycle,
    body: 'Calculate environmental impacts of products and processes across the full life cycle.',
  },
];

function useIsMobile(breakpointPx = 860) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpointPx);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
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
  const isMobile = useIsMobile(860);
  const prefersReducedMotion = useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    const nodes = cardRefs.current.filter(Boolean);
    if (!nodes.length) return;

    if (prefersReducedMotion) {
      setActiveIndex(0);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible/closest-to-center entry as active
        const candidates = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({
            idx: Number(e.target.getAttribute('data-idx')),
            ratio: e.intersectionRatio,
          }))
          .sort((a, b) => b.ratio - a.ratio);

        if (candidates[0]) setActiveIndex(candidates[0].idx);
      },
      {
        threshold: [0.25, 0.4, 0.55, 0.7, 0.85],
        rootMargin: '-35% 0px -45% 0px',
      }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [isMobile, prefersReducedMotion]);

  return (
    <section id={id} className="section section-light solutions-section">
      <div className="container">
        <header className="section-lead">
          <h2>Solutions we deliver</h2>
          <p className="lead-sub">Practical expertise to move projects from data to decision.</p>
        </header>

        {/* Desktop / large screens: keep the grid */}
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

        {/* Mobile: focused/scroll-activated accordion */}
        {isMobile && (
          <div className="solutions-mobile" aria-label="Solutions list">
            {solutions.map((s, idx) => {
              const SolutionIcon = s.icon;
              const isActive = idx === activeIndex;
              return (
                <article
                  key={s.title}
                  className={isActive ? 'solution-card is-active' : 'solution-card'}
                  data-idx={idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                >
                  <button
                    type="button"
                    className="solution-toggle"
                    aria-expanded={isActive}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <span className="solution-icon" aria-hidden="true">
                      <SolutionIcon className="solution-icon-svg" />
                    </span>
                    <span className="solution-title">{s.title}</span>
                    <span className="solution-chevron" aria-hidden="true">
                      ▾
                    </span>
                  </button>

                  <div className="solution-body" hidden={!isActive}>
                    <p>{s.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
