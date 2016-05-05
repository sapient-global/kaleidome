const TWEET_TEXT = ', I am at the #eventHashtag! Amazing, @sapientxt is also here!';
const TWEET_MAX_CHARS = 120;

function request( data ) {
  const xhttp = new XMLHttpRequest();

  xhttp.open( 'POST', 'https://localhost:1947/tweet', true );

  xhttp.send( data );

  /*
  xhttp.onreadystatechange = () => {
    if ( xhttp.readyState !== 4 ) {
      const loading = document.querySelector( '.step-4-share-it .icon-loading-animation');
      loading.classList.remove( 'u-hidden' );

      const header = document.querySelector( '.header' );
      header.classList.remove( 'u-light-background' );

      const image = document.querySelector( '.js-image-to-share' );
      image.classList.add( 'u-hidden' );

      const tweetErrorBox = document.querySelector( '.js-tweet-error' );
      tweetErrorBox.classList.add( 'u-hidden' );

      const tweetForm = document.querySelector( '.tweet-content-form' );
      tweetForm.classList.add( 'u-hidden' );

      const navbar = document.querySelector( '.navbar');
      navbar.classList.add( 'u-hidden' );

    }
  };
  */

  xhttp.onload = function() {
    // do something to response
    if ( this.readyState === 4 && this.status === 200 ) {
      window.location.href = '/goodbye.html';
    } else {
      const loading = document.querySelector( '.step-4-share-it .icon-loading-animation' );
      loading.classList.add( 'u-hidden' );

      const tweetErrorBox = document.querySelector( '.js-tweet-error' );
      tweetErrorBox.classList.remove( 'u-hidden' );

      const tweetForm = document.querySelector( '.tweet-content-form' );
      tweetForm.classList.add( 'u-hidden' );

      const header = document.querySelector( '.header' );
      header.classList.remove( 'u-light-background' );

      const navbar = document.querySelector( '.navbar' );
      navbar.classList.add( 'u-hidden' );
    }
  };
}

function _getTweetText() {
  const tweetTextarea = document.querySelector( '.js-tweet-text' );
  const username = document.querySelector( '.js-username' );
  const tweetText = `@${username.value}` + TWEET_TEXT + ` ${tweetTextarea.value}`;
  return tweetText;
}

function _getTweetMedia() {
  let imageData = document.querySelector( '.js-image-to-share' ).src;
  const indexOfComma = imageData.indexOf( ',' );
  imageData = imageData.substring( indexOfComma + 1 );

  return imageData;
}

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

function _getCharsLeft() {
  return TWEET_MAX_CHARS - _getTweetText().length;
}

function _setCharsLeft() {
  const tweetCharLeft = document.querySelector( '.js-characters-left' );
  tweetCharLeft.innerHTML = _getCharsLeft();
  _checkCharsLeft();
}

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
  const usernameInput = shareContainer.querySelector( 'input' );
  const tweetTextArea = shareContainer.querySelector( 'textarea' );

  usernameInput.addEventListener( 'input', ( e ) => {
    _setCharsLeft( e );

    if ( e.target.value.length === 0 || shareContainer.classList.contains( 'tweet-form-error' ) ) {
      tweetButton.disabled = true;
    } else {
      tweetButton.disabled = false;
    }
  } );

  tweetTextArea.addEventListener( 'input', ( e ) => {
    _setCharsLeft( e );

    if ( _getCharsLeft() > 0 && usernameInput.value.length > 0 ) {
      tweetButton.disabled = false;
    } else {
      tweetButton.disabled = true;
    }

  } );

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
