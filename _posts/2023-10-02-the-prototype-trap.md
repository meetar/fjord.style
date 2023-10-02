---
layout: page
title:  "The Prototype Trap"
# subtitle:  "Diving Back In to Web 3D"
date:   2023-10-02 12:02:02
categories: 3d
published: true
excerpt: The state of things, from the point of view of a shiny rock.
image: crystal.png
imgalt: A 3D computer-generated crystal fomamtion
---

I'm tired of reading long articles, so I'm going to write this one like a progressive JPG. It might still be long, but maybe it won't feel that way. Anyway, it's about third-party libraries, open-source software, and GPUs. There's a prize at the bottom.

---

<img class="gem" src="assets/prototype-trap/crystal9.png" />

I made a WebGL demo with my 9-year-old called <a href="https://meetar.github.io/gem-collector/">The Gem Collector</a>! It was mostly an excuse to try some things, wrapped in a framing narrative that looks like a pixel-art video game. It was fun to make, and is fun to use, but I can't recommend the stack without a long list of reservations. The major downside was that I accidentally recapitulated my career in prototyping.

---

<img class="gem" src="assets/prototype-trap/crystal8.png" />
Ten years ago <a href="https://fjord.style/journey-to-the-center-of-web-3d">I wrote about the then-current state of Web 3D</a>, ostensibly. What I <em>actually</em> wrote was a breakdown of the process of developing a <a href="http://meetar.github.io/globe-terrain/">globe demo</a> in JavaScript. Ten years later, I wanted to try something similar, using modern methods and tools. I was able to do a bit more in a bit less time, and the result was a fun <a href="https://meetar.github.io/gem-collector/">WebGL toy</a>! and a learning experience with my daughter!

By using available third-party tools, instead of writing it by hand at a lower level, I got a prototype up and running in record time. However, getting it to production took much longer than I anticipated, and I'm not 100% sure the tradeoff was worth it.

Spoiler: this has been a problem everywhere I've made prototypes, going back to the last millennium.

---

<img class="gem" src="assets/prototype-trap/crystal7.png" />
Ten years ago I was transitioning from a VFX career and wanted to see whether the burgeoning world of real-time web 3D could offer anything like what I was accustomed to. 

As part of this, I started learning <a href="http://threejs.org">three.js</a>, which had quickly become the most popular way to interact with WebGL. I had an idea for <a href="http://meetar.github.io/globe-terrain/">a representation of the earth</a> I wanted to see, so I coerced three.js to draw it with some of its built-in capabilities and some I had to hack in, using some techniques I knew from my VFX days and some I had to learn from scratch, following hunches and squinting at white papers. It took a few solid weeks, and worked fairly well, and almost everywhere. "Stirrings of order in the chaos" I said.

It was definitely annoying to make. I had to implement my own kernel operators, pass in lights to a custom shader which required a fork of three.js, and do ping-pong rendering with off-screen render targets I whittled out of soapstone with a knife I forged from an old bicycle chain. But it worked.

It didn't do everything I wanted, but it did it fairly quickly, and I understood its limitations. So a couple of weeks ago I did something of similar scope, for similar reasons, using available third-party tools which claim to make things simpler. And they do! ...Up to a point. Then they make them harder again. The balance, as always, is between convenience and control.

Partially, I think this is down to the expectations of developers. I didn't try to re-implement an old project (although that would be interesting, hm). I wanted to try something new and shiny. I understand that in this, I am not alone. And it had been awhile since I had worked in WebGL directly – I've drifted away from the world of graphics development, and I wanted to see what the kids are using these days, and what one aspect of the future might look like.

Also I wanted to try an idea for a shader I'd first had many years ago, to fake internal imperfections by perturbing texture lookup coordinates. I'll explain this in detail eventually, and link to it here when I do. (No link yet.)


---

<img class="gem" src="assets/prototype-trap/crystal6.png" />
By VFX career I mean 15 years in 3DS Max, After Effects, and Maya, rendering everything frame by frame. I think it was the animator David OReilly who convinced me that this approach was mostly unnecessary; so far as I could tell, he did all of his early work in the Maya preview window. No rendering, no anti-aliasing even. Just all real-time GPU output, super-fast feedback loops, very punk rock. It felt like an honest expression of the state of the art at a human scale, instead of a laborious, pains-taking simulation of advanced technology, a slick and shiny layer of big budgets shellacked over the grinding tedium of hundreds of people emailing "okay I updated the asset" over and over to each other until they got laid off or died.

The major upside of the slow way is that when you finish, you have a video. It looks – more-or-less – the same everywhere. But once you rely on a random selection of your viewers' GPUs to draw your pictures, you're stepping into a world of nondeterministic chaos.

When I started learning 3D, the real-time capability of consumer-grade machines was somewhere on par with the Death Star briefing animation from Episode IV. Cool enough! I probably could have built a career of that style, if I'd stuck with it. But it was the 90's, I wanted to see sparkles and flourescence and light refracting through the luminiferous aether. So I spent a lot of time wrangling renders while GPUs kept getting faster, until finally WebGL was released and three.js popped.

