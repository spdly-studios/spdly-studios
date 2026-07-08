/* ════════════════════════════════════════════════════════════════
   SpDly Studios — Shivaprasad V
   Vanilla JS interactions: preloader, cursor, menu, reveal,
   magnetic buttons, count-up, drag-scroll, contact form.
   No frameworks. No libraries.
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ── 1. PRELOADER ──────────────────────────────────────────── */
  var preloader = doc.getElementById("preloader");
  var preBar = preloader ? preloader.querySelector(".pre-bar span") : null;

  function finishPreloader() {
    if (preBar) { preBar.style.transition = "width .9s cubic-bezier(.16,1,.3,1)"; preBar.style.width = "100%"; }
    setTimeout(function () {
      if (preloader) preloader.classList.add("is-done");
      revealHero();
    }, reduceMotion ? 0 : 950);
  }

  /* ── 2. REVEAL ON SCROLL ───────────────────────────────────── */
  var revealEls = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]:not(.word)"));

  // Stagger siblings sharing a parent
  revealEls.forEach(function (el) {
    var sibs = el.parentElement ? el.parentElement.querySelectorAll(":scope > [data-reveal]") : [el];
    var idx = Array.prototype.indexOf.call(sibs, el);
    el.style.setProperty("--rd", (idx * 0.06) + "s");
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          if (e.target.querySelector("[data-count]") || e.target.hasAttribute("data-count")) {
            countUp(e.target);
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
    doc.querySelectorAll("[data-count]").forEach(function (c) { if (!c.closest("[data-reveal]")) io.observe(c); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Hero words reveal (controlled after preloader) */
  var heroWords = Array.prototype.slice.call(doc.querySelectorAll(".hero-title .word"));
  function revealHero() {
    heroWords.forEach(function (w, i) {
      setTimeout(function () { w.classList.add("is-in"); }, reduceMotion ? 0 : i * 90);
    });
    doc.querySelectorAll(".hero [data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ── 3. COUNT UP ───────────────────────────────────────────── */
  function countUp(scope) {
    var nums = scope.matches && scope.matches("[data-count]")
      ? [scope]
      : Array.prototype.slice.call(scope.querySelectorAll("[data-count]"));
    nums.forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (String(target).split(".")[1] || "").length;
      if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
      var start = null, dur = 1400;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    });
  }

  /* ── 4. SCROLL PROGRESS ────────────────────────────────────── */
  var progress = doc.getElementById("progress");
  function onScroll() {
    var h = doc.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || body.scrollTop) / max : 0;
    if (progress) progress.style.width = (p * 100) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── 5. CUSTOM CURSOR ──────────────────────────────────────── */
  if (finePointer && !reduceMotion) {
    body.classList.add("cursor-on");
    var dot = doc.querySelector(".cursor--dot");
    var ring = doc.querySelector(".cursor--ring");
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)"; }
    });
    function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    loop();

    var interactives = doc.querySelectorAll('a, button, [data-cursor], .work-link, .contact-link');
    interactives.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        var kind = el.getAttribute("data-cursor");
        if (ring) {
          if (kind === "view") ring.classList.add("is-view");
          else ring.classList.add("is-hover");
        }
      });
      el.addEventListener("mouseleave", function () {
        if (ring) { ring.classList.remove("is-hover"); ring.classList.remove("is-view"); }
      });
    });
  }

  /* ── 6. MAGNETIC BUTTONS ───────────────────────────────────── */
  if (finePointer && !reduceMotion) {
    doc.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { el.style.transition = "transform .3s cubic-bezier(.16,1,.3,1)"; });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + x * 0.3 + "px," + y * 0.4 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ── 7. MENU ───────────────────────────────────────────────── */
  var menuBtn = doc.getElementById("menu-btn");
  var menu = doc.getElementById("menu");
  function setMenu(open) {
    if (!menu) return;
    body.classList.toggle("menu-open", open);
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
  }
  if (menu) {
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ── 8. JOURNEY HORIZONTAL SCROLL ──────────────────────────── */
  var rail = doc.querySelector(".journey-rail");
  if (rail) {
    var down = false, startX = 0, startLeft = 0, moved = false;
    rail.addEventListener("pointerdown", function (e) {
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
      rail.classList.add("is-drag");
    });
    rail.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startLeft - dx;
    });
    function end() { down = false; rail.classList.remove("is-drag"); }
    rail.addEventListener("pointerup", end);
    rail.addEventListener("pointerleave", end);
    rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    rail.addEventListener("wheel", function (e) {
      var maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 0) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        rail.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  /* ── 9. CONTACT FORM (client-side only) ────────────────────── */
  var form = doc.getElementById("contact-form");
  if (form) {
    var status = doc.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#cf-name").value.trim();
      var email = form.querySelector("#cf-email").value.trim();
      var msg = form.querySelector("#cf-msg").value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk || !msg) {
        status.textContent = "Please add your name, a valid email and a short message.";
        status.style.color = "var(--red)";
        return;
      }
      status.textContent = "Thank you, " + name + ". Your message is ready to send — I'll be in touch.";
      status.style.color = "rgba(243,239,230,.8)";
      form.reset();
    });
  }

  /* ── 10. FOOTER YEAR ───────────────────────────────────────── */
  var yr = doc.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── BOOT ──────────────────────────────────────────────────── */
  if (doc.readyState === "complete") finishPreloader();
  else window.addEventListener("load", finishPreloader);
  // Safety: never let the preloader trap the page
  setTimeout(finishPreloader, 4000);

})();
