/* TANDEM docs: copy buttons, heading anchors, the "on this page" highlight, the mobile menu, and search. */
(function () {
  "use strict";

  // Tables scroll sideways on a narrow screen instead of widening the page.
  document.querySelectorAll(".content table").forEach(function (table) {
    var wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  // A copy button on every code block. Shell comments stay: they say what each line does.
  document.querySelectorAll(".content .hl, .content > pre").forEach(function (block) {
    var pre = block.tagName === "PRE" ? block : block.querySelector("pre");
    if (!pre) return;
    var button = document.createElement("button");
    button.className = "copy";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(pre.innerText.replace(/\n$/, "")).then(function () {
        button.textContent = "Copied";
        setTimeout(function () { button.textContent = "Copy"; }, 1400);
      });
    });
    block.appendChild(button);
  });

  // A "#" link on each section heading, to copy a link to it.
  document.querySelectorAll(".content h2[id], .content h3[id]").forEach(function (h) {
    var a = document.createElement("a");
    a.className = "anchor";
    a.href = "#" + h.id;
    a.textContent = "#";
    a.setAttribute("aria-label", "Link to this section");
    h.appendChild(a);
  });

  // "On this page": mark the section being read.
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc-list a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[decodeURIComponent(a.hash.slice(1))] = a; });
    var headings = Array.prototype.slice.call(document.querySelectorAll(".content h2[id], .content h3[id]"));
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      for (var i = 0; i < headings.length; i++) {
        if (visible[headings[i].id]) { current = headings[i].id; break; }
      }
      if (!current) {
        // Between headings: the last one above the fold.
        for (var j = headings.length - 1; j >= 0; j--) {
          if (headings[j].getBoundingClientRect().top < 120) { current = headings[j].id; break; }
        }
      }
      tocLinks.forEach(function (a) { a.classList.toggle("active", byId[current] === a); });
    }, { rootMargin: "-60px 0px -65% 0px" });
    headings.forEach(function (h) { observer.observe(h); });
  }

  // The page list, as a drawer on a narrow screen.
  var menu = document.querySelector(".menu");
  if (menu) {
    menu.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".sidebar a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  // Search: every page and section, matched on its title first, then its text.
  var input = document.querySelector(".search input");
  var box = document.querySelector(".search .results");
  var index = window.TANDEM_DOCS_INDEX || [];
  if (!input || !box) return;

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function mark(text, words) {
    var out = escapeHtml(text);
    words.forEach(function (w) {
      if (!w) return;
      var re = new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }
  function snippet(text, words) {
    var lower = text.toLowerCase();
    var at = -1;
    for (var i = 0; i < words.length && at < 0; i++) at = lower.indexOf(words[i]);
    if (at < 0) return text.slice(0, 140);
    var start = Math.max(0, at - 50);
    return (start ? "… " : "") + text.slice(start, start + 150) + "…";
  }
  function search(query) {
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var scored = [];
    index.forEach(function (entry) {
      var title = entry.title.toLowerCase();
      var text = entry.text.toLowerCase();
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var w = words[i];
        if (title.indexOf(w) >= 0) score += title.indexOf(w) === 0 ? 12 : 8;
        else if (text.indexOf(w) >= 0) score += 2;
        else return;  // every word must match somewhere
      }
      if (entry.title === entry.page) score += 1;
      scored.push({ entry: entry, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, 12).map(function (s) { return s.entry; }).map(function (e) {
      return { e: e, words: words };
    });
  }
  var selected = -1;
  function show() {
    var found = search(input.value);
    selected = -1;
    if (!input.value.trim()) { box.hidden = true; box.innerHTML = ""; return; }
    if (!found.length) {
      box.innerHTML = '<div class="empty">No matches for “' + escapeHtml(input.value) + '”.</div>';
    } else {
      box.innerHTML = found.map(function (r) {
        var e = r.e;
        var page = e.title === e.page ? "" : '<div class="r-page">' + escapeHtml(e.page) + "</div>";
        return '<a role="option" href="' + e.url + '">' + page +
          '<div class="r-title">' + mark(e.title, r.words) + "</div>" +
          '<div class="r-text">' + mark(snippet(e.text, r.words), r.words) + "</div></a>";
      }).join("");
    }
    box.hidden = false;
  }
  function move(step) {
    var links = box.querySelectorAll("a");
    if (!links.length) return;
    selected = (selected + step + links.length) % links.length;
    links.forEach(function (a, i) { a.classList.toggle("on", i === selected); });
    links[selected].scrollIntoView({ block: "nearest" });
  }
  input.addEventListener("input", show);
  input.addEventListener("focus", function () { if (input.value.trim()) show(); });
  input.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowDown") { ev.preventDefault(); move(1); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); move(-1); }
    else if (ev.key === "Enter") {
      var links = box.querySelectorAll("a");
      var target = links[selected >= 0 ? selected : 0];
      if (target) { window.location.href = target.href; }
    } else if (ev.key === "Escape") { box.hidden = true; input.blur(); }
  });
  document.addEventListener("click", function (ev) {
    if (!ev.target.closest(".search")) box.hidden = true;
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "/" && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      ev.preventDefault();
      input.focus();
    }
  });
})();
