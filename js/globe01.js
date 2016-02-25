//
// SCENE SETUP
//

// globals
var camera, scene, renderer, container;
var light, ambientLight, pointLight;

var globe = new THREE.Object3D(), rotator = new THREE.Object3D();
var globeImage, europeImage, alpsImage, regionImage, mountainImage;
var globeTexture, alpsTexture, regionTexture, mountainTexture;
var myDbgMat, myDbgMat2, myDbgMat3;
var RTTs = {};

var normScene, normCamera, normTexture, normTextureMat, normTextureGeo;
var mats, textureMats;
var easeType, easeSpeed;

var loopSteps = 1;
var large = $(window).width() < 1200 ? false : true;

var clock = new THREE.Clock();
startTime = new Date();

// divs to watch for and associated functions
var divList = {
	"div2" : doDiv2,
    "div3" : doDiv3,
    "div4" : doDiv4,
    "div5" : doDiv5,
    "div6" : doDiv6,
    "div7" : doDiv7,
    "div8" : doDiv8
};

//
// HELPER FUNCTIONS
//
	
function log(s) { console.log(s); }

function rads(x) { return x*Math.PI/180; }

function numst(s) { return String((s).toFixed(2)); }

function setMatUniform(name, value) {
	for (mat in mats) {
		mats[mat].uniforms[name].value = value;
	}
}




//
// START THE MACHINE
//

function init() {

// init WebGL renderer

container = document.getElementById( 'globecontainer' );
try {
    renderer = new THREE.WebGLRenderer( { alpha: true, 'antialias':false } );
    renderer.setSize( container.offsetWidth, container.offsetWidth );
	renderer.setClearColor(0xf9f9f9);
	renderer.autoClear = false;
    container.appendChild( renderer.domElement );
}
catch (e) {
    console.log("Couldn't make THREE.js renderer:", e);
}

	

// MASTER SCENE SETUP
	
scene = new THREE.Scene();
    
// Camera def

var fov = 15; // camera field-of-view in degrees
var width = renderer.domElement.width;
var height = renderer.domElement.height;
var aspect = width / height; // view aspect ratio
camera = new THREE.PerspectiveCamera( fov, aspect, .1, 10000 );
scene.add(camera);
camera.position.z = -1200;
camera.position.y = 0;
camera.lookAt(scene.position);
camera.updateMatrix();

// Light def

ambientLight = new THREE.AmbientLight( 0x000000 );
scene.add( ambientLight );

pointLight = new THREE.PointLight( 0xffffff, 0.0 );
camera.add(pointLight);
pointLight.position.set(0, 200, 300);

var sphere          = new THREE.SphereGeometry( 100, 8, 8 );
light               = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color:0xffffff } ) );
light.position      = pointLight.position;
light.scale.x       = light.scale.y = light.scale.z = 0.05;
scene.add(light);



// MATERIALS

// base mat def

var ambient = 0xffffff, diffuse = 0xffffff, specular = 0x999999, shininess = 100.0, scale = 100;

var shader = THREE.ShaderLib[ "normalmap" ];

uniforms = THREE.UniformsUtils.clone( shader.uniforms );

flatNormalTex = THREE.ImageUtils.loadTexture( '../img/flat.png' );
uniforms[ "tNormal" ] = { type: 't', value: flatNormalTex };
uniforms[ "diffuse" ].value.setHex( diffuse );
uniforms[ "specular" ].value.setHex( specular );
uniforms[ "ambient" ].value.setHex( ambient );
uniforms[ "shininess" ].value = shininess;
uniforms[ "enableDiffuse" ] = { type: 'i', value: 1 };
uniforms[ "tDiffuseOpacity" ] = { type: 'f', value: 0 };
uniforms[ "tDiffuse2Opacity" ] = { type: 'f', value: 0 };
uniforms[ "uPointLightPos"] =   { type: "v3", value: pointLight.position },
uniforms[ "uPointLightColor" ] = {type: "c", value: new THREE.Color( pointLight.color )};
uniforms[ "uAmbientLightColor" ] = {type: "c", value: new THREE.Color( ambientLight.color )};
uniforms[ "matrightBottom" ] = { type: 'v2', value: new THREE.Vector2( 180.0, -90.0 ) };
uniforms[ "matleftTop" ] = { type: 'v2', value: new THREE.Vector2( -180.0, 90.0 ) };
uniforms[ "sphereRadius" ] = { type: 'f', value: 100.0 };
uniforms[ "mixAmount" ] = { type: 'f', value: 1.0 };
// necessary? yes
uniforms[ "diffuse" ].value.convertGammaToLinear();
uniforms[ "specular" ].value.convertGammaToLinear();
uniforms[ "ambient" ].value.convertGammaToLinear();

uniforms[ "enableDisplacement" ] = { type: 'i', value: 1 };
uniforms[ "uDisplacementScale" ] = { type: 'f', value: 100 };
uniforms[ "uDisplacementPostScale" ] = {type: 'f', value: 50 };
uniforms[ "bumpScale" ] = { type: "f", value: 1.0 };
uniforms[ "opacity" ] = { type: "f", value: 0.0 };
uniforms[ "uNormalOffset" ] = { type: "v2", value: new THREE.Vector2( 1.0, 1.0 ) };


// master material
material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs_main,
    fragmentShader: fs_main,
	transparent: true,
	depthTest: false,
});

