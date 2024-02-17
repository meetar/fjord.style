---
layout: portfolio
title: "Case Studies"
published: true
hidden: true
paginate: false
pagination: 
  enabled: false
---



<div class="comments">~ What does a Design Technologist do? ~</div>
Most of my work in the last ten years has been focused on rapid prototyping using off-the-shelf web technologies in new or unusual configurations, to explore  potential product landscapes.

I've worked with product, engineering, research, and design teams to solve interesting problems across a wide array of industries, most recently in digital cartography and internet security. My work as a prototyper, developer, and product designer is especially influenced by my background in animation and visual effects.

Here are some examples to illustrate that work, as well as the <mark>guiding principles</mark> which inform it: 1) the connections between design and engineering, 2) visual explanations, and 3) exploration as a tool for learning.




<div class="case-study" id="pathfinder">
<div class="comments">~ Is there a way to break it down? ~</div>
  <div class="title-wrapper">
    <span class="case-study-tag">Case Study:</span><span class="title">Network Pathfinder</span>
  </div>
  <div class="subtitle-wrapper">
    <span class="case-study-tag">An interface</span><span class="subtitle">for navigating a complex dataset</span>
  </div>
  <div class="emphasis"><label>The Challenge:</label> Can incomprehensible data be visualized in a comprehensible way?</div>
  <div class="emphasis"><label>The Context:</label> Enterprise network permissions configuration management</div>
</div>

<div class="illustration"><img src="/assets/case-studies/pathfinder-sketch.jpg" alt='A pen-and-ink sketch of a node-based graph network interface' width='800px'></div>

This project was a key component in a network administration product I worked on as <mark>principal product designer</mark> for a startup inside a large security organization. User research by the product team found that security administrators were unsure what effects a given change to their permissions configuration would produce. Because of the interlocking, overlapping nature of these networks, apparently-simple changes could have extremely wide-ranging, unexpected, and costly effects.

The engineering team found a method of simulating these changes, but communicating the results proved challenging in complex network environments. Thousands of overlapping group relationships produced very large and unwieldy visual structures when graphed with standard network visualizations, and as the data contained entirely categorical rather than quantitative relationships, no natural non-arbitrary sorting or ranking was possible.

The results dataset was the <mark>key value proposition</mark> of the product, but it was difficult to understand. Could it be tamed?

<div class="illustration">
  <div class="multiple">
    <div class="shadow">
      <div class="underlay">
        <img src="/assets/case-studies/screenshot1.png" alt='A figma mockup of a network interface' width='1000px'>
        <span class="label left">Figma Mockup</span>
      </div>
    </div>
    <div class="overlayshadow">
      <div class="overlay">
        <img src="/assets/case-studies/screenshot2.png" alt='An interactive network interface' width='1000px'>
        <span class="label right">Prototype Interface</span>
      </div>
    </div>
  </div>
</div>

<div>
<div class="emphasis"><label>The Design Insight:</label> Building something allows you to understand it in an intuitive way.</div>
<div class="emphasis"><label>The Engineering Insight:</label> A higher-dimensional graph can be reduced by only showing relationships of certain types. If only one kind of attribute is displayed per step, the result is a slice of the graph in the shape of a tree.</div>
</div>

This interface allowed security administrators to explore access configuration changes step-by-step, by building paths through the complex network of interrelationships. Filtering and search mechanisms permitted the real-time expansion, contraction, filtering, and restructuring of the graph.

The result is a visual representation of many consecutive queries, each building on the last, mapping the ways that access changes propagate through the downstream network. The results can be <mark>both summarized and detailed</mark> in targeted ways, according to the specific needs of the user, while only showing as much or as little detail required by a given use case.

The prototype was a standalone tool which simulated database queries client-side. Later versions were integrated into a React app, making graphDB queries through a custom API developed by the engineering team.

Technology used:
<ul>
<li>React</li>
<li>JQuery</li>
<li>SVG</li>
</ul>

<div class="case-study">
<div class="comments">~ Is there a way to simulate it? ~</div>

  <div class="title-wrapper" id="globalterrain">
    <span class="case-study-tag">Case Study:</span><span class="title">Global Terrain Sculptor</span>
  </div>
  <div class="subtitle-wrapper">
    <span class="case-study-tag">A 3D design tool</span><span class="subtitle">to explore new modeling and animation techniques</span>
  </div>

  <div class="emphasis"><label>The Challenge:</label> Can terrain be scaled up while preserving its character?</div>
  <div class="emphasis"><label>The Context:</label> 3D animation and data visualization for visual effects</div>
  
