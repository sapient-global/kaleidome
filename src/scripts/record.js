import isMobile from './libs/isMobile.js';

let isStreaming = false;

const mediaSettings = {
  audio: false,
  video: true
};

let size = {
  width: 489,
  height: 360,
};

function detectAspectRatio() {
  const desktopRatio = 4 / 3;
  const mobileHeight = window.innerHeight;
  const desktopHeight = size.width / desktopRatio;
  size.height = ( isMobile.test() ) ? mobileHeight : desktopHeight;
}

function _clearPhoto( canvas, photo, video ) {
  const context = canvas.getContext( '2d' );
  context.fillStyle = '#ffffff';
  context.fillRect( 0, 0, canvas.width, canvas.height );
  const data = canvas.toDataURL( 'image/png' );
  photo.setAttribute( 'src', data );

  const images = document.querySelectorAll( '.kaleidoscope-image' );

  for ( let i = 0; i < images.length; i++ ) {
    let image = images[ i ];
    image.style.backgroundImage = `none`;
  }
}

function _takePicture( canvas, video, photo ) {
  const context = canvas.getContext( '2d' );
  canvas.width = size.width;
  canvas.height = size.height;
  context.drawImage( video, 0, 0, size.width, size.height );
  const data = canvas.toDataURL( 'image/png' );
  photo.setAttribute( 'src', data );
  photo.setAttribute( 'width', size.width );
  photo.setAttribute( 'height', size.height );
}

function _errorCallback( error ) {
  console.log( 'navigator.getUserMedia error: ', error );
}

function _recordVideo( stream ) {
  const video = document.querySelector( 'video' );
  window.stream = stream;
  video.srcObject = stream;
}

function _captureMedia( successCallback ) {
  navigator.mediaDevices.getUserMedia( mediaSettings ).then( successCallback ).catch( _errorCallback );
};

function init() {
  const canvas = window.canvas = document.querySelector( 'canvas' );
  const video = document.querySelector( '.video-recorder' );
  const photo = document.querySelector( '.photo' );

  const buttonPhoto = document.querySelector( '.js-button-photo' );
  const buttonClear = document.querySelector( '.js-button-again' );

  _captureMedia( _recordVideo );

  buttonPhoto.addEventListener( 'click', () => {
    _takePicture( canvas, video, photo );
  } );

  buttonClear.addEventListener( 'click', () => {
    _clearPhoto( canvas, photo, video );
  } );

  size.width = window.innerWidth;
  detectAspectRatio();

  video.addEventListener( 'canplay', () => {
    if ( !isStreaming ) {
      video.setAttribute( 'width', size.width );
      video.setAttribute( 'height', size.height );

      canvas.setAttribute( 'width', size.width );
      canvas.setAttribute( 'height', size.height );
      isStreaming = true;
    }
  }, false );
};

export default {
  init
};
