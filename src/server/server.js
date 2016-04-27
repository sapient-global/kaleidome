'use strict';
const async = require('async');
const multiparty = require('multiparty');
const express = require( 'express' );
const http = require( 'http' );
const path = require( 'path' );
const tweetRoute = require( './tweetRoute.js' );

const app = express();
const environment = process.env.NODE_ENV || 'development';
const host = isProd() ? '0.0.0.0' : 'localhost';
const opts = {
  port: process.env.PORT || 1947,
  host: process.env.HOST || process.env.HOSTNAME || host,
  baseDir: __dirname + '/'
};
const renderPort = ( opts.port ) ? `:${opts.port}` : '';
const location = `http://${opts.host}${renderPort}`;

function isProd() {
  return environment === 'production';
};

/* ==========================================================================
   Setup the server config
   ========================================================================== */

   app.set( 'port', opts.port );
   app.use( express.static( opts.baseDir ) );


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

//app.post( '/tweet', tweetRoute );
app.post('/tweet', function(req, res) {
    var formData = new multiparty.Form();

    formData.parse(req, function(err, fields, files) {
        /*
        Object.keys(fields).forEach(function(name) {
          console.log('got field named ' + name);
        });

        Object.keys(files).forEach(function(name) {
          console.log('got file named ' + name);
        });
        */
        tweetRoute(req, res, fields, files);
    });

});