Three.js makes WebGL much easier, but even with all its syntactic sugar, it's comparatively low-level from the point of view of someone used to web frameworks. And if you want any custom shaders, you still have to write shader code. It could be worse, and it was – ten years ago to do anything interesting you had to use actual math. Now, Three.js handles lights and materials automatically in most cases, and interaction and effects are stable and fast. I see a question from the audience. "Does it work with React!?" Yes! ...Well, kind of. And not the way you're hoping. Nothing beyond a simple demo setup "just works." Until you learn all the quirks, you still have to struggle.

Funny story. My first in-depth exposure to React came when I worked alongside a team that made an editor using React for a WebGL map-drawing library I was working on. It looked great and worked well, but it came with a very long tail of weird bugs involving other libraries, in particular a third-party code editor which had a lot of its own internal state and event handlers. It was ultimately probably easier than writing it <em>not</em> with React, but when you use React, all your bugs become React-related. And in any situation with lots of complex UI or animation, state management can be a chore, and React just multiplies that.

Later, I worked on another WebGL mapping project for another React-based app. I had to do a lot of middle-management to connect React to the graphics state, as it had no way to inspect the contents of a Canvas object, and no idea what WebGL was doing. The graphics layer was being managed by the WebGL library I was using, with a relatively small interaction layer exposed, and any connections in or out had to run through a set of controls React could manipulate, so that it thought it was still in charge of state, not to mention the event handlers. For an "unopinionated framework" I've had a whole lot of arguments with React.

---

<img class="gem" src="assets/prototype-trap/crystal5.png" />

So when I started contemplating another WebGL project, I did not assume I'd use React. I just wanted to work quickly, and have nice-looking output. I started looking for a modern GUI for my debugging work to replace the old and crotchety dat.gui boilerplate I'd made years ago, and found a nice-looking library called <a href="leva.org">Leva</a>. Unfortunately, its tagline is "React-first components." I like components! But do I like them enough to use React for a 3D project? It felt like hiring Deloitte for a bake sale.

Turns out Leva was developed by an open-source collective named <a href="https://github.com/pmndrs">Poimandres</a>, and when I looked into the rest of their work, I got excited. <a href="https://github.com/pmndrs/react-three-fiber">React-three-fiber</a> in particular (we call it "R3F" in the biz) is a "React renderer for three.js". Put components in and three.js code comes out. And the demos looked good! Life finds a way! What could go wrong?

Additionally, the Poimandres crew has released a collection of R3F shortcuts called <em>Drei</em>. It's very clever, calling it "three" in German. I'm led to believe there are 7,000 languages on Earth, and eventually the three.js ecosystem will have a library called the word "three" in each of them. I convinced myself that this was an excuse to give React a shot at a quick project with limited scope.

