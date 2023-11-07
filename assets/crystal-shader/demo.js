let rotationConstraint = 4;

let scrollDiv = document.getElementById("scrollDiv");
let rotateDiv = document.getElementById("rotateDiv");

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

function parallaxScroll(x) {
  let bbox = scrollDiv.getBoundingClientRect();
  scrollDiv.style.left  = `calc(${x}px - ${bbox.width/2}px)`;  
  scrollDiv.style.backgroundPosition = - x/2 + 'px 0px';
}

document.getElementById("rotateContainer").addEventListener('mousemove', e => {
  window.requestAnimationFrame(() => {
    parallaxRotate(e.clientX);
  });
});

document.getElementById("scrollContainer").addEventListener('mousemove', e => {
  window.requestAnimationFrame(() => {
    parallaxScroll(e.clientX);
  });
});

document.addEventListener('mousemove', e => {
  window.requestAnimationFrame(() => {
    updateCubeRotation(e)
  });
});


const cube = document.getElementById('cube');

// Update the transform property of the cube and the background position for parallax effect
function updateCubeRotation(event) {
  const { clientX, clientY } = event;
  const { left, top, width, height } = cube.getBoundingClientRect();

  const center = {
    x: left + width / 2 + 50, // 50 to center the cube in its parent
    y: top + height / 2,
  };

  const deltaX = clientX - center.x;
  const deltaY = clientY - center.y;

  // Adjust these values to control the rotation sensitivity
  const rotateY = deltaX * 0.1;
  const rotateX = deltaY * -0.1;

  const transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(-50px) translateY(-25px)`; // translate to center the cube
  cube.style.transform = transform;

  // Get all cube faces and update background position
  const faces = cube.querySelectorAll('.face');
  faces.forEach(face => {
    let bgPosX = -rotateY; // flip this here because the background origin (0,0) is at the top
    let bgPosY = rotateX;
    face.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  });
}
