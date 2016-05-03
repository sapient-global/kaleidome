import raf from 'raf.js';
import Kaleidoscope from './libs/kaleidoCanvas.js';
import isMobile from './libs/isMobile.js';
import isPointer from './libs/isPointer.js';

const options = {
  interactive: true,
  ease: 0.1,
  tx: 0,
  ty: 0,
  tr: 0,
};

let animationframeID;

function calculateRandomNumber( factor = 100 ) {
  return Math.random() * factor;
}

function updateKaledo( kaleidoscope ) {
  if ( options.interactive ) {

    /*
     *  for some reason those values are sometimes 'NaN',
     *  so, when it happens I pretend they are not with a random value.
     *  - clever, isn't it?
     *  - no, it is a hack!
     *  - well, it works on my machine.
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

function updateKaleidoscopeShape( kaleidoscope ) {
  animationframeID = requestAnimationFrame( updateKaledo.bind( this, kaleidoscope ) );
};

function init() {
  const shareButton = document.querySelector( '.js-button-share' );
  const kaleidoscopeContainer = document.querySelector( '.kaleidoscope-container' );
  const photo = document.querySelector( '.photo' );
  const kaleidoscope = new Kaleidoscope( {
    slices: 20
  } );

  kaleidoscope.image.src = photo.src;

  options.tx = kaleidoscope.offsetX;
  options.ty = kaleidoscope.offsetY;
  options.tr = kaleidoscope.offsetRotation;

  shareButton.addEventListener( 'click', () => {
    const data = kaleidoscope.domElement.toDataURL( 'image/png' );
    const img = document.querySelector( '.js-image-to-share' );
    img.setAttribute( 'src', data );
  } );

  //Ensure that Pointer can be used
  const moveEvent = ( isPointer.test() ) ? 'pointermove' : 'touchmove';
  const stopEvent = ( isPointer.test() ) ? 'pointerup' : 'touchend';

  const pointerMove = ( isMobile.test() ) ? moveEvent : 'mousemove';
  const pointerStop = ( isMobile.test() ) ? stopEvent : 'mousestop';

console.log( pointerMove, pointerStop );

  kaleidoscopeContainer.addEventListener( pointerStop, ( e ) => {
    console.log( e );
    animationframeID = cancelAnimationFrame( animationframeID );
  } );

  kaleidoscopeContainer.addEventListener( pointerMove, ( e ) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = e.pageX / window.innerWidth;
    const dy = e.pageY / window.innerHeight;
    const hx = dx - 0.5;
    const hy = dy - 0.5;
    options.tx = hx * kaleidoscope.radius * -2;
    options.ty = hy * kaleidoscope.radius * 2;
    options.tr = Math.atan2( hy, hx );
    updateKaleidoscopeShape( kaleidoscope );
  }, false );
}

export default {
  init
};
