/* ========= Slow scroll specifically for the "Learn more" button (no overshoot) ========= */
(function () {
  const btn = document.querySelector(".scroll-hint");
  const target = document.querySelector("#about");
  if (!btn || !target) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    // Figure out current header height (handles desktop/mobile)
    const header = document.querySelector(".site-header");
    const headerH = header ? header.offsetHeight : 0;

    // Small visual cushion so you don't see the next section's top
    const nudge = 0; // px

    const startY = window.scrollY;
    const rawEndY = target.getBoundingClientRect().top + window.scrollY;
    const endY = Math.max(0, rawEndY - headerH - nudge);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReduced ? 0 : 1600; // adjust for slower/faster

    if (duration === 0) {
      window.scrollTo({ top: endY, behavior: "auto" });
      return;
    }

    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let startTime = null;
    let raf;

    const cancel = () => raf && cancelAnimationFrame(raf);
    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("touchstart", cancel, { passive: true, once: true });
    window.addEventListener("keydown", cancel, { passive: true, once: true });

    function step(ts) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      window.scrollTo(0, startY + (endY - startY) * ease(p));
      if (p < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
  });
})();



/* ========= Header visibility (hide on hero, show after) ========= */
(function () {
  const root = document.body;
  const hero = document.getElementById("hero");
  if (!hero) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        root.classList.remove("header-visible"); // on hero
      } else {
        root.classList.add("header-visible");    // after hero
      }
    },
    {
      threshold: 0,
      rootMargin: "-20% 0px -1px 0px",
    }
  );
  io.observe(hero);
})();

/* ========= Parallax background + fade-out of logo & hint ========= */
(function () {
  const hero = document.getElementById("hero");
  const heroBg = document.querySelector(".hero-bg");
  const logoWrap = document.querySelector(".hero-center");
  const hint = document.querySelector(".scroll-hint");
  if (!hero || !heroBg || !logoWrap || !hint) return;

  const fadeAndParallax = () => {
    const heroHeight = hero.offsetHeight;                 // total hero height (300vh)
    const endWithinHero = heroHeight - window.innerHeight; // scrollable space until next section
    const y = window.scrollY;

    // Parallax: move background slower than scroll
    heroBg.style.backgroundPosition = `center ${y * 0.2}px`;

    // Fade progress: 0 at top, 1 when you reach the next section
    const t = Math.max(0, Math.min(1, y / Math.max(1, endWithinHero)));
    const opacity = 1 - t;

    logoWrap.style.opacity = opacity.toFixed(3);
    hint.style.opacity = opacity.toFixed(3);
  };

  // Run once and on scroll
  fadeAndParallax();
  window.addEventListener("scroll", fadeAndParallax, { passive: true });
  window.addEventListener("resize", fadeAndParallax);
})();