</div>

<div class="illustration"><img src="/assets/case-studies/terrain-sketch3.jpg" alt='Pen and ink sketches of globes' width="800px"></div>

In visual effects work, it's common to want to zoom into or away from a depiction of the Earth. In these cases, topographical features are typically only represented at a single scale, if at all – either they are a cartoon version of terrain or real-scale. Actual topographical data becomes difficult to exaggerate at large scales due to a mismatch between the scale of the map and our experience of mountains – when mountains are scaled vertically, things don't look right. Can our expectations about how landscapes should look be described empirically so computers can get involved?

This was a project I initiated to <mark>test the capabilities</mark> of a relatively-new web graphics library called three.js, which has since become one of the standard technologies of online 3D. It was also a chance to scratch a few technical and aesthetic itches, while bringing some techniques from graphics programming to the web.

Can this unwieldy data be used to show something new?

<div class="illustration">
  <div class="multiple">
    <div class="shadow">
      <div class="underlay">
        <img src="/assets/case-studies/earth-bw.jpg" alt='a 3D rendered monochrome globe with exaggerated terrain' width='1000px'>
        <span class="label left">Lighting Layer</span>
      </div>
    </div>
    <div class="overlayshadow">
      <div class="overlay">
        <img src="/assets/case-studies/earth-color.jpg" alt='a 3D rendered colored globe with exaggerated terrain' width='1000px'>
        <span class="label right">Color Layer</span>
      </div>
    </div>
  </div>
</div>



<div>
<div class="emphasis"><label>The Design Insight:</label> <a href="https://en.wikipedia.org/wiki/Raised-relief_map">Raised relief maps</a> summarize terrain by drawing it with a broad metaphorical brush.</div>
<div class="emphasis"><label>The Engineering Insight:</label> <a href="https://en.wikipedia.org/wiki/Mathematical_morphology">Morphological operators</a> can manipulate data to approximate this effect, and change the size of the virtual brush on the fly.</div>
</div>

This browser-based terrain-drawing tool uses adaptive generalization to make an exaggerated terrain map of the Earth, similar to a plastic vacuformed raised-relief map. However, this map responds to zoom level to keep the size of the tallest mountains relatively constant, while combining neighboring features as necessary to simplify terrain. These transformations can be animated, and the results exported for use in other 3D applications such as Maya or Unity.

The effect is of a planet which shows more detail as you approach it. This was the demo which led to my position as the <mark>first graphics hire</mark> at an open-source GIS startup.

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">WebGL</a> – a JavaScript API for controlling graphics cards</li><li>a fork of the <a href="https://threejs.org/">three.js</a> graphics library with custom <a href="https://en.wikipedia.org/wiki/Shader">shaders</a></li><li><a href="https://en.wikipedia.org/wiki/Shuttle_Radar_Topography_Mission">SRTM</a> global heightmap data</li></ul>

<!-- <a class="external" href="http://meetar.github.io/globe-terrain/">Live demo:</a> -->


<div class="case-study" id="musicmap">
<div class="comments">~ Can we find similarities with dissimilar things? ~</div>


  <div class="title-wrapper">
    <span class="case-study-tag">Case Study:</span><span class="title">Music Map</span>
  </div>
  <div class="subtitle-wrapper">
    <span class="case-study-tag">A prototype interface</span><span class="subtitle">to expand customer reach</span>
  </div>

  <div class="emphasis"><label>The Challenge:</label> Can mapped data be made accessible in a non-visual way?</div>
  <div class="emphasis"><label>The Context:</label> Dataset representation in public-facing governmental websites</div>
</div>

<div class="illustration">
        <img src="/assets/case-studies/calcite.jpg" alt="A screenshot of a website showing design system components" width='1000px'>
</div>

While at the R&D center of a large GIS organization, I was part of the development and launch of a <a href="https://developers.arcgis.com/calcite-design-system/">design and component system</a> for a major product offering in widespread use by governments at all levels as a public-facing communications platform. Part of that initiative was focused on increasing accessibility while expanding the capabilities of the component system, not least to ensure compliance with federal regulation.

