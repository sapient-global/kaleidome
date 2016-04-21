'use strict';

import raf from 'raf.js';
import Kaleidoscope from './vendor/kaleidoCanvas.js';

const options = {
  interactive: true,
  ease: 0.1,
  tx: 0,
  ty: 0,
  tr: 0,
};

function updateKaleidoscopeShape( kaleidoscope ) {
    if ( options.interactive ) {
      const delta = options.tr - kaleidoscope.offsetRotation;
      const theta = Math.atan2( Math.sin( delta ), Math.cos( delta ) );
      kaleidoscope.offsetX += ( options.tx - kaleidoscope.offsetX ) * options.ease;
      kaleidoscope.offsetY += ( options.ty - kaleidoscope.offsetY ) * options.ease;
      kaleidoscope.offsetRotation += ( theta - kaleidoscope.offsetRotation ) * options.ease;
      kaleidoscope.draw();
    }
    return requestAnimationFrame( updateKaleidoscopeShape.bind(this, kaleidoscope) );
};

function init() {
  const shareButton = document.querySelector( '.js-button-share' );
  const tweetButton = document.querySelector( '.js-button-tweet' );
  const kaleidoButton = document.querySelector( '.js-button-kaleido' );
  const kaleidoscopeContainer = document.querySelector( '.kaleidoscope-container' );
  const photo = document.querySelector( '.photo' );

  const kaleidoscope = new Kaleidoscope( {
    slices: 20
  } );

  kaleidoscope.image.src = photo.src;

  options.tx = kaleidoscope.offsetX;
  options.ty = kaleidoscope.offsetY;
  options.tr = kaleidoscope.offsetRotation;

  kaleidoscopeContainer.addEventListener( 'mousemove', ( e ) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = e.pageX / window.innerWidth;
    const dy = e.pageY / window.innerHeight;
    const hx = dx - 0.5;
    const hy = dy - 0.5;
    options.tx = hx * kaleidoscope.radius * -2;
    options.ty = hy * kaleidoscope.radius * 2;
    options.tr = Math.atan2( hy, hx );
    updateKaleidoscopeShape(kaleidoscope);
  }, false );
}

export default {
  init
};
