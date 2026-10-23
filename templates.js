/**
 * Template gallery — search, category filters and favourites.
 */
const templateCollection = [
        {
          id: 1,
          title: "Animated Navigation Bar",
          description:
            "A sleek navigation bar with smooth hover animations and dropdown effects.",
          category: "navbar",
          icon: "fas fa-bars",
          link: "templates/navbar.html",
        },
        {
          id: 2,
          title: "Contact Us Template",
          description:
            "A responsive contact form with animated inputs and validation.",
          category: "form",
          icon: "fas fa-envelope",
          link: "templates/contact.html",
        },
        {
          id: 3,
          title: "Coming Soon Landing Page",
          description:
            "An engaging coming soon page with countdown timer and newsletter signup.",
          category: "landing",
          icon: "fas fa-hourglass-half",
          link: "templates/Coming_Soon_Landing_Page.html",
        },
        {
          id: 4,
          title: "Animated Button Collection",
          description:
            "A variety of creative button animations for different interactions.",
          category: "button",
          icon: "fas fa-hand-pointer",
          link: "templates/animated-btn.html",
        },
        {
          id: 5,
          title: "Product Card Showcase",
          description:
            "Interactive product cards with hover effects and quick view options.",
          category: "card",
          icon: "fas fa-shopping-cart",
          link: "templates/card_hover.html",
        },
        {
          id: 6,
          title: "Login/Signup Form",
          description:
            "Beautiful authentication forms with smooth transitions between states.",
          category: "form",
          icon: "fas fa-user",
          link: "templates/LoginFormGlassMorphism.html",
        },
        {
          id: 7,
          title: "Pricing Table",
          description:
            "Animated pricing tables with hover effects and selection animations.",
          category: "card",
          icon: "fas fa-tags",
          link: "templates/price_plan.html",
        },
        {
          id: 8,
          title: "Testimonial Slider",
          description:
            "A responsive testimonial slider with smooth transitions.",
          category: "other",
          icon: "fas fa-comments",
          link: "templates/Testinomials_Sliders.html",
        },
        {
          id: 9,
          title: "Hero Section",
          description:
            "An eye-catching hero section with animated text and call-to-action.",
          category: "landing",
          icon: "fas fa-star",
          link: "templates/hero.html",
        },
        {
          id: 10,
          title: "FAQ Accordion",
          description:
            "An animated FAQ section with smooth expand/collapse transitions.",
          category: "other",
          icon: "fas fa-question-circle",
          link: "templates/faq_acc.html",
        },
        {
          id: 11,
          title: "Image Gallery",
          description:
            "A responsive image gallery with lightbox and hover effects.",
          category: "other",
          icon: "fas fa-images",
          link: "templates/carousel.html",
        },
        {
          id: 12,
          title: "Progress Bars",
          description:
            "Animated progress bars with different styles and loading effects.",
          category: "other",
          icon: "fas fa-chart-bar",
          link: "templates/Progress_Bar.html",
        },
        {
          id: 13,
          title: "404 Page",
          description: "A responsive 404 error page template for websites.",
          category: "other",
          icon: "fas fa-exclamation-triangle",
          link: "templates/404.html",
        },
        {
          id: 14,
          title: "CSS Snippet Generator",
          description: "Generate code for custom CSS styling",
          category: "other",
          icon: "fas fa-hand-pointer",
          link: "generator.html",
        },
        {
          id: 15,
          title: "Pomodoro Timer",
          description: "Your all in one Stopwatch.",
          category: "other",
          icon: "fas fa-hourglass-half",
          link: "pomodoro.html",
        },
        {
          id: 16,
          title: "Quote Generator",
          description: "Daily dose of motivation.",
          category: "other",
          icon: "fas fa-comments",
          link: "templates/quotes.html",
        }
      ];

const CATEGORY_LABELS = {
  navbar: "Navigation",
  button: "Buttons",
  card: "Cards",
  form: "Forms",
  landing: "Landing pages",
  other: "Other"
};

const grid = document.getElementById("templatesGrid");
const searchBar = document.getElementById("search-bar");
const filterButtons = document.querySelectorAll(".filter-btn");
const resultCount = document.getElementById("resultCount");

let favoriteTemplates = [];
try {
  favoriteTemplates = JSON.parse(localStorage.getItem("favorites")) || [];
} catch (e) {
  favoriteTemplates = [];
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function render(list) {
  grid.innerHTML = "";
  resultCount.textContent = list.length + (list.length === 1 ? " template" : " templates");

  if (!list.length) {
    grid.innerHTML =
      '<div class="no-results"><i class="fas fa-magnifying-glass"></i><h3>No templates found</h3>' +
      "<p>Try a different search term or clear the filter.</p></div>";
    return;
  }

  list.forEach((t, i) => {
    const fav = favoriteTemplates.includes(t.id);
    const card = document.createElement("article");
    card.className = "template-card";
    card.dataset.category = t.category;
    card.style.setProperty("--i", Math.min(i, 12));
    card.innerHTML =
      '<div class="template-preview"><i class="' + escapeHtml(t.icon) + '" aria-hidden="true"></i>' +
      '<button class="favorite-btn' + (fav ? " is-fav" : "") + '" data-id="' + t.id + '" type="button" aria-pressed="' + fav +
      '" aria-label="' + (fav ? "Remove from favorites" : "Add to favorites") + '">' +
      '<i class="' + (fav ? "fas" : "far") + ' fa-star"></i></button></div>' +
      '<div class="template-content"><span class="template-tag">' + (CATEGORY_LABELS[t.category] || t.category) + "</span>" +
      "<h2>" + escapeHtml(t.title) + "</h2><p>" + escapeHtml(t.description) + "</p>" +
      '<a href="' + escapeHtml(t.link) + '" class="template-btn">View template <i class="fas fa-arrow-right"></i></a></div>';
    grid.appendChild(card);
  });
}

function applyFilters() {
  const query = searchBar.value.trim().toLowerCase();
  const active = document.querySelector(".filter-btn.active").dataset.filter;
  render(
    templateCollection.filter((t) => {
      const matchesQuery = t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
      const matchesFilter =
        active === "all" ? true : active === "favorites" ? favoriteTemplates.includes(t.id) : t.category === active;
      return matchesQuery && matchesFilter;
    })
  );
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".favorite-btn");
  if (!btn) return;
  const id = parseInt(btn.dataset.id, 10);
  favoriteTemplates = favoriteTemplates.includes(id) ? favoriteTemplates.filter((x) => x !== id) : favoriteTemplates.concat(id);
  try {
    localStorage.setItem("favorites", JSON.stringify(favoriteTemplates));
  } catch (err) {}
  if (document.querySelector(".filter-btn.active").dataset.filter === "favorites") applyFilters();
  else {
    const on = favoriteTemplates.includes(id);
    btn.classList.toggle("is-fav", on);
    btn.setAttribute("aria-pressed", on);
    btn.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites");
    btn.firstElementChild.className = (on ? "fas" : "far") + " fa-star";
  }
});

searchBar.addEventListener("input", applyFilters);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });
});

applyFilters();
