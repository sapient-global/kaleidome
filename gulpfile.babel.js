'use strict';

import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import del from 'del';
import glob from 'glob';
import path from 'path';
import runSequence from 'run-sequence';
import {
  Instrumenter
} from 'isparta';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import WebpackDevServer from 'webpack-dev-server';
import source from 'vinyl-source-stream';
import webpackConfig from './webpack.config';
import browserSync from 'browser-sync';
import mochaGlobals from './test/setup/.globals';
import pkg from './package.json';

const browerSyncServer = browserSync.create();
// Load all of our Gulp plugins
const $ = loadPlugins();
const PORT = process.env.PORT || 9000;
const jsWatchedFiles = [ 'src/**/*.s', 'test/**/*', 'package.json', '**/.eslintrc.json', '.jscsrc' ];

// Gather the library data from `package.json`
const config = pkg.config;

const paths = {
  main: `${config.main}.js`,
  src: path.join( __dirname, 'src' ),
  dist: config.dist,
  bundleName: path.basename( config.main, path.extname( config.main ) )
};

/* ==========================================================================
   Helper tasks
   ========================================================================== */

function cleanDist( done ) {
  del( [ paths.dist ] ).then( () => done() );
}

function cleanTmp( done ) {
  del( [ 'tmp' ] ).then( () => done() );
}

function onError() {
  $.util.beep();
}

/* ==========================================================================
   JS babel linting and transpiling
   ========================================================================== */

// Lint a set of files
function lint( files ) {
  return gulp.src( files )
    .pipe( $.plumber() )
    .pipe( $.eslint() )
    .pipe( $.eslint.format() )
    .pipe( $.eslint.failOnError() )
    .pipe( $.jscs() )
    .pipe( $.jscs.reporter() )
    .pipe( $.jscs.reporter( 'fail' ) )
    .on( 'error', onError );
}

function lintSrc() {
  return lint( 'src/**/*.js' );
}

function lintTest() {
  return lint( 'test/**/*.js' );
}

function lintGulpfile() {
  return lint( 'gulpfile.babel.js' );
}

/* ==========================================================================
   Test tasks
   ========================================================================== */

function _mocha() {
  return gulp.src( [ 'test/setup/node.js', 'test/unit/**/*.js' ], {
      read: false
    } )
    .pipe( $.mocha( {
      reporter: 'dot',
      globals: Object.keys( mochaGlobals.globals ),
      ignoreLeaks: false
    } ) );
}

function _registerBabel() {
  require( 'babel-register' );
}

function test() {
  _registerBabel();
  return _mocha();
}

function coverage( done ) {
  _registerBabel();
  gulp.src( [ 'src/**/*.js' ] )
    .pipe( $.istanbul( {
      instrumenter: Instrumenter
    } ) )
    .pipe( $.istanbul.hookRequire() )
    .on( 'finish', () => {
      return test()
        .pipe( $.istanbul.writeReports() )
        .on( 'end', done );
    } );
}

function testBrowser() {
  // Our testing bundle is made up of our unit tests, which
  // should individually load up pieces of our application.
  // We also include the browser setup file.
  const testFiles = glob.sync( './test/unit/**/*.js' );
  const allFiles = [ './test/setup/browser.js' ].concat( testFiles );

  // Lets us differentiate between the first build and subsequent builds
  var firstBuild = true;

  // This empty stream might seem like a hack, but we need to specify
  //  all of our files through
  // the `entry` option of webpack. Otherwise, it ignores whatever
  // file(s) are placed in here.
  return gulp.src( '' )
    .pipe( $.plumber() )
    .pipe( webpackStream( {
      watch: true,
      entry: allFiles,
      output: {
        filename: '__spec-build.js'
      },
      module: {
        loaders: [
          // This is what allows us to author in future JavaScript
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          // This allows the test setup scripts to load `package.json`
          {
            test: /\.json$/,
            exclude: /node_modules/,
            loader: 'json-loader'
          }
        ]
      },
      plugins: [
        // By default, webpack does `n=>n` compilation with entry files. This concatenates
        // them into a single chunk.
        new webpack.optimize.LimitChunkCountPlugin( {
          maxChunks: 1
        } )
      ],
      devtool: 'inline-source-map'
    }, null, function() {
      if ( firstBuild ) {
        $.livereload.listen( {
          port: 35729,
          host: 'localhost',
          start: true
        } );
        var watcher = gulp.watch( jsWatchedFiles, [ 'lint' ] );
      } else {
        $.livereload.reload( './tmp/__spec-build.js' );
      }
      firstBuild = false;
    } ) )
    .pipe( gulp.dest( './tmp' ) );
}

