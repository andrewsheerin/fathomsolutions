import React from 'react';

export default function About({ id }) {
  return (
    <section id={id} className="section section-dark">
      <div className="container">
        <header className="section-lead">
          <h2>What I do</h2>
          <p className="lead-sub">
            I build practical, data-driven tools for water, infrastructure, and resilience work.
          </p>
        </header>

        <div className="about-grid">
          <div className="about-cards" aria-label="Core capabilities">
            <article className="about-card">
              <h3>Analytics that drive action</h3>
              <p>Turn complex datasets into clear answers, dashboards, and decision support.</p>
            </article>
            <article className="about-card">
              <h3>GIS & spatial insight</h3>
              <p>Map, model, and quantify place-based impacts using modern geospatial workflows.</p>
            </article>
            <article className="about-card">
              <h3>Lightweight web apps</h3>
              <p>Ship focused tools that stakeholders actually use—fast, polished, and maintainable.</p>
            </article>
          </div>

          <aside className="about-me" aria-label="About Andrew">
            <img className="about-headshot" src="/images/headshot.jpg" alt="Andrew Sheerin" />
            <div>
              <h3>Hi—I'm Andrew.</h3>
              <p>
                I'm the founder of Fathom Solutions. With a Ph.D. in Environmental Engineering and a background in systems design,
                I build tools that help teams make smarter sustainability decisions—without the complexity.
              </p>
              <p className="about-note">Curious about a project? I'm happy to chat.</p>
            </div>
          </aside>
        </div>

        <div className="definition-strip" aria-label="Meaning of fathom">
          <div className="definition-word">
            <span className="definition-title">fath·om</span>
            <span className="definition-pron">/ ˈfaT͟Həm /</span>
          </div>
          <div className="definition-body">
            <p><em>(noun)</em> a unit of length (often water depth) equal to six feet.</p>
            <p><em>(verb)</em> to understand after much thought.</p>
          </div>
          <div className="definition-tag">Deeper understandings.</div>
        </div>
      </div>
    </section>
  );
}
