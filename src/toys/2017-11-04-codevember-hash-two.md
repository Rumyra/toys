---
title: Codevember Hash Two
date: '2017-11-04'
category: craft-code
tags:
- codevember
- css
- audio
- audio-vis
status: published
---

### Codevember Hash Two

It's **Sapphire** subject today so here's a little audio vis instead of a grid practice, as it seemed to fit a little betterer.

<p data-height="300" data-theme-id="1345" data-slug-hash="XzdVKJ" data-default-tab="js,result" data-user="Rumyra" data-embed-version="2" data-pen-title="Codevember Hash 2" class="codepen">See the Pen <a href="https://codepen.io/Rumyra/pen/XzdVKJ/">Codevember Hash 2</a> by Rumyra (<a href="https://codepen.io/Rumyra">@Rumyra</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

The biggest change I've made to the audio-vis software I'm building (Vizra) is to move the visuals to a canvas element to help performance. Drawing (& re-drawing) a butt ton of SVGs wasn't working too well. So the audio vis you'll see this Codevember are all going to be on canvas - not too much change to the actual visuals from last year. But most of work this year has been around the nuts and bolts of the software rather than the vis themselves.

Weirdly I have run into _more_ performance problems recently, but that's a whole other blog post, in fact a whole series!