The first thing I did was try to make a custom shader, applied to a mesh, in a scene with a light. In my globe project, this takes (I'm guessing here) about 270 lines of JavaScript. Using the Drei shortcuts, in the context of a React app, it goes something like this (simplified):

```react
const uniforms = {key: 'value'}
const frag = `//fragment shader code`
const vert = `//vertex shader code`

const App = () => {
  return (
    <Canvas>
      <mesh>
        <pointLight />
        <boxGeometry />
        <shaderMaterial args={uniforms, vert, frag} />
      </mesh>
    </Canvas>
  );
};
```

At first, I was a bit offended. I mean: half of this is English. Robots taking our jobs! Then I remembered I was the Boss in this scenario, and promoted myself to an office with "Art Department" on the door. Freedom! Coding is awful! ...Then I tried to find out how to wire two shaders together, and woke up back on the factory floor.

I'm not the first to point out that libraries just hide complexity behind an import, and that outsourced functionality is only as flexible as the API. So I wasn't really saving code, just typing, and paying for it with a reduction in functionality.

This is CS 101 stuff. Did I mention I went to art school? I did start out in Engineering, but they tried to teach me Fortran, and the luminiferous aether was pretty thin on the ground in that class. All this to say that the kind of shader wiring I wanted still can't be done automagically, at least not the way that a graphics dev would ideally do it. To my knowledge.

When I did my globe project, I had to strip some three.js shaders for parts and make new ones from the pieces. One shader had displacement code, another had normal calculations, etc, but none had everything I needed in one place. So that required a bunch of Work, our Sworn Enemy.

What you'd want, ideally, is some kind of composable, plug-based system with inputs and outputs, like the Maya shader graph. <em>Turns out</em> there's another Poimandres project which appears to do something similar, called <a href="https://github.com/pmndrs/lamina">Lamina</a>, using a layer-based system. However I couldn't tell from the documentation how much work it would take to integrate the physical shading capabilities of three.js which were key to my concept. Additionally, the Lamina project was archived this spring, with a message I repeat here as emblematic of [waves hands in a circle] this whole situation:

> This project needs maintainers and a good rewrite from scratch. Lamina does a lot of hacky processing to achieve its API goals. As time has gone by I have started to doubt if it’s worth it. These hacks make it unreliable, unpredictable and slow. Not to mentaion, quite convoluted to maintain and debug. There might be better APIs or implimentations for this kind of library but I currently do not have the bandwidth to dedicate to finding them. Perhaps in the future.

Relatable. I truly, deeply sympathize. Additionally: 

> Lamina is built on top of three-custom-shader-material (CSM) and any effects that are achieved by lamina can be done with CSM in a predictable and performant manner albeit at a lower level.

So: don't use these shortcuts, they're slow. Very wise advice. I chose to do the exact opposite.

The Drei material wrappers are effectively shader passes, which means you can make it do whatever fancy stuff you like by just layering them on. This is much less efficient, but also much less work to code. If it's too hard to squeeze your data through a multi-step pipe, just hook multiple single-step pipes together! This is like wearing four shirts because it's chilly out. It might not be as effective, efficient, or comfortable as a coat, but it's cheaper and you already have the shirts right there.

One additional wrinkle is that the three.js physical materials function by rendering <em>other objects</em> through them, which means I couldn't layer my depth shader <em>and</em> a refraction shader on the same object, because ... there weren't any other objects for the refraction shader to see. So it saw nothing, and the result was a black object. (This is where a true multi-pass material would come in.) In those cases I made a second, smaller copy of the mesh <em>inside</em> the refracting object, which is twice again the work for the GPU, but with the result I wanted. These are old Maya reflexes I learned back on the render farm.

So I did that! And it looked great on my machine! ...But almost nowhere else.


---
<img class="gem" src="assets/prototype-trap/crystal4.jpg" />

It's true: hundreds of simultaneous texture lookups rendered multiple times per frame is not optimal. I shouldn't have done that! It was a useful prototype, but not an effective production strategy. It rendered at 60fps on fast machines, and 20fps on the next tier down, and anything more than a few years old locked up. I have a Windows gaming laptop which runs Cyberpunk 77 on High, but when it ran the demo the fans immediately redlined and the output looked like a reconstructed Muybridge sequence.

I wound up inserting numerous code branches to handle lower-capacity systems, turning off more and more features until the frame rate stopped dropping. But by far the largest number of bugs came from ... the typewriter-effect library I used for the dialogue system of the game wrapper. The introduction of third-party state and numerous custom event handlers, setIntervals, and whatnot reacted poorly with the branching network of React hooks I was using to get it working on other systems, and solving this problem became extremely time-consuming.

If at this point you suggest Redux or writing my own reducer, you are very smart, but you are missing my point, which is that I was trying to do As Little As Possible. Specifically: I was trying to make these libraries do something they weren't built to do, which I'm accustomed to. When you're prototyping, you generally only have to get it working once. But when coding for production, you have to care about a whole lot of factors beyond your control, simultaneously, and get it working for all of them, and it was painful learning exactly how much these third-party libraries didn't care about those concerns at all.

Real-time GPU work means different things to different GPUs. As I write this I have seven of them on my desk, with another one underneath it, spanning 12 fairly crucial years of technological development – the oldest is inside a MacBook Air from 2011. The detect-gpu library I use classifies it as Tier 0, of type "FALLBACK" – it's not even in the database.

So a certain amount of work is necessary to enable a given 3D scene to look its best everywhere, including providing alternatives for machines that don't have the juice to run it, or have JavaScript (very sensibly) disabled, etc. But by and large the 3D ecosystem isn't as interested in providing fallbacks as in pushing that envelope. And third-party libraries have their own assumptions and priorities baked in, and when you use them, they become yours.

The end result in my case was pleasing, but time-consuming. Maybe if I'd skipped the libraries it would have taken twice as long to write the proof of concept, but – who knows? – maybe a fraction of the time debugging, for an end state which more closely resembled my goal. This prototyping trap is something I've been fighting my entire career, and the battle is rejoined every time a new library, framework, or platform claims to solve an old problem in a better way.

There's another, parallel argument to be made here about Large Language Models and their collective understanding of how to solve code problems. A LLM is effectively an outlier-scrubbing device, and good luck using them to do something new.

---

<img class="gem" src="assets/prototype-trap/crystal3.jpg" />

One last note on this: I've discovered that it's not always obvious when you cross the line from prototype to production. I was making a toy with my kid! But we also wanted to show it to other people. To that end, I'd like to explore some kind of "responsive" 3D framework for site-building, which considers overall browser capability in addition to `@media-query` style switches, and includes the kind of throttling capability I wound up bodging in to my 3D code.

There are pieces of this around, including facilities for LoD (level-of-detail) model-swapping and performance monitoring, and some attention has been made to the `<model-viewer>` tag specifically. But as of this writing, most online 3D experiences are "one size fits most" and it'll stay that way until the developers more closely resemble the users.

This was secretly a story about accessibility. Thanks for reading!

---

<div class="iframewrapper">
<a href="https://github.com/meetar/reverse-parallax-shader"><iframe class="glcanvas" src="https://meetar.github.io/FS-reverse-parallax/"></iframe></a>
</div>
