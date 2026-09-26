#!/usr/bin/env python3
"""Build TANDEM's docs (/tandem/docs/) from the Markdown in tandem/docs/_src/.

The output is plain HTML, committed like the rest of the site: tandem/docs/index.html and one
tandem/docs/<page>/index.html per page, plus tandem/docs/static/search-index.js. Nothing is built at
deploy time. Run this after editing a page:

    pip install markdown pygments pymdown-extensions
    python3 tandem/build_tandem_docs.py

A link between pages is written the way the TANDEM repo's own docs write it -- to a Markdown file and a
heading (`CONFIGURATION.md#the-rig`, `../README.md#6-teleop`) -- or to a page (`installation.md`).
Either becomes a link to the page that has that heading. A link that resolves to no page fails the build.
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

import markdown
from pygments.formatters import HtmlFormatter

ROOT = Path(__file__).resolve().parent.parent  # the site repo
DOCS = ROOT / "tandem" / "docs"
SRC = DOCS / "_src"
BASE = "/tandem/docs/"
REPO = "https://github.com/SamratSahoo/TANDEM"

# The sidebar, in order. The home page ("index") is not listed; the brand and "Docs" link go there.
NAV: list[tuple[str, list[tuple[str, str]]]] = [
    (
        "Getting started",
        [
            ("installation", "Installation"),
            ("robot", "Robot setup"),
            ("perception-servers", "Perception servers"),
            ("cameras", "Cameras and calibration"),
            ("teleop", "Teleoperation"),
            ("getting-started", "Your first collection"),
        ],
    ),
    (
        "User guide",
        [
            ("collecting", "Collecting"),
            ("planning", "Planning from a photo"),
            ("reviewing", "Reviewing and exporting"),
            ("web-ui", "Web UI"),
            ("configuration", "Configuration"),
        ],
    ),
    (
        "Reference",
        [
            ("concepts", "Concepts"),
            ("commands", "Command reference"),
            ("data", "Data format"),
            ("troubleshooting", "Troubleshooting"),
        ],
    ),
    (
        "Extending TANDEM",
        [
            ("adding-a-planner", "Adding a planner"),
            ("adding-a-human-executor", "Adding a human executor"),
        ],
    ),
]

# A link to a whole file of the repo's docs, and where it goes here.
FILES = {
    "README.md": "index",
    "USAGE.md": "getting-started",
    "CONFIGURATION.md": "configuration",
    "DATA.md": "data",
    "TROUBLESHOOTING.md": "troubleshooting",
    "ADDING_A_PLANNER.md": "adding-a-planner",
    "ADDING_A_HUMAN_EXECUTOR.md": "adding-a-human-executor",
}

# Headings of the repo's README that are pages (or sections of one) here.
ALIASES = {
    "setup": ("installation", ""),
    "1-install": ("installation", "install"),
    "2-initialize": ("installation", "initialize"),
    "3-robot": ("robot", ""),
    "4-perception-servers": ("perception-servers", ""),
    "5-cameras-and-calibration": ("cameras", ""),
    "6-teleop": ("teleop", ""),
    "7-check-the-setup": ("installation", "check-the-setup"),
    "usage": ("getting-started", ""),
    "terms": ("concepts", ""),
    # USAGE.md's sections that are pages here, under other titles.
    "commands": ("commands", ""),
    "the-web-ui": ("web-ui", ""),
    "a-typical-session": ("getting-started", ""),
}


def slugify(text: str, _sep: str = "-") -> str:
    """GitHub's heading anchors, so links written for the repo's docs land on the same headings here."""
    text = re.sub(r"<[^>]+>", "", html.unescape(text)).strip().lower()
    text = re.sub(r"[^\w\- ]", "", text)
    return text.replace(" ", "-")


def pages() -> list[tuple[str, str]]:
    return [page for _, group in NAV for page in group]


def url(slug: str, anchor: str = "") -> str:
    path = BASE if slug == "index" else f"{BASE}{slug}/"
    return path + (f"#{anchor}" if anchor else "")


def heading_index() -> dict[str, list[str]]:
    """Every heading anchor, and the pages it is on."""
    found: dict[str, list[str]] = {}
    for slug in ["index", *(s for s, _ in pages())]:
        text = (SRC / f"{slug}.md").read_text()
        text = re.sub(r"```.*?```", "", text, flags=re.S)
        for heading in re.findall(r"^#{1,6} (.+)$", text, re.M):
            found.setdefault(slugify(heading), []).append(slug)
    return found


def resolve(target: str, here: str, anchors: dict[str, list[str]]) -> str | None:
    """Where a link written for the repo's docs goes on this site, or None."""
    if re.match(r"^(https?:|mailto:)", target):
        return target
    path, _, anchor = target.partition("#")
    name = Path(path).name
    if not path:
        if here in anchors.get(anchor, []):
            return f"#{anchor}"
        # A section of the same repo file that is a page of its own here.
        path, name = f"{here}.md", ""
    if name in ("LICENSE", "NOTICE"):
        return f"{REPO}/blob/main/{name}"
    stem = name.removesuffix(".md")
    if stem in {s for s, _ in pages()} or stem == "index":
        return url(stem, anchor)
    if anchor in ALIASES:
        slug, sub = ALIASES[anchor]
        return url(slug, sub)
    if anchor:
        where = anchors.get(anchor, [])
        preferred = FILES.get(name)
        if preferred in where:
            return url(preferred, anchor)
        if here in where:
            return url(here, anchor)
        if where:
            return url(where[0], anchor)
        return None
    if name in FILES:
        return url(FILES[name])
    if name == "README.md" and "docs" in path:
        return url("concepts")
    return None


