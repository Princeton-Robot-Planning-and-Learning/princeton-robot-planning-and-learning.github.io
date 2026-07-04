#!/usr/bin/env python3
"""Build the deployable site into _site/, materializing redirects.txt.

HTML-page sources become meta-refresh stubs. Non-HTML sources (which
GitHub Pages cannot redirect) are served as a copy of their local
destination file, so old URLs keep working.
"""

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_site"
EXCLUDE = {".git", ".github", "_site", "scripts", "redirects.txt", "README.md"}

STUB = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting&hellip;</title>
  <meta http-equiv="refresh" content="0; url={url}">
  <link rel="canonical" href="{url}">
</head>
<body>
  <p>This page has moved to <a href="{url}">{url}</a>.</p>
</body>
</html>
"""


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for item in ROOT.iterdir():
        if item.name in EXCLUDE:
            continue
        if item.is_dir():
            shutil.copytree(item, OUT / item.name)
        else:
            shutil.copy2(item, OUT / item.name)

    for line in (ROOT / "redirects.txt").read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        src, dst = line.split()
        src_path = OUT / src.lstrip("/")
        if src.endswith("/"):
            src_path = src_path / "index.html"
        elif not src_path.suffix:
            # GitHub Pages serves /foo from foo.html
            src_path = src_path.with_suffix(".html")
        src_path.parent.mkdir(parents=True, exist_ok=True)
        if src_path.suffix.lower() in (".html", ".htm"):
            src_path.write_text(STUB.format(url=dst))
        else:
            target = OUT / dst.lstrip("/")
            if not target.exists():
                sys.exit(f"redirects.txt: {src}: non-HTML source needs a local destination; {dst} not found")
            shutil.copy2(target, src_path)
        print(f"redirect: {src} -> {dst}")

    print(f"built {OUT}")


if __name__ == "__main__":
    main()
