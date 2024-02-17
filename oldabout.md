---
layout: page
title: About
hidden: true
published: false
permalink: /about/
---
<link rel="preconnect" href="https://meetar.github.io/">
<div id="globecontainer"><a target="_blank" href="https://github.com/meetar/FSglobe-terrain"><img id="globegif" src="/assets/FSglobe-terrain.gif"></a>
<iframe id="FSglobe" src="https://meetar.github.io/FSglobe-terrain/" width="100%" height="550px"></iframe>
</div>


I grew up in a tiny town in Alaska famous for disasters, where extremities of scale, weather, and character felt not so much normal as inscrutable, as though there was no angle from which they would ever make any sense.

So: I've been interested in describing hard-to-describe things for a long time.

I've worked as animator, technical director, and designer on a wide variety of commercial, industrial, and artistic projects. My most strongly-held opinions concern very brief events and very fast feedback loops.

"Fjord style" is an appreciation of layers, weatherproofing, clearly-marked routes, non-skid surfaces, dark neutrals with bright accents, and lists of things which turn out to be metaphors.

Currently, I mediate between designers and engineers from the edge of the woods on the Oregon coast.

You can reach me here:<br>
<a href="https://github.com/meetar/">https://github.com/meetar/</a><br>
<a href="https://mastodon.xyz/@meetar">https://mastodon.xyz/@meetar</a><br>
<a target="_top" href="mailto:pxrich@gmail.com">pxrich@gmail.com</a>

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
			iframe.style.height="550px"
			iframe.src = "https://meetar.github.io/FSglobe-terrain/"
			// iframe.src = "http://localhost:8080"
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
	// }
});

}
</script>