// make copy of master material, then modify
globeMat = material.clone();
globeMat.uniforms[ "tNormal" ] = { type: 't', value: flatNormalTex };
globeMat.uniforms[ "tDiffuse" ] = { type: 't', value: new THREE.ImageUtils.loadTexture( '../img/world.topo.4096_b.jpg' )};
globeMat.uniforms[ "tDisplacement" ] = { type: 't', value: globeTexture.texture2 };
globeMat.uniforms[ "uDisplacementPostScale" ] = {type: 'f', value: 4.0 };
globeMat.uniforms[ "bumpScale" ].value = 10.0;
globeMat.uniforms[ "opacity" ].value = 1.0;
globeMat.uniforms[ "mixAmount" ] = {type: 'f', value: 1.0 };
globeMat.depthTest = true;
globeMat.side = THREE.DoubleSide;
// globeMat textures - need two to ping-pong between for RTT
globeTexture.textureMat2.uniforms.u_erode.value = .1;
globeTexture.textureMat2.uniforms.u_dilate.value = .1;
globeTexture.textureMat.uniforms.u_erode.value = .1;
globeTexture.textureMat.uniforms.u_dilate.value = .1;

// new material
alpsMat = material.clone();
alpsMat.uniforms[ "tNormal" ] = { type: 't', value: flatNormalTex };
alpsMat.uniforms.tDiffuse.value = new THREE.ImageUtils.loadTexture( '../img/alps_sm.jpg' );
alpsMat.uniforms[ "tDisplacement" ] = { type: 't', value: alpsTexture.texture2 };
alpsMat.uniforms.matleftTop.value = new THREE.Vector2( -18.0, 63.0 );
alpsMat.uniforms.matrightBottom.value = new THREE.Vector2( 36.0, 27.0 );
alpsMat.uniforms[ "bumpScale" ].value = 10.0;
alpsMat.uniforms[ "uDisplacementPostScale" ] = {type: 'f', value: 4.0 };
alpsMat.uniforms[ "tDiffuseOpacity" ] = {type: 'f', value: 1.0 };
alpsMat.uniforms[ "tDiffuse2Opacity" ] = { type: 'f', value: 0.0 };
alpsMat.uniforms[ "uPointLightColor" ] = { type: 'c', value: new THREE.Color().setRGB(0.8, 0.8, 0.8) };
alpsMat.depthTest = true;
// textures
alpsTexture.textureMat2.uniforms.u_erode.value = .1;
alpsTexture.textureMat2.uniforms.u_dilate.value = .1;
alpsTexture.textureMat.uniforms.u_erode.value = .1;
alpsTexture.textureMat.uniforms.u_dilate.value = .1;

// new material
regionMat = material.clone();
regionMat.uniforms[ "tNormal" ] = { type: 't', value: flatNormalTex };
regionMat.uniforms.tDiffuse.value = new THREE.ImageUtils.loadTexture( '../img/region2_color.jpg' );
regionMat.uniforms[ "tDisplacement" ] = { type: 't', value: regionTexture.texture2 };
regionMat.uniforms.matleftTop.value = new THREE.Vector2( 5.651247806, 48.043751116 );
regionMat.uniforms.matrightBottom.value = new THREE.Vector2( 9.25791303, 44.437085892  );
regionMat.uniforms[ "uDisplacementPostScale" ] = {type: 'f', value: 1 };
regionMat.depthTest = false;
regionMat.side = THREE.DoubleSide;

// new material
mountainMat = material.clone();
mountainMat.uniforms[ "tNormal" ] = { type: 't', value: flatNormalTex };
mountainMat.uniforms.tDiffuse.value = new THREE.ImageUtils.loadTexture( '../img/matterhorn_image_crop.jpg' );
mountainMat.uniforms[ "tDisplacement" ] = { type: 't', value: new THREE.ImageUtils.loadTexture( '../img/MH_DEM_02.jpg' ) };
mountainMat.uniforms.matleftTop.value = new THREE.Vector2( 7.625885, 46.008221 );
mountainMat.uniforms.matrightBottom.value = new THREE.Vector2( 7.700386, 45.9566 );
mountainMat.uniforms[ "uDisplacementPostScale" ] = {type: 'f', value: .04 };
mountainMat.depthTest = true;
mountainMat.uniforms[ "sphereRadius" ] = { type: 'f', value: 100.35 };


			
mats = [globeMat, globeMat, globeMat, globeMat, alpsMat, alpsMat, regionMat, mountainMat, globeMat ];
textureMats = 	[	globeTexture.textureMat, globeTexture.textureMat2,
					alpsTexture.textureMat, alpsTexture.textureMat2,
					regionTexture.textureMat, regionTexture.textureMat2
				];


// GEOMETRY
// geo def

globeGeo = new THREE.PlaneGeometry(10, 10, 257, 129);
globeGeo.computeTangents();
globeMesh = new THREE.Mesh( globeGeo, globeMat);
globeMesh.frustumCulled = false;

alpsGeo = new THREE.PlaneGeometry(28, 28, 100, 150);
alpsGeo.computeTangents();
alpsMesh = new THREE.Mesh( alpsGeo, alpsMat);
alpsMesh.frustumCulled = false;

regionGeo = new THREE.PlaneGeometry(28, 28, 102, 102);
regionGeo.computeTangents();
regionMesh = new THREE.Mesh( regionGeo, regionMat);
regionMesh.frustumCulled = false;

mountainGeo = new THREE.PlaneGeometry(28, 28, 50, 50);
mountainGeo.computeTangents();
mountainMesh = new THREE.Mesh( mountainGeo, mountainMat);
mountainMesh.frustumCulled = false;


// rotator group to allow adjustments to the center of rotation
rotator = new THREE.Object3D();

rotator.add(globeMesh);
rotator.add(alpsMesh);
rotator.add(regionMesh);
rotator.add(mountainMesh);

