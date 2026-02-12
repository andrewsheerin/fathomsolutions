import React, { useEffect, useMemo, useRef, useState } from 'react';

const projects = [
  {
    id: 'swpt',
    title: 'SWPT',
    description:
      'Data-driven SaaS for municipalities to optimize street sweeping and reduce stormwater pollution.',
    href: '/SWPT',
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

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean);
    if (!nodes.length) return;

    if (prefersReducedMotion) {
      // show everything immediately
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
        // Reveal a bit before the card hits the viewport and fade out shortly after it leaves
        rootMargin: '10% 0px -20% 0px',
        threshold: 0.15,
      }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section id={id} className="section section-dark projects-section">
      <div className="container">
        <header className="section-lead">
          <h2>Projects</h2>
          <p className="lead-sub">Selected tools and repositories we’re building.</p>
        </header>

        <div className="projects-grid" aria-label="Project list">
          {projects.map((p, idx) => {
            const Tag = p.href ? 'a' : 'div';
            const tagProps = p.href
              ? { href: p.href, target: p.href.startsWith('http') ? '_blank' : undefined, rel: 'noopener' }
              : {};

            const isVisible = visibleMap[p.id] ?? false;

            return (
              <article
                className={isVisible ? 'project-card is-visible' : 'project-card'}
                key={p.id}
                data-key={p.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
              >
                <Tag className="project-card-link" {...tagProps} aria-label={p.title}>
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
                      <span className={`btn-primary project-cta ${p.href ? '' : 'is-disabled'}`}>
                        {p.cta}
                      </span>
                    </div>
                  </div>
                </Tag>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
