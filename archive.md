---
layout: page
title: Archive
permalink: /archive/
source: http://reyhan.org/2013/03/jekyll-archive-without-plugins.html
published: false
---

<section id="archive">
      <ul class="past">
  {%for post in site.posts %}
        {% if post.hidden == null or post.hidden == false %}
    <div><time>{{ post.date | date:"%Y %b %d" }}</time><a href="{{ post.url }}">{{ post.title }}</a></div>
    {% endif %}
  {% endfor %}
  </ul>
</section>