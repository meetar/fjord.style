let illustrations = document.querySelectorAll('.illustration');
let overlays = document.querySelectorAll('.overlay,.underlay,.shadow,.overlayshadow');

    // Function to get the scroll offset of the center of the viewport
    function getViewportCenterScrollOffset() {
      const viewportHeight = window.innerHeight;

      const centerY = viewportHeight / 2;

      const scrollY = window.scrollY || window.pageYOffset;

      const offsetY = scrollY + centerY;

      return offsetY;
    }

    const centerScrollOffset = getViewportCenterScrollOffset(window);

    // Function to find the first ancestor with a scrollable container
    function findScrollableContainer(element) {
      while (element !== document.body) {
        const { overflowX, overflowY } = window.getComputedStyle(element);
        if (overflowX === 'auto' || overflowX === 'scroll' || overflowY === 'auto' || overflowY === 'scroll') {
          return element;
        }
        element = element.parentElement;
      }
      return document.documentElement; // If no scrollable container found, fallback to the documentElement (usually the <html> element)
    }

    // Function to get the scroll offset of the center of an element
    function getElementCenterScrollOffset(element) {
      const elementRect = element.getBoundingClientRect();
      const container = findScrollableContainer(element);

      const centerY = elementRect.height / 2;

      const scrollY = window.scrollY || window.pageYOffset;

      const offsetY = scrollY + elementRect.top + centerY;

      return offsetY;
    }


for (var x=0; x < overlays.length; x++) {
    const centerScrollOffset = getElementCenterScrollOffset(overlays[x]);

}

function toggleSwipe(div) {
  let targets = div.querySelectorAll(".shadow, .underlay, .overlay")
  for (var x=0; x < targets.length; x++) {
    targets[x].classList.toggle('swiped')
  }
}

for (var x=0; x < illustrations.length; x++) {
  let div = illustrations[x];
    div.addEventListener('click', e => toggleSwipe(e.currentTarget));

}

const debounce = (fn) => {

  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame;

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params) => {
    
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) { 
      cancelAnimationFrame(frame);
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      
      // Call our function and pass any params we received
      fn(...params);
    });

  } 
};


const storeScroll = () => {
  const centerScrollOffset = getViewportCenterScrollOffset();  
  for (var x=0; x < overlays.length; x++) {
     const elementScrollOffset = getElementCenterScrollOffset(overlays[x]);
    if (elementScrollOffset < centerScrollOffset) {
      overlays[x].classList.add('swiped')
    } else {
      overlays[x].classList.remove('swiped')
    }
  }
}

document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();