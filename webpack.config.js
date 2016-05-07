'use strict';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import pkg from './package.json';
import path from 'path';
const config = pkg.config;
import autoprefixer from 'autoprefixer';

const paths = {
  main: `${config.main}.js`,
  src: path.resolve( __dirname, 'src' ),
  dist: path.resolve( __dirname, config.dist ),
  bundleName: `${config.main}.js`
};

const browsers = {
  browsers: [ 'last 2 version', 'ie >= 11' ]
};

export default ( DEBUG, PATH, PORT = 3000, WEBPACKSERVER ) => ( {
  cache: DEBUG,
  debug: DEBUG,
  //  entry: PATH,
  entry: ( DEBUG && WEBPACKSERVER ? [
    `webpack-dev-server/client?http://localhost:${PORT}`,
  ] : [] ).concat( [
    `${paths.src}/styles/style.scss`,
    'babel-polyfill',
    PATH,
  ] ),
  output: {
    path: paths.dist,
    publicPath: paths.dist,
    filename: paths.bundleName
  },
  resolve: {
    // you can load named modules from any dirs you want.
    // attempts to find them in the specified order.
    modulesDirectories: [
      paths.src,
      'node_modules'
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    loaders: [ {
        test: /\.js$/,
        exclude: /node_modules/,
        include: paths.src,
        loader: 'babel-loader'
      }, {
        test: /\.scss$/,
        loader: DEBUG ?
          'style!css?postcss-loader!sass?sourceMap!' : ExtractTextPlugin.extract( 'style-loader', 'css?sourceMap!postcss-loader!sass?sourceMap!' )
      },
      // // Load images
      {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&mimetype=image/jpg'
      }, {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&mimetype=image/gif'
      }, {
        test: /\.png/,
        loader: 'url-loader?limit=10000&mimetype=image/png'
      }, {
        test: /\.svg/,
        loader: 'url-loader?limit=10000&mimetype=image/svg'
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?limit=100000&name=fonts/[name].[ext]'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
    postcss: function() {
      return [ autoprefixer( {
        browsers: [ 'last 2 versions' ]
      } ) ];
    },
    noParse: [
      /(node_modules|~)\/(crappy\-bundled\-lib|jquery)\//gi
    ]
  },
  devtool: 'eval-source-map',
  plugins: ( [
    // Avoid publishing files when compilation failed:
    new webpack.NoErrorsPlugin(),

    // Aggressively remove duplicate modules:
    new webpack.optimize.DedupePlugin(),

    // This plugin sends to the client the __DEV__ variable that
    // tells the client in which environment we are running.
    // Here we are checking aginst debug, because this constant is send to webpack
    // as true when we are running the dev evironment. It is set to false when
    // we are creating the bundle for the production environment.
    // So if in your local computer you run:
    // $gulp build
    // $node dist/server.js
    // The client will be running as if you were in production
    // (the post requests are made to /tweet instead of the full url of the node server)
    // But the server will be running in development mode. (The ssl set with a locally
    // self signed certificate. In the production environment we have a fully valid one)
    new webpack.DefinePlugin( {
      __DEV__: JSON.stringify( JSON.parse( DEBUG || 'false' ) )
    } ),

    // Write out CSS bundle to its own file:
    new ExtractTextPlugin( 'style.css', {
      allChunks: true
    } )
  ] ).concat( process.env.WEBPACK_ENV === 'dev' ? [] : [
    new webpack.optimize.OccurenceOrderPlugin(),

    // minify the JS bundle
    new webpack.optimize.UglifyJsPlugin( {
      output: {
        comments: false
      },
      compress: {
        warnings: false
      },
      exclude: [ /\.min\.js$/gi ] // skip pre-minified libs
    } )
  ] ),
  // Pretty terminal output
  stats: {
    colors: true
  },
  // `webpack-dev-server` spawns a live-reloading HTTP server for your project.
  devServer: {
    port: PORT,
    contentBase: paths.src,
    historyApiFallback: true
  }
} );
