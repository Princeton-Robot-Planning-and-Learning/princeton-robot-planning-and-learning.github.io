/* Interactive board diagram: draws hotspots from BOARD_HOTSPOTS onto the SVG,
   shows each hotspot's content in the side panel, and swaps the stylized
   drawing for a real photo when assets/img/<BOARD_PHOTO> exists. */

(function () {
    var SVG_NS = 'http://www.w3.org/2000/svg';

    function el(name, attrs) {
        var node = document.createElementNS(SVG_NS, name);
        for (var k in attrs) node.setAttribute(k, attrs[k]);
        return node;
    }

    function labelAnchor(shape) {
        if (shape.type === 'circle') {
            return { x: shape.cx, y: shape.cy - shape.r - 6 };
        }
        return { x: shape.x + 4, y: shape.y - 6 };
    }

    function select(spot, hotspotNodes, panel) {
        hotspotNodes.forEach(function (n) { n.classList.remove('selected'); });
        hotspotNodes.get(spot.id).classList.add('selected');
        panel.innerHTML = '<h3>' + spot.label + '</h3><div class="body">' + spot.body + '</div>';
    }

    document.addEventListener('DOMContentLoaded', function () {
        var svg = document.getElementById('board-svg');
        var panel = document.getElementById('board-panel');
        if (!svg || !panel) return;

        // Swap in the real photo if it exists. The drawing group stays as the
        // fallback; hotspot coordinates are shared between both.
        var probe = new Image();
        probe.onload = function () {
            var drawing = document.getElementById('board-drawing');
            var img = el('image', { x: 0, y: 0, width: 1000, height: 640, preserveAspectRatio: 'xMidYMid slice' });
            img.setAttribute('href', probe.src);
            drawing.replaceWith(img);
            svg.insertBefore(img, svg.firstChild);
            var note = document.getElementById('stylized-note');
            if (note) note.remove();
        };
        probe.src = 'assets/img/' + BOARD_PHOTO;

        var hotspotNodes = new Map();
        var layer = el('g', {});
        svg.appendChild(layer);

        BOARD_HOTSPOTS.forEach(function (spot) {
            var s = spot.shape;
            var node = s.type === 'circle'
                ? el('circle', { cx: s.cx, cy: s.cy, r: s.r })
                : el('rect', { x: s.x, y: s.y, width: s.w, height: s.h, rx: 6 });
            node.classList.add('hotspot');
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'button');
            node.setAttribute('aria-label', spot.label);

            var pos = labelAnchor(s);
            var text = el('text', { x: pos.x, y: pos.y, class: 'hotspot-label' });
            if (s.type === 'circle') text.setAttribute('text-anchor', 'middle');
            text.textContent = spot.label;

            function activate() { select(spot, hotspotNodes, panel); }
            node.addEventListener('click', activate);
            node.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
            });

            layer.appendChild(node);
            layer.appendChild(text);
            hotspotNodes.set(spot.id, node);
        });
    });
})();
