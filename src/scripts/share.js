function request( data ) {
  const xhttp = new XMLHttpRequest();

  xhttp.open( 'POST', 'https://localhost:1947/tweet', true );
  xhttp.send( data );

  xhttp.onreadystatechange = () => {
    if ( xhttp.readyState === 4 && xhttp.status === 200 ) {
      window.location.href = '/goodbye.html';
    } else {
      const tweetErrorBox = document.querySelector( '.js-tweet-error' );
      tweetErrorBox.classList.remove( 'u-hidden' );

      const tweetForm = document.querySelector( '.tweet-content-form' );
      tweetForm.classList.add( 'u-hidden' );

      const header = document.querySelector( '.header' );
      header.classList.remove( 'u-light-background' );
    }
  };

  xhttp.onload = function() {
    // do something to response
    console.log( this.responseText );
  };
}

const TWEET_TEXT = ", I am at the #eventHashtag! Amazing, @sapientxt is also here!";
const TWEET_MAX_CHARS = 120;

function _getTweetText() {
  const tweetTextarea = document.querySelector( '.js-tweet-text' );
  const username = document.querySelector( '.js-username' );

  const tweetText = `@${username.value}` + TWEET_TEXT + ` ${tweetTextarea.value}`;
  console.log( tweetText );
  return tweetText;
}

function _getTweetMedia() {
  let imageData = document.querySelector( '.js-image-to-share' ).src;
  const indexOfComma = imageData.indexOf( ',' );
  imageData = imageData.substring( indexOfComma + 1 );

  return imageData;
}

function _shareImage() {
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
  const tweetButton = document.querySelector( '.js-button-tweet' );
  const shareContainer = document.querySelector( '.js-tweet-content' );
  const data = new FormData();

  if ( _getCharsLeft() < 0 ) {
    if ( !shareContainer.classList.contains( 'error' ) ) {
      shareContainer.classList.add( 'error' );
    }
    tweetButton.disabled = true;
  } else {
    shareContainer.classList.remove( 'error' );
    tweetButton.disabled = false;
  }

  data.append( 'tweetText', tweetText );
  data.append( 'imageData', imageData );

  request( data );
}

function init() {
  const tweetButton = document.querySelector( '.js-button-tweet' );
  const tweetContent = document.querySelector( '.js-tweet-content' );

  tweetContent.querySelector( '.js-message' ).innerHTML = TWEET_TEXT;

  tweetContent.querySelector( 'input' ).addEventListener( 'input', ( e ) => {
    _setCharsLeft( e );
  } );

  tweetButton.addEventListener( 'click', ( e ) => {
    e.preventDefault();
    _shareImage( e );
  } );
}

export default {
  init
};
