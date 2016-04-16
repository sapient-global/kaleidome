'use strict';

import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import del from 'del';
import glob from 'glob';
import path from 'path';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import WebpackDevServer from 'webpack-dev-server';
import source from 'vinyl-source-stream';
import webpackConfig from './webpack.config';
import pkg from './package.json';

// Load all of our Gulp plugins
const $ = loadPlugins();
const PORT = process.env.PORT || 9000;

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

function clean( done ) {
  del( [ paths.dist ] ).then( () => done() );
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
  return lint( 'src/scripts/*.js' );
}

function lintGulpfile() {
  return lint( 'gulpfile.babel.js' );
}

/* ==========================================================================
   Styles and other webapp stuff
   ========================================================================== */

function sass() {
  return gulp.src( `${paths.src}/styles/*.scss` )
    .pipe( $.sourcemaps.init() )
    .pipe( $.sass().on( 'error', $.sass.logError ) )
    .pipe( $.csso() )
    .pipe( $.postcss( [
      require( 'autoprefixer' )( {
        browsers: [ 'last 2 versions' ]
      } )
    ] ) )
    .pipe( $.sourcemaps.write() )
    .pipe( gulp.dest( paths.dist ) );
}

function html() {
  return gulp.src( 'src/*.html' )
    .pipe( gulp.dest( paths.dist ) );
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
  const config = webpackConfig( true, `${paths.src}/scripts/${paths.main}`, PORT, false );
  return gulp.src( `${paths.src}/scripts/${paths.main}` )
    .pipe( $.plumber() )
    .pipe( webpackStream( config ) )
    .pipe( gulp.dest( paths.dist ) );
}

function bundleDist() {
  const config = webpackConfig( false, `${paths.src}/scripts/${paths.main}`, PORT, false );
  return gulp.src( `${paths.src}/scripts/${paths.main}` )
    .pipe( $.plumber() )
    .pipe( webpackStream( config ) )
    .pipe( gulp.dest( paths.dist ) );
}

function serve() {
  const config = webpackConfig( true, `${paths.src}/scripts/${paths.main}`, PORT, true );

  return new WebpackDevServer( webpack( config ), {
      contentBase: config.output.path,
      publicPath: config.output.publicPath,
      watchOptions: {
        aggregateTimeout: 100
      }
    } )
    .listen( PORT, '0.0.0.0', ( err ) => {
      if ( err ) {
        throw new $.util.PluginError( 'webpack-dev-server', err );
      }

      $.util.log( `[${pkg.name} serve]`, `Listening at 0.0.0.0:${PORT}` );
    } );
}

/* ==========================================================================
   Taks declarations
   ========================================================================== */

gulp.task( 'html', html );

gulp.task( 'sass', sass );

// Remove the built files
gulp.task( 'clean', clean );

// Lint our source code
gulp.task( 'lint-src', lintSrc );

// Lint this file
gulp.task( 'lint-gulpfile', lintGulpfile );

// Lint everything
gulp.task( 'lint', [ 'lint-src', 'lint-gulpfile' ] );

// Build two versions of the library
gulp.task( 'bundleDist', [ 'lint' ], bundleDist );

gulp.task( 'bundle', bundleDev );

gulp.task( 'bundleDev', [ 'lint' ], bundleDev );

gulp.task( 'build', [ 'clean', 'html', 'test', 'bundleDist' ] );

gulp.task( 'build-dev', [ 'clean', 'html', 'sass', 'bundleDev' ] );

gulp.task( 'serve', function( cb ) {
  runSequence( 'clean', [ 'build-dev', 'watch' ], serve );
} );

gulp.task( 'watch', function() {
  gulp.watch( `${paths.src}/**/*`, [ 'html', 'sass', 'bundle' ] );
} );
