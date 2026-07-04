(function () {
  const root = document.body.dataset.siteRoot || "./";
  const componentTargets = document.querySelectorAll("[data-component]");

  function rooted(path) {
    if (!path || path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("#")) {
      return path;
    }
    return root + path.replace(/^\.\//, "");
  }

  function prepareLinks(scope) {
    scope.querySelectorAll("[data-href]").forEach((link) => {
      link.setAttribute("href", rooted(link.dataset.href));
    });

    scope.querySelectorAll("[data-src]").forEach((image) => {
      image.setAttribute("src", rooted(image.dataset.src));
    });

    scope.querySelectorAll("[data-social-url]").forEach((link) => {
      const url = (link.dataset.socialUrl || "").trim();
      if (!url) {
        link.remove();
        return;
      }
      link.setAttribute("href", url);
      link.setAttribute("rel", "noopener");
    });

    const page = document.body.dataset.page;
    scope.querySelectorAll("[data-page-target]").forEach((link) => {
      if (link.dataset.pageTarget === page && page !== "home") {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  async function loadComponent(target) {
    const name = target.dataset.component;
    const response = await fetch(rooted(`components/${name}.html`));
    if (!response.ok) {
      throw new Error(`Could not load ${name} component`);
    }
    target.innerHTML = await response.text();
    prepareLinks(target);
  }

  async function initComponents() {
    try {
      await Promise.all(Array.from(componentTargets, loadComponent));
      document.dispatchEvent(new CustomEvent("site:components-loaded"));
    } catch (error) {
      console.error(error);
    }
  }

  if (componentTargets.length) {
    initComponents();
  }
})();
