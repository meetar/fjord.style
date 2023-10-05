---
layout: default
# title: About
---

<div class="comments intro">This is the web page of designer Peter Richardson.</div>

<img class="headshot" alt="Photo of designer Peter Richardson" src="/assets/headshot.jpg">
Hi, I'm Peter.

For many years, I worked as an animator, technical director, and designer on commercial, industrial, and artistic projects for animation, video game, and advertising studios.

Since then, I've applied that experience as a product designer and design technologist, leading interface research, design, and prototyping for security and GIS companies. 

"Fjord style" is an appreciation of layers, weatherproofing, clearly-marked routes, non-skid surfaces, dark neutrals with <mark>bright accents</mark>, and lists of things which turn out to be metaphors.


I'm currently open to new opportunities – <a href="#reachme">contact me</a>, view my <a href="">CV</a>, or check out some <a href="">case studies</a> if you'd like to learn more.

<div class="comments">Why "fjord.style"?</div>

I grew up in a tiny coastal town in Alaska famous for disasters, where extremities of scale, weather, and character felt not so much normal as inscrutable, as though there was no angle from which they would ever make any sense. 

So: I've been interested in describing hard-to-describe things for a long time.

The town itself was situated on the side of a fjord – a bay scooped out by glacial activity – where it had been relocated from the <em>end</em> of the fjord, building by surviving building, after the <a href="https://en.wikipedia.org/wiki/1964_Alaska_earthquake">1964 Good Friday earthquake</a> and attendant tsunami took out the port and destroyed much of the town.

Adaptation, exploration, learning from mistakes, and living in the face of loss.

The scale and scope of life on and near the sea feels to me like a deep reflection of what it means to be alive on Earth. In particular, I'm impressed by the design and practices of maritime industry and services, especially the US Coast Guard and organizations like it around the world.

The work of search and rescue, lighthouse-keeping, wayfinding and signaling, and maritime health and safety inspires me to make everyday things clearer, safer, stronger, more resilient, and more accessible to help us all cope with the extremities of experience in unstable circumstances.

<hr>

<div class="comments">My latest posts:</div>

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
        {% endunless }
    {% endfor %}
  </ul>

<hr>


<div class="comments" id="reachme">How to reach me:</div>
<a target="_top" href="mailto:pxrich@gmail.com">pxrich@gmail.com</a><br>
<a href="https://github.com/meetar/">https://github.com/meetar/</a><br>
<a href="https://mastodon.xyz/@meetar">https://mastodon.xyz/@meetar</a><br>

