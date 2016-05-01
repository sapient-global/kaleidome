function request( data ) {
  const xhttp = new XMLHttpRequest();

  xhttp.open( 'POST', 'http://localhost:1947/tweet', true );
  //xhttp.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
  xhttp.send( data );

  xhttp.onreadystatechange = () => {
    if ( xhttp.readyState === 4 && xhttp.status === 200 ) {
      const step4ShareIt = document.querySelector( '.step-4-share-it' );
      const step5Goodbye = document.querySelector( '.step-5-goodbye' );
      step4ShareIt.classList.add( 'u-hidden' );
      step5Goodbye.classList.remove( 'u-hidden' );
    }
  };

  xhttp.onload = function () {
    // do something to response
    console.log( this.responseText );
};
}

const TWEET_TEXT = ", I am at the #eventHashtag! Amazing, @sapientxt is also here!";
const TWEET_MAX_CHARS = 120;

function _getTweetText() {
  const tweetTextarea = document.querySelector( '.js-tweet-text' );
  const username = document.querySelector( '.js-username' );

  const tweetText = `@${username.value}`+ TWEET_TEXT + ` ${tweetTextarea.value}`;
console.log( tweetText );
  return tweetText;
}

function _getTweetMedia() {
  var imageData = document.querySelector( '.js-image-to-share' ).src;

  var indexOfComma = imageData.indexOf( ',' );
  imageData = imageData.substring( indexOfComma+1 );

  return imageData;
}

function _shareImage() {
  var imageData = _getTweetMedia();
  const tweetText = _getTweetText();

  var data = new FormData();
  data.append( 'tweetText', tweetText );
  data.append( 'imageData', imageData );

  request( data );
}

function _getCharsLeft() {
  return TWEET_MAX_CHARS - _getTweetText().length ;
}

function _setCharsLeft() {
  const tweetCharLeft = document.querySelector( '.js-characters-left' );
  tweetCharLeft.innerHTML = _getCharsLeft() ;
  _checkCharsLeft();
}

function _checkCharsLeft() {
  var tweetButton = document.querySelector( '.js-button-tweet' );
  var shareContainer = document.querySelector( '.js-tweet-content' );
  var cssCLasses = shareContainer.className;
  if( _getCharsLeft() < 0 ){
    if(cssCLasses.indexOf('error') === -1){
      shareContainer.className += ' error';
    }
    tweetButton.disabled = true;
  }else{
    shareContainer.className = shareContainer.className.replace('error','');
    tweetButton.disabled = false;
  }
}

function init() {

  const tweetButton = document.querySelector( '.js-button-tweet' );
  const tweetTextarea = document.querySelector( '.js-tweet-text' );
  const tweetContent = document.querySelector( '.js-tweet-content' );

  tweetContent.querySelector( '.js-message' ).innerHTML = TWEET_TEXT;

  tweetContent.querySelector( 'input' ).addEventListener('input', ( e ) =>{
    _setCharsLeft(e);
  });

  tweetContent.querySelector( 'textarea' ).addEventListener('input', ( e ) =>{
    _setCharsLeft(e);
  });

  tweetButton.addEventListener( 'click' , ( e ) => {
    e.preventDefault();
      _shareImage(  e );
  });
}

export default {
  init
};
