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

let mediaObjects = {
  stream: false,
  tracks: false
};

function detectAspectRatio() {
  const desktopRatio = 4 / 3;
  const mobileHeight = window.innerHeight;
  size.width = window.innerWidth;
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

function _recordVideo( mediaStream ) {
  //A mediaStream consist of cero or more MediaStreamTracks (audio or video)
  //A mediaStream also has channels, they are using to transfer data across peers
  const video = document.querySelector( 'video' );
  mediaObjects.stream = mediaStream;
  video.srcObject = mediaStream;
}

function _captureMedia( successCallback ) {
  try {
    //When we call getUserMedia, we are getting an object called MediaStream.
    //This object contains
    //several tracks, which correspond to the media devices available in the local device (cameras or microphones)
    //or available via the Peer connection API (Yes, the one to make calls)
    navigator.mediaDevices.getUserMedia( mediaSettings ).then( successCallback ).catch( _errorCallback );
  } catch ( e ) {
    console.log( 'navigator.getUserMedia error: ', e );
  }
};

function init() {
  const canvas = window.canvas = document.querySelector( 'canvas' );
  const video = document.querySelector( '.video-recorder' );
  const photo = document.querySelector( '.photo' );
  const navbar = document.querySelector( '.navbar' );
  const content = document.querySelector( '.js-all-content' );

  const buttonPhoto = document.querySelector( '.js-button-photo' );
  const buttonClear = document.querySelector( '.js-button-again' );
  const buttonCancel = document.querySelector( '.js-button-cancel' );

  _captureMedia( _recordVideo );

  buttonPhoto.addEventListener( 'click', () => {
    _takePicture( canvas, video, photo );
    navbar.classList.remove( 'u-hidden' );
    content.classList.remove( 'content--no-nav' );
    //The stream is of type MediaStream, is available in the callback when we star recording
    //and we make it available here. The tracks is of type MediaStreamTrack. This object represents
    //a source of media available in the UserAgent, in our case is a video.
    mediaObjects.tracks = mediaObjects.stream.getTracks()[ 0 ];
    //By calling stop, the mediaStreamTrack will be ended, this means that we will stop
    //recording the video. To start it again, we need to add a new track to the mediaStream
    mediaObjects.tracks.stop();
  } );

  buttonClear.addEventListener( 'click', () => {
    _clearPhoto( canvas, photo, video );
    navbar.classList.add( 'u-hidden' );
    content.classList.add( 'content--no-nav' );
    //As we have stoped completely the mediaStream when we took the photo,
    //in case we want to start it again, we need to get again the mediaStream
    _captureMedia( _recordVideo );
  } );

  buttonCancel.addEventListener( 'click', () => {
    //Whenever the user clicks on cancel, they are retrieved to
    //this screen. Therefore we need to restart again the video recording
    _captureMedia( _recordVideo );
  } );

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
