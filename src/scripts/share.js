function request( params ) {
  const xhttp = new XMLHttpRequest();

  xhttp.open( 'POST', 'http://localhost:1947/tweet', true );
  xhttp.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
  xhttp.send( params );

  xhttp.onreadystatechange = () => {
    if ( xhttp.readyState == 4 && xhttp.status == 200 ) {
      const step4ShareIt = document.querySelector( '.step-4-share-it' );
      const step5Goodbye = document.querySelector( '.step-5-goodbye' );
      step4ShareIt.classList.add( 'u-hidden' );
      step5Goodbye.classList.remove( 'u-hidden' );
    }
  };
}

function _shareImage() {
  const tweetTextarea = document.querySelector( '.js-tweet-text' );
  const username = document.querySelector( '.js-username' );
  const imageData = document.querySelector( '.js-image-to-share' ).src;
  const tweetText = `@${username.value} at #btConf ${tweetTextarea.value}`;

  request( {
    tweetText: tweetText,
    imageData: imageData
  } );
}

function init() {
  const shareButton = document.querySelector( '.js-button-share' );
  const tweetButton = document.querySelector( '.js-button-tweet' );
  const shareContainer = document.querySelector( '.share-container' );
  const tweetTextarea = document.querySelector( '.js-tweet-text' );

  tweetButton.addEventListener( 'click', ( e ) => {
    e.preventDefault();
    _shareImage();
  } );
  //
  // tweetTextarea.addEventListener( 'blur', ( e ) => {
  //
  // } );
}

export default {
  init
};
