import raf from 'raf.js';
import Kaleidoscope from './libs/kaleidoCanvas.js';
import isMobile from './libs/isMobile.js';

const options = {
  interactive: true,
  ease: 0.1,
  tx: 0,
  ty: 0,
  tr: 0,
};

var count = 0;
var animationframeID;

function updateKaledo ( kaleidoscope ){
  if ( options.interactive ) {

    /*
     *  fonr some reason those values are sometimes 'NaN',
     *  so, when it happens I pretend they are not with a random value.
     *  - clever, isn't it?
     *  - no, it is a hack!
     *  - well, it works on my machine.
     */
    var kaleidoscopeoffsetX = isNaN(kaleidoscope.offsetX) ? Math.random() * 100 : kaleidoscope.offsetX;
    var kaleidoscopeoffsetY = isNaN(kaleidoscope.offsetY) ? Math.random() * 100 : kaleidoscope.offsetY;
    var kaleidoscopeoffsetRotation = isNaN(kaleidoscope.offsetRotation) ? (Math.random() * 1000) : kaleidoscope.offsetRotation;
    var optionstr = isNaN(options.tr) ? (Math.random() * 10) : options.tr;
    var optionstx = isNaN(options.tx) ? (Math.random() * 10) : options.tx;
    var optionsty = isNaN(options.ty) ? (Math.random() * 10) : options.ty;

    const delta = optionstr - kaleidoscope.offsetRotation;
    const theta = Math.atan2( Math.sin( delta ), Math.cos( delta ) );
    kaleidoscope.offsetX += ( optionstx - kaleidoscopeoffsetX ) * options.ease;
    kaleidoscope.offsetY += ( optionsty - kaleidoscopeoffsetY ) * options.ease;
    kaleidoscope.offsetRotation += ( theta - kaleidoscopeoffsetRotation ) * options.ease;
    kaleidoscope.draw();
  }
}

function updateKaleidoscopeShape(kaleidoscope) {
  animationframeID =  requestAnimationFrame( updateKaledo.bind( this, kaleidoscope) );
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

  const pointerMove = ( isMobile.test() ) ? 'touchmove' : 'mousemove';
  const pointerStop = ( isMobile.test() ) ? 'touchend' : 'mousestop';

  kaleidoscopeContainer.addEventListener( pointerStop, ( e ) => {
    animationframeID = cancelAnimationFrame( animationframeID );
  });

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
