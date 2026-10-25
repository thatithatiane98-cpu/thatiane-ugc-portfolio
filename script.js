/* =====================================================================
   SCRIPT.JS — funcionamento do site (idioma, projetos, contatos, menu).
   Você normalmente NÃO precisa editar este arquivo.
   ===================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var settings = SITE.settings || {};
  var showTodo = settings.showPlaceholders !== false;
  var TODO = "[A CONFIRMAR]";
  var STORE_KEY = "tm-lang";
  var lang = "en";
  var captionTimer = null;

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Escapes text and turns [A CONFIRMAR] into a visible tag.
  function rich(str) {
    var safe = escapeHTML(str == null ? "" : str);
    return safe.split(escapeHTML(TODO)).join('<mark class="todo">A CONFIRMAR</mark>');
  }
  function t(key) {
    var dict = (SITE.text && SITE.text[lang]) || {};
    var fallback = (SITE.text && SITE.text.en) || {};
    return dict[key] != null ? dict[key] : (fallback[key] != null ? fallback[key] : "");
  }
  function pick(value) {
    if (value == null) return "";
    if (typeof value === "string" || Array.isArray(value)) return value;
    return value[lang] != null ? value[lang] : (value.en != null ? value.en : "");
  }
  function isFilled(v) { return typeof v === "string" && v.trim() !== "" && v.indexOf(TODO) === -1; }
  function storageGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function storageSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Video links ---------- */
  function videoEmbed(url) {
    if (!isFilled(url)) return null;
    url = url.trim();
    var m;
    if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/i))) {
      return { type: "iframe", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0&playsinline=1" };
    }
    if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i))) {
      return { type: "iframe", src: "https://player.vimeo.com/video/" + m[1] + "?dnt=1" };
    }
    if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)) {
      return { type: "video", src: url };
    }
    return { type: "link", src: url };
  }

  /* ---------- Static texts ---------- */
  function applyTexts() {
    $all("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"));
      if (Array.isArray(val)) return;
      el.innerHTML = rich(val);
    });
  }

  /* ---------- Ticker ---------- */
  function renderTicker() {
    var track = $("#tickerTrack");
    if (!track) return;
    var items = t("ticker") || [];
    var group = items.map(function (i) { return '<span class="ticker__item">' + escapeHTML(i) + "</span>"; }).join("");
    track.innerHTML = '<div class="ticker__group">' + group + group + '</div><div class="ticker__group">' + group + group + "</div>";
  }

  /* ---------- Phone caption (typing) ---------- */
  function startCaptions() {
    var el = $("#caption");
    if (!el) return;
    clearTimeout(captionTimer);
    var list = t("hero.captions");
    if (!Array.isArray(list) || !list.length) return;
    if (reduceMotion) { el.textContent = list[0]; return; }

    var idx = 0, pos = 0, deleting = false;
    function step() {
      var full = list[idx];
      if (!deleting) {
        pos++;
        el.textContent = full.slice(0, pos);
        if (pos >= full.length) { deleting = true; captionTimer = setTimeout(step, 2200); return; }
        captionTimer = setTimeout(step, 55 + Math.random() * 45);
      } else {
        pos--;
        el.textContent = full.slice(0, pos);
        if (pos <= 0) { deleting = false; idx = (idx + 1) % list.length; captionTimer = setTimeout(step, 420); return; }
        captionTimer = setTimeout(step, 24);
      }
    }
    el.textContent = "";
    step();
  }

  function startTimecode() {
    var el = $("#timecode");
    if (!el || reduceMotion) return;
    var frames = 0;
    setInterval(function () {
      frames = (frames + 1) % (30 * 30); // loops every 30 seconds
      var s = Math.floor(frames / 30), f = frames % 30;
      el.textContent = "00:" + String(s).padStart(2, "0") + ":" + String(f).padStart(2, "0");
    }, 1000 / 30);
  }

  /* ---------- Projects ---------- */
  function renderProjects() {
    var grid = $("#workGrid");
    if (!grid) return;
    var projects = SITE.projects || [];
    grid.innerHTML = projects.map(function (p) {
      var name = escapeHTML(p.name || "");
      var embed = videoEmbed(p.video);
      var media;

      if (embed && embed.type === "iframe") {
        media = '<div class="media"><iframe src="' + escapeHTML(embed.src) + '" title="' + name + ' video" loading="lazy" ' +
          'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
      } else if (embed && embed.type === "video") {
        var poster = isFilled(p.poster) ? ' poster="' + escapeHTML(p.poster) + '"' : "";
        media = '<div class="media"><video src="' + escapeHTML(embed.src) + '"' + poster +
          ' controls playsinline preload="metadata" aria-label="' + name + ' video"></video></div>';
      } else if (embed && embed.type === "link") {
        media = '<a class="media media--empty media--link" href="' + escapeHTML(embed.src) + '" target="_blank" rel="noopener">' +
          '<span class="vf vf--tl"></span><span class="vf vf--tr"></span><span class="vf vf--bl"></span><span class="vf vf--br"></span>' +
          '<span class="media__top"><span>' + name + '</span><span>9:16</span></span>' +
          '<span class="media__soon"><span class="play" aria-hidden="true"></span><span class="media__label">' + escapeHTML(t("work.watch")) + ' ↗</span></span></a>';
      } else {
        media = '<div class="media media--empty">' +
          '<span class="vf vf--tl"></span><span class="vf vf--tr"></span><span class="vf vf--bl"></span><span class="vf vf--br"></span>' +
          '<span class="media__top" aria-hidden="true"><span>' + name + '</span><span>9:16</span></span>' +
          '<span class="media__soon"><span class="play" aria-hidden="true"></span>' +
          '<span class="media__label">' + escapeHTML(t("work.soon")) + '</span>' +
          (showTodo ? '<span class="media__hint">' + escapeHTML(t("work.hint")) + "</span>" : "") +
          "</span></div>";
      }

      var links = "";
      if (isFilled(p.post)) {
        links = '<div class="card__links"><a class="card__link" href="' + escapeHTML(p.post.trim()) + '" target="_blank" rel="noopener">' +
          escapeHTML(t("work.post")) + " ↗</a></div>";
      }

      return '<li class="card">' + media +
        '<div class="card__meta"><div class="card__row"><h3 class="card__name">' + name + "</h3>" +
        '<span class="card__cat">' + rich(pick(p.category)) + "</span></div>" +
        '<p class="card__desc">' + rich(pick(p.description)) + "</p>" + links + "</div></li>";
    }).join("");
  }

  /* ---------- Services ---------- */
  function renderServices() {
    var list = $("#servicesList");
    if (!list) return;
    list.innerHTML = (SITE.services || []).map(function (s) {
      var tags = (pick(s.tags) || []).map(function (tg) { return '<span class="tag">' + escapeHTML(tg) + "</span>"; }).join("");
      return '<li class="service"><span class="service__mark" aria-hidden="true"></span>' +
        '<h3 class="service__title">' + escapeHTML(pick(s.title)) + "</h3>" +
        '<p class="service__text">' + escapeHTML(pick(s.text)) + "</p>" +
        (tags ? '<div class="tags">' + tags + "</div>" : "") + "</li>";
    }).join("");
  }

  /* ---------- Contact ---------- */
  function handleFrom(url, prefixAt) {
    try {
      var u = new URL(url);
      var path = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
      if (!path.length) return u.hostname.replace(/^www\./, "");
      var last = path[path.length - 1];
      if (prefixAt) return last.charAt(0) === "@" ? last : "@" + last;
      return u.hostname.replace(/^www\./, "") + "/" + path.join("/");
    } catch (e) { return url; }
  }

  function renderContact() {
    var list = $("#contactList");
    if (!list) return;
    var c = SITE.contact || {};
    var rows = [];

    function emptyRow(label) {
      if (!showTodo) return;
      rows.push('<li><div class="contact-item contact-item--empty"><span class="contact-item__label">' + escapeHTML(label) +
        '</span><span class="contact-item__value">' + rich(t("contact.missing")) + "</span><span></span></div></li>");
    }
    function linkRow(label, url, display) {
      rows.push('<li><a class="contact-item" href="' + escapeHTML(url) + '" target="_blank" rel="noopener">' +
        '<span class="contact-item__label">' + escapeHTML(label) + '</span>' +
        '<span class="contact-item__value">' + escapeHTML(display) + '</span>' +
        '<span class="contact-item__arrow" aria-hidden="true">↗</span></a></li>');
    }

    // Email
    if (isFilled(c.email)) {
      var mail = c.email.trim();
      rows.push('<li><div class="contact-item"><span class="contact-item__label">' + escapeHTML(t("contact.email")) + '</span>' +
        '<span class="contact-item__value"><a href="mailto:' + escapeHTML(mail) + '" id="emailText">' + escapeHTML(mail) + '</a></span>' +
        '<button type="button" class="copy-btn" id="copyEmail" data-value="' + escapeHTML(mail) + '">' + escapeHTML(t("contact.copy")) + "</button></div></li>");
    } else { emptyRow(t("contact.email")); }

    if (isFilled(c.instagram)) linkRow("Instagram", c.instagram.trim(), handleFrom(c.instagram.trim(), true));
    else emptyRow("Instagram");

    if (isFilled(c.tiktok)) linkRow("TikTok", c.tiktok.trim(), handleFrom(c.tiktok.trim(), true));
    else emptyRow("TikTok");

    if (isFilled(c.linkedin)) linkRow("LinkedIn", c.linkedin.trim(), handleFrom(c.linkedin.trim(), false));

    if (c.other && isFilled(c.other.url)) {
      linkRow(isFilled(c.other.label) ? c.other.label : "Link", c.other.url.trim(), handleFrom(c.other.url.trim(), false));
    }

    list.innerHTML = rows.join("");

    var btn = $("#copyEmail");
    if (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-value");
        function done() {
          btn.textContent = t("contact.copied");
          setTimeout(function () { btn.textContent = t("contact.copy"); }, 1800);
        }
        function fallback() {
          var el = $("#emailText");
          if (!el || !window.getSelection) return;
          var range = document.createRange();
          range.selectNodeContents(el);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done, fallback);
        } else { fallback(); }
      });
    }
  }

  /* ---------- Photo ---------- */
  function renderPhoto() {
    var box = $("#aboutPhoto");
    if (!box) return;
    if (isFilled(SITE.photo)) {
      box.innerHTML = '<img src="' + escapeHTML(SITE.photo.trim()) + '" alt="Thatiane Moura" loading="lazy" width="880" height="1100">';
    } else if (!showTodo) {
      var label = $(".photo-placeholder__label", box);
      if (label) label.hidden = true;
    }
  }

  /* ---------- Language ---------- */
  function setLanguage(next, save) {
    lang = (SITE.text && SITE.text[next]) ? next : "en";
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    $all(".lang__btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    applyTexts();
    renderTicker();
    renderProjects();
    renderServices();
    renderContact();
    startCaptions();
    if (save) storageSet(STORE_KEY, lang);
  }

  function initialLanguage() {
    var fromUrl = null;
    try { fromUrl = new URLSearchParams(window.location.search).get("lang"); } catch (e) { /* ignore */ }
    if (fromUrl === "pt" || fromUrl === "en") return fromUrl;
    var saved = storageGet(STORE_KEY);
    if (saved === "pt" || saved === "en") return saved;
    return settings.defaultLanguage || "en";
  }

  /* ---------- Menu & header ---------- */
  function initMenu() {
    var btn = $("#menuBtn"), nav = $("#nav");
    if (!btn || !nav) return;
    function set(open) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      var label = $(".menu-btn__label", btn);
      if (label) label.textContent = open ? t("nav.close") : t("nav.menu");
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    $all("a", nav).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  function initHeader() {
    var header = $(".header");
    if (!header) return;
    function update() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Start ---------- */
  $all(".lang__btn").forEach(function (b) {
    b.addEventListener("click", function () { setLanguage(b.getAttribute("data-lang"), true); });
  });
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  renderPhoto();
  initMenu();
  initHeader();
  startTimecode();
  setLanguage(initialLanguage(), false);
})();
