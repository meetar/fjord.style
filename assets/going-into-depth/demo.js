let rotationConstraint = 4;

let scrollDiv = document.getElementById("scrollDiv");
let rotateDiv = document.getElementById("rotateDiv");

//
// scrolling parallax example
//

function parallaxScroll(x) {
  let bbox = scrollDiv.getBoundingClientRect();
  scrollDiv.style.left  = `calc(${x}px - ${bbox.width/2}px)`;
  scrollDiv.style.backgroundPositionX = - x/2 + 'px';
}


//
// rotation parallax example
//

function parallaxRotate(x) {
  let bbox = rotateDiv.getBoundingClientRect();
  let rotateY = (x - bbox.x - (bbox.width / 2)) / rotationConstraint;
  rotateY = Math.max(rotateY, -85);
  rotateY = Math.min(rotateY, 85);

  // 10000px approximates a very long lens
  rotateDiv.style.transform  = "perspective(10000px) "
    + "   rotateX("+ -10 +"deg) "
    + "   rotateY("+ rotateY +"deg) "

  // prevent the background offset from being calculated if the frame is at its limit
  if (Math.abs(rotateY) == 85) return;

  // calculate tangent of the angle in radians
  const angleInRadians = (rotateY * Math.PI) / 180;
  const tanAngle = Math.tan(angleInRadians);
  // offset background position by the tangent times an arbitrary multiplier
  const bgoffset = -tanAngle * 50;

  // apply new background image position to xoffset only
  rotateDiv.style.backgroundPosition = bgoffset + 'px 0px';
}


//
// 3D cube example
//


const cube = document.getElementById('cube');