globe.add(rotator);
scene.add(globe);

easeType = TWEEN.Easing.Quartic.InOut;
easeSpeed = 2000;

controls = new THREE.TrackballControls( camera, container );
controls.addEventListener( 'change', render );
controls.enabled = false;
	
addMouseHandler(renderer.domElement);

// calculate all textures
for (x in RTTs) prepTextures(RTTs[x]);
// start render loop
startLoop();
// animate in globe
doDiv1();
// start checking for container visibility
startDivCheck();

endTime = new Date();
// console.log( (endTime - startTime) / 1000);

} // end init()



//
// TEXTURE FUNCTIONS
//

var vs, fs_erode, fs_dilate, fs_maximum, fs_rtt, vs_main, fs_main;

SHADER_LOADER.load( function (data) {
    vs = data.vs_rt.vertex;
    fs_erode = data.fs_erode.fragment;
    fs_dilate = data.fs_dilate.fragment;
    fs_rtt = data.fs_rtt.fragment;

    vs_main = data.vs_main.vertex;
	fs_main = data.fs_main.fragment;
});

function prepTextures(myRTT) {
	// the results differ wildly depending on whether erode or dilate runs first -
	// could interleave them but with current setup that would involve
	// recompiling the materials every frame.
	// todo: make four FBOs with dedicated shader assignments
	
	// firstShader = fs_dilate, secondShader = fs_erode;
	firstShader = fs_erode, secondShader = fs_dilate; // this feels better - science!
	
	// set first shader
	myRTT.textureMat.fragmentShader = firstShader;
	myRTT.textureMat.needsUpdate = true;

	myRTT.textureMat2.fragmentShader = firstShader;
	myRTT.textureMat2.needsUpdate = true;
	
	// initialize first RTT FBO's colorMap with the source image
	myRTT.textureMat.uniforms.colorMap.value = myRTT.image;
	// render first FBO with erode shader
	renderer.render( myRTT.scene, myRTT.camera, myRTT.texture, false );
	// then switch first FBO's colorMap to second FBO
	myRTT.textureMat.uniforms.colorMap.value = myRTT.texture2;
	
	// while ( myRTT.textureMat.uniforms.u_unchanged == 0.0 ) {
	// would be nice to have some kind of switch that turned the loop off
	// when there was no difference detected between the two FBOs.
	// I suppose I'd need a third shader to do a diff... 
	for (x=0;x<loopSteps;x++) {
		calculate(myRTT);
	}
	
	// switch shaders
	myRTT.textureMat.fragmentShader = secondShader;
	myRTT.textureMat.needsUpdate = true;

	myRTT.textureMat2.fragmentShader = secondShader;
	myRTT.textureMat2.needsUpdate = true;

	for (x=0;x<loopSteps;x++) {
		calculate(myRTT);
	}
	
}

// ping-pong between two textures 
function calculate(myRTT) {
	// render second FBO, based on first FBO
	renderer.render( myRTT.scene2, myRTT.camera2, myRTT.texture2, false );
	// render first FBO, based on second FBO
	renderer.render( myRTT.scene, myRTT.camera, myRTT.texture, false );
}

var requestId;

function loop() {
	// TWEEN.update() returns a boolean, 1 = there are tweens still running
	if ( mouseDown || TWEEN.update() ) {
		render();
		controls.update(); // trackball interaction
	}
	requestId = requestAnimationFrame( loop );
}

function startLoop() {
	if (!requestId) {
		 loop();
	}
}

function stopLoop() {
	if (requestId) {
		 cancelAnimationFrame(requestId);
		 requestId = undefined;
	}
}

function render() {
    renderer.clear();
    renderer.render(scene, camera);
}



window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
        	window.setTimeout(callback, 1000 / 60);
        };
})();




//
// TWEEN.JS SETUP
//


// define objects for tween.js to act on
var camPos = { x : 0, y: 0, z: -1200.0 };
var camTarget = { x : 0, y: 0, z: 0 };
var camPosTarget = { x : 0, y: 0, z: -1200.0 };
var camTargetTarget = { x : 0, y: 0, z: 0 };
var globeTarget = { y : 0 };
var rotatorTarget = {x: 0, z: 0};
var lightPos = {x: 0, y: 0, z: 0};
var lightTarget = {x: 0, y: 0, z: 0};


// define view variables
var currentView = -1;
var lastView = 0;
var currentDiv = "";
// list of views
var viewsList = ["globe", "globe2", "europe", "euroborders", "alps", "hannibal", "region", "mountain"]
// list of materials associated with each view
var matsList = ["globe", "globe", "globe", "globe", "alps", "alps", "region", "mountain", "globe"]

// helper function to set current view vars
function setView(which) {
	for (x in viewsList) {
		window[viewsList[x]] = (viewsList[x] == which) ? true : false;
	}
}

globeRotation = 1.42;

// set views and tween goals, then trigger tweens
// mark current and last views by their index in viewsList

function doDiv1() { // globemain
	if (currentView != 0 || lastView == -1) {
		lastView = currentView;
		currentView = 0;
		getCameraState();

		camPosTarget.y = 400;
		camPosTarget.z = -800;
		camTargetTarget.y = 0;

		globeTarget.y = globeRotation;
		
		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 0.0;
		
		rotatorTarget.x = 0.0;
		rotatorTarget.z = 0.0;

		doSceneTweens();
		doMaterialTweens();
	}
}