def rewrite_links(text: str, here: str, anchors: dict[str, list[str]], problems: list[str]) -> str:
    parts = re.split(r"(```.*?```)", text, flags=re.S)
    for i, part in enumerate(parts):
        if part.startswith("```"):
            continue

        def fix(match: re.Match) -> str:
            label, target = match.group(1), match.group(2)
            where = resolve(target, here, anchors)
            if where is None:
                problems.append(f"{here}.md: no page for link {target!r}")
                return match.group(0)
            return f"[{label}]({where})"

        parts[i] = re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", fix, part)
    return "".join(parts)


def indent_lists(text: str) -> str:
    """A numbered item's blocks indented 3 spaces (GitHub's style, which the repo's docs use) to Python-Markdown's 4.

    Only outside top-level code blocks, so a code sample's own indentation is left as written.
    """
    out, fence = [], False
    for line in text.split("\n"):
        if line.startswith("```"):
            fence = not fence
        elif not fence and re.match(r"^ {3}\S", line):
            line = " " + line
        out.append(line)
    return "\n".join(out)


def render(text: str) -> tuple[str, list[dict]]:
    text = indent_lists(text)
    md = markdown.Markdown(
        # superfences, not fenced_code: the setup steps put code blocks inside numbered lists.
        extensions=["pymdownx.superfences", "pymdownx.highlight", "tables", "toc", "md_in_html", "sane_lists"],
        extension_configs={
            "pymdownx.highlight": {"css_class": "hl", "guess_lang": False, "use_pygments": True},
            "toc": {"slugify": slugify, "toc_depth": "2-3"},
        },
    )
    body = md.convert(text)
    return body, md.toc_tokens


