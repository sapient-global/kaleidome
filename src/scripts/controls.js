'use strict';

import kaleidoscope from './kaleidoscope.js';

function init() {
  const canvas = window.canvas = document.querySelector( 'canvas' );
  const video = document.querySelector( '.video-recorder' );
  const photo = document.querySelector( '.photo' );
  const shareContainer = document.querySelector( '.share-container' );
  const kaleidoskopeContainer = document.querySelector( '.kaleidoscope-container' );

  const buttonPhoto = document.querySelector( '.js-button-photo' );
  const buttonClear = document.querySelector( '.js-button-clear' );
  const shareButton = document.querySelector( '.js-button-share' );
  const tweetButton = document.querySelector( '.js-button-tweet' );
  const kaleidoButton = document.querySelector( '.js-button-kaleido' );

  // Step 1: Take the photo
  buttonPhoto.addEventListener( 'click', () => {
    buttonPhoto.classList.add( 'u-hidden' );
    kaleidoButton.classList.remove( 'u-hidden' );
    buttonClear.classList.remove( 'u-hidden' );

    //Elems
    video.classList.add( 'u-hidden' );
    photo.classList.remove( 'u-hidden' );
  } );

  // Option in step 1: Take another photo
  buttonClear.addEventListener( 'click', () => {
    buttonPhoto.classList.remove( 'u-hidden' );
    kaleidoButton.classList.add( 'u-hidden' );
    buttonClear.classList.add( 'u-hidden' );

    //Elems.
    photo.classList.add( 'u-hidden' );
    video.classList.remove( 'u-hidden' );
  } );

  //Step 2: Kaleidoscopize
  kaleidoButton.addEventListener( 'click', () => {
    buttonClear.classList.add( 'u-hidden' );
    kaleidoButton.classList.add( 'u-hidden' );
    shareButton.classList.remove( 'u-hidden' );
    kaleidoscope.init();
    photo.classList.add( 'u-hidden' );
    kaleidoskopeContainer.classList.remove( 'u-hidden' );
  } );

  //Step 3: Write tweet and tweet
  shareButton.addEventListener( 'click', () => {
    shareButton.classList.add( 'u-hidden' );
    tweetButton.classList.remove( 'u-hidden' );
    photo.classList.add( 'u-hidden' );

    kaleidoskopeContainer.classList.add( 'u-hidden' );
    shareContainer.classList.remove( 'u-hidden' );
  } );

};

export default {
  init
};
