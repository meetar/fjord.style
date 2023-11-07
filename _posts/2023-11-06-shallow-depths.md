---
layout: page
title: Shallow Depths
categories: 3d
published: true
excerpt:
image: 'prototype.jpg'
imgalt: 'A closeup of a 3D rendered crystal'
---

<style>
.container {
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  border: 3px solid #6c6;
  border-radius: 5px;
  height: 100px;
  width: 100px;
  position: absolute;
  background-image: url('img/speckles.png');
  background-size: 130%;
}

.cubeContainer {
  /* height: 200px; */
  /* width: 200px; */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 500px;
}

.cubeDiv {
  /* width: 100%; */
  /* height: 100%; */
  position: relative;
  transform-style: preserve-3d;
  transform: translateX(-50px) translateY(-25px);
}

.face {
  position: absolute;
  height: 100px;
  width: 100px;
  background: #6c6 url('img/speckles.png') center center;
  background-size: 130%;
  /* border: 3px solid #6c6; */
  border-radius: 5px;
  box-sizing: border-box;
}

.front  { transform: translateZ(50px); }
.back   { transform: rotateY(180deg) translateZ(50px); }
.left   { transform: rotateY(-90deg) translateZ(50px); }
.right  { transform: rotateY(90deg) translateZ(50px); }
.top    { transform: rotateX(90deg) translateZ(50px); }
.bottom { transform: rotateX(-90deg) translateZ(50px); }

</style>


Let's try something new! Mix and match your own adventure:

<button>Child</button> <button>Artist</button> <button>Coder</button> <button>Specialist</button>

---

I made a magic brush that paints inside of things! I made it so I can hide sparkles in crystals.

This is a 3D trick that moves textures around on an object's surface based on the view angle. This makes the texture appear to be at a different distance from the view.

This works due to the <mark>parallax effect</mark>, which makes distant objects appear to move more slowly. It's especially noticeable when looking out of the side windows of a moving vehicle, or while playing a pixel-art video game. You can even fake it in CSS! Move your cursor over the box below:

<div id="scrollContainer" class="container">
  <div id="scrollDiv" class="box"></div>
</div>

This window appears to reveal a separate, more-distant starry layer. This layer is just a repeating <code>background-image</code> on the moving div, but its position is being moved more slowly than the div, but in <mark>linear proportion</mark> to the div's position. This relationship creates the parallax effect.

This effect can also work during rotation, which can also be simulated in CSS:

<div id="rotateContainer" class="container">
  <div id="rotateDiv" class="box"></div>
</div>

In the example above, the background position is moved relative to <mark>the tangent</mark> of the div's rotation. This approximates the relationship between rotating layers of different distance from the viewer.

If you can imagine this window as a face in a 3D mesh, this is the basis for the crystal shader. Here's a CSS prototype:

<div id="cubeContainer" class="container">
  <div id="cube" class="cubeDiv">
    <div class="face front"></div>
    <div class="face left"></div>
    <div class="face right"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
</div>

---

The crystals are drawn in your browser inside a <mark>canvas</mark> element. This is a special html5 element that lets you manipulate pixels directly.

---

The <code>canvas</code> element has a
This is accomplished by making changes ("perturbations") to the UV coordinates for each pixel.

The fragment shader references a heightmap to know how far away to look.

---

<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax/"></iframe>
</div>

<script src="assets/crystal-shader/demo.js"></script>