// CSS cube rotation and backgroundPosition
function updateCubeRotation(clientX, clientY) {
  const { left, top, width, height } = cube.getBoundingClientRect();

  const center = {
    x: left + width / 2 + 50, // 50 to center the cube in its parent
    y: top + height / 2,
  };

  const deltaX = clientX - center.x;
  const deltaY = clientY - center.y;

  // rotation sensitivity
  const rotateY = deltaX * 0.1;
  const rotateX = deltaY * -0.1;

  const transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(-50px) translateY(-50px)`; // translate to center manually
  cube.style.transform = transform;

  const faces = cube.querySelectorAll('.face');
  faces.forEach(face => {
    // use a linear relationship between rotation and background position for simplicity –
    // this prevents switching cases for each face to handle proper tangent orientation
    let bgPosX = -rotateY; // flip this here because the background origin (0,0) is at the top
    let bgPosY = rotateX;
    face.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  });
}


// 
// canvas parallax example
// 

const image = new Image();
image.src = 'assets/going-into-depth/speckles2.png';
const cheeseContainer = document.getElementById('cheeseContainer');
const cheeseContainerReverse = document.getElementById('cheeseContainerReverse');

image.onload = function () {
  // create a canvas to manipulate the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const imageWidth = image.width;
  const imageHeight = image.height;
  const numRanges = 7; // number of brightness ranges
  const step = 256 / numRanges; // calculate step for splitting into ranges

  for (let range = 0; range < numRanges; range++) {
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // define brightness range for this canvas
    const minBrightness = range * step;
    const maxBrightness = (range + 1) * step;

    // iterate through pixels and set alpha based on brightness range – 
    // array is a Uint8ClampedArray with a stride of 4: r, g, b, a
    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = pixels[i]; // only need to check one channel to calculate brightness

      // check if the brightness falls within the specified range
      if (brightness >= minBrightness && brightness < maxBrightness) {
        pixels[i + 3] = 255; // fully opaque
      } else {
        pixels[i + 3] = 0; // fully transparent
      }
    }

    // write modified image data back to the canvas
    ctx.putImageData(imageData, 0, 0);

    // create a new canvas element for the page, containing only pixels from the current brightness range
    const newCanvas = document.createElement('canvas');
    newCanvas.willReadFrequently = true;

    newCanvas.className = 'cheeseSlice';
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    newCanvas.getContext('2d').drawImage(canvas, 0, 0);

    // append the canvas to the cheeseContainer
    cheeseContainer.appendChild(newCanvas);

    
    // prepend the canvas to the reversed cheeseContainers
    ['cheeseContainerReverse', 'cheeseContainerLighten'].forEach(selector => {
      // clone the canvas element
      const clonedCanvas = cloneCanvas(newCanvas);
      const div = document.getElementById(selector);
      div.insertBefore(clonedCanvas, div.firstChild);
    });
  }

};

function cloneCanvas(canvas) {
  const clonedCanvas = canvas.cloneNode();

  // Create a context for the cloned canvas
  const clonedContext = clonedCanvas.getContext('2d');

  // Set the dimensions of the cloned canvas
  clonedCanvas.width = canvas.width;
  clonedCanvas.height = canvas.height;

  // Copy the content from the original canvas to the cloned canvas
  clonedContext.drawImage(canvas, 0, 0);
  return clonedCanvas
}

// range of motion modulation, from least motion to most motion (furthest to nearest for parallax effect)
const startFactor = .1;
const endFactor = .2;

function updateCheese(clientX, clientY, selector) {
  const containerDiv = document.getElementById(selector);
  const canvasList = document.querySelectorAll(`#${selector} > .cheeseSlice`);
  const numCanvases = canvasList.length;
  const rect = containerDiv.getBoundingClientRect();
  var mouseX = clientX - rect.left ;
  var mouseY = clientY - rect.top;

  // if the mouse is too far away, set the input position to the center of the container div so all offsets are 0,0
  if (Math.abs(mouseY) > 300) {
    mouseY = rect.height / 2;
    mouseX = rect.width / 2;
  }

  const centerX = containerDiv.clientWidth / 2;
  const centerY = containerDiv.clientHeight / 2;

  for (let i = 0; i < numCanvases; i++) {
    const canvas = canvasList[i];
    const factor = startFactor + (endFactor - startFactor) * (i / (numCanvases - 1));

    const offsetX = (mouseX - centerX) * factor;
    const offsetY = (mouseY - centerY) * factor;

    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
};


//
// event handlers
//

function handleScroll(e) {
  // handle mouse and touch events
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  e.preventDefault();
  window.requestAnimationFrame(() => {
    parallaxScroll(clientX);
  });
}

function handleRotate(e) {
  // handle mouse and touch events
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  e.preventDefault();
  window.requestAnimationFrame(() => {
    parallaxRotate(clientX);
  });
}

// track whether touchstart event started within the allowed divs
let touchStartedInsideDiv = false;

// set flag if the touch starts inside the allowed divs
document.querySelectorAll('#cubeContainer, #cheeseContainer').forEach(div => {
    div.addEventListener('touchstart', function() {
      touchStartedInsideDiv = true;
  });
});

// reset the flag when the touch ends
document.addEventListener('touchend', function() {
  touchStartedInsideDiv = false;
});

// Reset the flag if the touch is cancelled
document.addEventListener('touchcancel', function() {
  touchStartedInsideDiv = false;
});

function handleDocumentMove(e) {
  // handle mouse and touch events
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  // handle mobile behavior
  if (e.touches) {
    if (touchStartedInsideDiv) {
    // don't scroll on mobile
    e.preventDefault()
    } else {
      // don't rotate cube if touch started outside of the container
      return;
    }
  }

  window.requestAnimationFrame(() => {
    updateCubeRotation(clientX, clientY);
    ['cheeseContainer', 'cheeseContainerReverse', 'cheeseContainerLighten'].forEach(selector => {
      updateCheese(clientX, clientY, selector);
    })
  });

}

// mouse event listeners
document.getElementById("rotateContainer").addEventListener('mousemove', handleRotate);
document.getElementById("scrollContainer").addEventListener('mousemove', handleScroll);
document.addEventListener('mousemove', handleDocumentMove);

// touch event listeners
document.getElementById("rotateContainer").addEventListener('touchmove', handleRotate, { passive: false });
document.getElementById("scrollContainer").addEventListener('touchmove', handleScroll, { passive: false });
document.addEventListener('touchmove', handleDocumentMove, { passive: false });