def strip_tags(fragment: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def search_entries(slug: str, title: str, body: str) -> list[dict]:
    """The page, and each of its sections, with a little text to match against."""
    entries = []
    chunks = re.split(r'(<h[23] id="[^"]+">.*?</h[23]>)', body, flags=re.S)
    entries.append({"title": title, "page": title, "url": url(slug), "text": strip_tags(chunks[0])[:400]})
    for i in range(1, len(chunks), 2):
        match = re.match(r'<h[23] id="([^"]+)">(.*?)</h[23]>', chunks[i], re.S)
        text = strip_tags(chunks[i + 1] if i + 1 < len(chunks) else "")
        entries.append(
            {"title": strip_tags(match.group(2)), "page": title, "url": url(slug, match.group(1)), "text": text[:400]}
        )
    return entries


def sidebar(current: str) -> str:
    out = []
    for group, items in NAV:
        out.append(f'<div class="side-group"><div class="side-hd">{html.escape(group)}</div><ul>')
        for slug, title in items:
            active = ' class="active" aria-current="page"' if slug == current else ""
            out.append(f'<li><a href="{url(slug)}"{active}>{html.escape(title)}</a></li>')
        out.append("</ul></div>")
    return "\n".join(out)


def on_this_page(tokens: list[dict]) -> str:
    items = []
    for h2 in tokens:  # toc_depth 2-3: the page's h1 is not among them
        items.append(f'<li><a href="#{h2["id"]}">{h2["name"]}</a></li>')
        for h3 in h2.get("children", []):
            items.append(f'<li class="sub"><a href="#{h3["id"]}">{h3["name"]}</a></li>')
    if not items:
        return ""
    return '<div class="toc-hd">On this page</div><ul class="toc-list">' + "".join(items) + "</ul>"


def pager(slug: str) -> str:
    order = [s for s, _ in pages()]
    titles = dict(pages())
    if slug == "index":
        prev, nxt = None, order[0]
    else:
        i = order.index(slug)
        prev = order[i - 1] if i > 0 else "index"
        nxt = order[i + 1] if i + 1 < len(order) else None
    cells = []
    if prev:
        cells.append(
            f'<a class="prev" href="{url(prev)}"><span>Previous</span>{html.escape(titles.get(prev, "Home"))}</a>'
        )
    else:
        cells.append("<span></span>")
    if nxt:
        cells.append(f'<a class="next" href="{url(nxt)}"><span>Next</span>{html.escape(titles[nxt])}</a>')
    return '<nav class="pager" aria-label="Pages">' + "".join(cells) + "</nav>"


def page_html(slug: str, title: str, body: str, tokens: list[dict]) -> str:
    template = (DOCS / "_template.html").read_text()
    edit = f"{REPO}" if slug == "index" else ""
    return (
        template.replace("{{title}}", html.escape(title))
        .replace("{{page_class}}", "home" if slug == "index" else "page")
        .replace("{{sidebar}}", sidebar(slug))
        .replace("{{body}}", body)
        .replace("{{toc}}", on_this_page(tokens) if slug != "index" else "")
        .replace("{{pager}}", pager(slug))
        .replace("{{repo}}", REPO)
        .replace("{{edit}}", edit)
    )


def main() -> int:
    anchors = heading_index()
    problems: list[str] = []
    index: list[dict] = []
    for slug, title in [("index", "TANDEM documentation"), *pages()]:
        text = rewrite_links((SRC / f"{slug}.md").read_text(), slug, anchors, problems)
        body, tokens = render(text)
        out = DOCS / "index.html" if slug == "index" else DOCS / slug / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page_html(slug, title, body, tokens))
        if slug != "index":
            index += search_entries(slug, title, body)
    if problems:
        print("\n".join(problems), file=sys.stderr)
        return 1
    static = DOCS / "static"
    static.mkdir(exist_ok=True)
    (static / "search-index.js").write_text("window.TANDEM_DOCS_INDEX = " + json.dumps(index) + ";\n")
    # Pygments' "friendly" colours, with comments in the site's muted grey rather than teal italics.
    css = HtmlFormatter(style="friendly").get_style_defs(".hl")
    css += "\n.hl .c, .hl .c1, .hl .ch, .hl .cm, .hl .cs, .hl .cp { color: #72757b; font-style: normal; }\n"
    (static / "highlight.css").write_text(css)
    print(f"built {len(pages()) + 1} pages into {DOCS.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
