# PRPL lab website

Source for [prpl-group.com](https://prpl-group.com), the website of the Princeton Robot Planning and Learning group.

## How the site works

The site is a single static page: `index.html` plus `assets/` (stylesheet, fonts, images). There is no framework and no build step for the page itself — what you see in the repo is what gets served.

Deployment happens through GitHub Actions (`.github/workflows/deploy.yml`) on every push to `master`. The workflow runs `scripts/build_site.py`, which copies the site into `_site/` and materializes the redirects listed in `redirects.txt`, then publishes `_site/` to GitHub Pages. Redirects work two ways:

- **Page paths** (e.g. `/prbench-site/`) become small HTML files that immediately forward the browser to the destination.
- **Non-HTML paths** (e.g. a `.pdf`) cannot redirect on GitHub Pages, so the build copies the destination file to the old path — both URLs serve the same file.

## TANDEM's docs

`/tandem/docs/` is generated from the Markdown in `tandem/docs/_src/` (one file per page; the sidebar order is `NAV` in the script). The HTML is committed, so the deploy doesn't change. After editing a page:

```bash
pip install markdown pygments pymdown-extensions
python3 tandem/build_tandem_docs.py
```

The build fails on a link between pages that resolves to no heading.

## Making changes

You should already be on the PRPL lab GitHub team with write access to this repo — ask Tom if not. **Do not fork**; work on a branch:

```bash
git clone git@github.com:Princeton-Robot-Planning-and-Learning/princeton-robot-planning-and-learning.github.io.git
cd princeton-robot-planning-and-learning.github.io
git checkout -b my-change
```

Test locally (asset paths are absolute, so you need a local server, not `file://`):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

If your change involves redirects, test the built site instead:

```bash
python3 scripts/build_site.py
cd _site && python3 -m http.server 8000
```

Then open a PR (direct pushes to `master` are blocked):

```bash
git push -u origin my-change
gh pr create --fill
```

Merging to `master` deploys automatically; the site updates within a minute or two.

### Adding a person

1. Prepare a square headshot, roughly 600×600, saved as JPG, and add it as `assets/images/team/firstname-lastname.jpg`.
2. In `index.html`, copy an existing `<div class="person">` block in the team grid and edit the image path, name, link, role, and affiliation.
3. Keep each list sorted alphabetically by last name (PhD students within the grid; same for the visitors and alumni lists).

Visitors, external collaborators, and alumni have no photo — add an `<li>` to the matching list instead, following the entries already there.

### Adding a redirect

Append one line to `redirects.txt` and open a PR:

```
/old-path/ https://example.com/new-location/
```

**Special case — paper PDFs.** Put the file in `papers/` and link it directly (`/papers/my-paper.pdf`); no redirect needed. Only if an *old* PDF URL is already circulating and must keep working, add a line whose destination is the local file:

```
/my-paper.pdf /papers/my-paper.pdf
```

The build then serves a copy of the PDF at the old path (the URL will not visibly change — that is expected; GitHub Pages cannot issue real redirects for non-HTML files).