function doDiv2() { // globe2main
	if (currentView != 1) {
		lastView = currentView;
		currentView = 1;
		getCameraState();
			
		camPosTarget.y = 400;
		camPosTarget.z = -800;
		camTargetTarget.y = 0;

		globeTarget.y = globeRotation;
		
		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 0.0;

		rotatorTarget.x = 0.0;
		rotatorTarget.z = 0.0;	
		
		doSceneTweens();
		doMaterialTweens();
	}
}

function doDiv3() { // europemain
	if (currentView != 2) {
		lastView = currentView;
		currentView = 2;
		getCameraState();
		
		camPosTarget.y = 300;
		camPosTarget.z = -150;
		camTargetTarget.y = 100;

		globeTarget.y = globeRotation;
		
		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 300.0;

		rotatorTarget.x = 0.106;
		rotatorTarget.z = 0.756;			
		
		doSceneTweens();
		doMaterialTweens();
	}
}

function doDiv4() { // eurobordersmain
	if (currentView != 3) {
		if (currentView > 3) {
			globeSettings.uDisplacementPostScale = 0;
		}
		lastView = currentView;
		currentView = 3;
		getCameraState();
			
		camPosTarget.y = 300;
		camPosTarget.z = -150;
		camTargetTarget.y = 100;

		globeTarget.y = 1.0;
		
		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 300.0;	
		
		rotatorTarget.x = 0.45;
		rotatorTarget.z = 0.4;		

		doSceneTweens();
		if (lastView > 3) {
			globeSettings.opacity = 0.0;
		}
		doMaterialTweens();
	}
}
function doDiv5() { // alpsmain
	if (currentView != 4) {
		// if (currentView != 5) {
			alpsSettings.opacity = 0.0;
		// }
		lastView = currentView;
		currentView = 4;
		getCameraState();
			
		camPosTarget.y = 150;
		camPosTarget.z = -50;
		camTargetTarget.y = 100;

		globeTarget.y = globeRotation;

		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 150.0;
	
		rotatorTarget.x = 0.106;
		rotatorTarget.z = 0.756;		

		doSceneTweens();
		doMaterialTweens();
	}
}
function doDiv6() { // hannibalmain
	if (currentView != 5) {
		if (currentView == 6) {
			alpsSettings.uDisplacementPostScale = 2;
			alpsSettings.opacity2 = 0.0;
		}
		lastView = currentView;
		currentView = 5;
		getCameraState();
			
		camPosTarget.y = 120;
		camPosTarget.z = -20;
		camTargetTarget.y = 100;

		globeTarget.y = globeRotation;

		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 150.0;
	
		rotatorTarget.x = 0.09;
		rotatorTarget.z = 0.775;		
		
		doSceneTweens();
		doMaterialTweens();
	}
}
function doDiv7() { // regionmain
	if (currentView != 6) {
		regionSettings.opacity = 0.0;
		regionMain.opacity = 1.0;

		if (currentView == 5) {
			alpsSettings.uDisplacementPostScale = alpsMat.uniforms.uDisplacementPostScale.value;
			alpsSettings.opacity2 = 0.0;
		}

		lastView = currentView;
		currentView = 6;
		getCameraState();
			
		camPosTarget.y = 105;
		camPosTarget.z = -5;
		camTargetTarget.y = 99.98;

		globeTarget.y = globeRotation;

		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 300.0;
		
		rotatorTarget.x = 0.09;
		rotatorTarget.z = 0.759;		
		
		doSceneTweens();
		doMaterialTweens();
	}
}
function doDiv8() { // mountainmain
	if (currentView != 7) {
		mountainSettings.opacity = 0.0;
		mountainMain.opacity = 1.0;
		if (currentView == 6) {
			regionSettings.opacity = 0.0;
			regionMain.opacity = 1.0;
		}
		mtHeight = mountainMat.uniforms.sphereRadius.value;
		lastView = currentView;
		currentView = 7;
		getCameraState();
		camPosTarget.y = mtHeight + .09
		camPosTarget.z = -.3;
		camTargetTarget.y = mtHeight + .02;

		globeTarget.y = -0.5;

		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 300.0;
		
		rotatorTarget.x = 0.09277586790855208;
		rotatorTarget.z = 0.763802032176122;		
		
		doSceneTweens();
		doMaterialTweens();
	}
}

function doDiv9() { // globe3
	if (currentView != 8 ) {
		lastView = currentView;
		currentView = 8;
		getCameraState();

		camPosTarget.y = 400;
		camPosTarget.z = -800;
		camTargetTarget.y = 0;

		globeTarget.y = globeRotation;
		
		lightTarget.x = 0.0;
		lightTarget.y = 200.0;
		lightTarget.z = 0.0;
		
		rotatorTarget.x = 0.0;
		rotatorTarget.z = 0.0;

		doSceneTweens();
		doMaterialTweens();
	}
}

// set camera starting position
function getCameraState() {
	camPos.x = camera.position.x;
	camPos.y = camera.position.y;
	camPos.z = camera.position.z;
	camTarget.x = controls.target.x;
	camTarget.y = controls.target.y;
	camTarget.z = controls.target.z;
}


// SHADER TWEENS

globeSettings = { opacity: 0.0,
					bumpScale: 0.0,
					uDisplacementPostScale: 0.0,
					u_erode: large ? 0.005 : 0.008,
					u_dilate: 0.008,
					scale: 0.0,
					diffuse: 0.3,
					steps: large ? 15 : 10
				};		
globeMain = 	{ opacity: 1.0,
					bumpScale: 25.0,
					uDisplacementPostScale : 0.0,
					u_erode: large ? 0.005 : 0.008,
					u_dilate: 0.008,
					scale: 1.0,
					diffuse: 0.3,
					steps: large ? 15 : 10
				};
