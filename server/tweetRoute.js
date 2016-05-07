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


  /*
   *  this speak for itself, it is not agile, it is waterfall, as we are used to.
   *  Let's do this, take what we have produced here, and give it to the next stage...
   *  and so on and so forth until we are done.
   */
  async.waterfall( [
    function( callback ) {
      /*
       *  so, let's first upload the media (the image in our case).
       */
      client.post( 'media/upload', {
        media_data: tweetImageData
      }, function( error, media, response ) {

        if ( !error ) {
          callback( null, media );
        }
      } );
      // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    },
    function( media, callback ) {
      /*
       *  'media' is the JSON object returned from the previous HTTP POST call,
       *  from there we get the media ids to add to our tweet together with the
       *  tweet text
       */
      var status = {
        status: tweetText,
        media_ids: [ media.media_id_string ]
      };
      client.post( 'statuses/update', status, function( error, data, response ) {
        callback( null, error, data, response );
      } );
    },
    function( error, data, response, callback ) {
      /*
       *  and than we add it to our twitter collection.
       *
       *  NOTE:
       *  for some reason you MUST prefix your collection id with 'custom-' it
       *  took me an hour to figure this out (and not even by myself!!)
       *
       */
      var params = {
        'id': 'custom-728559939015327744',
        'tweet_id': data.id_str
      };

      client.post( 'collections/entries/add', params, function( error, data, response ) {
        callback( error, data, response );
      } );
    }
  ], function( error, data, response ) {
    /*
     *  at the very end, we can finally respond by sending back the response
     *  status and the response information
     */
    if ( !error ) {
      res.status( 200 ).send( data );
    } else {
      res.status( 500 ).send( error );
    }
  } );
};
