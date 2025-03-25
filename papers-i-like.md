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

<section class="content-section" aria-labelledby="papers-heading">
  <h1 id="papers-heading">#PapersILike</h1>
  <p>Each week, we post one paper we like (not written by us!)&mdash;just a link and a few words about why we like it. We try to pick papers that haven't received recent attention on social media. They're typically related to robotics, planning, and/or learning.</p>
  <hr>
  <div id="papers-list">
    <!-- Papers will be populated here -->
  </div>
</section>

<script>
  fetch('/papers-i-like.json')
    .then(response => response.json())
    .then(data => {
      const papersList = document.getElementById('papers-list');
      data.forEach(paper => {
        const paperDiv = document.createElement('div');
        paperDiv.classList.add('paper');
        paperDiv.innerHTML = `
          <h3>${paper.title}</h3>
          <h4>${paper.reference}</h4>
          <p>${paper.explanation}</p>
          <p><strong>Link:</strong> <a href="${paper.link}" target="_blank">${paper.link}</a></p>
          <p><strong>Date Posted:</strong> ${paper.datePosted}</p>
          <hr>
        `;
        papersList.appendChild(paperDiv);
      });
    });
</script>