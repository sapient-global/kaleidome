import texts from '../texts.json';
import isMobile from './libs/isMobile.js';

const TWEET_TEXT = texts.step4tweet.defaultText;
const TWEET_MAX_CHARS = parseInt( texts.step4tweet.maxChars, 10 );

/**
 * Well this function is quite straight forward, basically gives the
 * feedback to the user after the tweet post request was sent.
 *
 * response is any of these types https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
 */
function handleResponse( response ) {
  if ( response.readyState === 4 && response.status === 200 ) {
    window.location.href = '/goodbye.html';

  } else {
    // Hide all the elements of the screen related to sharing a tweet
    const loading = document.querySelector( '.step-4-share-it .icon-loading-animation' );
    loading.classList.add( 'u-hidden' );

    const tweetErrorBox = document.querySelector( '.js-tweet-error' );
    tweetErrorBox.classList.remove( 'u-hidden' );

    const tweetForm = document.querySelector( '.tweet-content-form' );
    tweetForm.classList.add( 'u-hidden' );

    const header = document.querySelector( '.header' );
    header.classList.remove( 'u-light-background' );

    const buttonPlayAgain = document.querySelector( '.js-button-play-again' );
    buttonPlayAgain.classList.remove( 'u-hidden' );

    const buttonTweet = document.querySelector( '.js-button-tweet' );
    buttonTweet.classList.add( 'u-hidden' );

    const navbar = document.querySelector( '.navbar' );
    navbar.classList.remove( 'u-hidden' );

    const image = document.querySelector( '.js-image-to-share' );
    image.classList.remove( 'u-hidden' );

    const content = document.querySelector( '.content' );
    content.classList.add( 'content--long-page' );
  }
}

/**
 * Other fearull thing of using vanillaJS is to do your own Ajax requests.
 * Good thing is that we are not anymore in 2005 and we have a nice API for it.
 *
 * @param  {FormData} data data to send to twitter
 */
function request( data ) {
  const xhttp = new XMLHttpRequest();
  // This variable is made available in the webpack.config file.
  // Check the plugins section to get to know more about it.
  // In a nutshell: It allow us to know if we are in production or not.
  // If we are in development, then we want to make the request to our node server
  // running standalone. The app in dev environment is served via webpack, because it watches
  // our changes.
  const remoteUrl = ( __DEV__ ) ? 'https://localhost:1947' : '';

  xhttp.open( 'POST', `${remoteUrl}/tweet`, true );

  xhttp.send( data );

  //This funtion is called whenever the server sent a response.
  //Whatever that response was. Theoretically, we could use only this one, and not
  //use .onload...
  xhttp.onreadystatechange = () => {
    handleResponse( xhttp );
  };

  //This was added in the XMLHttpRequest 2, and is called when a
  //successful response is available
  xhttp.onload = function() {
    handleResponse( this );
  };
}

/**
 * We get here the text which is in a given moment in the tweet form
 *
 * @return {String} The full text which will be tweeted
 */
function _getTweetText() {
  const tweetTextarea = document.querySelector( '.js-tweet-text' );
  const username = document.querySelector( '.js-username' );
  const tweetText = `@${username.value}` + TWEET_TEXT + ` ${tweetTextarea.value}`;
  return tweetText;
}

/**
 * Gets the image out of the dom.
 *
 * @return {Img} data-uri image
 */
function _getTweetMedia() {
  let imageData = document.querySelector( '.js-image-to-share' ).src;
  const indexOfComma = imageData.indexOf( ',' );
  imageData = imageData.substring( indexOfComma + 1 );

  return imageData;
}

/**
 * Shares the image, and shows a loading indicator while the tweet is sent
 */
function _shareImage() {
  const loading = document.querySelector( '.step-4-share-it .icon-loading-animation' );
  loading.classList.remove( 'u-hidden' );

  const header = document.querySelector( '.header' );
  header.classList.remove( 'u-light-background' );

  const image = document.querySelector( '.js-image-to-share' );
  image.classList.add( 'u-hidden' );

  const tweetErrorBox = document.querySelector( '.js-tweet-error' );
  tweetErrorBox.classList.add( 'u-hidden' );

  const tweetForm = document.querySelector( '.tweet-content-form' );
  tweetForm.classList.add( 'u-hidden' );

  const navbar = document.querySelector( '.navbar' );
  navbar.classList.add( 'u-hidden' );

  const imageData = _getTweetMedia();
  const tweetText = _getTweetText();

  var data = new FormData();
  data.append( 'tweetText', tweetText );
  data.append( 'imageData', imageData );

  request( data );
}

/* ==========================================================================
   Calculation of chars left
   ========================================================================== */

function _getCharsLeft() {
  return TWEET_MAX_CHARS - _getTweetText().length;
}

/**
 * Sets the remaining chars the user has to write the tweet
 */
function _setCharsLeft() {
  const tweetCharLeft = document.querySelector( '.js-characters-left' );
  tweetCharLeft.innerHTML = _getCharsLeft();
  _checkCharsLeft();
}

/**
 * Gives feedback the user about the chars they have used.
 */
function _checkCharsLeft() {
  const shareContainer = document.querySelector( '.js-tweet-content' );

  if ( _getCharsLeft() < 0 ) {
    if ( !shareContainer.classList.contains( 'tweet-form-error' ) ) {
      shareContainer.classList.add( 'tweet-form-error' );
    }
  } else {
    shareContainer.classList.remove( 'tweet-form-error' );
  }
}

function init() {
  const tweetButton = document.querySelector( '.js-button-tweet' );
  const shareContainer = document.querySelector( '.js-tweet-content' );
  const usernameInput = shareContainer.querySelector( '.js-username' );
  const inputs = shareContainer.querySelectorAll( '.js-input' );
  const body = document.querySelector( 'body' );

  for ( let i = 0; i < inputs.length; i++ ) {
    const currentInput = inputs[ i ];

    if ( isMobile.test() ) {
      //This is a hack of us.
      //It allows us to set he height of the body bigger when in a mobile the user
      //has focused the inputs. This is due to the fact that for the recording video and taking photo
      //we need to have everything inside the viewport, including the navbar. To do so we use viewportHeight
      //in a mobile device, the viewportHeight is smaller when the keyboard is shown.
      currentInput.addEventListener( 'focus', () => {
        body.classList.add( 'input-focused-body-min-height' );
      } );

      currentInput.addEventListener( 'blur', () => {
        body.classList.remove( 'input-focused-body-min-height' );
      } );
    }

    currentInput.addEventListener( 'input', ( e ) => {
      _setCharsLeft( e );

      //The tweet button is disabled if there is no username or if the user used more chars than allowed.
      if ( ( _getCharsLeft() > 0 && usernameInput.value.length > 0 ) || !shareContainer.classList.contains( 'tweet-form-error' ) ) {
        tweetButton.disabled = false;
      } else {
        tweetButton.disabled = true;
      }
    } );
  }

  tweetButton.addEventListener( 'click', ( e ) => {
    e.preventDefault();
    if ( usernameInput.value.length > 0 ) {
      _shareImage( e );
    }
  } );

  _setCharsLeft();
}

export default {
  init
};
