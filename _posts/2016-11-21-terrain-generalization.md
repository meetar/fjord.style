---
layout: page
category: blog
title: Terrain Generalization
excerpt: Generalization blending is a way to solve two problems at once – terrain data contains small details which aren't necessary for understanding the shape and location of important features, but basic simplification methods such as blurring are applied everywhere indiscriminately.
image: https://mapzen-assets.s3.amazonaws.com/images/terrain-generalization/terrain2.jpg
authors: [meetar]
tags: [tangram, terrain, demo]
---


<script>
function elementIntersectsViewport (el) {
  var top = el.offsetTop;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    (top + height) > window.pageYOffset
  );
}

function hide(el) {
    iframe = el.getElementsByTagName("iframe")[0];
    if (typeof iframe != "undefined") el.removeChild(iframe);
}
function show(el) {
    iframe = el.getElementsByTagName("iframe")[0];
    if (typeof iframe == "undefined") {
        iframe = document.createElement("iframe");
        el.appendChild(iframe);
        iframe.style.height = "100%";
        iframe.src = el.getAttribute("source");
    }
}

// check visibility every half-second, hide off-screen demos to go easy on the GPU

setInterval( function() {
    var elements = document.getElementsByClassName("demo-wrapper");
    for (var i=0; i < elements.length; i++) {
        el = elements[i];
        if (elementIntersectsViewport(el) || (i == 0 && window.pageYOffset < 500)) {
            show(el);
            show(elements[i+1]);
            for (var j=0; j < elements.length; j++) {
                if (j != i && j != i+1) {
                    hide(elements[j]);
                }
            }
            break;
        }
    }
}, 500);

</script>

<style>
.envmap {
    vertical-align: top;
    width: 25%;
    max-height: 150px;
    max-width: 150px;
    float: left;
}
.envframe {
    height: 150px;
    width: 75%;
}
.envwrapper {
    height: 150px;
    width: 100%;
}

iframe.envframe {
    width: 75%;
}

.static-content img:not([width]):not([height]).envmap {
    width: 25%;
    margin: 0;
}

.demo-wrapper {
    max-height: 60vh;
}

.caption {
    margin-top: -.5em;
}
</style>

"Generalization" is a term used in cartography to describe reducing the complexity of data while preserving its essential characteristics in a meaningful way. It's not just simplification, but finding and revealing the most important details. It's a useful skill when you have more information than you need, and that's almost always the case.

Cartographers can learn to recognize significant details in mappable data, but teaching a computer this skill is trickier.

I'm interested in this problem lately as it relates to terrain. Mountains are a hobby of mine, and depicting them has made up a significant portion of my work at Mapzen (for more on this, see [Mapping Mountains](https://mapzen.com/blog/mapping-mountains)). Since that post, we've integrated terrain data in our [Walkabout and Tron house styles](https://mapzen.com/products/maps/).

At the annual meeting of [NACIS](http://nacis.org) (North American Cartographic Information Society) this year, the generalization of terrain was discussed in several sessions, giving me lots of ideas to explore. Included among these was a technique described by Daniel Huffman in his blog post [On Generalization Blending for Shaded Relief](https://somethingaboutmaps.wordpress.com/2011/10/18/on-generalization-blending-for-shaded-relief/).

Generalization blending is a way to solve two problems at once – terrain data contains small details which aren't necessary for understanding the size and shape of important features, but basic simplification methods such as blurring are applied everywhere indiscriminately.

<img src="https://mapzen-assets.s3.amazonaws.com/images/terrain-generalization/blurred.jpg" alt="blurred terrain" style="width: 350px; margin: 0 auto; display: block;"><p class='caption' style='text-align: center'>A displeasing, indiscriminately-blurred image.</p>

However, if you have some knowledge of the terrain's bumpiness, you can use it to blur small details while letting bigger features show through in all their bumpy glory.

Following Daniel's lead, I decided to try to implement a version of this technique in a realtime [Tangram](https://mapzen.com/products/tangram) shader. To detect bumpiness, I used the [standard deviation](https://en.wikipedia.org/wiki/Standard_deviation), which describes the range of variation in a collection of samples. Starting with our [tiled terrain normals](https://mapzen.com/documentation/terrain-tiles/), we can sample a small area around each pixel to test how locally smooth or bumpy that area is. This will give us a "bumpiness" map with lines along ridges – the sharper the ridge, the brighter the line.

<div class="demo-wrapper" source="https://tangrams.github.io/terrain-demos/?noscroll&url=styles/green-stdev.yaml#10/57.0719/-126.2290"></div>
<p class='caption'>An interactive bumpiness map of somewhere in British Columbia. <a style="font-weight:normal" href="http://tangrams.github.io/terrain-demos/?url=styles/green-stdev.yaml#10/57.0719/-126.2290" target="_blank">Open&nbsp;full&nbsp;screen&nbsp;➹</a></p>

This can be used as a mask, showing the original terrain only where the mask is bright, and fading to the blurred version everywhere else:

<div class="demo-wrapper" source="https://tangrams.github.io/terrain-demos/?noscroll&url=styles/green-selectiveblur.yaml#10/57.0719/-126.2290"></div>
<p class='caption'>An interactive, selectively-blurred map. <a style="font-weight:normal" href="http://tangrams.github.io/terrain-demos/?url=styles/green-selectiveblur.yaml#10/57.0719/-126.2290" target="_blank">Open&nbsp;full&nbsp;screen&nbsp;➹</a></p>

Here's a side-by-side comparison:

<div style="margin: inherit auto; display: block;"><img src="https://mapzen-assets.s3.amazonaws.com/images/terrain-generalization/terrain1.jpg" alt="unblurred terrain" style="width: 49%; display: inline; margin: 0; margin-right: 4px;"><img src="https://mapzen-assets.s3.amazonaws.com/images/terrain-generalization/terrain2.jpg" alt="selectively blurred terrain" style="width: 49%; display: inline; margin: 0;"></div><p class='caption'>The original terrain, followed by selectively blurred terrain. I am pleased.</p>

Here's a [live, editable version of the demo](https://mapzen.com/tangram/play/?scene=https://raw.githubusercontent.com/tangrams/terrain-demos/master/styles/green-selectiveblur.yaml#10.1375/51.0141/-117.6778), and here's a [link to the code](https://github.com/tangrams/terrain-demos/blob/master/styles/green-selectiveblur.yaml) on github – fork away!

Further optimizations are possible – for example, [here's a version which should be faster](https://github.com/tangrams/terrain-demos/blob/master/styles/green-stdev-opt.yaml) while giving slightly different results, and [here's a version which samples in screen space](https://github.com/tangrams/terrain-demos/blob/master/styles/green-stdev-adjusted.yaml) to reduce artifacts at zoom levels (thanks to [Patricio Gonzalez Vivo](https://twitter.com/patriciogv) and [Brett Camper](https://github.com/bcamper) for shader help). And there are lots of other kinds of blurs and manipulations to try – for instance, the current shader works best out to about z8, but this range could be expanded by linking various shading parameters to the zoom level.

In this way, I believe terrain can be made legible at all scales, and then my life's work will be complete.
