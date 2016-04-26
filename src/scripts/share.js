function request(data ) {
  const xhttp = new XMLHttpRequest();

  xhttp.open( 'POST', 'http://localhost:1947/tweet', true );
  //xhttp.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
  xhttp.send( data );

  xhttp.onreadystatechange = () => {
    if ( xhttp.readyState == 4 && xhttp.status == 200 ) {
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

function _shareImage() {
  const tweetTextarea = document.querySelector( '.js-tweet-text' );
  const username = document.querySelector( '.js-username' );
  var imageData = document.querySelector( '.js-image-to-share' ).src;

  var indexOfComma = imageData.indexOf(',');
  imageData = imageData.substring(indexOfComma+1);

  const tweetText = `@${username.value}, I am at #btconf and visited the @SapientNitro bot! ${tweetTextarea.value}`;

  var data = new FormData();
  data.append('tweetText', tweetText);
  data.append('imageData', imageData);

  request(data);
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
