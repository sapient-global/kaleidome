/*
  Wecome to KaleidoMe's source code!
  Here you will find a bunch of techniques to build websites
  and we will do our best to explain them, so you can also use them
  in your projects.

  We are transpiling our client side code with Babel and bundling it
  with Webpack. The notation below is the new module syntax of ES2015.

  The modules are supported at the moment only by Chrome.
  If you want to learn more about the syntax,
  check it [here](https://github.com/lukehoban/es6features#modules)
 */
import adapter from 'webrtc-adapter';
import record from './record.js';
import share from './share.js';
import controls from './controls.js';

/*
  We have four scripts that are handling our code.
  Controls, record, kaleidoscope and share.

  Perhaps the controls is the one with more confusing name.
  It just takes care of handling the visibility of the elements in the page.

  Here we are initializing all our modules. Well, not the kaleidoscope,
  we don't want to start generating a kaleidoscope out of a non existing yet selfie :)
 */

controls.init();
record.init();
share.init();
