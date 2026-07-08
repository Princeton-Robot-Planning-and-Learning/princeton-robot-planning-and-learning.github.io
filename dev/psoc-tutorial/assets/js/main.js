/* Shared behavior for all tutorial pages. */

/* Placeholder images: every <figure class="media" data-img="name.png"> renders
   as a labeled drop-box until assets/img/name.png exists, then swaps to the
   real image automatically. To fill a placeholder, just save the file under
   the name shown in the box — no HTML edits needed. */
function activateMediaPlaceholders() {
    document.querySelectorAll('figure.media[data-img]').forEach(function (fig) {
        var name = fig.dataset.img;
        var probe = new Image();
        probe.onload = function () {
            var box = fig.querySelector('.placeholder-box');
            if (!box) return;
            var img = document.createElement('img');
            img.src = probe.src;
            img.alt = fig.dataset.alt || '';
            box.replaceWith(img);
        };
        probe.src = 'assets/img/' + name;
    });
}

/* Style toggle: retro (default) vs readable. An inline script in each
   page's <head> applies the class before first paint, reading the URL's
   ?style= parameter first and localStorage second. localStorage alone is
   not enough: under file:// some browsers isolate it per file, so internal
   links also carry the choice in their query string (syncStyleLinks). */
function syncStyleLinks() {
    var readable = document.documentElement.classList.contains('readable');
    document.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href || /^(https?:|mailto:|#)/.test(href)) return;
        var base = href.split('?')[0];
        a.setAttribute('href', readable ? base + '?style=readable' : base);
    });
}

function initStyleToggle() {
    var btn = document.getElementById('style-toggle');
    if (!btn) return;
    function updateLabel() {
        var readable = document.documentElement.classList.contains('readable');
        btn.textContent = readable ? 'Retro style' : 'Easy-read style';
        btn.setAttribute('aria-pressed', String(readable));
    }
    btn.addEventListener('click', function () {
        var root = document.documentElement;
        root.classList.toggle('readable');
        try {
            localStorage.setItem('ece302-style',
                root.classList.contains('readable') ? 'readable' : 'retro');
        } catch (e) { /* private browsing: links still carry the choice */ }
        updateLabel();
        syncStyleLinks();
    });
    updateLabel();
    syncStyleLinks();
}

/* Highlight the current page in the nav. */
function highlightNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
        if (a.getAttribute('href') === here) a.classList.add('active');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    activateMediaPlaceholders();
    highlightNav();
    initStyleToggle();
});
