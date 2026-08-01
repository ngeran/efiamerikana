/* =========================================================================
   main.js — progressive enhancement (vanilla, no dependencies)
   1. Flip html.no-js → html.js  (collapses mobile nav; enables reveals)
   2. Mobile nav toggle (aria-expanded, ESC / link-click / resize to close)
   3. IntersectionObserver scroll-reveal + chart/bar draw-in
   Without JS, the site remains fully usable (menus visible, no hidden content).
   ========================================================================= */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* ── Mobile navigation ─────────────────────────────────────────────── */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  function openNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "true");
    root.classList.add("nav-open");
    document.body.classList.add("nav-locked");
  }
  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    root.classList.remove("nav-open");
    document.body.classList.remove("nav-locked");
  }
  function toggleNav() {
    if (toggle.getAttribute("aria-expanded") === "true") closeNav();
    else openNav();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", toggleNav);
    // Close on link click (mobile).
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    // ESC closes.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    // Reset state past the tablet breakpoint.
    var mq = window.matchMedia("(min-width: 48em)");
    var onBreak = function () { if (mq.matches) closeNav(); };
    if (mq.addEventListener) mq.addEventListener("change", onBreak);
    else if (mq.addListener) mq.addListener(onBreak);
  }

  /* ── Scroll reveal + chart/bar animations ──────────────────────────── */
  var revealEls = document.querySelectorAll("[data-reveal], .animate-draw, .bars-fill");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show everything.
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
