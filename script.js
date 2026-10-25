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

  /* Textos de segurança: usados só se faltarem no content.js */
  var DEFAULTS = {
    en: { "contact.send": "Send an email", "work.watch": "Watch video", "work.post": "View post",
          "hero.videoLabel": "Intro video", "hero.videoSoon": "Coming soon",
          "hero.videoHint": "Add the link in content.js → introVideo",
          "hero.videoTag": "Intro", "work.videoTitle": "{name} video", "todo.label": "To confirm",
          "a11y.skip": "Skip to content", "a11y.home": "Thatiane Moura, home",
          "a11y.nav": "Main navigation", "a11y.lang": "Language" },
    pt: { "contact.send": "Enviar e-mail", "work.watch": "Assistir vídeo", "work.post": "Ver publicação",
          "hero.videoLabel": "Vídeo de apresentação", "hero.videoSoon": "Em breve",
          "hero.videoHint": "Adicione o link em content.js → introVideo",
          "hero.videoTag": "Apresentação", "work.videoTitle": "Vídeo {name}", "todo.label": "A confirmar",
          "a11y.skip": "Pular para o conteúdo", "a11y.home": "Thatiane Moura, início",
          "a11y.nav": "Navegação principal", "a11y.lang": "Idioma" }
  };

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Escapes text, turns [A CONFIRMAR] into a visible tag,
  // *words between asterisks* into the rose italic accent and " | " into a rose divider.
  function rich(str) {
    var safe = escapeHTML(str == null ? "" : str);
    safe = safe.split(escapeHTML(TODO)).join('<mark class="todo">' + escapeHTML(t("todo.label")) + "</mark>");
    safe = safe.replace(/\*([^*]+)\*/g, '<em class="accent">$1</em>');
    safe = safe.replace(/ \| /g, ' <span class="sep" aria-hidden="true">|</span> ');
    return safe;
  }
  function t(key) {
    var dict = (SITE.text && SITE.text[lang]) || {};
    var fallback = (SITE.text && SITE.text.en) || {};
    if (dict[key] != null) return dict[key];
    if (fallback[key] != null) return fallback[key];
    var d = DEFAULTS[lang] || DEFAULTS.en;
    return d[key] != null ? d[key] : "";
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
    $all("[data-i18n-aria]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n-aria"));
      if (val) el.setAttribute("aria-label", val);
    });
    var menuBtn = $("#menuBtn"), menuLabel = $(".menu-btn__label");
    if (menuBtn && menuLabel) {
      menuLabel.textContent = menuBtn.getAttribute("aria-expanded") === "true" ? t("nav.close") : t("nav.menu");
    }
  }

  /* ---------- Ticker ---------- */
  function renderTicker() {
    var track = $("#tickerTrack");
    if (!track) return;
    var items = t("ticker") || [];
    var group = items.map(function (i) { return '<span class="ticker__item">' + escapeHTML(i) + "</span>"; }).join("");
    track.innerHTML = '<div class="ticker__group">' + group + group + '</div><div class="ticker__group">' + group + group + "</div>";
  }

  /* ---------- Intro video (hero) ---------- */
  function renderIntro() {
    var box = $("#introMedia");
    if (!box) return;
    var embed = videoEmbed(SITE.introVideo);
    var title = escapeHTML(t("hero.videoLabel")) + " · Thatiane Moura";
    box.className = "phone__screen";
    if (embed && embed.type === "iframe") {
      box.classList.add("phone__screen--video");
      var existing = box.querySelector("iframe");
      if (existing) existing.title = t("hero.videoLabel") + " · Thatiane Moura";
      if (!existing) {
        box.innerHTML = '<iframe src="' + escapeHTML(embed.src) + '" title="' + title + '" loading="lazy" ' +
          'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      }
      return;
    }
    if (embed && embed.type === "video") {
      box.classList.add("phone__screen--video");
      var existingVideo = box.querySelector("video");
      if (existingVideo) existingVideo.setAttribute("aria-label", t("hero.videoLabel") + " · Thatiane Moura");
      if (!existingVideo) {
        var poster = isFilled(SITE.introPoster) ? ' poster="' + escapeHTML(SITE.introPoster.trim()) + '"' : "";
        box.innerHTML = '<video src="' + escapeHTML(embed.src) + '"' + poster + ' controls playsinline preload="metadata" aria-label="' + title + '"></video>';
      }
      return;
    }
    box.classList.add("phone__screen--empty");
    var corners = '<span class="vf vf--tl"></span><span class="vf vf--tr"></span><span class="vf vf--bl"></span><span class="vf vf--br"></span>';
    var top = '<span class="intro-empty__top" aria-hidden="true"><span>' + escapeHTML(t("hero.videoTag")) + '</span><span>9:16</span></span>';
    if (embed && embed.type === "link") {
      box.innerHTML = '<a class="intro-empty" href="' + escapeHTML(embed.src) + '" target="_blank" rel="noopener">' + corners + top +
        '<span class="intro-empty__center"><span class="play" aria-hidden="true"></span><span class="media__label">' +
        escapeHTML(t("work.watch")) + ' ↗</span></span></a>';
      return;
    }
    box.innerHTML = '<div class="intro-empty">' + corners + top +
      '<span class="intro-empty__center"><span class="play play--pending" aria-hidden="true"></span><span class="media__label">' +
      escapeHTML(t("hero.videoSoon")) + "</span>" +
      (showTodo ? '<span class="media__hint">' + escapeHTML(t("hero.videoHint")) + "</span>" : "") +
      "</span></div>";
  }

  /* ---------- Projects ---------- */
  function renderProjects() {
    var grid = $("#workGrid");
    if (!grid) return;
    var projects = SITE.projects || [];
    grid.innerHTML = projects.map(function (p) {
      var name = escapeHTML(p.name || "");
      var videoTitle = escapeHTML(t("work.videoTitle").replace("{name}", p.name || ""));
      var embed = videoEmbed(p.video);
      var media;

      if (embed && embed.type === "iframe") {
        media = '<div class="media"><iframe src="' + escapeHTML(embed.src) + '" title="' + videoTitle + '" loading="lazy" ' +
          'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
      } else if (embed && embed.type === "video") {
        var poster = isFilled(p.poster) ? ' poster="' + escapeHTML(p.poster) + '"' : "";
        media = '<div class="media"><video src="' + escapeHTML(embed.src) + '"' + poster +
          ' controls playsinline preload="metadata" aria-label="' + videoTitle + '"></video></div>';
      } else if (embed && embed.type === "link") {
        media = '<a class="media media--empty media--link" href="' + escapeHTML(embed.src) + '" target="_blank" rel="noopener">' +
          '<span class="vf vf--tl"></span><span class="vf vf--tr"></span><span class="vf vf--bl"></span><span class="vf vf--br"></span>' +
          '<span class="media__top"><span>' + name + '</span><span>9:16</span></span>' +
          '<span class="media__soon"><span class="play" aria-hidden="true"></span><span class="media__label">' + escapeHTML(t("work.watch")) + ' ↗</span></span></a>';
      } else {
        media = '<div class="media media--empty">' +
          '<span class="vf vf--tl"></span><span class="vf vf--tr"></span><span class="vf vf--bl"></span><span class="vf vf--br"></span>' +
          '<span class="media__top" aria-hidden="true"><span>' + name + '</span><span>9:16</span></span>' +
          '<span class="media__soon"><span class="play play--pending" aria-hidden="true"></span>' +
          '<span class="media__label">' + escapeHTML(t("work.soon")) + '</span>' +
          (showTodo ? '<span class="media__hint">' + escapeHTML(t("work.hint")) + "</span>" : "") +
          "</span></div>";
      }

      var links = "";
      var postUrl = isFilled(p.post) ? p.post : (isFilled(p.link) ? p.link : "");
      if (postUrl) {
        links = '<div class="card__links"><a class="card__link" href="' + escapeHTML(postUrl.trim()) + '" target="_blank" rel="noopener">' +
          escapeHTML(t("work.post")) + ' <span aria-hidden="true">↗</span></a></div>';
      }
      var cat = pick(p.category);

      return '<li class="card">' + media +
        '<div class="card__meta">' +
        (cat ? '<span class="card__cat">' + rich(cat) + "</span>" : "") +
        '<h3 class="card__name">' + name + "</h3>" +
        '<p class="card__desc">' + rich(pick(p.description)) + "</p>" + links + "</div></li>";
    }).join("");
  }

  /* ---------- Services ---------- */
  var ICONS = {
    video: '<rect x="3" y="6" width="12" height="12" rx="2.5"/><path d="M15 10.5l5-3v9l-5-3"/>',
    app: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 17.5h2"/>',
    ai: '<path d="M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7z"/><path d="M18 15l.7 1.8 1.8.7-1.8.7L18 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
    tutorial: '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><circle cx="5.5" cy="6.5" r="1.3"/><circle cx="5.5" cy="12" r="1.3"/><circle cx="5.5" cy="17.5" r="1.3"/>',
    idea: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.4 10.9c.6.4.9 1.1.9 1.8V16h5v-.3c0-.7.3-1.4.9-1.8A6 6 0 0 0 12 3z"/>',
    review: '<path d="M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6L12 16.6l-5.1 2.6 1-5.6-4-3.9 5.6-.8z"/>'
  };
  var ICON_ORDER = ["video", "app", "ai", "tutorial", "idea", "review"];
  function icon(name, i) {
    var path = ICONS[name] || ICONS[ICON_ORDER[i % ICON_ORDER.length]];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  }

  function renderServices() {
    var list = $("#servicesList");
    if (!list) return;
    list.innerHTML = (SITE.services || []).map(function (s, i) {
      var tags = (pick(s.tags) || []).map(function (tg) { return '<span class="tag">' + escapeHTML(tg) + "</span>"; }).join("");
      return '<li class="service"><span class="service__icon">' + icon(s.icon, i) + "</span>" +
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
        '</span><span class="contact-item__value">' + rich(t("contact.missing")) + "</span></div></li>");
    }
    function linkRow(label, url, display) {
      rows.push('<li><a class="contact-item" href="' + escapeHTML(url) + '" target="_blank" rel="noopener">' +
        '<span class="contact-item__label">' + escapeHTML(label) + '</span>' +
        '<span class="contact-item__value">' + escapeHTML(display) + '</span>' +
        '<span class="contact-item__end"><span class="contact-item__arrow" aria-hidden="true">↗</span></span></a></li>');
    }

    // Email
    if (isFilled(c.email)) {
      var mail = c.email.trim();
      rows.push('<li><div class="contact-item"><span class="contact-item__label">' + escapeHTML(t("contact.email")) + '</span>' +
        '<span class="contact-item__value"><a href="mailto:' + escapeHTML(mail) + '" id="emailText">' + escapeHTML(mail).replace("@", "@<wbr>") + '</a></span>' +
        '<span class="contact-item__end"><button type="button" class="copy-btn" id="copyEmail" data-value="' + escapeHTML(mail) + '">' + escapeHTML(t("contact.copy")) + "</button></span></div></li>");
    } else { emptyRow(t("contact.email")); }

    var cta = $("#contactCta");
    if (cta) {
      if (isFilled(c.email)) { cta.href = "mailto:" + c.email.trim(); cta.hidden = false; }
      else { cta.hidden = true; }
    }

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
    renderIntro();
    renderProjects();
    renderServices();
    renderContact();
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
      document.documentElement.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      var label = $(".menu-btn__label", btn);
      if (label) label.textContent = open ? t("nav.close") : t("nav.menu");
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    $all("a", nav).forEach(function (a) {
      a.addEventListener("click", function (e) {
        var open = btn.getAttribute("aria-expanded") === "true";
        set(false);
        if (!open) return;
        // Unlock the page first, then scroll to the section
        var target = document.querySelector(a.getAttribute("href"));
        if (target) {
          e.preventDefault();
          requestAnimationFrame(function () {
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            if (history.replaceState) history.replaceState(null, "", a.getAttribute("href"));
          });
        }
      });
    });
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
  setLanguage(initialLanguage(), false);
})();