globe2Main = 	{ opacity : 1.0,
					bumpScale: 25.0,
					uDisplacementPostScale : large ? 80 : 50.0,
					u_erode : large ? 0.005 : 0.008,
					u_dilate : 0.008,
					scale: 1.0,
					diffuse: 0.5,
					steps: large ? 15 : 10
				};
europeMain = 	{ opacity : 1.0,
					bumpScale: large ? 7 : 10,
					uDisplacementPostScale: large ? 28 : 30.0,
					u_erode: 0.05,
					u_dilate: 0.025,
					diffuse: 0.2,
					scale: 1.0,
					steps: large? 20 : 10,
				};
eurobordersMain =	{ opacity : 1.0,
						bumpScale: 10,
						uDisplacementPostScale : 30.0,
						u_erode: 0.03,
						u_dilate: 0.025,
						diffuse: 0.2,
						scale: 1.0,
						steps: 10
				};
alpsSettings = 	{ opacity : 0.0,
					opacity2: 0.0,
					bumpScale : large ? 10 : 10,
					u_erode : 0.05,
					u_dilate: 0.02,
					diffuse : 0.4,
					uDisplacementPostScale : 4.0,
					uPointLightColor : 0.5,
					shininess : 40,
					specular : 3.0,
				};
alpsMain = 		{ opacity : 1.0,
					opacity2: 1.0,
					bumpScale : large ? 10 : 10,
					u_erode : 0.05,
					u_dilate: 0.02,
					diffuse : 0.4,
					uDisplacementPostScale : 4.0,
					uPointLightColor : 0.5,
					shininess : 40,
					specular : 3.0,
				};
hannibalMain = 	{ opacity : 1.0,
					opacity2: 1.0,
					bumpScale : 5.5,
					u_erode : 0.15,
					u_dilate: 0.08,
					diffuse : 0.75,
					uDisplacementPostScale : 2.0,
					uPointLightColor : 0.5,
					shininess : 50,
					specular : 2.5,
				};
regionSettings = { opacity : 0.0,
					bumpScale : 2.2,
					u_erode : 0.04,
					u_dilate: 0.012,
					steps: 15,
					diffuse : 0.8,
					uDisplacementPostScale : 1.0,
					uPointLightColor : 0.5,
					shininess : 50,
					specular : 2.5,
				};
regionMain = 	{ opacity : 1.0,
					bumpScale : 3,
					u_erode : 0.04,
					u_dilate: 0.012,
					steps: 5,
					diffuse : 0.8,
					uDisplacementPostScale : .45,
					uPointLightColor : 0.5,
					shininess : 20,
					specular : 2.5,
				};
mountainSettings = { opacity : 0.0,
						bumpScale : .2,
						u_erode : 1,
						u_dilate: 1,
						diffuse : 1,
						uDisplacementPostScale : .04,
					};
mountainMain = { opacity : 1.0,
					bumpScale : .2,
					u_erode : 1,
					u_dilate: 1,
					diffuse : 1,
					uDisplacementPostScale : .04,
				};
globe3Main = 	{ opacity : 0.0,
					bumpScale : 5.5,
					u_erode : 0.02,
					u_dilate: 0.01,
					diffuse : 0.2,
					uDisplacementPostScale : 1.0,
				};


// GEOMETRY TWEENS

var easeType = TWEEN.Easing.Quartic.InOut;

tweencamPos = new TWEEN.Tween(camPos)
.to(camPosTarget, 2000)
.easing(easeType)
.onUpdate( function () {
  camera.position.x = camPos.x;
  camera.position.y = camPos.y;
  camera.position.z = camPos.z;
});

tweencamTarget = new TWEEN.Tween(camTarget)
.to(camTargetTarget, 2000)
.easing(easeType)
.onUpdate( function () {
  controls.target.x = camTarget.x;
  controls.target.y = camTarget.y;
  controls.target.z = camTarget.z;
	});

tweenGlobe = new TWEEN.Tween(globe.rotation)
	.to(globeTarget, 2000)
.easing(easeType)
.onUpdate( function () {
  globe.rotation.y = this.y;
	})
; 

tweenRotator = new TWEEN.Tween(rotator.rotation)
.to(rotatorTarget, 2000)
.easing(easeType)
.onUpdate( function () {
  rotator.rotation.x = this.x;
  rotator.rotation.z = this.z;
} )
;   

tweenLight = new TWEEN.Tween(lightPos)
.to(lightTarget, 2000)
.easing(easeType)
.onUpdate( function () {
  pointLight.position.set(this.x, this.y, this.z);
		setMatUniform("uPointLightPos", pointLight.position);
} )
;   



// VIEW TWEENS

var globe_tween = new TWEEN.Tween(globeSettings)
.to(globeMain, 2000)
.easing(easeType)
	.onStart( function () {
		globeMesh.visible = true;
		globeMat.uniforms.opacity.value = 1;
		alpsMat.uniforms.opacity.value = 0;
		regionMat.uniforms.opacity.value = 0;
		mountainMat.uniforms.opacity.value = 0;

		globeMat.uniforms.tDiffuseOpacity.value = this.diffuse;
		globeMat.uniforms.bumpScale.value = this.bumpScale;
		globeTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
		globeTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
		globeTexture.textureMat.uniforms.u_erode.value = this.u_erode;
		globeTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;
		
		
		prepTextures(RTTs["globe"]);
	})
.onUpdate( function () {
	globeMat.uniforms.opacity.value = this.opacity;
	globeMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
	globeMesh.scale.set(this.scale, this.scale, this.scale);

});

