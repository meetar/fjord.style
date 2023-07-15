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
    <span class="case-study-tag">An interface</span> for navigating a complex dataset
  <div class="emphasis"><label>The Challenge:</label> Can incomprehensible data be visualized in a comprehensible way?</div>
  <div class="emphasis"><label>The Context:</label> Enterprise network permissions configuration management</div>
</div>

This project was a key component in a network administration product I worked on as principal product designer. User research by the product team found that the administrators of network permissions configurations were unsure what kinds of effects a given change to their configuration would produce. Because of the interlocking, overlapping nature of permissions configuration, apparently-simple changes could have extremely wide-ranging and unexpected effects.

The engineering team found a method of simulating the changes, but communicating the results proved challenging in complex network environments. Standard network visualization of the resulting data structures produced by the analysis produced very large and unwieldy visual structures. This was exacerbated by the fact that the results dataset was comprised entirely of categorical rather than quantitative relationships, meaning that no natural non-arbitrary sorting or ranking was possible.

The results dataset was the key value proposition of the business, but it was difficult to understand. Could it be tamed?

<div class="illustration"><img src="http://placekitten.com/1024/480" height=480 width=1024></div>

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
<div class="intro">~ Here's an example. ~</div>
  <div class="subtitle" id="globalterrain">
    <span class="case-study-tag">Case Study:</span> Global Terrain Sculptor
  </div>
    <span class="case-study-tag">A 3D design tool</span> to explore new modeling and animation techniques
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

This browser-based terrain-drawing tool uses adaptive generalization to make a "cartoon" terrain map of the Earth, similar to a plastic "vacuformed" raised-relief map. However, this map responds to zoom level to keep the size of the tallest mountains relatively constant. With this technique, a vertical scale is chosen, after which each point in the landscape is expanded every direction except upward, as though every mountain was inflated from its peak. This causes the largest features to subsume their smaller neighbors, and neighboring peaks combine to form simplified versions of ranges.

These transformations can be animated, and the result exported for use in other 3D applications such as Maya or Unity.

<div class="illustration"><img height=600 width=800></div>

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">WebGL</a> – a JavaScript API for controlling graphics cards</li><li>a fork of the <a href="https://threejs.org/">three.js</a> graphics library with custom <a href="https://en.wikipedia.org/wiki/Shader">shaders</a></li><li><a href="https://en.wikipedia.org/wiki/Shuttle_Radar_Topography_Mission">SRTM</a> global heightmap data</li></ul>

<a class="external" href="http://meetar.github.io/globe-terrain/">Live demo:</a>










<div class="case-study">
<div class="intro">~ Okay, you're going to love this. ~</div>

  <div class="subtitle">
    <span class="case-study-tag">Case Study:</span> Music Map
  </div>
    <span class="case-study-tag">An audio interface</span> to expand customer reach
  <div class="emphasis"><label>The Challenge:</label> Can mapped data be made accessible in a non-visual way?</div>
  <div class="emphasis"><label>The Context:</label> Dataset representation in public-facing governmental websites</div>
</div>

While working at the ESRI R&D Center, I was part of the development and launch of a design and component system for a major product offering in widespread use by governments at all levels as a public-facing communications platform. Part of that initiative was focused on increasing accessibility, not only for ethical reasons but for compliance with federal regulation. As a company with a long history in GIS, ESRI naturally used maps as a core part of that product offering, but maps have always had unique accessibility challenges.

The average digital map is an inherently visual object, with text embedded as pixels in the images which make up the map. This means any data embedded in maps is completely opaque to screen readers. It's possible to offer the same data in other form factors, but is there some way to use the strengths of a map to reach people who don't use it in the typical way?

<div class="illustration"><img height=600 width=800></div>

<div>
  <div class="emphasis"><label>The Design Insight:</label> Data points on a map resemble music notation, and can be played as music.</div>
  <div class="emphasis"><label>The Engineering Insight:</label> Quantizing the data to a pentatonic scale allows a continuous chord through multiple octaves, reducing dissonance.</div>
</div>

This map prototype is designed for screen readers, and features a musical interface which treats latitude as pitch and longitude as time. Playing all the data in the region of interest at once gives a musical overview, and stepping through the notes individually allows datapoint-level introspection. Onscreen text is presented as HTML elements rather than embedded in the map tiles, which grants screenreaders access to the information. With a geolocation API and careful use of ARIA tags, a text-to-speech interface announces general and specific locations as the map position changes.

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">ESRI ArcGis Hub</a> cloud platform</li>
<li><a href="https://developers.arcgis.com/calcite-design-system/">Calcite</a> – ESRI's internal component design system</li>
<li><a href="https://d3js.org/">d3.js</a> browser-based data-visualization library</li>
<li><a href="https://tonejs.github.io/">Tone.js</a> Web Audio framework</li></ul>

