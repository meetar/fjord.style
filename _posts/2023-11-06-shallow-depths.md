---
layout: page
title: Going Into Depth
subtitle: A 3D Trick
categories: 3d
published: true
excerpt: This post examines a variation on parallax mapping that I used for a recent project called <a href="/the-prototype-trap">The Gem Collector</a>, with detailed examinations of the rationale, the technique in the abstract, and its implementation in detail.
image: 'prototype.jpg'
imgalt: 'A closeup of a 3D rendered crystal'
---

<link rel="stylesheet" href="assets/crystal-shader/demo.css">

<!-- 
Let's try something new! Mix and match your own adventure:

<button>Child</button> <button>Artist</button> <button>Coder</button> <button>Specialist</button>

---
-->

<div class="aside">This post examines a variation on parallax mapping that I used for <a href="/the-prototype-trap">a recent project</a>, with detailed examinations of the rationale, the technique in the abstract, and its implementation in detail.</div>

# Looking Past the Surface

3D objects are typically defined as surfaces only, but are rendered with solid textures to appear solid. (If you've ever clipped through a wall in a video game, this shameful secret has already been revealed to you.) Textures can add the appearance of detail, and sometimes of layers and transparency, but they are still just a coat of paint on the exterior.

Advanced rendering techniques like volumetric rendering, sub-surface scattering, and photon tracing can suggest hidden depths, make objects appear as foggy or cloudy volumes, or sometimes as groups of particles, but without a lot of work the objects are still just hollow.

The world is made of solids, each with their own inner lives – full of nooks and crannies, cracks and dings, secret layers and imperfections. Light gets in, bounces and bends, and takes many paths on its way back out. I wanted to see more of this, and I had an idea.

So I made a magic brush that paints inside of things! I made it, specifically, to add sparkles to crystals. Here's a simplified example:

<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax-plain/"></iframe>
</div>

This 3D crystal uses shader math to manipulate textures on an object's surface, based on the view angle and a heightmap. This makes certain parts of the texture appear to be closer to or further from the face of the object, suggesting internal structures which would otherwise require a much more detailed mesh or complex shaders to render.

# Perspective Shift

This trick is entirely based on the <mark>parallax effect</mark>, which makes distant objects appear to move more slowly. This effect is especially noticeable when looking out of the side windows of a moving vehicle at a distant landscape, or while playing certain retro pixel-art video games. Fundamentally, it's very a simple effect – you can even fake it in CSS! Move your cursor over the box below:

<div id="scrollContainer" class="container">
  <div id="scrollDiv" class="box"></div>
</div>

This box appears to be a window to a separate, more-distant starry layer, which is really just a repeating <code>background-image</code> on the moving div. The background position is being changed in <mark>linear proportion</mark> to the div's position, but more slowly. This relationship creates the parallax effect.

<code>div.style.backgroundPositionX = - div.getBoundingClientRect().left/2 + 'px';</code>

This effect can also work during rotation, which can also be simulated in CSS:

<div id="rotateContainer" class="container">
  <div id="rotateDiv" class="box"></div>
</div>

In the example above, the background position is moved relative to <mark>the tangent</mark> of the div's rotation. This approximates the relationship between rotating layers of different distance from the viewer.

<code>div.style.backgroundPositionX = - Math.tan(divRotationInRadians)/2 + 'px';</code>

If you can imagine this window as a face in a 3D mesh, this is the basis for the crystal shader. Here's one more CSS prototype, using separate divs for faces of a cube, and applying 3D rotation transforms:

<div id="cubeContainer" class="container">
  <div id="cube" class="cubeDiv">
    <div class="face front"></div>
    <div class="face left"></div>
    <div class="face right"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
</div>

The net effect is something like refraction, as though it were a solid cube of glass in front of a distant star field.

However, to add detail <em>inside</em> the shape using the parallax effect, we have to simulate a parallax effect between individual stars. This will give our eyes a clue about each star's position relative to the face of the object.

I chose a simple method using an image as both heightmap and texture map. In other words, information from the same bitmap is used for both color and displacement. More complex implementations could use separate textures, but this one suits our purposes.

Here's a simple example using canvas elements to do the brightness filtering, and CSS transformations to simulate the parallax:

<div id="cheeseContainer"></div>

But to do this on a 3D object, we'll need something more powerful than CSS.

# Shader Version

The crystals shown at the top are drawn in a <code>canvas</code> element using another built-in browser feature called WebGL, which provides a shortcut to the graphics-drawing power of your GPU.

In fact, this example uses a whole stack of shortcuts, in the form of three libraries called <a href="http://threejs.org">three.js</a>, <a href="https://github.com/pmndrs/react-three-fiber">react-three-fiber</a>, and <a href="https://github.com/pmndrs/drei">drei</a>, all wrapped in another set of shortcuts called <a href="">React</a>. It's a slightly convoluted stack, with lots of upsides and downsides, but for this simple crystal demo it works well enough.

<div id="diagram-container" class="container"></div>

<div class="infobox aside">
<span class="infoboxLabel">?</span>
<span class="infoboxContent">
To learn more about this stack: <a href="/the-prototype-trap">The Prototype Trap</a>.<br>
To learn more about shaders: <a href="https://thebookofshaders.com/">The Book of Shaders</a>.
</span>
</div>

But for now, let's continue to look at the parallax mechanism, as implemented in a shader.

---

A parallax shader does something similar to the last example, with brighter values pushed outward, away from the face. 



This is accomplished by making changes ("perturbations") to the UV coordinates for each pixel.

The fragment shader references a heightmap to know how far away to look.

---

<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax/"></iframe>
</div>

<script src="assets/crystal-shader/demo.js"></script>

