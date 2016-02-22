window.addEventListener("load", function() {
	// first time page loads
	container = document.getElementById("globecontainer");
	for (div in divList) {
		$('#'+div).height(container.offsetWidth);
	}
});

window.addEventListener("resize", function() {
	globeResize();	
});

function globeResize() {
	container = document.getElementById("globecontainer");
	
	// make renderer square
	containerHeight = container.offsetWidth;

	// fit the renderer to the container
	renderer.setSize( container.offsetWidth, containerHeight );
	// update the camera
	camera.aspect = container.offsetWidth / containerHeight;
	camera.updateProjectionMatrix();
	render();	
}