<a class="external" href="http://meetar.github.io/music-map/">Live demo:</a>











<div class="case-study">
<div class="intro">~ Let me show you something. ~</div>

  <div class="subtitle">
    <span class="case-study-tag">Case Study:</span> Spheremap Painter
  </div>
    <span class="case-study-tag">An Interactive Design Tool</span> for real-time feedback
  <div class="emphasis"><label>The Challenge:</label> Is there an easier way to art-direct terrain data?</div>
  <div class="emphasis"><label>The Context:</label> Custom browser-based cartography for an egalitarian, open-source cartographic stack</div>
</div>

Topographical map data is normally quite difficult to obtain, work with, and style. In most cases, if it is offered as part of a map design toolkit, it comes as a pre-set layer with limited customization options. This is in part because the traditional methods of working with this data are based on old conceptual models, both cartographic and technical.

The normal ways of lighting 3D objects involve creating virtual light sources and manipulating them until the desired effect is achieved, which requires relatively sophisticated understanding of the conceptual models involved, the appropriate goals concerning both computer lighting and 3D geometry generally. Is there a way to make this work more broadly accessible in a less arcane and technical way?

<div class="illustration"><img height=600 width=800></div>

<div>
  <div class="emphasis"><label>The Design Insight:</label> Painting colors directly on a map would allow instant feedback.</div>
  <div class="emphasis"><label>The Engineering Insight:</label> spheremaps allow the use of a texture as a light source.</div>
</div>

This tool makes use of a technique I borrowed from 3D VFX work called a spheremap, which simulates global lighting using textures. Spheremaps assign an array of pixel colors (aka an image) to a corresponding array of geometric angles, and can be used in lighting calculations in place of traditional light sources. When used as a lightsource, a spheremap effectively paints a piece of geometry with an image.

This design tool uses an embedded JavaScript canvas element as a literal canvas with brushes and a color pallette, with an interactive terrain map on the side. The spheremap calculations reference this canvas directly in real-time as the user paints, for instant feedback. This tool was used in the creation of maps and map baselayers by the design team, and both the baselayers and the tool were made freely available for public use in open-source mapping projects.


Technology used:
<ul><li>SVG</li>
<li>React</li>
<li>TypeScript</li>
</ul>

<a class="external" href="http://meetar.github.io/music-map/">Live demo:</a>







<div class="case-study">

<div class="intro">~ Here's one way of looking at it. ~</div>

  <div class="subtitle" id="globalterrain">
    <span class="case-study-tag">Case Study:</span> Albers Projection
  </div>
    <span class="case-study-tag">A prototype</span> of a dynamic projection inside an online map 
  <div class="emphasis"><label>The Challenge:</label> Can a standard browser-based map replicate more sophisticated cartography?</div>
  <div class="emphasis"><label>The Context:</label> 3D animation and data visualization for open-source cartography</div>  
</div>

While working at Mapzen on the development of a browser-based map graphics library, I often functioned as "User Number One" to test the capacity of the codebase and guide further development. One of the most important characteristics of any map is its projection, which is the method the map uses to distort the features of a spherical Earth into a flat plane.

The vast majority of online maps are in the Mercator projection, which has a long history and many flaws. However, its simplicity and ubiquity have ensured a degree of technical lock-in, including its enshrinement into the actual data sources used to create online maps.

Many other map projections are known to us in other contexts, including (in North America) the Albers Conic, known to schoolchildren for decades as the classic projection used to display North America and the contiguous United States. However, the Albers is a flexible projection, which can be adapted to minimize distortion for any point on earth, including the poles. Is this ability something which could be demonstrated in an online map?

<div class="illustration"><img height=600 width=800></div>

<div>
<div class="emphasis"><label>The Design Insight:</label> A dynamic, interactive digital map can have dynamic, interactive projections.</div>
<div class="emphasis"><label>The Engineering Insight:</label> Custom vertex shaders on modern GPUs can produce many other map projections by "distorting" the geometry of a Mercator-based datasource into a new projection in real-time.</div>
</div>

To create this map projection demo, I "unprojected" a set of Mercator-based tiled vector data points to regular latitude and longitude coordinates, and then reprojected them in the Albers projection. As the map moves, the map's position is fed to a set of variables in the projection, which adjusts it to minimize distortion at a given latitude. In this way the demo shows both the capacity of the projection and the capacity of the underlying map library.

<div class="illustration"><img height=600 width=800></div>

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">WebGL</a> – a JavaScript API for controlling graphics cards</li><li><a href="">Tangram</a> web mapping library with custom <a href="https://en.wikipedia.org/wiki/Shader">shaders</a></li></ul>

<a class="external" href="">Live demo:</a>

