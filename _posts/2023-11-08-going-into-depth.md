---
layout: post
title: Going Into Depth
categories: 3d
published: true
excerpt: This post describes a variation on parallax mapping that I used for a recent project, with detailed examinations of the rationale and a breakdown of the technique in the abstract.
image: 'speckles.gif'
imgalt: 'A closeup of a 3D rendered crystal'
---

<link rel="stylesheet" href="assets/going-into-depth/demo.css">

<div class="aside">This post describes a variation on parallax mapping that I used for <a href="/the-prototype-trap">a recent project</a>, with detailed examinations of the rationale and a breakdown of the technique in the abstract.</div>

<br>

Most 3D objects rendered by computers are defined as hollow shells, a collection of zero-thickness surfaces, describing empty volumes. But the world is full of solids, each with its own inner life of nooks and crannies, cracks and dings, secret layers, bubbles, inclusions, and imperfections.

So I made a magic brush that paints inside of things! I made it, specifically, to add sparkles to crystals. Here's a stripped-down example:


<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax-plain/"></iframe>
<div class="aside">[<a href="https://github.com/meetar/FS-reverse-parallax-plain/">github</a>]</div>
</div>

This crystal has no internal details, and is not performing any ray-tracing or fancy lightbending math. It's drawn with a shader that covers it with a texture made of a single image, then manipulates the texture based on the view angle. The result is that certain parts of the texture appear to be more distant than the faces they're applied to, suggesting internal structures which would otherwise require a much more detailed mesh to render.

(For an introduction to shaders, I recommend <a href="http://thebookofshaders.com">The Book of Shaders</a>.)

Let's break down the effect.

# Perspective Shift

This trick is entirely based on the <em>parallax effect</em>, which makes distant objects appear to move more slowly. Conceptually, it's a very simple idea – you can even fake it in CSS! Drag the box below:

<div id="scrollContainer" class="container">
  <div id="scrollDiv" class="box"></div>
</div>

This box appears to be a window to a separate, more-distant starry layer, which is really just a repeating <code>background-image</code> on the moving div. The background position is being changed in <em>linear proportion</em> to the div's position, but more slowly. This relationship creates the parallax effect. Here's the line of JavaScript that sets the relevant css properties for the example:

<code>div.style.backgroundPositionX = - div.getBoundingClientRect().left/2 + 'px';</code>

The `-` sign shows that the background is being moved in the <em>opposite direction</em> of the div, as otherwise the background would inherit the div's motion. The result is that the opposing motion adds a bit of "drag". The `/2` sets the rate of the background's motion to half the rate of the div itself, which suggests distance.

This effect also works during rotation, which can also be simulated in CSS. Drag this box to see it in action:

<div id="rotateContainer" class="container">
  <div id="rotateDiv" class="box"></div>
</div>

In the example above, the background position is moved relative to <em>the tangent</em> of the div's rotation. This approximates the relationship between rotating layers of different distance from the viewer.

<code>div.style.backgroundPositionX = - Math.tan(divRotationInRadians)/2 + 'px';</code>

If you can imagine the rotating div above as a face in a 3D mesh, this is the basic principle of the crystal shader. Here's one more CSS prototype, using multiple copies of the last example as faces of a cube, and applying 3D transforms:

<div id="cubeContainer" class="container">
  <div id="cube" class="cubeDiv">
    <div class="face front"></div>
    <div class="face left"></div>
    <div class="face right"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
</div>

The net effect is something like refraction, as though the object were a solid cube of glass in front of a distant star field.

# Turning up the Volume

However, to add the illusion of <em>volume</em> to the shape, we have to provide depth cues at various distances. To do this, we can simulate a parallax effect between individual stars.

Here's a simple example using canvas elements to split the image up into layers of constant brightness, and CSS transformations to simulate the parallax between layers, with one important difference from the crystal's method: brighter pixels appear to be pulled <em>towards</em> the viewer.

<div id="cheeseContainer" class="container"></div>

This is similar to the standard behavior of <em>parallax shaders</em>, a class of shaders used to add the illusion of depth to a surface. Generally, they assume a continuous, opaque surface, and are used to add small amounts of subtle <em>protruding</em> detail to an otherwise flat face – bricks and cobblestones are a very common use case.

We're looking for something slightly different, but most of the same principles apply. In fact, you could describe the crystal shader as a parallax shader turned inside out:

<div id="cheeseContainerReverse" class="container"></div>

You'll notice that in the previous examples, "closer" layers occlude "further" layers. This order is simply determined by painting order, which in CSS is determined by `z-index`. Occlusion could be useful in certain cases, but when dealing with sparkly crystals, you want to maximize the sparkle levels, and minimize any apparent occlusion.

To achieve this the crystal shader uses a technique which equates to a "lighten" blending mode in a layer-based image editor like Photoshop. This is done in CSS with `mix-blend-mode: lighten`, and the result is that where pixels overlap, the lightest pixel is shown. (For the full effect we'll need to ensure that the background is darker than the foreground.)

<div id="cheeseContainerLighten" class="container"></div>

This is the essence of the technique! It's relatively simple to do this on a flat plane, but to do this on an arbitrary 3D object, we'll need something more powerful than CSS, capable of slightly more intense math.

In the next post, we'll walk through the building blocks of the shader implementation, and then we'll dig into the shader code itself.

Until then, enjoy a shiny purple gem. Thanks for reading!

<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax"></iframe>
</div>


<script src="assets/going-into-depth/demo.js"></script>

