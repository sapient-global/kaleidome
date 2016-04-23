//https://dev.twitter.com/rest/reference/post/statuses/update_with_media
//https://dev.twitter.com/rest/media/uploading-media
//{status: 'foo', hashtags: [], media: [], username: ''}
//post: https://api.twitter.com/1.1/statuses/update.json
//https://github.com/desmondmorris/node-twitter/tree/master/examples#media

import Twitter from 'twit';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const client = new Twitter( {
  consumer_key: process.env.TWITTER_CONSUMER_KEY || 'a',
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'b',
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY || 'c',
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'd',
} );

function _shareImage() {
  const tweetInput = document.querySelector( '.js-tweet-text' );
  const img = document.querySelector( '.js-image-to-share' ).src;
  const tweetText = tweetInput.value;

  client.post( 'media/upload', {
    media_data: img
  }, function( error, media, response ) {
    if ( !error ) {
      // If successful, a media object will be returned.
      console.log( media );
      // Lets tweet it
      const status = {
        status: `#btConf ${tweetText}`,
        media_ids: [ media.media_id_string ]
      };

      client.post( 'statuses/update', status, function( error, tweet, response ) {
        if ( !error ) {
          console.log( tweet );
          // Show a success message and redirect to home
        }
      } );
    }
  } );
}

// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

function init() {
  const shareButton = document.querySelector( '.js-button-share' );
  const tweetButton = document.querySelector( '.js-button-tweet' );
  const shareContainer = document.querySelector( '.share-container' );
  const tweetInput = document.querySelector( '.js-tweet-text' );

  tweetButton.addEventListener( 'click', ( e ) => {
    e.preventDefault();
    _shareImage();
  } );

  tweetInput.addEventListener( 'blur', ( e ) => {
    const label = document.querySelector( '.js-label' );
    if ( tweetInput.value !== '' ) {
      label.classList.add( 'u-hidden' );
    } else {
      label.classList.remove( 'u-hidden' );
    }
  } );
}

export default {
  init
};