The average digital map is an inherently visual object, with text embedded as pixels in the images which make up the map. This means any data embedded in maps is completely opaque to screen readers, and to reach these users, the data must be offered in other form factors.

Are there ways to use the strengths of a map to reach people who don't use them in the typical way?

<div class="illustration">
        <img src="/assets/case-studies/musicmap.jpg" alt='A map of the Iberian peninsula with data points scattered on it' width='1000px'>
</div>

<div>
  <div class="emphasis"><label>The Design Insight:</label> Data points on a map resemble music notation, and can be played as music.</div>
  <div class="emphasis"><label>The Engineering Insight:</label> Quantizing the data to a pentatonic scale allows a continuous chord through multiple octaves, allowing easy transposition and reducing dissonance.</div>
</div>

This map prototype was made to demonstrate the flexibility of the design system, and was made by integrating third-party libraries into the design system components. It is explicitly designed for screen readers as its first audience, and features a musical interface which treats <mark>latitude as pitch and longitude as time</mark>.

"Playing" all the data in the region of interest gives a musical overview, and stepping through the notes individually allows datapoint-level introspection. Map labels are presented as HTML elements rather than embedded in the map tiles, which grants screenreaders access to the information. With a keyboard interface, a geolocation API, and careful use of ARIA tags, a text-to-speech interface announces general and specific locations as the map position, and variable amounts of reverb serve as a secondary clue to zoom level.

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">ESRI ArcGis Hub</a> cloud platform</li>
<li><a href="https://developers.arcgis.com/calcite-design-system/">Calcite</a> – ESRI's internal component design system</li>
<li><a href="https://d3js.org/">d3.js</a> browser-based data-visualization library</li>
<li><a href="https://tonejs.github.io/">Tone.js</a> Web Audio framework</li></ul>

<!-- <a class="external" href="http://meetar.github.io/music-map/">Live demo:</a> -->



<div class="case-study" id="spheremaps">
<div class="comments">~ Can we speed up the feedback loop? ~</div>

  <div class="title-wrapper">
    <span class="case-study-tag">Case Study:</span><span class="title">Spheremap Painter</span>
  </div>
  <div class="subtitle-wrapper">
    <span class="case-study-tag">An interactive design tool</span><span class="subtitle">for real-time feedback</span>
  </div>

  <div class="emphasis"><label>The Challenge:</label> Is there an easier way to art-direct terrain data?</div>
  <div class="emphasis"><label>The Context:</label> Custom browser-based cartography for an egalitarian, open-source cartographic stack</div>
</div>

While working on the development of Mapzen's graphics library, the graphics team worked to bring <mark>modern graphics techniques</mark> to online mapping. One of the major challenges was in overcoming expectations about the limitations of existing toolsets, and demonstrating potential benefits compared to traditional workflows.

For example, topographical map data is normally quite difficult to obtain, work with, and style. In most cases, if it is offered as part of a GIS product, it comes as a pre-set layer with limited customization options. This is in part because the traditional methods of working with this data are based on old conceptual models, both cartographic and technical.

Terrain data is typically presented as a pre-processed, pre-rendered static image layer. During processing, the standard methods of converting terrain data to images involve creating virtual light sources and manipulating them until the desired traditional effect is achieved, which requires a relatively sophisticated understanding of the conceptual models involved, and the appropriate goals of both terrain styling and 3D lighting generally.

Is there a way to make this work less arcane and technical, and more broadly accessible?

<div class="illustration">
  <div class="multiple">
    <div class="shadow">
      <div class="underlay">
        <img src="/assets/case-studies/kinkade1.jpg" alt='A terrain map of Mount Fuji in blues and pinks' width='1000px'>
        <span class="label left">Mt. Fuji</span>
      </div>
    </div>
    <div class="overlayshadow">
      <div class="overlay">
        <img src="/assets/case-studies/kinkade2.jpg" alt='A terrain map of the Grand Canyon in teal and orange' width='1000px'>
        <span class="label right">Grand Canyon</span>
      </div>
    </div>
  </div>
</div>

<div>
  <div class="emphasis"><label>The Design Insight:</label> Painting light directly on a map would provide instant feedback.</div>
  <div class="emphasis"><label>The Engineering Insight:</label> The “spheremap” technique allows the use of a texture as a light source, which can be created in real-time in a browser.</div>
</div>

