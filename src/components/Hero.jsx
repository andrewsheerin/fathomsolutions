import React from 'react';

export default function Hero({ id, onPrimary, onSecondary, onScrollHint }) {
  return (
    <section id={id} className="hero" aria-label="Hero">
      <div className="hero-bg" aria-hidden="true" />

      <div className="container hero-inner hero-inner--stacked">
        <div className="hero-copy">
          <img className="hero-logo" src="/images/fathom_logo_one_line_white.png" alt="" aria-hidden="true" />
          <h1>Technical tools for environmental decisions.</h1>
          <p className="hero-sub">
            Data analytics, GIS, and lightweight web apps that help teams move from messy data to confident next steps.
          </p>

          <div className="hero-actions">
            <button type="button" className="btn-primary" onClick={onPrimary}>
              View projects
            </button>
            <button type="button" className="btn-secondary" onClick={onSecondary}>
              Contact
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="hero-scroll-hint"
        onClick={onScrollHint}
        aria-label="Scroll to learn more"
      >
        <span className="hero-scroll-hint__label">Learn more</span>
        <span className="hero-scroll-hint__chevron" aria-hidden="true">
          ↓
        </span>
      </button>
    </section>
  );
}
