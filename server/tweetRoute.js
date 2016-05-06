const Twitter = require( 'twit' );
const async = require( 'async' );

module.exports = function( req, res, fields, files ) {
  /* ==========================================================================
     Setup Twitter POST request
     ========================================================================== */

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  const client = new Twitter( {
    consumer_key: process.env.TWITTER_CONSUMER_KEY || 'BIJ5EV4sUAFy701YijAzsOob3',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'MFoNd75YhKQ7zqhUavUD9ahXT1dWMK53zS0mqgPQGjpp8eKGdH',
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY || '723478728811134976-OxKxoXCFRj12cQYxO26Oj4mJIwWE56g',
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'LO2wkEeGH1WgNaDeJ5K4o0X5KioUSHMaQEjF3It5I4rPr',
  } );

  //Get the params out of the request
  const tweetText = fields.tweetText;
  const tweetImageData = fields.imageData;

  async.waterfall([
    function(callback){
      client.post( 'media/upload', {
        media_data: tweetImageData
      }, function( error, media, response ) {

        if ( !error ) {
          var status = {
            status: tweetText,
            media_ids: [ media.media_id_string ]
          };
          callback(null, status);
        }
      });
      // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    },
    function(status, callback){
      client.post( 'statuses/update', status, function( error, data, response ) {
          callback(error, data, response);
      });
    }
  ], function(error, data, response) {
    if(!error){
      res.status( 200 ).send( data );
    }else{
      res.status( 500 ).send( error );
    }
  });
};

//https://dev.twitter.com/rest/reference/post/statuses/update_with_media
//https://dev.twitter.com/rest/media/uploading-media
//{status: 'foo', hashtags: [], media: [], username: ''}
//post: https://api.twitter.com/1.1/statuses/update.json
//https://github.com/desmondmorris/node-twitter/tree/master/examples#media
