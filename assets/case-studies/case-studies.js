
let overlays = document.querySelectorAll('.overlay,.underlay,.shadow,.overlayshadow');
console.log(overlays);

    // Function to get the scroll offset of the center of the viewport
    function getViewportCenterScrollOffset() {
      const viewportHeight = window.innerHeight;

      const centerY = viewportHeight / 2;

      const scrollY = window.scrollY || window.pageYOffset;

      const offsetY = scrollY + centerY;

      return offsetY;
    }

    // Example usage
    const centerScrollOffset = getViewportCenterScrollOffset(window);
    console.log(centerScrollOffset); // Output: Object { x: <center-x-offset>, y: <center-y-offset> }
  

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

    // const element = document.getElementById('element');
    // const elementScrollOffset = getElementCenterScrollOffset(element);
    // console.log(elementScrollOffset); // Output: Object { x: <center-x-offset>, y: <center-y-offset> }


for (var x=0; x < overlays.length; x++) {
  console.log(overlays[x]);
     const centerScrollOffset = getElementCenterScrollOffset(overlays[x]);
    console.log(centerScrollOffset); // Output: Object { x: <center-x-offset>, y: <center-y-offset> }

}

  // The debounce function receives our function as a parameter
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


// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
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

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();