(function () {
  function initNavigation() {
    const header = document.querySelector("[data-navbar]");
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.querySelector(".nav-panel");

    if (!header || !toggle || !panel) {
      return;
    }

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initLightbox() {
    const dialog = document.getElementById("media-lightbox");
    const image = document.getElementById("lightbox-image");
    const title = document.getElementById("lightbox-title");

    if (!dialog || !image || !title || typeof dialog.showModal !== "function") {
      return;
    }

    document.querySelectorAll(".gallery-item").forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.dataset.full;
        const caption = button.dataset.caption || "";
        const thumb = button.querySelector("img");

        image.src = source;
        image.alt = thumb ? thumb.alt : caption;
        title.textContent = caption;
        dialog.showModal();
      });
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.querySelector(".lightbox__close").addEventListener("click", () => {
      dialog.close();
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".feature-card, .value-card, .team-card, .update-card, .timeline li, .gallery-item");
    if (!items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach((item) => observer.observe(item));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLightbox();
    initReveal();
  });

  document.addEventListener("site:components-loaded", initNavigation);
})();