Working with engineering, the graphics team decided to include a version of our terrain data in a form which encodes the angles of topographical slopes. This allows virtual lights to be applied at runtime, client-side.

This design tool makes use of an additional technique I <mark>borrowed from 3D VFX work</mark> called a spheremap, which simulates global lighting using textures. Spheremaps assign an array of pixel colors (better known as an bitmap) to a corresponding array of geometric angles, such as those encoded in our terrain data product. This can then be used in lighting calculations in place of traditional light sources, effectively painting a piece of 3D geometry with an image.

The interface uses an embedded JavaScript canvas element as a literal canvas with brushes and a color palette, with an interactive terrain map on the side. The spheremap calculations reference this canvas directly in real-time as the user paints, for instant feedback. This tool was used in the creation of maps and map baselayers by the design team, and both the baselayers and the tool were made freely available for public use in open-source mapping projects.


Technology used:
<ul>
<li><a href="https://en.wikipedia.org/wiki/OpenGL_Shading_Language">GLSL</a> shading language</li>
<li><a href="http://github.com/tangrams/tangram">Tangram</a> web mapping library</li>
</ul>

<a class="external" href="http://tangrams.github.io/kinkade/">Live demo:</a>







<div class="case-study" id="projection">

<div class="comments">~ What if we start at the goal and work backwards? ~</div>

  <div class="title-wrapper">
    <span class="case-study-tag">Case Study:</span><span class="title">Conic Projection</span>
  </div>
  <div class="subtitle-wrapper">
    <span class="case-study-tag">A demonstration</span><span class="subtitle">of a new kind of cartographic flexibility</span>
  </div>

  <div class="emphasis"><label>The Challenge:</label> Can browser-based maps replicate more sophisticated cartography?</div>
  <div class="emphasis"><label>The Context:</label> 3D animation and data visualization for open-source cartography</div>  
</div>

While at Mapzen, I created many <mark>prototypes</mark> to test the capacity of the codebase and guide further development. One of the most important characteristics of any map is its projection, which is the method the map uses to distort the features of a spherical Earth into a flat plane.

The vast majority of online maps are in the Mercator projection, which has a long history and many flaws. However, its simplicity and ubiquity have ensured a degree of technical lock-in, including its enshrinement into the actual data sources the engineering team created to produce custom maps.

Many other map projections are familiar to us in other contexts, including those known as the conic projections, seen by schoolchildren in the US for decades on classroom wall maps of the United States. However, conic projections are also flexible, and can be adapted to minimize distortion for any point on earth, including the poles.

Could a web map datasource be used to produce such a versatile, non-Mercator web map?

<div class="illustration">
  <div class="multiple">
    <div class="shadow">
      <div class="underlay">
        <img src="/assets/case-studies/albers1.jpg" alt='A map of North America' width='1000px'>
        <span class="label left">North American Conic Projection</span>
      </div>
    </div>
    <div class="overlayshadow">
      <div class="overlay">
        <img src="/assets/case-studies/albers2.jpg" alt='A map of Eurasia' width='1000px'>
        <span class="label right">Eurasian Conic Projection</span>
      </div>
    </div>
  </div>
</div>

<div>
<div class="emphasis"><label>The Design Insight:</label> A dynamic, interactive digital map can have dynamic, interactive projections.</div>
<div class="emphasis"><label>The Engineering Insight:</label> Modern graphics cards can create new maps from old, through real-time geometric transformations.</div>
</div>

To create this map projection demo, I used the ability of the Tangram mapping library to manipulate map data geometry directly, as though it were an animatable asset in a video game. Using custom vertex shaders, I "unprojected" a set of Mercator-based tiled vector data points to regular latitude and longitude coordinates, and then reprojected them in a conic projection.

As the map moves, the map's position is fed to a set of variables in the projection, adjusting it to minimize distortion at a given latitude. In this way the demo shows both the capacity of the projection and the <mark>unique capabilities</mark> of the team's technical offering, producing maps with less distortion.

Technology used:
<ul><li><a href="https://en.wikipedia.org/wiki/WebGL">WebGL</a> – a JavaScript API for rendering interactive 3D graphics</li><li><a href="">Tangram</a> web mapping library with custom <a href="https://en.wikipedia.org/wiki/Shader">shaders</a></li></ul>

<a class="external" href="http://meetar.github.io/albers/">Live demo:</a>

<script src="/assets/case-studies/case-studies.js">