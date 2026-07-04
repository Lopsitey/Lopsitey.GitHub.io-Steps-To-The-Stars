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

    initScrollSpy(panel);
  }

  function initScrollSpy(panel) {
    if (document.body.dataset.page !== "home") {
      return;
    }

    const links = Array.from(panel.querySelectorAll("[data-section-target]"));
    const sections = links
      .map((link) => document.getElementById(link.dataset.sectionTarget))
      .filter(Boolean);

    if (!links.length || !sections.length) {
      return;
    }

    function setActive(id) {
      links.forEach((link) => {
        if (link.dataset.sectionTarget === id) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActive(visible.target.id);
      }
    }, {
      rootMargin: "-36% 0px -52% 0px",
      threshold: [0.08, 0.2, 0.4, 0.7]
    });

    sections.forEach((section) => observer.observe(section));
    setActive((location.hash || "#game").replace("#", ""));
  }

  function initHeroVideo() {
    const video = document.querySelector(".hero__video");

    if (!video) {
      return;
    }

    video.addEventListener("canplay", () => {
      video.classList.add("is-ready");
      video.classList.remove("is-unavailable");
    }, { once: true });

    video.addEventListener("error", () => {
      video.classList.add("is-unavailable");
    });

    Array.from(video.querySelectorAll("source")).forEach((source) => {
      source.addEventListener("error", () => {
        source.dataset.failed = "true";
        const hasWorkingSource = Array.from(video.querySelectorAll("source")).some((item) => item.dataset.failed !== "true");
        if (!hasWorkingSource) {
          video.classList.add("is-unavailable");
        }
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
    const items = document.querySelectorAll(".showcase-card, .news-card, .roadmap li");
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

  function initCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((target) => {
      target.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroVideo();
    initLightbox();
    initReveal();
  });

  document.addEventListener("site:components-loaded", () => {
    initNavigation();
    initCurrentYear();
  });
})();
