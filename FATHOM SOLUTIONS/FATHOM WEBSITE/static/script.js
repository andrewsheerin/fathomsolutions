// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Prevent accidental horizontal scroll on touch while interacting with cards
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('touchmove', (e) => {
    if (Math.abs(e.touches[0].clientX - (card._touchX ?? 0)) > 8) {
      e.preventDefault();
    }
  }, { passive: false });

  card.addEventListener('touchstart', (e) => {
    card._touchX = e.touches[0].clientX;
  });
});


// HERO: when the hero leaves the viewport, "dock" the brand to the corner and show the header
(function() {
  const root = document.documentElement;
  const sentinel = document.getElementById('hero-sentinel');
  if (!sentinel) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // When sentinel is NOT visible (hero scrolled past), add class
        if (!entry.isIntersecting) {
          root.classList.add('hero-docked');
        } else {
          root.classList.remove('hero-docked');
        }
      });
    },
    { rootMargin: "-20% 0px 0px 0px", threshold: 0 }
  );

  io.observe(sentinel);
})();

