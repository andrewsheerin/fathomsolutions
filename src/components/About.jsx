import React from 'react';

export default function About({ id }) {
  return (
    <section id={id} className="section section-dark">
      <div className="container">
        <header className="section-lead">
          <h2>Mission</h2>
        </header>

        <div className="mission-grid">
          <div className="mission-main" aria-label="Mission">
            <h3 className="mission-headline">Technical decision support for environmental systems.</h3>

            <div className="mission-body">
              <p>
                We design and build technical decision-support tools for water, infrastructure, climate, and resilience
                systems. Our work sits at the intersection of hydrology, weather data, GIS, environmental modeling, and
                software development, bringing these disciplines together into practical systems that help people make
                defensible, data-driven decisions.
              </p>
              <p>
                We focus on environmental systems where complexity is unavoidable: stormwater networks, watershed
                processes, street-scale pollution, life cycle impacts, and climate-sensitive infrastructure. Rather than
                treating these as abstract models, we build tools that translate scientific understanding into usable,
                operational workflows for engineers, municipalities, researchers, and planners.
              </p>
              <p>
                At the end of the day, we’re interested in building tools that actually get used. Clear logic. Transparent
                assumptions. Strong data foundations. If a model or dashboard doesn’t help someone make a better
                decision, it needs to be reworked. The goal is not complexity, it’s clarity backed by rigor.
              </p>
            </div>

            <div className="definition-shell" aria-label="Meaning of fathom">
              <div className="definition-strip definition-strip--mission">
                <div className="definition-word">
                  <span className="definition-title">fath·om</span>
                  <span className="definition-pron">/ ˈfaT͟Həm /</span>
                </div>
                <div className="definition-body">
                  <p>
                    <em>(noun)</em> a unit of length (often water depth) equal to six feet.
                  </p>
                  <p>
                    <em>(verb)</em> to understand after much thought.
                  </p>
                </div>
                <div className="definition-tag">Deeper understandings</div>
              </div>
            </div>
          </div>

          <aside className="about-me about-me--mission" aria-label="About Andrew">
            <h3 className="about-me-title">Hi — I’m Andrew.</h3>
            <img className="about-headshot about-headshot--lg" src="/images/headshot.jpg" alt="Andrew Sheerin" />
            <div className="about-me-copy">
              <p>
                I’m an environmental engineer and founder of Fathom Solutions. My background is in systems thinking,
                hydrology, and data-driven environmental research, and I care deeply about building tools that improve how
                we manage water, infrastructure, and climate risk.
              </p>
              <p>
                I earned my Ph.D. in Civil and Environmental Engineering from the University of Rhode Island, and my B.S. in Systems
                Engineering from George Washington University.
              </p>
              <p>
                I’m motivated by science, research, and solving real problems, not just analyzing them. I enjoy working
                at the intersection of modeling, GIS, and software development, where data becomes something operational
                and useful. As a programmer and developer, I build the tools I wish existed, clear, efficient, and grounded
                in sound environmental science.
              </p>
              <p>
                Outside of work, I spend time sailing, biking, skiing, or working on passion projects. The same
                curiosity that drives my research tends to carry into everything else.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