var globe2_tween = new TWEEN.Tween(globeSettings)
.to(globe2Main, 2000)
.easing(easeType)
.onStart( function () {
	globeMesh.visible = true;
	alpsMat.uniforms.opacity.value = 0;
	regionMat.uniforms.opacity.value = 0;
	mountainMat.uniforms.opacity.value = 0;
	globeTexture.textureMat2.uniforms.u_erode.value = globeSettings.u_erode;
	globeTexture.textureMat2.uniforms.u_dilate.value = globeSettings.u_dilate;
	globeTexture.textureMat.uniforms.u_erode.value = globeSettings.u_erode;
	globeTexture.textureMat.uniforms.u_dilate.value = globeSettings.u_dilate;
	loopSteps = this.steps;
	prepTextures(RTTs["globe"]);
	})
.onUpdate( function () {

	globeMat.uniforms.tDiffuseOpacity.value = this.diffuse;
	globeMat.uniforms.opacity.value = this.opacity;
	globeMat.uniforms.bumpScale.value = this.bumpScale;
	globeMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
	globeTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
	globeTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
	globeTexture.textureMat.uniforms.u_erode.value = this.u_erode;
	globeTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;
	// if coming from europe
	if (lastView == 2 || lastView == 3) {
		prepTextures(RTTs["globe"]);
	}
	globeMesh.scale.set(this.scale, this.scale, this.scale);

	})
.onComplete( function () {
	prepTextures(RTTs["globe"]);
});


var europe_tween = new TWEEN.Tween(globeSettings)
.to(europeMain, 2000)
.easing(easeType)
	.onStart( function () {
		log('europe_tween');
		alpsMat.uniforms.opacity.value = 0;
		regionMat.uniforms.opacity.value = 0;
		mountainMat.uniforms.opacity.value = 0;
		globeMesh.visible = true;
		globeMesh.scale.set(1.0, 1.0, 1.0);
	})
.onUpdate( function () {
	globeMat.uniforms.opacity.value = this.opacity;
	globeMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
	globeMat.uniforms.bumpScale.value = this.bumpScale;
	if (globeSettings.u_erode != europeMain.u_erode) {
		globeTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
		globeTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
		globeTexture.textureMat.uniforms.u_erode.value = this.u_erode;
		globeTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;
		prepTextures(RTTs["globe"]);
	}
	});

// dodiv4
var euroborders_tween = new TWEEN.Tween(globeSettings)
.to(eurobordersMain, 2000)
.easing(easeType)
	.onStart( function () {
		if (lastView > 3) {
			alpsMat.depthTest = false;
			alpsSettings.opacity = 0;
		}
		globeMat.uniforms.opacity.value = 1;
		globeMesh.visible = true;
		globeMesh.scale.set(1.0, 1.0, 1.0);
		globeTexture.textureMat2.uniforms.u_erode.value = eurobordersMain.u_erode;
		globeTexture.textureMat2.uniforms.u_dilate.value = eurobordersMain.u_dilate;
		globeTexture.textureMat.uniforms.u_erode.value = eurobordersMain.u_erode;
		globeTexture.textureMat.uniforms.u_dilate.value = eurobordersMain.u_dilate;
		prepTextures(RTTs["globe"]);
	})
.onUpdate( function () {
	globeMat.uniforms.bumpScale.value = this.bumpScale;
		globeMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
		if (lastView > 3) {
			mats[lastView].uniforms.opacity.value = alpsSettings.opacity = 1 - this.opacity;
		}
})
	.onComplete( function () {
	})
;

// dodiv5
alps_tween = new TWEEN.Tween(alpsSettings)
.to(alpsMain, 2000)
.easing(easeType)
	.onStart( function() {
		alpsMat.depthTest = false;
		globeMesh.scale.set(1,1,1)
		regionMat.uniforms.opacity.value = 0;
		mountainMat.uniforms.opacity.value = 0;
		if (lastView < currentView) {
			alpsTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
			alpsTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
			alpsTexture.textureMat.uniforms.u_erode.value = this.u_erode;
			alpsTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;
			prepTextures(RTTs["alps"]);
		}
	})
.onUpdate( function () {
	alpsMat.uniforms.tDiffuseOpacity.value = this.diffuse;
	alpsMat.uniforms.uPointLightColor.value = new THREE.Color().setRGB(this.uPointLightColor,this.uPointLightColor,this.uPointLightColor);
	alpsMat.uniforms.shininess.value = this.shininess;
	alpsMat.uniforms.specular.value = new THREE.Color().setRGB(this.specular,this.specular,this.specular);

	alpsMat.uniforms.bumpScale.value = this.bumpScale;
	alpsMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
	alpsMat.uniforms.opacity.value = this.opacity;

	alpsTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
	alpsTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
	alpsTexture.textureMat.uniforms.u_erode.value = this.u_erode;
	alpsTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;

	// transition from globe
	if (lastView < currentView) {
		globeMat.uniforms.uDisplacementPostScale.value = globeSettings.uDisplacementPostScale * (1 - this.opacity * .75);
	} else if (lastView == 5) {
		prepTextures(RTTs["alps"]);
	}

})
	.onComplete( function() { 
		globeMesh.scale.set(.95,.95,.95);
		alpsMat.depthTest = true;
		regionMat.uniforms.opacity.value = 0;
		mountainMat.uniforms.opacity.value = 0;
	})
;

hannibal_tween = new TWEEN.Tween(alpsSettings)
.to(hannibalMain, 2000)
.easing(easeType)
	.onStart( function() {
		globeMesh.visible = false;
		regionMat.uniforms.opacity.value = 0;
		mountainMat.uniforms.opacity.value = 0;

		alpsTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
		alpsTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
		alpsTexture.textureMat.uniforms.u_erode.value = this.u_erode;
		alpsTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;
		prepTextures(RTTs["alps"]);

	})
