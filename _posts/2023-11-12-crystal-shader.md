---
layout: page
title: Crystal Shader
subtitle: A 3D Trick
categories: 3d
published: false
excerpt: This post examines a variation on parallax mapping that I used for a recent project called <a href="/the-prototype-trap">The Gem Collector</a>, with detailed examinations of the rationale, the technique in the abstract, and its implementation in detail.
image: 'prototype.jpg'
imgalt: 'A closeup of a 3D rendered crystal'
---

Let's continue to look at the parallax mechanism, as implemented in the crystal shader in WebGL.

### The Problem of Occlusion

(If you're not familiar with shaders: when you see "fragment" you can think "pixel". There are cases when the two don't equate, but we don't get into that below.)

Making a texture appear to be on a different plane from the surface of an object is as simple as applying an offset to its position, similar to the CSS examples above. You can do this in the "fragment shader" part of a shader by adjusting the texture's UV coordinates by some factor, based on the view angle. (This kind of real-time UV manipulation is called "perturbation" which suggests that it bothers them, but they don't mind.)

Adjusting the UVs at different rates based on their brightness seems like it should be a relatively minor adjustment: you simply add a factor into the calculation based on the sampled texture value at that point, right? However, there's a wrinkle in this plan, which has to do with the way a fragment shader works, which is one pixel at a time, in order. An OpenGL fragment shader can't write to arbitrary pixel locations! So if you only have write access to the current pixel, and you want to replace its color with the color of another pixel, how do you know what color it should be?

The general idea is this: if you know which direction you want to push a pixel, that means for a given output pixel you know which direction <em>the source pixel is coming from</em>.



The real challenge here has to do with occlusion, which is something a standard parallax shader treats relatively differently – if your heightmap pixel is bright, then you pull things outward and ignore everything which might be behind it. In this way the surface remains solid.

However, for a transparent crystal with internal, possibly-occluding details, you have to handle it differently.

We can get the direction that a given pixel would move thanks to the surface normal and the view angle, and we can get the pixel value of the heightmap, but what if there are other pixels in the way? What should we do with them?

The crystal shader looks for all possible matches along the perturbation vector, and takes the brightest. This is equivalent to the "lightest" blending mode in WebGL. Other blend modes are possible, but this is the method I used here.



When applying a bitmap to a 3D face, a fragment shader performs a "texture lookup" using the UV coordinate provided by the vertex shader. In the simplest case, you could imagine that the 


The shader consists of a <em>vertex shader</em>, to set vertex attributes including position, and a <em>fragment shader</em>, which is responsible for writing visible pixels. The catch here is that some of the information needed by the fragment shader isn't directly accessible in that context, and must be calculated in the vertex shader first. Then is can be passed along by special shader variables called 'varyings.'

### The Vertex Shader

Most of this is fairly standard boilerplate for shaders which perform normal mapping. 

```glsl
  // define varyings, which allow information to be passed to the fragment shader
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    // set uv varying
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    // set viewPosition varying – this is the position in view space
    vViewPosition = mvPosition.xyz;

    // calculate normal in view space and set normal varying
    vNormal = normalize(normalMatrix * normal);

    // set vertex positions
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
```

The `vViewPosition` and `vNormal` calculations convert the position and normal vectors into view space, which is crucial for this effect – we must know the relationship of these vectors to the view in order to move the textures in the right direction and by the right amount.

### The Fragment Shader

The fragment shader performs a number of steps, all in service of "pushing" pixels in the texture some distance behind the face they're painted on. Bear in mind that these steps are performed for each pixel in the output, every frame. GPUs are amazing!

Let's look at an outline first, then we'll dig into each step:

1. Initialize parameters

2. Calculate the offset direction

3. Loop through the texture in the offset direction

4. Find a matching pixel based on the heightmap

5. Set output color

#### Step 1: Initialize Everything

This is accomplished by making changes ("perturbations") to the UV coordinates for each pixel.

The fragment shader references a heightmap to know how far away to look.

# View Source

This project is open-source! The relevant repos are here:

https://github.com/meetar/FS-reverse-parallax-plain/blob/main/public/parallax.frag

---

<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax/"></iframe>
</div>

<script src="assets/crystal-shader/demo.js"></script>

