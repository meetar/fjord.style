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

I made a magic brush that paints inside of things! I made it so I can hide sparkles in crystals. This is very important to my career.

This is a 3D trick that moves textures around on an object's surface based on the view angle. This makes the texture appear to be at a different distance from the view. A basic version would look something like this:

- simple one-layer view change

This works due to the <mark>parallax effect</mark>, which you've seen if you've ever looked out the window of a moving vehicle, or played a pixel-art video game. You can even fake it in CSS!

<div id="scrollContainer" class="container">
  <div id="scrollDiv" class="box"></div>
</div>

The parallax effect also works during rotation, which can also be simulated in CSS:

<div id="rotateContainer" class="container">
  <div id="rotateDiv" class="box"></div>
</div>

And if you imagine this window as a face in a 3D mesh, this is the basis for the crystal shader. It's not perfect, but it's good enough for my purposes. Here's a CSS prototype:

<div id="cubeContainer" class="container">
  <div id="cube" class="cubeDiv">
    <div class="face front"></div>
    <div class="face back"></div>
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

<script>
let constrain = 5;
let scrollDiv = document.getElementById("scrollDiv");
let rotateDiv = document.getElementById("rotateDiv");

function parallaxRotate(x) {
  let bbox = rotateDiv.getBoundingClientRect();
  let rotateY = (x - bbox.x - (bbox.width / 2)) / constrain;
  rotateY = Math.max(rotateY, -75);
  rotateY = Math.min(rotateY, 75);
  
  // 10000px approximates a very long lens
  rotateDiv.style.transform  = "perspective(10000px) "
    + "   rotateX("+ -10 +"deg) "
    + "   rotateY("+ rotateY +"deg) "
  
  // prevent the background offset from being calculated if the frame is at its limit
  if (Math.abs(rotateY) == 75) return;
    
  // calculate tangent of the angle in radians
  const angleInRadians = (rotateY * Math.PI) / 180;
  const tanAngle = Math.tan(angleInRadians);
  // offset background position by the tangent times an arbitrary multiplier
  const bgoffset = -tanAngle * 50;

  // apply new background image position to xoffset only
  rotateDiv.style.backgroundPosition = bgoffset + 'px 0px';
}

function parallaxScroll(x) {
  let bbox = scrollDiv.getBoundingClientRect();
  scrollDiv.style.left  = `calc(${x}px - ${bbox.width/2}px)`;  
  scrollDiv.style.backgroundPosition = - x/2 + 'px 0px';
}

document.getElementById("rotateContainer").addEventListener('mousemove', e => {
  window.requestAnimationFrame(() => {
    parallaxRotate(e.clientX);
  });
});

document.getElementById("scrollContainer").addEventListener('mousemove', e => {
  window.requestAnimationFrame(() => {
    parallaxScroll(e.clientX);
  });
});

document.addEventListener('mousemove', e => {
  window.requestAnimationFrame(() => {
    updateCubeRotation(e)
  });
});

const cube = document.getElementById('cube');

// Update the transform property of the cube and the background position for parallax effect
function updateCubeRotation(event) {
  const { clientX, clientY } = event;
  const { left, top, width, height } = cube.getBoundingClientRect();

  const center = {
    x: left + width / 2 + 50, // 50 to center the cube in its parent
    y: top + height / 2,
  };

  const deltaX = clientX - center.x;
  const deltaY = clientY - center.y;

  // Adjust these values to control the rotation sensitivity
  const rotateY = deltaX * 0.1;
  const rotateX = deltaY * -0.1;

  const transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(-50px) translateY(-25px)`; // translate to center the cube
  cube.style.transform = transform;

  // Get all cube faces and update background position
  const faces = cube.querySelectorAll('.face');
  faces.forEach(face => {
    let bgPosX = -rotateY;
    let bgPosY = rotateX;
    face.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  });
}

</script>
