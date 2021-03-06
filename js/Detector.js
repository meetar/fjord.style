/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */
var failure = false;

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// check for IE
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var trident = ua.indexOf("Trident");
// if (msie > 0)

// if WebGL support not detected, bail
if (!Detector.webgl || (msie > 0) || (trident > 0)) {
	log("Scene failed to start.")
	failure = true;
} else {
	// hide fallback images and apology
	document.getElementById("apology").innerHTML = "(Click and drag to rotate each view.)";
	var fallbacks = document.getElementsByClassName('fallback');
	for(i=0; i<fallbacks.length; i++) {
		fallbacks[i].style.display = 'none';
		fallbacks[i].style.visibility = 'hidden';
	}

	// divs to watch for and associated functions
	var divList = {
		"div2" : 0,
	    "div3" : 0,
	    "div4" : 0,
	    "div5" : 0,
	    "div6" : 0,
	    "div7" : 0,
	    "div8" : 0
	};

	// size all container divs to make them square
	container = document.getElementById("globecontainer");
	for (div in divList) {
		document.getElementById(div).setAttribute("height",container.offsetWidth+"px");
	}
}