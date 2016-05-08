/*
  In the KaleidoMe page, we have a section with four articles.
  Each one is a step of the app.
  Below there is a navigation bar that allows you go further of start again.
  Each time you tap on a button of the navigation bar, to go to the next screen
  The listeners in this file will toggle the visibility of the elements of the next screen,
  and its next step button.

  When you click on the KalidoMe button, the kaleidoscope module will be initialized,
  when we do that, the kaleidoscope will be generated.
 */

import kaleidoscope from './kaleidoscope.js';
// This is a mini lib with moment.js to check if today is a day in which BTconf is happening
// if so, then the tweet feature is enabled. Otherwise, well, is not.
import isAConferenceDay from './libs/isAConferenceDay.js';
// Safari does not support WebRTC... Infinite Sadness.
import isWebRTCsupported from './libs/isWebRTCsupported.js';

/**
 * This function is called when you tap on the take photo button
 * or when the webRTC is not supported, in which case we just dont show the first step.
 *
 * @param  {domElement} buttonKaleidoMe
 * @param  {domElement} buttonAgain
 * @param  {domElement} step1TakePhoto
 * @param  {domElement} step2ReviewPhoto
 * @param  {domElement} navbar
 * @param  {domElement} content   container of the four steps
 *
 */
function hideVideoScreen( buttonKaleidoMe, buttonAgain, step1TakePhoto, step2ReviewPhoto, navbar, content ) {
  buttonKaleidoMe.classList.remove( 'u-hidden' );
  buttonAgain.classList.remove( 'u-hidden' );
  navbar.classList.remove( 'u-hidden' );
  content.classList.remove( 'content--no-nav' );

  step1TakePhoto.classList.add( 'u-hidden' );
  step2ReviewPhoto.classList.remove( 'u-hidden' );
}

/**
 * Initialization and setup of the event listeners
 */
function init() {
  // We are using the js- prefix for the buttons and some elements.
  // Now that I am adding these comments, I would say that it would be more consistent
  // to use it for all the selectors. One idea to keep in mind for future projects.
  // but the advantage of using the 'js-' prefix, is that you can change your dom element
  // as you wish, or even the CSS class that you apply to your element. Your JS wont break.
  // This goes particularly well with projects in which you keep styles short by adding lots of classes
  // to a DOMElement
  //
  // Note 2: the DOM elements wont change, therefore we use const :)
  const step1TakePhoto = document.querySelector( '.step-1-take-photo' );
  const step2ReviewPhoto = document.querySelector( '.step-2-review-photo' );
  const step3KaleidoscopeContainer = document.querySelector( '.step-3-play-with-kaleidoscope' );
  const step4ShareIt = document.querySelector( '.step-4-share-it' );
  const step5Goodbye = document.querySelector( '.step-5-goodbye' );
  const header = document.querySelector( '.header' );
  const tweetError = document.querySelector( '.js-tweet-error' );
  const tweetContent = document.querySelector( '.js-tweet-content' );
  const tweetNotEnabled = document.querySelector( '.js-tweet-disabled' );
  const content = document.querySelector( '.content' );
  const navbar = document.querySelector( '.navbar' );

  const buttonPhoto = document.querySelector( '.js-button-photo' );
  const buttonAgain = document.querySelector( '.js-button-again' );
  const buttonShare = document.querySelector( '.js-button-share' );
  const buttonTweet = document.querySelector( '.js-button-tweet' );
  const buttonPlayAgain = document.querySelector( '.js-button-play-again' );
  const buttonKaleidoMe = document.querySelector( '.js-button-kaleidome' );
  const buttonCancel = document.querySelector( '.js-button-cancel' );

  buttonPlayAgain.addEventListener( 'click', () => {
    window.location.href = '/index.html';
  } );

  buttonCancel.addEventListener( 'click', () => {
    buttonShare.classList.add( 'u-hidden' );
    buttonTweet.classList.add( 'u-hidden' );
    buttonKaleidoMe.classList.add( 'u-hidden' );
    buttonAgain.classList.add( 'u-hidden' );
    buttonCancel.classList.add( 'u-hidden' );
    header.classList.remove( 'u-light-background' );
    tweetError.classList.add( 'u-hidden' );
    tweetContent.classList.remove( 'u-hidden' );
    content.classList.remove( 'content--long-page' );

    step1TakePhoto.classList.remove( 'u-hidden' );
    step2ReviewPhoto.classList.add( 'u-hidden' );
    step3KaleidoscopeContainer.classList.add( 'u-hidden' );
    step4ShareIt.classList.add( 'u-hidden' );
    buttonPlayAgain.classList.add( 'u-hidden' );
  } );

  const notSupportedText = document.querySelector( '.js-not-supported' );

  if ( !isWebRTCsupported.test() ) {
    notSupportedText.classList.remove( 'u-hidden' );
    buttonAgain.disabled = true;
    hideVideoScreen( buttonKaleidoMe, buttonAgain, step1TakePhoto, step2ReviewPhoto, navbar, content );
  }

  // Step 1: Take the photo
  buttonPhoto.addEventListener( 'click', () => {
    hideVideoScreen( buttonKaleidoMe, buttonAgain, step1TakePhoto, step2ReviewPhoto, navbar, content );
    return false;
  } );

  // Option in step 1: Take another photo
  buttonAgain.addEventListener( 'click', () => {
    buttonKaleidoMe.classList.add( 'u-hidden' );
    buttonAgain.classList.add( 'u-hidden' );
    navbar.classList.add( 'u-hidden' );
    content.classList.add( 'content--no-nav' );

    //Elems.
    step2ReviewPhoto.classList.add( 'u-hidden' );
    step1TakePhoto.classList.remove( 'u-hidden' );
  } );

  //Step 2: KaleidoMe
  buttonKaleidoMe.addEventListener( 'click', () => {
    buttonAgain.classList.add( 'u-hidden' );
    buttonKaleidoMe.classList.add( 'u-hidden' );
    header.classList.remove( 'u-light-foreground' );

    buttonCancel.classList.remove( 'u-hidden' );
    buttonShare.classList.remove( 'u-hidden' );

    kaleidoscope.init();

    step2ReviewPhoto.classList.add( 'u-hidden' );
    step3KaleidoscopeContainer.classList.remove( 'u-hidden' );
  } );

  //Step 3: Write tweet and tweet... Or show a screen with a preview
  //of the kaleidoscope, so people can download it
  buttonShare.addEventListener( 'click', () => {
    buttonShare.classList.add( 'u-hidden' );

    if ( isAConferenceDay.test( new Date() ) ) {
      tweetNotEnabled.classList.add( 'u-hidden' );
      tweetContent.classList.remove( 'u-hidden' );
      header.classList.add( 'u-light-background' );
      buttonPlayAgain.classList.add( 'u-hidden' );
      buttonTweet.classList.remove( 'u-hidden' );
    } else {
      tweetNotEnabled.classList.remove( 'u-hidden' );
      tweetContent.classList.add( 'u-hidden' );
      buttonTweet.disabled = true;
      buttonPlayAgain.classList.remove( 'u-hidden' );
      content.classList.add( 'content--long-page' );
    }

    step3KaleidoscopeContainer.classList.add( 'u-hidden' );
    step4ShareIt.classList.remove( 'u-hidden' );
  } );
};

/*
  This is the new Object Literal syntax of ES2015, normally in ES5, you would Write
  module.exports = {
    init: init
  }
*/

export default {
  init
};