/* ==========================================================================
   Styles and other webapp stuff
   ========================================================================== */

function less() {
  return gulp.src( `${paths.src}/styles/*.less` )
    .pipe( $.sourcemaps.init() )
    .pipe( $.less() )
    .pipe( $.csso() )
    .pipe( $.postcss( [
      require( 'autoprefixer' )( {
        browsers: [ 'last 2 versions' ]
      } )
    ] ) )
    .pipe( $.sourcemaps.write() )
    .pipe( gulp.dest( paths.dist ) )
    .pipe( browerSyncServer.stream() );
}

function html() {
  return gulp.src( 'src/*.html' )
    .pipe( gulp.dest( paths.dist ) )
    .pipe( browerSyncServer.stream() );
}

function minifyImages() {
  return gulp.src( 'src/images/**/*' )
    .pipe( $.cache( $.imagemin( {
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [ {
        cleanupIDs: false
      } ]
    } ) ) )
    .pipe( gulp.dest( `${paths.dist}/images` ) );
}

function bundleDev() {
  const config = webpackConfig( true, `${paths.src}/${paths.main}`, PORT, false );
  return gulp.src( `${paths.src}/${paths.main}` )
    .pipe( $.plumber() )
    .pipe( webpackStream( config ) )
    .pipe( gulp.dest( paths.dist ) );
}

function bundleDist() {
  const config = webpackConfig( false, `${paths.src}/${paths.main}`, PORT, false );
  return gulp.src( `${paths.src}/${paths.main}` )
    .pipe( $.plumber() )
    .pipe( webpackStream( config ) )
    .pipe( gulp.dest( paths.dist ) );
}

function serve() {
  browerSyncServer.init( {
    notify: false,
    open: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: paths.dist
    }
  } );
}

function serveWebpack() {
  const config = webpackConfig( true, `${paths.src}/${paths.main}`, PORT, true );

  return new WebpackDevServer( webpack( config ), {
      contentBase: config.output.path,
      publicPath: config.output.publicPath,
      watchDelay: 100
    } )
    .listen( PORT, '0.0.0.0', ( err ) => {
      if ( err ) {
        throw new $.util.PluginError( 'webpack-dev-server', err );
      }

      $.util.log( `[${pkg.name} serve]`, `Listening at 0.0.0.0:${PORT}` );
    } );
}

// Run the headless unit tests as you make changes.
function watch() {
  gulp.watch( `${paths.scr}/*.html`, [ 'html' ] );
  gulp.watch( `${paths.src}/styles/*.less`, [ 'less' ] );
  gulp.watch( jsWatchedFiles, [ 'test', 'bundleDev' ] )
    .on( 'change', browerSyncServer.reload );
}

/* ==========================================================================
   Taks declarations
   ========================================================================== */

gulp.task( 'html', html );

gulp.task( 'less', less );

// Remove the built files
gulp.task( 'clean', cleanDist );

// Remove our temporary files
gulp.task( 'clean-tmp', cleanTmp );

// Lint our source code
gulp.task( 'lint-src', lintSrc );

// Lint our test code
gulp.task( 'lint-test', lintTest );

// Lint this file
gulp.task( 'lint-gulpfile', lintGulpfile );

// Lint everything
gulp.task( 'lint', [ 'lint-src', 'lint-test', 'lint-gulpfile' ] );

// Build two versions of the library
gulp.task( 'bundleDist', [ 'lint' ], bundleDist );

gulp.task( 'bundleDev', [ 'lint' ], bundleDev );

// Lint and run our tests
gulp.task( 'test', [ 'lint' ], test );

// Set up coverage and run tests
gulp.task( 'coverage', [ 'lint' ], coverage );

// Set up a livereload environment for our spec runner `test/runner.html`
gulp.task( 'test-browser', [ 'lint', 'clean-tmp' ], testBrowser );

gulp.task( 'build', [ 'clean', 'html', 'test', 'bundleDist' ] );

gulp.task( 'build-dev', [ 'clean', 'html', 'less', 'bundleDev' ] );

gulp.task( 'watch', watch );

gulp.task( 'serve', [ 'build-dev', 'watch' ], serve );

gulp.task( 'serveWebpack', [ 'build-dev' ], serveWebpack );
