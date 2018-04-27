---
layout: page
title: Archive
permalink: /archive/
source: http://reyhan.org/2013/03/jekyll-archive-without-plugins.html
---

<section id="archive">
  <ul>
  {%for post in site.posts %}
    {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
    {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
    {% if year != nyear %}
      </ul>
      <h3>{{ post.date | date: '%Y' }}</h3>
      <ul class="past">
    {% endif %}
    <li><time>{{ post.date | date:"%d %b" }}</time><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
  </ul>
</section>