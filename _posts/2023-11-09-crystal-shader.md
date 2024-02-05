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

<aside>This is a continuation of <a href="/going-into-depth">Going Into Depth</a>, examining the construction of a custom parallax shader in WebGL. There will be math, but also pictures, and isn't that the best case scenario?</aside>

# Mind Games

Making a texture appear to be on a different plane from the surface of an object is as simple as applying an offset to the texture's position which varies with the position or rotation of the surface. This creates a parallax effect *in your mind*.

You can achieve this in a shader by adjusting the texture's [UV coordinates](https://en.wikipedia.org/wiki/UV_mapping) based on the view angle. (This kind of real-time UV manipulation is called "perturbation" which suggests that it bothers them, but in my experience they don't mind.)

Perturbing UVs is easy enough, but how do you know in which direction to perturb? Sadly, this requires math.

When moving a background-image in a div with CSS, much of this math is either automatic or unnecessary, because the view angle is constant relative to the scene and the transformations are always relative to their parent. But in a shader in a 3D scene, none of this is taken for granted.

# There Are Four Spaces

To get the math right, you have to get your conceptual spaces in order. In this case, there are four[*](#its-more-complicated-than-that) we need to consider: view space, world space, object space, and tangent space. Don't freak out! The names are weird, but the concepts are simple. Each conceptual "space" is just a frame of reference with its own "up," "right," and "in," otherwise known as the "X," "Y," and "Z" axes.

An example: Which way is up in the images below, according to the view? This one's easy, because the view is through a 3D camera, and cameras have a built-in "up". No matter which way the camera points or how it's rotated, "up" is the same direction relative to the camera. *View space* is the conceptual space (aka a coordinate system) in which this is true.

<img src="/assets/parallax-shift/viewspace.png" height="200px"/>

Now, which way is up in *world space*, as seen through the view? This is slightly trickier, because of perspective. In the center of the view, world-space "up" matches view-space "up" (assuming the camera isn't tilted). But off to one side, "up" can be angled relative to the view, due to perspective.

<img src="/assets/parallax-shift/worldspace.png" height="200px" />

Now: which way is up, relative to the object? This one's easy again, as objects are defined with an internal "up." However, the actual orientation of the arrows on your screen is also affected by world space and view space, as the object is situated in both.

<img src="/assets/parallax-shift/objectspace.png" height="200px" />

Now the tricky one: which way is up, relative to the surface of the object?

<img src="/assets/parallax-shift/tangentspace.png" height="200px" />

Any way could be up! It's arbitrary. What's more, it varies *across the object* and is in fact defined separately for each vertex, and can vary across a face. It can even be changed at runtime, by rotating the vertices independently of the object! This is probably the trickiest conceptual leap to make, and is the main reason the math in this shader is tricky. 

The abstract space in which all those arrows point the same direction is known as "tangent space" and is defined locally for each point on an object's surface. It's closely related to the realm of [UV mapping](https://en.wikipedia.org/wiki/UV_mapping), which relates textures to faces. When an object is "UV mapped," its vertices are assigned a new set of coordinates, called U and V, and these describe a contiguous space in which a texture can be mapped onto the faces of the object. Tangent space covers the same domain, and is determined by the UV layout of the face, but contains a bonus "in" direction, which is what our shader needs to function.

When UV mapping, objects are often "unwrapped" in an intermediate step in order to flatten them into a plane, while maintaining as much of their relative position as possible – this allows each face of the object to be assigned a unique point in this "UV space".

Unwrapping is an art unto itself, and if you've ever flattened a cardboard box or tried to lay an orange peel flat, you have some appreciation of the nuances involved. There's no one "right" way to do it, because it depends on the needs particular to every situation. Here's an unwrapped cube viewed in a UV-editing interface:

<img src="/assets/parallax-shift/unwrapped.jpg" height="200px" />

Once this is done, the relationship between the UVs and their partner vertices determines how and where textures should be applied to an object. The UV coordinates may even be modified, which allows a texture to be positioned, repositioned, scaled, rotated, flipped, repeated, and even distorted over the surface of the object.

For simpler objects, the decision of where to put UVs seems comparatively easy. But for others, it's a matter of interpretation:

<img src="/assets/parallax-shift/UVmaps.jpg" height="300px" />

Finally, once UVs are handled, a texture lookup can be performed, to pull the right pixel from the input texture. But which pixel is that exactly? That is determined by all of the above factors, in a chained process that looks like this:

texture → UV map → object space → world space → view space → output pixel

Most of these steps are not necessary in the average shader, because default 3D pipelines assume all of this. However, our shader relies on selective manipulation of the UV coordinates for each point on the surface of an object. In a way, it's replacing the typical function of the "UV map" step above. That means it needs to take all four spaces plus the UV coordinates into account when performing its calculations.

# Finding the Perpendicular

The primary function of the shader, speaking technically, is to wiggle some pixels around. The trick is in determining which way, and by how much. Let's look at some simple cases to understand the parameters of this problem.

The card below has been rotated at an angle in 3D. On it are two grey squares. The red arrow is the surface's "out" direction, also known as the normal, and the green arrow is the "in" direction. The grey square on the left looks further "in" from the surface of card, as though it had been pushed along the green direction.

<img src="/assets/parallax-shift/card.jpg" height="200px" />

Now let's turn the card to face us, so we're seeing it *in texture space*.

<img src="/assets/parallax-shift/card-skewed.jpg" height="180px" />

From the texture's point of view, the "in" vector is slightly up and to the left. However, if any of the pieces of our puzzle change, so will that vector.

# Tunnel Vision

Now for the real kicker. We want to move the pixels based on their brightness, to give our shader differing levels of faux depth. This seems like it should be a relatively minor adjustment: you simply add a factor into the calculation based on the texture's value at that point, right?

However, there's a wrinkle in this plan, which has to do with the way a fragment shader works, which is by applying itself to all the pixels in question individually, nigh-simultaneously. This means when the fragment shader runs, it doesn't have a concept of "this pixel" and "that pixel" – it only knows "the current pixel." This means an OpenGL fragment shader can't write to arbitrary pixel locations! So to "move" a pixel, you have to structure the shader so that when it's drawing the destination pixel, it finds and draws the origin pixel instead.

An example: say we know we want to move the lighter square below to the location of the darker square. We would have to write our shader so that when it's drawing the pixel at the dark square's location, it performs a lookup at the light square's location, and pulls that color in. Then we'd have to ensure that when it's drawing the pixel at the lighter square's location, it draws the background color.

<img src="/assets/parallax-shift/square1.jpg" height="100px" />

Okay, easy enough. But there's yet another wrinkle! (This is a very wrinkly problem.) Because we want to move pixels based on brightness, the pixel which *should* be in the current location *might* be one of a number of brightnesses. So the origin pixel could come from... lots of places! All we know for sure is the direction. But there might be lots of pixels in that direction which could be moved – which one should we choose?

<img src="/assets/parallax-shift/square2.jpg" height="100px" />

# Multiple Choice

The last challenge here has to do with occlusion, which in a standard parallax shader is a fundamental component. It has to kep track of which pixels should be in front, and ignores everything which might otherwise have been drawn there. In this way the surface remains solid. However, for a transparent crystal with internal and possibly-occluding details, we want this to be handled differently.

To solve this problem, the crystal shader looks for all possible matches along the perturbation vector, and takes the brightest. This is equivalent to the "lightest" blending mode in WebGL. Other blend modes are possible, but this is the method I used here. (This was the last CSS demo in the previous post.) This handles both the occlusion problem and the question of which pixel to use in the case of multiple matches, mentioned above.

This is the main distinguishing factor of my base crystal shader. It seems simple, but I'd never seen anybody do it, and I wanted to try.

# Shader Time

First, creds: This shader is based on a [techbrood demo](https://techbrood.com/threejs/examples/webgl_materials_parallaxmap.html), which was in turn based on work from <a href="https://web.archive.org/web/20190128023901/http://sunandblackcat.com/tipFullView.php?topicid=28">Igor Dyhta</a> and the venerable <a href="http://mmikkelsen3d.blogspot.sk/2012/02/parallaxpoc-mapping-and-no-tangent.html">Morten S. Mikkelsen</a>. My thanks to all involved.

We'll start with the vertex shader, which simply positions the vertices and sets up some information which will be needed by the fragment shader. Most of this is fairly standard boilerplate for shaders which perform normal mapping. 

```glsl
// define varyings, special shader variables which allow information to be passed to the fragment shader
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

The fragment shader performs a number of steps, all in service of "pushing" pixels in the texture some distance behind the face they're painted on. Bear in mind that these steps are performed for each pixel in the output, every frame, up to 60 frames per second. GPUs are amazing!

Let's look at an outline first, then we'll dig into each step:

1. Initialize everything
2. Calculate the offset direction
3. Step through the texture with an offset
4. Sample the texture in the offset direction and set output color

#### Step 1: Initialize Everything

```glsl
// pull in uniforms from the cpu
uniform float _steps; // how many layers of displacement
uniform float _height; // maximum displacement distance
uniform float _scale; // scales the texture
uniform float _opacity; // texture opacity
uniform sampler2D _texture; // the input texture
// pull in varyings from the vertex shader
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
```

#### Step 2: Calculate the offset direction

This is the gnarly one. First, the `main()` function initializes a couple of variables, then calls `perturbUv()`. This function returns the maximum texture offset vector for the current pixel – in other words, given the `_height` uniform, the maximum distance into the face to push the current pixel.

```glsl
void main() {

  float lum;
  vec3 color = vec3(0.);

  // perform the actual parallax mapping calculation. it takes the view position and the surface normal as arguments.
  vec2 maximumOffset = perturbUv( vViewPosition, normalize( vNormal ));
```

Now let's step into `perturbUv()`:

```glsl
vec2 perturbUv( vec3 viewPosition, vec3 surfNormal ) {

  // partial derivatives of the texture coordinates (vUv) with respect to the screen-space x and y coordinates.
  vec2 texDx = dFdx( vUv );
  vec2 texDy = dFdy( vUv );

```

First, a note of appreciation for the `dFdx` and `dFdy` functions, which are the workhorse of advanced shaders, and are crucial to this one in particular. These functions calculate the *partial derivatives* of something, one piece at a time. In this case, we're interested in knowing, essentially, the *slope* of the UVs, because we don't have direct access to the geometry, and want to understand the relationship between the UVs and screenspace. The UVs could be described as a 2D function that can be analyzed in any direction, with a different slope depending on which direction you are facing. However, a *partial derivative* of a function with multiple factors only concerns itself with one factor at a time and ignores the rest, and this happens to be ideal in situations where your inputs are 2D grids, like bitmaps or things which map to bitmaps, like UV maps!

We use dFdx and dFdy again with the surface coordinates, which give us more information about where and how the current pixel to be drawn is oriented in space.

```glsl
  // partial derivatives of surfPosition with respect to screen-space x and y coordinates. they represent the change in the world-space position along the x and y axes in screen space.
  vec3 vSigmaX = dFdx( surfPosition );
  vec3 vSigmaY = dFdy( surfPosition );
```

Once we have these pieces, we use them to construct the tangent space, through the use of a transformation function helpfully called the *TBN matrix*. This is done by taking the cross product of those last two partial derivatives with the surface normal, which produces vectors perpendicular to both:

```glsl
  // vR1 and vR2: tangent vectors used to build the TBN (tangent, bitangent, normal) matrix, which is used to transform vectors from tangent space to view space.
  vec3 vR1 = cross( vSigmaY, surfNormal );
  vec3 vR2 = cross( surfNormal, vSigmaX );
  // fDet is the determinant of the TBN matrix. It essentially ensures that the two cross products are scaled proportionally to the surface normal.
  float fDet = dot( vSigmaX, vR1 );
```

Confusingly, there's no actual matrix constructed here, but we do get what is essentially three vectors in space, which implies a matrix.  I do know why it's important – faces don't, by themselves, have an orientation. However, by combining all the things we know about the face's surface normal and the UV orientation, we can construct something which functions like an orientation, which could be considered something like "face space". This is the crucial piece of this puzzle – you have to have this imaginary space in order to know how and where to do the parallax mapping trick.

If you want more on the TBN matrix, [the diagrams on this page](https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/) do a good job of explaining it.

Anyway. The point is, you can use those three pieces to construct a TBN matrix. And if we *had* a TBN matrix, you could pull these pieces out again to do projection math. But since we have those three pieces, we can skip right past the matrix step and use them directly, to give us a vector which points "in":

```glsl
  // vProjVscr: a 2D vector that contains the projected view vector onto the tangent plane of the surface.
  vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );
```

This step projects the view vector onto the surface, which tells us the relative angle between the view direction and the surface relative to the components of that vector. This gives us 

```glsl
  // vProjVtex: a 3D vector in texture space that represents the direction of UV perturbation.
  vec3 vProjVtex;
  vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
  vProjVtex.z = dot( surfNormal, viewPosition );
```

Our vector! The one in texture space that we want! The green one we drew on the face, from the perspective of the texture!

```glsl
  // _height is the maximum distance to perform the perturbation
  vec2 texCoordOffset = _height * vProjVtex.xy / vProjVtex.z;

  // return the offset uv
  return texCoordOffset;
```


#### Step 3: Step through the texture with an offset

Back in `main()`, we set up a loop based on the number of distinctions we want to make in the grayscale image, starting with the brightest possible value and stepping down to nothing. Theoretically, with an 8-bit black and white image, the loop could usefully have 256 steps, assigning slighly different displacement values to each possible luminance value. For my purposes this was unnecessary overhead. Conversely, with too few steps, the displacement is obviously quantized, which might be fine in some situations, but I wanted to ensure the features seemed semi-randomly distributed through the object. I found using about 8 steps seemed to work well.

```glsl
  // loop starting at the maximum value and stepping down by 1 each time
  for (float i = _steps + 1.; i >= 0.; i--) {
    float percent = (1. / _steps) * i;
    float next = (1. / _steps) * (i + 1.);

    // apply the offset to the UVs in steps, ending with the maximum offset
    vec2 newUv = vUv - maximumOffset * percent;
```

#### Step 4: Sample the texture in the offset direction and set output color

The second half of the loop samples the target pixel, and saves the first one which matches the current range, setting it as the output:

```glsl
    // get the brightness of the pixel, in this case by simply taking the r channel's value. this assumes a grayscale teture
    lum = texture2D( _texture, newUv  * _scale ).r; //
    // if the value of the sampled pixel falls within the current step percentage range, use it and stop.
    // this chooses the brightest of the available values
    if (lum >= percent && lum < next) {
      color = vec3(lum);
      break; // exit the loop
    }
  }

  // set the output fragment color
  gl_FragColor = vec4(color, _opacity); // sets rgb color plus alpha
}
```

Using this input texture...

<img src="/assets/parallax-shift/speckles2.png" height="200px" />

...and these uniforms:

```js
    _steps: 8,
    _height: 1,
    _scale: 4
```

The result is below.

<div class="iframewrapper">
<iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax-plain/"></iframe>
</div>

# View Source

This project is open-source! The relevant repos are here:

<https://github.com/meetar/FS-reverse-parallax-plain/>

And the full shaders are here:

<https://github.com/meetar/FS-reverse-parallax-plain/blob/main/public/parallax.frag>
<https://github.com/meetar/FS-reverse-parallax-plain/blob/main/public/parallax.vert>

I hope you found this interesting. I wrote it because I didn't sufficiently understand what my shader was doing, so I pulled it apart and wrote until I did, and now so do you.

---

<a name="its-more-complicated-than-that">* It's more complicated than that</a>
