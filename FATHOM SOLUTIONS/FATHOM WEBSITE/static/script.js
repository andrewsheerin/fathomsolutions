/* ========= Smooth scroll for in-page anchors ========= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#" || href.startsWith("#!")) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ========= Header visibility: show only when the hero is OUT of view =========
   - While any part of the hero is visible => hide header
   - Once hero is not visible => show header (and keep it shown for all sections)
*/
(function () {
  const root = document.body;
  const hero = document.getElementById("hero");
  if (!hero) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Still seeing the hero → hide header
        root.classList.remove("header-visible");
      } else {
        // Hero is out of view → show header
        root.classList.add("header-visible");
      }
    },
    {
      threshold: 0.20,              // flip as soon as intersection changes
      rootMargin: "0px 0px 0px 0px" // treat hero as visible until it's ~fully gone
    }
  );
  io.observe(hero);
})();

/* ========= Optional: small touch guard to avoid sideways scroll on project cards ========= */
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener(
    "touchstart",
    (e) => {
      card._touchX = e.touches[0].clientX;
    },
    { passive: true }
  );

  card.addEventListener(
    "touchmove",
    (e) => {
      const dx = Math.abs(e.touches[0].clientX - (card._touchX ?? 0));
      if (dx > 8) e.preventDefault();
    },
    { passive: false }
  );
});

/* ========= Initialize Lucide if present ========= */
if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}
