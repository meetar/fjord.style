---
layout: portfolio
title: "Case Studies"
# date: 2013-08-08 12:02:02
# categories: terrain
published: true
hidden: true
paginate: false
pagination: 
  enabled: false
# excerpt: I have a lot of questions. I blame the fact that I grew up in a fjord.
# image: 1446403033.jpg
---

<div class="intro">~ What does a Design Technologist do? ~</div>
My work as a prototyper, developer, and product designer is heavily influenced by my time in animation, visual effects, and cartography. Here are some concrete examples to help illustrate that, as well as the guiding principles which inform that work: 1) the connections between design and engineering, 2) visual explanations, and 3) exploration as a tool for learning.





<div class="case-study">
  <div class="subtitle">
    <span class="case-study-tag">Case Study:</span> Network Pathfinder
  </div>
    <span class="case-study-tag">Solution type:</span> A novel interface for navigating a complex dataset
  <div class="emphasis"><label>The Challenge:</label> Can incomprehensible data have a comprehensible interface?</div>
  <div class="emphasis"><label>The Context:</label> Enterprise network permissions configuration management</div>
</div>

This project was a key component in a network administration product I worked on as principal product designer. User research by the product team found that the administrators of network permissions configurations were unsure what kinds of effects a given change to their configuration would produce. Because of the interlocking, overlapping nature of permissions configuration, apparently-simple changes could have extremely wide-ranging and unexpected effects.
The engineering team found a method of simulating the changes, but communicating the results proved challenging in complex network environments. Standard network visualization of the complex data structures produced by the analysis resulted in very large and unwieldy visual structures. This was exacerbated by the fact that the results dataset was made entirely of categorical rather than quantitative relationships, meaning that no natural non-arbitrary sorting or ranking was possible.

The results dataset was the key value proposition of the business, but it was difficult to understand. Could it be tamed?

<div class="illustration"><img height=600 width=800></div>

<div>
<div class="emphasis"><label>The Design Insight:</label> Building something allows you to understand it in an intuitive way.</div>
<div class="emphasis"><label>The Engineering Insight:</label> A higher-dimensional graph can be reduced by only showing relationships of certain types. If only one kind of attribute is displayed per node, the result is a slice of the graph in the shape of a tree.</div>
</div>

This interface allowed access configuration changes to be described piecewise, by building paths through the complex network of interrelationships. Filtering and search mechanisms permitted the real-time expansion, contraction, filtering, and restructuring of the graph. The prototype was a standalone tool replicating queries internally using a JSON database dump. Later versions were integrated into a React app, making graphDB queries through a custom API developed by the engineering team.

The result is a visual representation of many consecutive database queries, each building on the last, showing how access changes propagated through the downstream network graph. In this way, the results could be summarized and explored in targeted ways, according to the specific needs of the user, while only showing as much or as little detail as required by a given use case.

Technology used:
<ul><li>SVG</li>
<li>React</li>
<li>TypeScript</li>
</ul>

<a class="external" href="http://meetar.github.io/music-map/">Live demo:</a>




<div class="case-study">
  <div class="subtitle" id="globalterrain">
    <span class="case-study-tag">Case Study:</span> Global Terrain Sculptor
  </div>
    <span class="case-study-tag">Solution type:</span> A design tool to explore new modeling and animation techniques
  <div class="emphasis"><label>The Challenge:</label> Can mountains be depicted at varying scales while preserving their character?</div>
  <div class="emphasis"><label>The Context:</label> 3D animation and data visualization for film and commercial visual effects</div>
  
</div>

In visual effects work, it's common to want to zoom into or away from a depiction of the Earth. In these cases, topographical features are typically only represented at a single scale, if at all – either they are a cartoon version of terrain or real-scale. Actual topographical data becomes difficult to exaggerate at large scales due to a mismatch between the scale of the map and our experience of mountains – when mountains are scaled vertically, things don't look right. Can our expectations about how mountains should look be described empirically so computers can get involved?

This was a project I initiated to test the capabilities of a relatively-new graphics library called three.js, which has since become one of the standard technologies of online 3D. It was also a chance to scratch a few technical and aesthetic itches I'd had for a long time, and start getting back into web programming after a long time in commercial VFX.

<div class="illustration"><img height=600 width=800></div>

