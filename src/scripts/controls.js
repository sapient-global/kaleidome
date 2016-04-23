'use strict';

import kaleidoscope from './kaleidoscope.js';

function init() {
  const step1TakePhoto = document.querySelector( '.step-1-take-photo' );
  const step2ReviewPhoto = document.querySelector( '.step-2-review-photo' );
  const step3KaleidoscopeContainer = document.querySelector( '.step-3-play-with-kaleidoscope' );
  const step4ShareIt = document.querySelector( '.step-4-share-it' );
  const step5Goodbye = document.querySelector( '.step-5-goodbye' );

  const buttonPhoto = document.querySelector( '.js-button-photo' );
  const buttonAgain = document.querySelector( '.js-button-again' );
  const buttonShare = document.querySelector( '.js-button-share' );
  const buttonTweet = document.querySelector( '.js-button-tweet' );
  const buttonKaleidoMe = document.querySelector( '.js-button-kaleidome' );
  const buttonCancel = document.querySelector( '.js-button-cancel' );

  buttonCancel.addEventListener( 'click', () => {
    buttonShare.classList.add( 'u-hidden' );
    buttonTweet.classList.add( 'u-hidden' );
    buttonKaleidoMe.classList.add( 'u-hidden' );
    buttonAgain.classList.add( 'u-hidden' );
    buttonCancel.classList.add( 'u-hidden' );

    step1TakePhoto.classList.remove( 'u-hidden' );
    step2ReviewPhoto.classList.add( 'u-hidden' );
    step3KaleidoscopeContainer.classList.add( 'u-hidden' );
    step4ShareIt.classList.add( 'u-hidden' );
  } );

  // Step 1: Take the photo
  buttonPhoto.addEventListener( 'click', () => {
    buttonKaleidoMe.classList.remove( 'u-hidden' );
    buttonAgain.classList.remove( 'u-hidden' );

    //Elems
    step1TakePhoto.classList.add( 'u-hidden' );
    step2ReviewPhoto.classList.remove( 'u-hidden' );
  } );

  // Option in step 1: Take another photo
  buttonAgain.addEventListener( 'click', () => {
    buttonKaleidoMe.classList.add( 'u-hidden' );
    buttonAgain.classList.add( 'u-hidden' );

    //Elems.
    step2ReviewPhoto.classList.add( 'u-hidden' );
    step1TakePhoto.classList.remove( 'u-hidden' );
  } );

  //Step 2: KaleidoMe
  buttonKaleidoMe.addEventListener( 'click', () => {
    buttonAgain.classList.add( 'u-hidden' );
    buttonKaleidoMe.classList.add( 'u-hidden' );

    buttonCancel.classList.remove( 'u-hidden' );
    buttonShare.classList.remove( 'u-hidden' );

    kaleidoscope.init();

    step2ReviewPhoto.classList.add( 'u-hidden' );
    step3KaleidoscopeContainer.classList.remove( 'u-hidden' );
  } );

  //Step 3: Write tweet and tweet
  buttonShare.addEventListener( 'click', () => {
    buttonShare.classList.add( 'u-hidden' );
    buttonTweet.classList.remove( 'u-hidden' );

    step3KaleidoscopeContainer.classList.add( 'u-hidden' );
    step4ShareIt.classList.remove( 'u-hidden' );
  } );

  buttonTweet.addEventListener( 'click', () => {
    step4ShareIt.classList.add( 'u-hidden' );
    step5Goodbye.classList.remove( 'u-hidden' );
  } );

};

export default {
  init
};