.onUpdate( function () {
	alpsMat.uniforms.bumpScale.value = this.bumpScale;
	alpsMat.uniforms.tDiffuseOpacity.value = this.diffuse;

	alpsMat.uniforms.bumpScale.value = this.bumpScale;
	alpsMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
	alpsMat.uniforms.opacity.value = this.opacity;
	
	alpsTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
	alpsTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
	alpsTexture.textureMat.uniforms.u_erode.value = this.u_erode;
	alpsTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;
	
	alpsMat.uniforms.uPointLightColor.value = new THREE.Color().setRGB(this.uPointLightColor,this.uPointLightColor,this.uPointLightColor);
	alpsMat.uniforms.shininess.value = this.shininess;
	alpsMat.uniforms.specular.value = new THREE.Color().setRGB(this.specular,this.specular,this.specular);

	// only recalculate if coming from alps
	if (lastView == 4) {
		prepTextures(RTTs["alps"]);
	}
		else if (lastView == 6) {
		regionSettings.opacity = 1 - this.opacity2;
		regionMat.uniforms.opacity.value = 1 - this.opacity2;
	}
})
	.onComplete( function() { 
		globeMesh.scale.set(.95,.95,.95);
		regionMat.uniforms.opacity.value = 0;
		mountainMat.uniforms.opacity.value = 0;
		prepTextures(RTTs["alps"]);
	})
;

region_tween = new TWEEN.Tween(regionSettings)
.to(regionMain, 2000)
.easing(easeType)
	.onStart( function() {
		alpsMat.depthTest = false;
		mountainMat.uniforms.opacity.value = 0;

		regionMat.uniforms.tDiffuseOpacity.value = this.diffuse;
		regionMat.uniforms.bumpScale.value = this.bumpScale;
		regionMat.depthTest = true;
		regionMat.uniforms.uPointLightColor.value = new THREE.Color().setRGB(this.uPointLightColor,this.uPointLightColor,this.uPointLightColor);
		regionMat.uniforms.shininess.value = this.shininess;
		regionMat.uniforms.specular.value = new THREE.Color().setRGB(this.specular,this.specular,this.specular);

		loopSteps = this.steps;
		regionTexture.textureMat2.uniforms.u_erode.value = this.u_erode;
		regionTexture.textureMat2.uniforms.u_dilate.value = this.u_dilate;
		regionTexture.textureMat.uniforms.u_erode.value = this.u_erode;
		regionTexture.textureMat.uniforms.u_dilate.value = this.u_dilate;

		if (lastView < 6) {
			alpsSettings.uDisplacementPostScale = alpsMat.uniforms.uDisplacementPostScale.value;
			regionMat.uniforms.opacity.value = 0;
		}
		prepTextures(RTTs["region"]);

		})
.onUpdate( function () {
	regionMat.uniforms.opacity.value = this.opacity;
	regionMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
	regionMat.uniforms.tDiffuseOpacity.value = this.diffuse;
	if (lastView == 5) {
		alpsMat.uniforms.uDisplacementPostScale.value = alpsSettings.uDisplacementPostScale * (1 - Math.max(this.opacity, 0.01)*.75);
	}
	if (lastView == 7) {
		mountainMat.uniforms.opacity.value = 1 - this.opacity;
		mountainSettings.opacity = 1 - this.opacity;
	}
});


mountain_tween = new TWEEN.Tween(mountainSettings)
.to(mountainMain, 2000)
.easing(easeType)
	.onStart( function() {
		globeMat.uniforms.opacity.value = 0;
		alpsMat.uniforms.opacity.value = 0;
		regionMat.uniforms.opacity.value = 1 - this.opacity;
		mountainMat.uniforms.opacity.value = this.opacity;

		mountainMat.uniforms.bumpScale.value = this.bumpScale;
		mountainMat.uniforms.tDiffuseOpacity.value = this.diffuse;
		mountainMat.uniforms.uPointLightColor.value = new THREE.Color().setRGB(0,0,0);
		mountainMat.uniforms.uDisplacementPostScale.value = this.uDisplacementPostScale;
	})
.onUpdate( function () {
	mountainMat.uniforms.opacity.value = this.opacity;
	regionMat.uniforms.opacity.value = 1 - this.opacity;
});


function doSceneTweens() {
	tweenGlobe.start();
	tweenRotator.start();
	tweenLight.start();
	tweencamPos.start();
	tweencamTarget.start();
}      

// trigger visibility tweens based on view
function doMaterialTweens() {
	// log("currentView: "+currentView+" lastView: "+lastView)
	for (x in viewsList) {
		if (currentView == x) {
			// current view position
			window[viewsList[x]+"_tween"]["start"]();
		} else {
			// stop all other tweens
			// this is a good idea eventually
			window[viewsList[x]+"_tween"]["stop"]();
		}
	}
}


//
// PAGE SETUP
//

window.addEventListener("load", function() {
	// when page loads, size all container divs to make them square
	container = document.getElementById("globecontainer");
	for (div in divList) {
		$('#'+div).height(container.offsetWidth+"px");
	}
});

var docViewTop, docViewBottom;

// finds the div whose middle is closest to center screen
function position(div) {
	// console.log('div:', div)
	if ($("#"+div).offset() == undefined) {return false;}
	else {
		var divTop = $("#"+div).offset().top;
		var divBottom = divTop + $("#"+div).height();
		return (divTop + divBottom)/2;
	}
}

