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

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'resolve-url!',
  'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve( __dirname, './src/styles' )
]

const sassResolvePaths = path.resolve( __dirname, './src/styles' );
const sassPaths = `indentedSyntax=sass&includePaths[]= ${sassResolvePaths}`;


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
        //loader: [ 'style', 'css?sourceMap', 'sass?sourceMap' ].join('!')
        loader: DEBUG ?
          'style!css?sourceMap!resolve-url!postcss-loader!sass?sourceMap!' : ExtractTextPlugin.extract( 'style-loader', 'css-loader!resolve-url!postcss-loader!sass!' )
      },
      // Load images
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
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
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
    sassLoader: {
      includePaths: [ `${paths.src}/styles` ]
    },
    noParse: [
      /(node_modules|~)\/(crappy\-bundled\-lib|jquery)\//gi
    ]
  },
  devtool: 'source-map',
  plugins: ( [
    // Avoid publishing files when compilation failed:
    new webpack.NoErrorsPlugin(),

    // Aggressively remove duplicate modules:
    new webpack.optimize.DedupePlugin(),

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
