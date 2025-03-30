---
layout: default
title: Papers I Like
---

<style>

  .content-section {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
  }

  p {
    text-align: left;
    margin-left: 0;
  }
</style>

<link rel="alternate" type="application/rss+xml" title="#PapersILike RSS Feed" href="/papers-i-like.xml">

<section class="content-section" aria-labelledby="papers-heading">
  <h1 id="papers-heading">#PapersILike</h1>
  <p>Each week, we post one paper we like (not written by us!)&mdash;just a link and a few words about why we like it. We try to pick papers that haven't received recent attention on social media. They're typically related to robotics, planning, and/or learning.</p>
  <div class="rss-subscribe">
    <p><a href="/papers-i-like.xml" target="_blank">📡 Subscribe via RSS</a></p>
  </div>
  <hr>
  <div id="papers-list">
    <!-- Papers will be populated here -->
  </div>
</section>

<script>
  fetch('/papers-i-like.xml')
    .then(response => response.text())
    .then(str => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, "application/xml");
      const items = xml.querySelectorAll("item");

      const papersList = document.getElementById('papers-list');

      items.forEach(item => {
        const title = item.querySelector("title")?.textContent || "";
        const reference = item.querySelector("author")?.textContent || "";
        const explanation = item.querySelector("description")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "";
        const rawDate = item.querySelector("pubDate")?.textContent || "";
        const date = new Date(rawDate);
        const formattedDate = date.toISOString().split('T')[0];

        const paperDiv = document.createElement('div');
        paperDiv.classList.add('paper');
        paperDiv.innerHTML = `
          <h3>${title}</h3>
          <h4>${reference}</h4>
          <p>${explanation}</p>
          <p><strong>Link:</strong> <a href="${link}" target="_blank">${link}</a></p>
          <p><strong>Date Posted:</strong> ${formattedDate}</p>
          <hr>
        `;
        papersList.appendChild(paperDiv);
      });
    });
</script>
