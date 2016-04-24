'use strict';

const express = require( 'express' );
const Twitter = require( 'twit' );
const http = require( 'http' );
const path = require( 'path' );
const bodyParser = require( 'body-parser' );
const tweetRoute = require( './tweetRoute.js' );

const app = express();
const environment = process.env.NODE_ENV || 'development';
const host = isProd() ? '0.0.0.0' : 'localhost';
const opts = {
  port: process.env.PORT || 1947,
  host: process.env.HOST || process.env.HOSTNAME || host,
  baseDir: __dirname + '/dist'
};
const renderPort = ( opts.port ) ? `:${opts.port}` : '';
const location = `http://${opts.host}${renderPort}`;

function isProd() {
  return environment === 'production';
};

/* ==========================================================================
   Setup the server config
   ========================================================================== */

app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use( bodyParser.urlencoded( { // to support URL-encoded bodies
  extended: true
} ) );
app.set( 'port', opts.port );
app.use( express.static( opts.baseDir ) );

// var urlencode = require('urlencode');
// var json = require('json-middleware');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
//
// app.use(json);
// app.use(urlencode);
// app.use('/url/that/accepts/form-data', multipartMiddleware);
//

/* ==========================================================================
   Init the server
   ========================================================================== */
const server = http.createServer( app );
server.listen( opts.port, opts.host, () => {
  console.log( `Server running on: ${location}` );
} );

/* ==========================================================================
   Routes
   ========================================================================== */

app.get( '/', ( req, res ) => {
  res.writeHead( 200, {
    'Content-Type': 'text/html'
  } );
  fs.createReadStream( path.join( opts.baseDir, '/index.html' ) ).pipe( res );
} );

app.post( '/tweet', tweetRoute );
