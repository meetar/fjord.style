---
layout: page
title: Crystal Shader
subtitle: A 3D Trick
categories: 3d
published: true
excerpt: Part II.
image: 'prototype.jpg'
imgalt: 'A closeup of a 3D rendered crystal'
---

<aside>This is a continuation of <a href="/going-into-depth">the previous post</a>, examining the mechanism of a parallax shader in WebGL.</aside>
<br>

### The Problem of Occlusion

Firstly, if you're not familiar with shaders, a typical shader setup requires a "vertex shader" which handles geometry and layout, and a "fragment shader" which determines what color things should be. And in general, when you see "fragment" you can think "pixel". There are cases when the two don't equate, but we won't get into that below.

As we saw in the last post, making a texture appear to be on a different plane from the surface of an object is as simple as applying an offset to its position, which varies somehow with the position or rotation of the surface. You can do this in a "fragment shader" by adjusting the texture's UV coordinates by some factor based on the view angle. (This kind of real-time UV manipulation is called "perturbation" which suggests that it bothers them, but they don't mind.)

Perturbing UVs is easy enough, but how do you know which direction to perturb? Sadly, this requires math.

In a CSS demo, moving a background-image in a div, a lot of this math is handled for you, because the view angle is constant and the transformations are always relative to their parent. But in a shader, none of this is taken for granted.

relationship between object space, view space, and tangent space

To get the math right, you have to get your conceptual spaces right. In this case, there are three we need to consider: view space, world space, and tangent space. Don't freak out! The concepts are simple, but the names are weird. Check it out:

Which way is up, according to the view? Easy:

Now, which way is up, according to the 3D space? This is slightly trickier, because of perspective. In the center of the view, it matches the view space:

But off to one side, it's tilted relative to the view:

Okay, so much for perspective. Now: which way is up, relative to the surface of the object?

This is probably the trickiest conceptual leap to make in the whole shader. Any way could be up, and it often is! In truth, it's arbitrary. Generally, this kind of orientation is the realm of "UV mapping" and is often set by artists when deciding how textures should be applied to an object.

For some objects, the decision seems fairly easy:

square

But for others, it's a matter of interpretation:

complex shape

In an ideal world we could ignore the decisions of mere artists, and use the orientation of the object in the world to determine which was was up. However, this particular shader relies on textures to function, so it must play by the rules of texturing.

# Finding the Perpendicular

Let's look at some simple cases to understand the parameters of this problem.

In this case, which way is "in"?

"In" is the opposite of the surface normal. The surface normal is a geometric and mathematical term for "out". (It's from the Latin "normalis" which means "perpendicular.")

So in general, we want to make pixels appear to have been moved "in."

# Pixel Myopia

Adjusting the UVs at different rates based on their brightness seems like it should be a relatively minor adjustment: you simply add a factor into the calculation based on the sampled texture value at that point, right? However, there's a wrinkle in this plan, which has to do with the way a fragment shader works, which is one pixel at a time, in order. An OpenGL fragment shader can't write to arbitrary pixel locations! So if you only have write access to the current pixel, and you want to replace its color with the color of another pixel, how do you know what color it should be?

The general idea is this: if you know which direction you want to push a pixel, that means for a given output pixel you know which direction <em>the source pixel is coming from</em>.

So all you need to do is find the pixel which should be in the current location.

But there's another wrinkle! (This is a very wrinkly problem.) The pixel which <em>should</em> be in the current location could come from... lots of places! All we know is the direction it should come from. But there might be lots of pixels in that direction. Which one is it?

# Multiple Choice

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

