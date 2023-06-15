---
layout: page
title: About
permalink: /about/
---

<div id="globecontainer"><a target="_blank" href="https://github.com/meetar/FSglobe-terrain"><img id="globegif" src="/assets/FSglobe-terrain.gif"></a>
<iframe id="FSglobe" src="" width="100%"></iframe>
</div>


I grew up in a tiny town in Alaska famous for disasters, where extremities of scale, weather, and character felt not so much normal as inscrutable, as though there was no angle from which they would ever make any sense.

So: I've been interested in describing hard-to-describe things for a long time.

I've worked as animator, designer, and technical director on a wide variety of commercial, industrial, and artistic projects, mostly involving 3D graphics. My most strongly-held opinions concern the timing of very brief events.

"Fjord style" is an appreciation of layers, weatherproofing, clearly-marked routes, non-skid surfaces, dark neutrals with bright accents, and lists of things which turn out to be metaphors.

Currently, I work with abstruse data structures on the edge of the woods on the Oregon coast. You can find me here:

https://github.com/meetar/
https://mastodon.xyz/@meetar
pxrich@gmail.com

<script>
	let iframe;
var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
if (width > 700) {
	// wait for page to load
	window.onload = function() {


		// set iframe src
		iframe = document.getElementById("FSglobe");
		if (iframe) {
			// iframe.src = "https://meetar.github.io/FSglobe-terrain/"
			iframe.style.height="550px"
			iframe.src = "http://localhost:8080"
		}
	}

	window.addEventListener("message", function(event) {
	// if (event.origin === "http://localhost:8080") {
		// Handle the message from the iframe
		console.log('received:', event.data);
		console.log('success?:', event.data.FSsuccess);

		if (event.data.FSsuccess) {
			console.log("Received yes message from iframe:", event.data);
		}
		if (!event.data.FSsuccess) {
			console.log("Received no message from iframe:", event.data);
			let globegif = document.getElementById("globegif");
			console.log(globegif);
			iframe.style.display = "none";
			globegif.style.display = "block";
		}
});

}
</script>