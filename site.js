/**
 * AnimateItNow — shared site chrome.
 * Injects the navbar and footer, owns the light/dark theme, and wires up the
 * scroll helpers (progress bar, back-to-top, reveal-on-scroll) on every page.
 *
 * Opt-outs (attributes on <body>):
 *   data-no-nav     skip the navbar
 *   data-no-footer  skip the footer
 */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ---------------- Theme ---------------- */
  function storedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function currentTheme() {
    var saved = storedTheme();
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(theme, persist) {
    var dark = theme === "dark";
    root.setAttribute("data-theme", theme);
    if (document.body) {
      document.body.setAttribute("data-theme", theme);
      document.body.classList.toggle("dark", dark);
      document.body.classList.toggle("dark-theme", dark);
    }
    document.querySelectorAll("#ds-theme-toggle i").forEach(function (i) {
      i.className = dark ? "fas fa-sun" : "fas fa-moon";
    });
    if (persist) {
      try { localStorage.setItem("theme", theme); } catch (e) {}
    }
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { isDark: dark, theme: theme } }));
  }
  // Set as early as possible to avoid a flash of the wrong theme.
  root.setAttribute("data-theme", currentTheme());

  /* ---------------- Markup ---------------- */
  var NAV_GROUPS = [
    { label: "Templates", href: "templates.html", match: ["templates.html"] },
    { label: "Components", href: "components.html", match: ["components.html"] },
    { label: "Editor", href: "editor.html", match: ["editor.html"] },
    {
      label: "Resources",
      items: [
        { href: "playground.html", icon: "fa-mouse-pointer", title: "Hover Effects", desc: "Interactive hover playground" },
        { href: "generator.html", icon: "fa-wand-magic-sparkles", title: "Generator", desc: "Generate animation code" },
        { href: "documentation.html", icon: "fa-book-open", title: "Documentation", desc: "Guides and API reference" },
        { href: "blog.html", icon: "fa-pen-nib", title: "Blog", desc: "Tutorials and release notes" },
        { href: "pomodoro.html", icon: "fa-clock", title: "Pomodoro", desc: "Stay focused while you build" }
      ]
    },
    {
      label: "Community",
      items: [
        { href: "leaderboard.html", icon: "fa-trophy", title: "Leaderboard", desc: "Top contributors ranked" },
        { href: "contributors.html", icon: "fa-users", title: "Contributors", desc: "The people behind the project" },
        { href: "feedback.html", icon: "fa-comment-dots", title: "Feedback", desc: "Tell us what to improve" },
        { href: "support.html", icon: "fa-life-ring", title: "Support", desc: "Get help from the team" }
      ]
    },
    { label: "About", href: "about.html", match: ["about.html"] },
    { label: "Contact", href: "contact.html", match: ["contact.html"] }
  ];

  function pageName() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }
  function isActive(href) {
    var here = pageName();
    if (here.indexOf(".") === -1) here += ".html";
    return href === here;
  }

  function buildNav() {
    var links = NAV_GROUPS.map(function (g) {
      if (g.items) {
        var open = g.items.some(function (i) { return isActive(i.href); });
        return (
          '<li class="ds-dd">' +
          '<button type="button" aria-haspopup="true" aria-expanded="false"' + (open ? ' class="is-active"' : "") + ">" +
          g.label + ' <i class="fas fa-chevron-down ds-caret" aria-hidden="true"></i></button>' +
          '<ul class="ds-menu">' +
          g.items.map(function (i) {
            return '<li><a href="' + i.href + '"' + (isActive(i.href) ? ' class="is-active" aria-current="page"' : "") + ">" +
              '<span class="ds-ico"><i class="fas ' + i.icon + '" aria-hidden="true"></i></span>' +
              "<span><strong>" + i.title + "</strong><small>" + i.desc + "</small></span></a></li>";
          }).join("") +
          "</ul></li>"
        );
      }
      var on = isActive(g.href);
      return '<li><a href="' + g.href + '"' + (on ? ' class="is-active" aria-current="page"' : "") + ">" + g.label + "</a></li>";
    }).join("");

    return (
      '<header class="ds-nav" id="ds-nav">' +
      '<div class="ds-nav__inner">' +
      '<a class="ds-brand" href="index.html" aria-label="AnimateItNow home">' +
      '<img src="images/logo.png" alt="" width="34" height="34"><span>Animate<b>ItNow</b></span></a>' +
      '<nav aria-label="Primary"><ul class="ds-links" id="ds-links">' + links +
      '<li class="ds-mobile-only ds-mobile-cta"><a class="btn btn-secondary" href="loginpage.html">Log in</a>' +
      '<a class="btn" href="signup.html">Sign up</a></li>' +
      "</ul></nav>" +
      '<div class="ds-actions">' +
      '<a class="ds-icon-btn" href="https://github.com/AnujShrivastava01/AnimateItNow" target="_blank" rel="noopener" aria-label="GitHub repository" title="GitHub"><i class="fab fa-github"></i></a>' +
      '<button class="ds-icon-btn" id="ds-theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle theme"><i class="fas fa-moon"></i></button>' +
      '<a class="ds-login" href="loginpage.html">Log in</a>' +
      '<a class="btn" href="signup.html">Get started</a>' +
      '<button class="ds-icon-btn ds-burger" id="ds-burger" type="button" aria-label="Open menu" aria-controls="ds-links" aria-expanded="false"><i class="fas fa-bars"></i></button>' +
      "</div></div></header>"
    );
  }

  function buildFooter() {
    var year = new Date().getFullYear();
    return (
      '<footer class="ds-footer" id="ds-footer"><div class="container">' +
      '<div class="ds-newsletter reveal"><div><h3>Stay in the loop</h3>' +
      "<p>New templates and animation tips, straight to your inbox. No spam.</p></div>" +
      '<form id="ds-newsletter" novalidate><label class="sr-only" for="ds-email">Email address</label>' +
      '<input id="ds-email" type="email" placeholder="you@example.com" autocomplete="email" required>' +
      '<button class="btn" type="submit">Subscribe</button></form></div>' +
      '<div class="ds-footer__grid">' +
      '<div><a class="ds-brand" href="index.html"><img src="images/logo.png" alt="" width="34" height="34"><span>Animate<b>ItNow</b></span></a>' +
      "<p>Open-source CSS animations, templates and tools — built by a community that loves great motion.</p>" +
      '<div class="ds-social">' +
      '<a href="https://github.com/AnujShrivastava01/AnimateItNow" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>' +
      '<a href="https://www.linkedin.com/in/anujshrivastava1/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>' +
      '<a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>' +
      '<a href="https://discord.com" target="_blank" rel="noopener" aria-label="Discord"><i class="fab fa-discord"></i></a>' +
      '<a href="mailto:contact@animateitnow.com" aria-label="Email"><i class="fas fa-envelope"></i></a></div></div>' +
      '<div><h4>Product</h4><ul><li><a href="templates.html">Templates</a></li><li><a href="components.html">Components</a></li>' +
      '<li><a href="editor.html">Live editor</a></li><li><a href="playground.html">Hover effects</a></li><li><a href="generator.html">Generator</a></li></ul></div>' +
      '<div><h4>Resources</h4><ul><li><a href="documentation.html">Documentation</a></li><li><a href="blog.html">Blog</a></li>' +
      '<li><a href="support.html">Support</a></li><li><a href="feedback.html">Feedback</a></li><li><a href="sitemap.html">Sitemap</a></li></ul></div>' +
      '<div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="contributors.html">Contributors</a></li>' +
      '<li><a href="leaderboard.html">Leaderboard</a></li><li><a href="contact.html">Contact</a></li><li><a href="privacy.html">Privacy policy</a></li></ul></div>' +
      "</div>" +
      '<div class="ds-footer__bar"><p>© ' + year + " AnimateItNow. Made with care by Anuj and contributors.</p>" +
      '<nav aria-label="Legal"><a href="privacy.html">Privacy</a><a href="privacyPolicy.html">Terms</a><a href="sitemap.html">Sitemap</a></nav></div>' +
      "</div></footer>"
    );
  }

  /* ---------------- Mount ---------------- */
  function mount() {
    var body = document.body;
    var slug = pageName().replace(/\.html$/, "") || "index";
    body.setAttribute("data-page", slug);

    // Drop any legacy chrome so nothing renders twice.
    var legacyNav = document.getElementById("navbar");
    if (legacyNav) legacyNav.remove();
    document.querySelectorAll("body > nav.navbar, body > .navbar").forEach(function (n) { n.remove(); });

    if (!body.hasAttribute("data-no-nav")) {
      body.insertAdjacentHTML("afterbegin", buildNav());
    }
    if (!body.hasAttribute("data-no-footer")) {
      document.querySelectorAll("body > footer, body footer.footer, body #footer-placeholder").forEach(function (f) { f.remove(); });
      var scripts = body.querySelectorAll(":scope > script");
      var holder = document.createElement("div");
      holder.innerHTML = buildFooter();
      body.insertBefore(holder.firstChild, scripts.length ? scripts[0] : null);
    }

    // Scroll progress + back-to-top
    var bar = document.createElement("div");
    bar.className = "ds-progress";
    bar.setAttribute("aria-hidden", "true");
    body.appendChild(bar);
    var top = document.createElement("button");
    top.className = "ds-top";
    top.type = "button";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<i class="fas fa-arrow-up"></i>';
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    body.appendChild(top);
    // Retire older per-page scroll buttons / progress bars.
    ["scrollBtn", "progress-bar", "scrollToTopBtn", "back-to-top"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    var nav = document.getElementById("ds-nav");
    var ticking = false;
    function onScroll() {
      var y = window.scrollY || root.scrollTop;
      if (nav) nav.classList.toggle("is-scrolled", y > 8);
      top.classList.toggle("is-visible", y > 480);
      var h = root.scrollHeight - root.clientHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    initNav(nav);
    initNewsletter();
    initReveal();

    applyTheme(currentTheme(), false);
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("#ds-theme-toggle")) {
        applyTheme(document.body.classList.contains("dark") ? "light" : "dark", true);
      }
    });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var follow = function (e) { if (!storedTheme()) applyTheme(e.matches ? "dark" : "light", false); };
      if (mq.addEventListener) mq.addEventListener("change", follow);
    }
  }

  function initNav(nav) {
    if (!nav) return;
    var burger = document.getElementById("ds-burger");
    var dds = nav.querySelectorAll(".ds-dd");

    function closeDropdowns(except) {
      dds.forEach(function (li) {
        if (li !== except) {
          li.classList.remove("is-open");
          li.querySelector("button").setAttribute("aria-expanded", "false");
        }
      });
    }
    dds.forEach(function (li) {
      var btn = li.querySelector("button");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !li.classList.contains("is-open");
        closeDropdowns(li);
        li.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) closeDropdowns();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeDropdowns(); setMenu(false); }
    });

    function setMenu(open) {
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("ds-lock", open);
      if (burger) {
        burger.setAttribute("aria-expanded", String(open));
        burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        burger.firstElementChild.className = open ? "fas fa-xmark" : "fas fa-bars";
      }
    }
    if (burger) burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.querySelectorAll(".ds-links a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1060) setMenu(false); });
  }

  function initNewsletter() {
    var form = document.getElementById("ds-newsletter");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input");
      if (!input.value || !input.checkValidity()) {
        input.focus();
        input.style.borderColor = "#f87171";
        return;
      }
      form.innerHTML = '<span class="ds-newsletter__ok"><i class="fas fa-circle-check"></i> Thanks — you\'re on the list!</span>';
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();

  window.AnimateItNow = { setTheme: function (t) { applyTheme(t === "dark" ? "dark" : "light", true); } };
})();
