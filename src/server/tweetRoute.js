const Twitter = require( 'twit' );

module.exports = function( req, res ) {
  /* ==========================================================================
     Setup Twitter POST request
     ========================================================================== */

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  const client = new Twitter( {
    consumer_key: process.env.TWITTER_CONSUMER_KEY || 'a',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'b',
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY || 'c',
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'd',
  } );

  //Get the params out of the request
  const tweetText = req.body.tweetText;
  const tweetImageData = req.body.imageData;

  client.post( 'media/upload', {
    media_data: tweetImageData
  }, function( error, media, response ) {
    if ( !error ) {
      // If successful, a media object will be returned.
      console.log( media );
      // Lets tweet it
      const status = {
        status: tweetText,
        media_ids: [ media.media_id_string ]
      };

      client.post( 'statuses/update', status, function( error, tweet, response ) {
        if ( !error ) {
          console.log( tweet );
          res.send( response, 200 );
          // Show a success message and redirect to home
        }
      } );
    }
  } );
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
};

//https://dev.twitter.com/rest/reference/post/statuses/update_with_media
//https://dev.twitter.com/rest/media/uploading-media
//{status: 'foo', hashtags: [], media: [], username: ''}
//post: https://api.twitter.com/1.1/statuses/update.json
//https://github.com/desmondmorris/node-twitter/tree/master/examples#media