// check to see which div is closest to center screen
function startDivCheck() {
	setInterval( function() {
		docViewTop = $(window).scrollTop();
		docViewBottom = docViewTop + $(window).height();
		docMiddle = (docViewTop+docViewBottom)/2;
		var closest = ["", 1000000]
		// determine which div is closest
		for (var div in divList) {
			var distance = Math.abs(position(div) - docMiddle);
			if (distance < closest[1]) {
				closest[0] = div;
				closest[1] = distance;
			}
		}
		// if it's a new closest div
		if (closest[0] != currentDiv) {
			currentDiv = closest[0];
			// move canvas to div
			$("#globecontainer").fadeOut(100, function() {
				setTimeout($("#globecontainer").appendTo('#'+closest[0]), 250);
			}).fadeIn(350);
			// trigger the associated tween
			divList[closest[0]]();
		}
	// check every n milliseconds
	}, 500);
}

function globeResize() {
	container = document.getElementById("globecontainer");
	for (div in divList) {
		$('#'+div).height(container.offsetWidth);
	}
	// make renderer square
	containerHeight = container.offsetWidth;
	// fit the renderer to the container
	renderer.setSize( container.offsetWidth, containerHeight );
	// update the camera
	camera.aspect = container.offsetWidth / containerHeight;
	camera.updateProjectionMatrix();
	render();	
}


window.onload = function() {
	// check for IE
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	var trident = ua.indexOf("Trident");
	// if (msie > 0)

	// if WebGL support not detected, bail
	if (!Detector.webgl || (msie > 0) || (trident > 0)) {
	// if (true) { // testing
		console.log("Scene failed to start.")
		return;
	}

	// hide fallback images and apology
	document.getElementById("apology").style.visibility = "hidden";
	document.getElementById("apology").style.display = "none";
	var fallbacks = document.getElementsByClassName('fallback');
	for(i=0; i<fallbacks.length; i++) {
		fallbacks[i].style.display = 'none';
		fallbacks[i].style.visibility = 'hidden';
	}

	// enable div resizing
	window.addEventListener("resize", function() {
		globeResize();	
	});

	// switch textures images based on window width
	large = false
	// load dem textures first thing
	globeImage = THREE.ImageUtils.loadTexture(
		large ? '../img/Srtm.2k_norm.jpg' : '../img/Srtm.1k_norm.jpg',
		new THREE.UVMapping(),
		// callback function
		function() {
			globeTexture = prepRTT(globeImage, vs, fs_dilate);
			addRTT("globe", globeTexture);
		}
	);

	alpsImage = THREE.ImageUtils.loadTexture(
		large ? '../img/alps_2k_norm.jpg' : '../img/alps_1k_norm.jpg',
		new THREE.UVMapping(),
		// callback function
		function() {
			alpsTexture = prepRTT(alpsImage, vs, fs_dilate);
			addRTT("alps", alpsTexture);
		}
	);
	
	regionImage = THREE.ImageUtils.loadTexture(
		large ? '../img/region2_2k.jpg' : '../img/region2_1k.jpg',
		new THREE.UVMapping(),
		// callback function
		function() {
			regionTexture = prepRTT(regionImage, vs, fs_dilate);
			addRTT("region", regionTexture);
		}
	);
}



// create custom RTT scenes for a texture
function addRTT(name, texture) {
	RTTs[name] = texture; // register texture so it can be referenced by name

	// once all three RTTs are loaded
	if (Object.keys(RTTs).length == 3) {
		init();
	}
}
	
function adjustNormScene(width, height) {
		// recreate buffer
		normTexture = new THREE.WebGLRenderTarget( width, height, renderTargetParams );	

		// resize texture to match image size
		normTextureMat.uniforms.u_textureSize.value = new THREE.Vector2( width, height );
		normTextureMat.needsUpdate = true;
		// recreate rtt scene
		normScene.remove( normTextureMesh );
		normTextureGeo = new THREE.PlaneGeometry( width, height );
		normTextureMesh = new THREE.Mesh( normTextureGeo, normTextureMat );
		normTextureMesh.position.z = -100;
		normScene.add( normTextureMesh );
		normCamera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 10000 );
}


//
// INTERACTION
//

var mouseDown = false,
	mouseX = 0,
	mouseY = 0;
		
function onMouseMove(evt) {
	if (!mouseDown) { return; }

	evt.preventDefault();

	var deltaX = evt.clientX - mouseX,
			deltaY = evt.clientY - mouseY;
	if (evt.clientX != 0) {
		mouseX = evt.clientX;
		mouseY = evt.clientY;
	}
	rotateScene(deltaX, deltaY);
	render();
}

function onMouseDown(evt) {
		evt.preventDefault();
		mouseDown = true;
	if (evt.clientX != 0) {
		mouseX = evt.clientX;
		mouseY = evt.clientY;
	}
}

function onMouseUp(evt) {
		evt.preventDefault();
		mouseDown = false;
}


// cross-browser scrollwheel handling
function addMouseHandler(div) {
	div.addEventListener('mousemove', function (e) {
			onMouseMove(e);
	}, false);
	div.addEventListener('mousedown', function (e) {
			onMouseDown(e);
	}, false);
	div.addEventListener('mouseup', function (e) {
			onMouseUp(e);
	}, false);
}

function rotateScene(deltaX, deltaY) {
	globe.rotation.y += deltaX / 100;
	// keep rotation within PI rads of 0 to prevent auto-rotations of > 180°
	if (globe.rotation.y > Math.PI) { globe.rotation.y -= Math.PI*2 }
	if (globe.rotation.y < -Math.PI) { globe.rotation.y += Math.PI*2 }
}
