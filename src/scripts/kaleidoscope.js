// raf is a npm module that includes the polifylls of requestAnimationFrame
import raf from 'raf.js';
//This is our library that generates the kaliedoscope
import Kaleidoscope from './libs/kaleidoCanvas.js';
// There are some funky stuff happening in mobile, you will see below.. We need these tests :)
import isMobile from './libs/isMobile.js';
import isPointer from './libs/isPointer.js';

const options = {
  //This option tells us if we want to allow people to change the pattern of the kaleidoscope
  interactive: true,
  ease: 0.1,
  tx: 0,
  ty: 0,
  tr: 0,
};

// let! Anoter es2015 cool feature. It is kind of the most famous one.
// It gives us the joy to have scoped variables, so no hoisting with them.
let animationframeID;

/**
 * In mobile each time you swipe your finger over the kaliedoscope new patterns
 * are created, the caluculation is done by using some factors. Well, in Desktop there is a kind
 * of logic behind it, in mobile... well. Is random :)
 *
 * @param  {Integer} factor = 100 This is another cool thing. default Values in the arguments :)
 * @return {Integer}        Random number
 */
function calculateRandomNumber( factor = 100 ) {
  return Math.random() * factor;
}

/**
 * It recives the kaleidoscope object, and will be called each time
 * you swipe over the kaleidoscope. It will generate a new pattern
 *
 * @param  {Kaleidoscope} kaleidoscope
 */
function updateKaleidoscopePattern( kaleidoscope ) {
  if ( options.interactive ) {
    /*
     *  for some reason those values are sometimes 'NaN',
     *  so, when it happens I pretend they are not with a random value.
     *  - clever, isn't it?
     *  - no, it is a hack!
     *  - well, it works on my machine.
     *  - Maybe there is a clever explanation for it. If you found it, let us know via issues.
     */
    const kaleidoscopeoffsetX = isNaN( kaleidoscope.offsetX ) ? calculateRandomNumber() : kaleidoscope.offsetX;
    const kaleidoscopeoffsetY = isNaN( kaleidoscope.offsetY ) ? calculateRandomNumber() : kaleidoscope.offsetY;
    const kaleidoscopeoffsetRotation = isNaN( kaleidoscope.offsetRotation ) ? calculateRandomNumber() : kaleidoscope.offsetRotation;

    const optionstr = isNaN( options.tr ) ? calculateRandomNumber( 10 ) : options.tr;
    const optionstx = isNaN( options.tx ) ? calculateRandomNumber( 10 ) : options.tx;
    const optionsty = isNaN( options.ty ) ? calculateRandomNumber( 10 ) : options.ty;

    const delta = optionstr - kaleidoscope.offsetRotation;
    const theta = Math.atan2( Math.sin( delta ), Math.cos( delta ) );

    kaleidoscope.offsetX += ( optionstx - kaleidoscopeoffsetX ) * options.ease;
    kaleidoscope.offsetY += ( optionsty - kaleidoscopeoffsetY ) * options.ease;
    kaleidoscope.offsetRotation += ( theta - kaleidoscopeoffsetRotation ) * options.ease;
    kaleidoscope.draw();
  }
}

/**
 * Here is where we use raf. Each time we want to update the kaleidoscope,
 * we time it, so it happens the next time the browser will render Something
 *
 * @param  {Kaleidoscope} kaleidoscope
 */
function updateKaleidoscopeShape( kaleidoscope ) {
  animationframeID = window.requestAnimationFrame( updateKaleidoscopePattern.bind( this, kaleidoscope ) );
};

function init() {
  const shareButton = document.querySelector( '.js-button-share' );
  const kaleidoscopeContainer = document.querySelector( '.kaleidoscope-container' );
  const photo = document.querySelector( '.photo' );
  //When we instatiate this class, the kaleidoscope is initiated.
  const kaleidoscope = new Kaleidoscope( {
    slices: 20
  } );

  //Here we give it the src of the image to use, and an onload event will be triggered to draw the figure
  kaleidoscope.image.src = photo.src;

  options.tx = kaleidoscope.offsetX;
  options.ty = kaleidoscope.offsetY;
  options.tr = kaleidoscope.offsetRotation;

  shareButton.addEventListener( 'click', () => {
    // Here we send the image to the next screen
    const data = kaleidoscope.domElement.toDataURL( 'image/png' );
    const img = document.querySelector( '.js-image-to-share' );
    img.setAttribute( 'src', data );
  } );

  //Pointer events are also a blog post on their own. What it matters here
  //is that if we can use the pointermove event, we will use it.
  const moveEvent = ( isPointer.test() ) ? 'pointermove' : 'touchmove';

  //Test for mobile, otherwise attach mousemove
  const pointerMove = ( isMobile.test() ) ? moveEvent : 'mousemove';

  /*
   *  On Move calculate some stuff to get numbers that
   *  Change the Kaleidoscope
   */
  kaleidoscopeContainer.addEventListener( pointerMove, ( e ) => {
    const dx = e.pageX / window.innerWidth;
    const dy = e.pageY / window.innerHeight;
    const hx = dx * 0.5;
    const hy = dy * 0.5;
    options.tx = hx * kaleidoscope.radius * -2;
    options.ty = hy * kaleidoscope.radius * 2;
    options.tr = Math.atan2( hy, hx );
    updateKaleidoscopeShape( kaleidoscope );
  } );
}

export default {
  init
};
