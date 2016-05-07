'use strict';
const async = require( 'async' );
const multiparty = require( 'multiparty' );
const express = require( 'express' );
const https = require( 'https' );
const path = require( 'path' );
const tweetRoute = require( './tweetRoute.js' );
const fs = require( 'fs' );

const app = express();
const environment = process.env.NODE_ENV || 'development';
const host = isProd() ? '0.0.0.0' : 'localhost';
const opts = {
  port: process.env.PORT || 1947,
  host: process.env.HOST || process.env.HOSTNAME || host,
  baseDir: __dirname + '/'
};
const renderPort = ( opts.port ) ? `:${opts.port}` : '';
const location = `https://${opts.host}${renderPort}`;

function isProd() {
  return environment === 'production';
};

function startedServerCallback() {
  console.log( `Server running on: ${location} [environment: ${environment}]` );
}

/* ==========================================================================
   Setup the server config
   ========================================================================== */

app.set( 'port', opts.port );
app.use( express.static( opts.baseDir ) );

/* ==========================================================================
   Init the server
   ========================================================================== */
if ( !isProd() ) {
  const sslConf = {
    key: fs.readFileSync( './server/server.key' ),
    cert: fs.readFileSync( './server/server.crt' ),
    requestCert: false,
    rejectUnauthorized: false
  };

  const server = https.createServer( sslConf, app );
  server.listen( opts.port, opts.host, startedServerCallback );
  
} else {

  app.listen( opts.port, opts.host, startedServerCallback );
}



/* ==========================================================================
   Routes
   ========================================================================== */
app.all( '/*', function( req, res, next ) {
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Headers", "X-Requested-With" );
  next();
} );

app.get( '/', ( req, res ) => {
  res.writeHead( 200, {
    'Content-Type': 'text/html'
  } );
  fs.createReadStream( path.join( opts.baseDir, '/index.html' ) ).pipe( res );
} );

app.post( '/tweet', function( req, res ) {
  let formData = new multiparty.Form();
  const isTweetEnabled = isProd() ? process.env.TWEET_ENABLED : true;

  if ( isTweetEnabled ) {
    formData.parse( req, function( err, fields, files ) {
      tweetRoute( req, res, fields, files );
    } );
  } else {
    res.statusCode = 503;
    res.statusMessage = 'Tweet feature is disabled';
  }
} );
