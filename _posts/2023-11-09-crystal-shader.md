---
layout: page
title: Parallax Shift
subtitle: A 3D Trick
categories: 3d
published: true
excerpt: Part II.
image: 'prototype.jpg'
imgalt: 'A closeup of a 3D rendered crystal'
---

<aside>This is a continuation of <a href="/going-into-depth">Going Into Depth</a>, examining the mechanism of a parallax shader in WebGL.</aside>
<br>

# The Problem of Occlusion

Firstly, if you're not familiar with [shaders](https://thebookofshaders.com/01/), a typical shader setup requires a "vertex shader" which handles geometry and layout, and a "fragment shader" which determines what color things should be. In general, when you see "fragment" you can think "pixel". There are cases when the two don't equate, but we won't get into that below.

As we saw in the last post, making a texture appear to be on a different plane from the surface of an object is as simple as applying an offset to the texture's position, which varies somehow with the position or rotation of the surface. You can do this in a fragment shader by adjusting the texture's [UV coordinates](https://en.wikipedia.org/wiki/UV_mapping) based on the view angle. (This kind of real-time UV manipulation is called "perturbation" which suggests that it bothers them, but in my experience they don't seem to mind.)

Perturbing UVs is easy enough, but how do you know which direction to perturb? Sadly, this requires math.

When moving a background-image in a div with CSS, much of this math is handled for you or unnecessary, because the view angle is constant relative to the scene and the transformations are always relative to their parent. But in a shader, none of this is taken for granted.

# There Are Four Spaces

To get the math right, you have to get your conceptual spaces in order. In this case, there are four[*](#chill) we need to consider: view space, world space, object space, and tangent space. Don't freak out! The names are weird, but the concepts are simple. Check it out:

Which way is up, according to the view? This one's easy, because the view is the camera, and cameras have a built-in "up". No matter which way the camera points or how it's rotated, "up" is the same direction relative to the image.

<img src="/assets/parallax-shift/viewspace.png" height="200px"/>

<img src="/assets/parallax-shift/viewspace_r.jpg" height="200px"/>

Now, which way is up according to the world, as seen through the view? This is slightly trickier, because of perspective. In the center of the view, world-space "up" matches view-space "up" (assuming the camera isn't tilted). But off to one side, "up" can be angled relative to the view, due to perspective.

<img src="/assets/parallax-shift/worldspace.png" height="200px" />

Now: which way is up, relative to the object? This one's easy again, as objects are defined with an internal "up."

<img src="/assets/parallax-shift/objectspace.png" height="200px" />

<img src="/assets/parallax-shift/objectspace_r.jpg" height="200px" />

Okay, so much for perspective. Now the hard one one: which way is up, relative to the surface of the object?

<img src="/assets/parallax-shift/tangentspace.png" height="200px" />

Any way could be up! It's arbitrary. What's more, it varies *across the object* and is in fact defined separately or each face. It can even be changed at runtime! This is probably the trickiest conceptual leap to make in the whole shader, and is the main reason our shader math is tricky. 

The abstract space in which all those arrows point the same direction is known as "tangent space," and is the realm of [UV mapping](https://en.wikipedia.org/wiki/UV_mapping). When an object is "UV mapped," its vertices are assigned a new set of coordinates, called U and V. The vertices of the object are often "unwrapped" in order to flatten them into a plane while maintaining as much of their relative position as possible – this allows each face of the object to be assigned a unique point in this "UV space".

Once this is done, the UV coordinates may be repositioned, and the relationship between the UVs and their partner vertices determines how and where textures should be applied to an object. This allows a texture to be positioned, repositioned, scaled, rotated, flipped, repeated, and even distorted over the surface of the object. This is good.

For simpler objects, the decision of where to put UVs seems comparatively easy. But for others, it's a matter of interpretation:

<img src="/assets/parallax-shift/UVmaps.jpg" height="300px" />

Finally, once all of that is done, a texture lookup can be performed. But which pixel exactly? That is determined by all of the above factors, in a chained process that looks like this:

input pixel → UV map → object space → world space → view space → output pixel

Our shader relies on selective manipulation of the UV coordinates for each point on the surface of an object. In a way, it's replacing the typical function of the "UV map" step above. That means it needs to take all four spaces plus the UV coordinates into account when performing its calculations.

# Finding the Perpendicular

The primary function of the shader, speaking technically, is to wiggle some pixels around. The trick is in determining which way, and by how much. Let's look at some simple cases to understand the parameters of this problem.

We want to move surface texture pixels to make it look like they are "further in" to an object. In the case of the highlighted face below, which way is "in"?

<img src="/assets/parallax-shift/normalsphere.jpg" height="300px" />

Luckily, there's a term for that. The "in" direction is the inverse of the surface <em>normal</em>, which is a geometric and mathematical term for "perpendicular." It's determined by the position of the vertices which make up a given face. Here, I'll make all the face normals visible and draw our "in" vector in green.

<img src="/assets/parallax-shift/normalsphere_normals.jpg" height="300px" />

Note that this direction is the "in" <em>as seen through the view</em>. If you were to draw that line on the face and then look at it directly, it might look like this:

<img src="/assets/parallax-shift/face_normal.jpg" height="300px" />

Not the same direction! And it changes as the view and the object move. Or at least it should.

To restate: our task is to find a pixel in a texture, and make it appear to have been moved "in" by some amount (determined by pixel brightness) and in some direction (depending on the angle of the surface relative to the view). So this requires taking information about the view angle, the world "up" angle, the object's "up" angle, and the surface normal, and performing a calculation to tell us which direction to fetch a pixel from and which direction to move it.

This is pretty easy for a human. We have a whole chunk of hindbrain for exactly this kind of thing. Let's back up a bit, step through the process, and break down exactly what it is we're doing.

[card with square and two arrows]

Here's a card, rotated slightly, with a square painted on it. The green arrow is "out" and the red arrow is "in." If we wanted to make the square appear to move in the direction of the red arrow in texture space, where would it go?

Now let's view the card **in texture space** and take another look. The square would move up and to the left a bit. Not so bad! Math can do this!

# Shader Magic

It's not magic. It's just arcane, and annoying. We know all the steps now, the trick is coaxing the machine to do this for us.

Vertex shaders handle the position of objects, by computing and positioning each vertex, one at a time. Our 3d library (three.js) automagically supplies vertex shaders with all kinds of info about those objects they need to do this job, like uv coordinates and transformation matrices. Fragment shaders don't normally know anything about this stuff, they just paint pretty pictures. However! The vertex shader can pass this kind of information to the fragment shader, like passing notes in class, through special variables called "varyings," and we'll need to do that for our shader.

First, let's walk through the vertex shader. These lines initialize the varyings but don't set them:

```glsl
  varying vec3 vNormal; // the normal vector of the vertex
  varying vec2 vUv; // the uv coordinate of the vertex
  varying vec3 vViewPosition;  // the vertex position in view space
```

Next is the `main()` function, which we have to declare explicitly because GLSL was made by C nerds, who love this kind of thing. Whatever, it's better than assembly.

```glsl
  void main() {
    // set uv varying
    vUv = uv;

    // set viewPosition varying
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); 
    vViewPosition = mvPosition.xyz; 

    // calculate and set normal varying
    vNormal = normalize(normalMatrix * normal);

    // set vertex positions
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  ```

A number of these terms are magic words which are either supplied to or expected from the vertex shader. The matrices are essentially 

- `uv` : the uv coordinates of the current vertex
- `normalMatrix` : makes sure the normals stay normal when the object is transformed
- `modelViewMatrix` : a combination of object space and view space, used to produce world space coordinates
- `projectionMatrix` : used to transform world space coordinates to view space
- `gl_Position` : the computed position of the current vertex, in another secret space called 'clip space' but don't worry about that, it's basically the portion of view space seen in the screen

The fragment shader only needs those first two.

# Math

I'll make this quick. In fact I'll make this entirely optional. Click the "expand" button if you really want to see what's happening in the shader.

If you're really excited about how it all connects, here's a link to the shader in the repo:

fragment shader
vertex shader

# Pixel Myopia

Now for the real kicker. Adjusting UVs at different rates based on their brightness seems like it should be a relatively minor adjustment: you simply add a factor into the calculation based on the sampled texture value at that point, right? However, there's a wrinkle in this plan, which has to do with the way a fragment shader works, which is one pixel at a time, in order. An OpenGL fragment shader can't write to arbitrary pixel locations! So if you only have write access to the current pixel, and you want to replace its color with the color of another pixel, how do you know what color it should be?

The general idea is this: if you know which direction you want to push a pixel, that means for a given output pixel you know which direction <em>the source pixel is coming from</em>.

So all you need to do is find the pixel which should be in the current location.

But there's another wrinkle! (This is a very wrinkly problem.) The pixel which <em>should</em> be in the current location could come from... lots of places! All we know is the direction it should come from. But there might be lots of pixels in that direction. Which one is it?

# Multiple Choice

The last challenge here has to do with occlusion, which is something a standard parallax shader treats relatively differently – if your heightmap pixel is bright, then you pull things outward and ignore everything which might be behind it. In this way the surface remains solid.

However, for a transparent crystal with internal, possibly-occluding details, you have to handle it differently.

We can get the direction that a given pixel would move thanks to the surface normal and the view angle, and we can get the pixel value of the heightmap, but what if there are other pixels in the way? What should we do with them?

The crystal shader looks for all possible matches along the perturbation vector, and takes the brightest. This is equivalent to the "lightest" blending mode in WebGL. Other blend modes are possible, but this is the method I used here. (This was the last CSS demo in the previous post.)

# Shader Time

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

<https://github.com/meetar/FS-reverse-parallax-plain/blob/main/public/parallax.frag>

<p>
<a name="chill">* It's more complicated than that</a>
</p>
---

<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax/"></iframe>
</div>

<script src="assets/crystal-shader/demo.js"></script>

