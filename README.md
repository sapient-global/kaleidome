# btconf-2016

A Kaleidoscope app for BT2016

[![Travis build status](http://img.shields.io/travis/Sapient/btconf-2016.svg?style=flat)](https://travis-ci.org/Sapient/btconf-2016)
[![Code Climate](https://codeclimate.com/github/Sapient/btconf-2016/badges/gpa.svg)](https://codeclimate.com/github/Sapient/btconf-2016)
[![Test Coverage](https://codeclimate.com/github/Sapient/btconf-2016/badges/coverage.svg)](https://codeclimate.com/github/Sapient/btconf-2016)
[![Dependency Status](https://david-dm.org/Sapient/btconf-2016.svg)](https://david-dm.org/Sapient/btconf-2016)
[![devDependency Status](https://david-dm.org/Sapient/btconf-2016/dev-status.svg)](https://david-dm.org/Sapient/btconf-2016#info=devDependencies)


# Taks

## Develop mode

### dev server with browserSync
gulp serve

### dev server with Webpack
gulp serveWebpack

### Create bundle for distribution
gulp build

### Running tests
gulp test

### Checkin code coverate
gulp coverage

### Run test with browser view
gulp test-browser

# Features

* ES2016 with eslint from the airbnb config
* JS style validation with jscs
* No frameworks
* Tests with mocha, sinon and chai
* Test coverage with istanbul


# TODO
* Add template engine
* Configure imagemin
* Copy assets
* Add less styling
* Decide if we want to use webpack to load less. (Allows us to add styles with require)
* Define less guideline: BEM, SMACSS, OOCSS ?
