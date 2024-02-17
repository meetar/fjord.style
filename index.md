---
layout: index
---

<style>
  .subtitle {
    flex-basis: 100%;
    font-size: 8px;
    -webkit-text-stroke: 1px;
  }
  body {
    justify-content: center;
  }
</style>

<div class="index-intro">
Visual technology, digital cartography, prototypes, R&D, and miscellaneous hackery from designer Peter Richardson.
<br><br>
<mark>Currently</mark>: Freelance. <mark>Formerly</mark>: Okta, Esri, Snap, Mapzen, and dozens of animation and advertising studios for hundreds of clients including Microsoft, Disney/Pixar, Sony, Rockstar Games, Hershey, Frito-Lay, LEGO, Comedy Central, and Sesame Street.
</div>

<div class="grid">

<a href="https://meetar.github.io/reverse-parallax-shader/">
<div>
Crystal Shader
<img src="assets/the-prototype-trap/prototype.jpg">
</div>
</a>

<!--
<a href="">
<div>
  Audubon Bird Explorer
  <img src="img/audubonMBE.png">
</div>
</a>
-->

<a href="case-studies#pathfinder">
<div>
Graph Pathfinder
<img src="assets/case-studies/screenshot2.png">
</div>
</a>

<a href="case-studies#musicmap">
<div>
Music Map
<img src="assets/case-studies/musicmap.jpg">
</div>
</a>

<!--
<a href="">
<div>
Bendix Sapphire
<img src="img/bendix.jpg">
</div>
</a>
-->

<a href="http://meetar.github.io/gem-collector">
<div>
Gem Collector
<img src="img/gemcollector.png">
</div>
</a>

<a href="/fake-rock/">
<div>
Fake Rock
<img src="img/rock.jpg">
</div>
</a>

<a href="/plotter/">
<div>
Plotter Prints
<img src="img/plotter.jpg">
</div>
</a>

<a href="http://tangrams.github.io/heightmapper">
<div>
Heightmapper
<img src="img/heightmapper.png">
</div>
</a>

<a href="https://tangrams.github.io/terrain-demos/?url=styles/green-stdev.yaml#10/57.0719/-126.2290">
<div>
Standard Deviation Map
<img src="img/stddev.png">
</div>
</a>

<a href="https://tangrams.github.io/terrain-demos/?url=styles/green-selectiveblur.yaml#10/57.0719/-126.2290">
<div>
Adaptive Generalization
<img src="img/generalization.png">
</div>
</a>

<a href="http://meetar.github.io/elevator">
<div>
Elevator
<img src="img/elevator.png">
</div>
</a>

<a href="https://tangrams.github.io/carousel/?daynight#15/40.7076/-74.0094">
<div>
Day/Night Map
<img src="img/daynight.png">
</div>
</a>

<a href="https://tangrams.github.io/kinkade/">
<div>
Kinkade Terrain Painter
<img src="img/kinkade.png">
</div>
</a>

<a href="https://meetar.github.io/siggraph-maps/?palms.yaml/#15">
<div>
Palms Map
<img src="img/palms.png">
</div>
</a>

<a href="https://meetar.github.io/siggraph-maps/?galaxy.yaml/#15">
<div>
Galaxy Map
<img src="img/galaxy.png">
</div>
</a>

<a href="https://meetar.github.io/siggraph-maps/?1988.yaml/#15">
<div>
1988 Map
<img src="img/1988.png">
</div>
</a>

<a href="https://meetar.github.io/albers/">
<div>
Albers Projection
<img src="assets/escape-from-mercator/albers.jpg">
</div>
</a>

<a href="https://meetar.github.io/bendy-map/">
<div>
Bendy Map
<img src="img/bendymap.jpg">
</div>
</a>

<a href="https://tangrams.github.io/explorer/#14.0/40.7238/-73.9881/kind/major_road">
<div>
OSM Explorer
<img src="img/explorer.png">
</div>
</a>

<a href="/makerbot-mountains/">
<div>
Makerbot Mountains
<img src="img/diablo.jpg">
</div>
</a>

<a href="https://meetar.github.io/globe-terrain/">
<div>
Global Terrain
<img src="img/globeterrain.png">
</div>
</a>

<a href="https://github.com/meetar/littlebits-r2d2-controls">
<div>
Littlebits R2D2
<img src="img/r2.png">
</div>
</a>

<a href="https://github.com/meetar/dotmap">
<div>
Dotmap
<span class="subtitle">(Contributor)</span>
<img src="img/dotmap.png">
</div>
</a>

<a href="https://mapzen.com/products/tangram/">
<div>
Tangram
<span class="subtitle">(Contributor)</span>
<img src="img/tangram.png">
</div>
</a>

<a href="https://github.com/meetar/manhattan-project">
<div>
Manhattan Project
<img src="img/manhattan.png">
</div>
</a>

<a href="/formline/">
<div>
Formline
<img src="img/formline/vlcsnap-2024-02-16-15h48m55s063.png">
</div>
</a>

<a href="/spacebunnies/">
<div>
Space Bunnies
<img src="img/spacebunnies.png">
</div>
</a>

<a href="/matrix/">
<div>
Matrix: Revolutions
<img src="img/matrix.png">
</div>
</a>

<a href="https://vimeo.com/manage/videos/79354708">
<div>
VDZ Year
<img src="img/vdz.png">
</div>
</a>

</div>


<hr>

<div class="comments">Latest posts:</div>

  <ul class="post-cards">
    {% assign filtered_posts = site.posts | exclude_hidden_posts %}
    {% for post in filtered_posts limit:4 %}
    {% unless post.hidden %}
      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}" aria-label="{{ post.aria-label }}"><div class="border"><li class="post-card">
          <h2>
            {{ post.title }}
          </h2>
          <span class="post-meta">{{ post.date | date: "%-d %b %Y" }}</span>
          {% if post.image %}<span class="post-img">
      
      <img class="cardheaderimg" src="/assets{{ post.url }}/{{ post.image }}" alt="{{ post.imgalt }}"></span>
          {% endif %}

          <span class="post-excerpt">{{ post.excerpt | remove: '<p>' | remove: '</p>' }}</span>

        </li></div></a>
        {% endunless %}
    {% endfor %}
  </ul>

<hr>

