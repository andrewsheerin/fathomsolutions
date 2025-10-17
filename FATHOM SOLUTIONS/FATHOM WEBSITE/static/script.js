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
