import React, { useEffect, useMemo, useRef, useState } from 'react';

const projects = [
  {
    id: 'swpt',
    title: 'SWPT',
    description:
      'Data-driven SaaS for municipalities to optimize street sweeping and reduce stormwater pollution.',
    href: `${import.meta.env.BASE_URL}SWPT/`,
    cta: 'Learn more',
    tags: ['Stormwater', 'SaaS', 'Municipal'],
    image: '/images/street_sweeper.jpeg',
  },
  {
    id: 'lca',
    title: 'LCA Pave',
    description:
      'Life cycle assessment tooling for pavement and infrastructure systems. Compare materials, costs, and impacts across scenarios.',
    href: null,
    cta: 'Coming soon',
    tags: ['LCA', 'Infrastructure'],
    image: '/images/asphalt-background.jpg',
  },
  {
    id: 'wind',
    title: 'Wind App',
    description: 'A lightweight wind resource viewer for site screening and exportable summaries.',
    href: null,
    cta: 'Coming soon',
    tags: ['Geospatial', 'Energy'],
    image: '/images/topographic_map.jpg',
  },
  {
    id: 'github',
    title: 'GitHub Repositories',
    description: 'Explore public code experiments, utilities, and app starters behind the work.',
    href: 'https://github.com/andrewsheerin',
    cta: 'View GitHub',
    tags: ['Open source'],
    image: '/images/dark_background.jpg',
  },
];

export default function Projects({ id }) {
  const prefersReducedMotion = useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const cardRefs = useRef([]);
  const [visibleMap, setVisibleMap] = useState(() => ({}));
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean);
    if (!nodes.length) return;

    if (prefersReducedMotion) {
      const all = {};
      nodes.forEach((n) => {
        all[n.getAttribute('data-key')] = true;
      });
      setVisibleMap(all);
      return;
    }

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
        rootMargin: '10% 0px -20% 0px',
        threshold: 0.15,
      }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    // If a card scrolls out of view, close it so the list stays tidy.
    if (!openId) return;
    if (visibleMap[openId] === false) setOpenId(null);
  }, [openId, visibleMap]);

  return (
    <section id={id} className="section section-dark projects-section">
      <div className="container">
        <header className="section-lead">
          <h2>Projects</h2>
          <p className="lead-sub">Selected tools and repositories we’re building.</p>
        </header>

        <div className="projects-grid" aria-label="Project list">
          {projects.map((p, idx) => {
            const isExternal = Boolean(p.href && /^https?:\/\//i.test(p.href));
            const isVisible = visibleMap[p.id] ?? false;
            const isOpen = openId === p.id;

            return (
              <article
                className={
                  `${isVisible ? 'project-card is-visible' : 'project-card'}${isOpen ? ' is-open' : ''}`
                }
                key={p.id}
                data-key={p.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
              >
                <button
                  type="button"
                  className="project-card-link"
                  aria-label={p.title}
                  aria-expanded={isOpen}
                  onClick={() => setOpenId((prev) => (prev === p.id ? null : p.id))}
                >
                  <div className="project-bg" style={{ backgroundImage: `url(${p.image})` }} aria-hidden="true" />
                  <div className="project-inner">
                    <h3 className="project-title">{p.title}</h3>
                    <div className="project-overlay">
                      <p className="project-desc">{p.description}</p>
                      <div className="project-tags" aria-label="Project tags">
                        {p.tags.map((t) => (
                          <span key={t} className="tag">
                            {t}
                          </span>
                        ))}
                      </div>

                      {p.href ? (
                        <a
                          className="btn-primary project-cta"
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {p.cta}
                        </a>
                      ) : (
                        <span className="btn-primary project-cta is-disabled">{p.cta}</span>
                      )}

                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