<div>
<div class="emphasis"><label>The Design Insight:</label> Raised relief maps summarize terrain by drawing it with a broad metaphorical brush.</div>
<div class="emphasis"><label>The Engineering Insight:</label> Morphological operators can manipulate a heightmap to approximate this effect, and change the size of the virtual brush on the fly.</div>
</div>

This browser-based terrain-drawing tool uses adaptive generalization to make a "cartoon" terrain map of the Earth, similar to a plastic "vacuformed" raised-relief map. However, this map can adjusts with zoom level to keep the size of the tallest mountains relatively constant. With this technique, a vertical scale is chosen, after which each point in the landscape is expanded every direction except upward, as though every mountain was inflated from its peak. This causes the largest features to subsume their smaller neighbors, and neighboring peaks combine to form simplified versions of ranges.

These transformations can be animated, and the result exported for use in other 3D applications such as Maya or Unity.

<div class="illustration"><img height=600 width=800></div>

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">WebGL</a> – a JavaScript API for controlling graphics cards</li><li>a fork of the <a href="https://threejs.org/">three.js</a> graphics library with custom <a href="https://en.wikipedia.org/wiki/Shader">shaders</a></li><li><a href="https://en.wikipedia.org/wiki/Shuttle_Radar_Topography_Mission">SRTM</a> global heightmap data</li></ul>

<a class="external" href="http://meetar.github.io/globe-terrain/">Live demo:</a>










<div class="case-study">
  <div class="subtitle">
    <span class="case-study-tag">Case Study:</span> Music Map
  </div>
    <span class="case-study-tag">Solution type:</span> A new interface to expand customer reach.
  <div class="emphasis"><label>The Challenge:</label> Can mapped data be made accessible in a non-visual way?</div>
  <div class="emphasis"><label>The Context:</label> Dataset representation in public-facing governmental websites</div>
</div>
The average digital map is an inherently visual object, with text embedded as pixels in the images which make up the map. This means it is completely inaccessible to people who rely on screen readers. Is there any way around this?

<div class="illustration"><img height=600 width=800></div>

<div>
  <div class="emphasis"><label>The Design Insight:</label> Data points on a map resemble music notation, and can be played as music.</div>
  <div class="emphasis"><label>The Engineering Insight:</label> Quantizing the data to a pentatonic scale allows a continuous chord through multiple octaves, reducing dissonance.</div>
</div>
This map is designed for screen readers, and features a musical interface which treats latitude as pitch and longitude as time. Playing all the data in the region of interest at once gives a musical overview, and stepping through the notes individually allows datapoint-level introspection. Onscreen text is presented as HTML elements rather than embedded in the map tiles, which grants screenreaders access to the information. With a geolocation API and careful use of ARIA tags, a text-to-speech interface announces general and specific locations as the map position changes.

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">ESRI ArcGis Hub</a> cloud platform</li>
<li><a href="https://developers.arcgis.com/calcite-design-system/">Calcite</a> – ESRI's internal component design system</li>
<li><a href="https://d3js.org/">d3.js</a> browser-based data-visualization library</li>
<li><a href="https://tonejs.github.io/">Tone.js</a> Web Audio framework</li></ul>

<a class="external" href="http://meetar.github.io/music-map/">Live demo:</a>











<div class="case-study">
  <div class="subtitle">
    <span class="case-study-tag">Case Study:</span> Spheremap Painter
  </div>
  <div class="emphasis"><label>The Challenge:</label> Is there a faster way to art-direct terrain data?</div>
  <div class="emphasis"><label>The Context:</label> Custom browser-based cartography</div>
</div>
Drawing maps


<div class="illustration"><img height=600 width=800></div>

<div>
  <div class="emphasis"><label>The Design Insight:</label> Painting colors directly on a map would allow instant feedback.</div>
  <div class="emphasis"><label>The Engineering Insight:</label> spheremaps allow the use of a texture as a light source.</div>
</div>

This tool makes use of a technique used in 3D graphics to simulate global lighting called a spheremap. Spheremaps assign an array of pixel colors (aka an image) to a corresponding array of geometry angles, and can be used in lighting calculations in place of traditional light sources. When used as the only lightsource, a spheremap effectively paints a piece of geometry. This painting tool uses an embedded JavaScript canvas element as a literal canvas, and the spheremap calculations reference it directly in real-time.


Technology used:
<ul><li>SVG</li>
<li>React</li>
<li>TypeScript</li>
</ul>

<a class="external" href="http://meetar.github.io/music-map/">Live demo:</a>






