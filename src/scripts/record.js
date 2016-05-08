/**
 * Here we get via webRTC a the mediaStream that contains the
 * MediaStreamTracks (video) that contains whatever the camera is recording.
 * Once we get it, we set it in the video tag's src, so it is displayed in the browser.
 *
 * When the user wants to get a photo out of it, with the canvas API, we capture whatever is happening
 * in the video tag, and make a png image out of it.
 */
import isMobile from './libs/isMobile.js';
import isWebRTCsupported from './libs/isWebRTCsupported.js';

let isStreaming = false;

// These are the settings that the webRTC needs, it tells it that
// we want to record only video
const mediaSettings = {
  audio: false,
  video: true
};

//This is the size of the video and photo
let size = {
  width: 489,
  height: 360,
};

let mediaObjects = {
  mediaStream: false,
  mediaStreamTracks: false
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

/**
 * Given the video, it tells the canvas to capture an image out of it
 *
 * @param  {DOMElement} canvas
 * @param  {DOMElement} video
 * @param  {DOMElement} photo
 */
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

/**
 * Logs in the console if something bad happened...
 *
 * @param  {Error} error Error that happening when trying to record
 */
function _errorCallback( error ) {
  console.log( 'navigator.getUserMedia error: ', error );
}

/**
 * Starts recording video if the userMedia is supported
 *
 * @param  {mediaStream} mediaStream MediaStream sent by getUserMedia
 */
function _recordVideo( mediaStream ) {
  //A mediaStream consist of cero or more MediaStreamTracks (audio or video)
  //A mediaStream also has channels, they are using to transfer data across peers
  const video = document.querySelector( 'video' );
  //Here we give the video the input of the camera.
  mediaObjects.mediaStream = mediaStream;
  video.srcObject = mediaStream;
}

/**
 * Starts capturing video
 *
 * @param  {Function} successCallback callback to call if we can record video
 */
function _captureMedia( successCallback ) {
  try {
    //When we call getUserMedia, we are getting an object called MediaStream.
    //This object contains
    //several tracks, which correspond to the media devices available in the local device (cameras or microphones)
    //or available via the Peer connection API (Yes, the one to make calls)
    navigator.mediaDevices.getUserMedia( mediaSettings ).then( successCallback ).catch( _errorCallback );
  } catch ( e ) {
    console.log( 'navigator.mediaDevices.getUserMedia error: ', e );
  }
};

function init() {
  const canvas = window.canvas = document.querySelector( 'canvas' );
  const video = document.querySelector( '.video-recorder' );
  const photo = document.querySelector( '.photo' );
  const navbar = document.querySelector( '.navbar' );
  const content = document.querySelector( '.js-all-content' );

  const buttonPhoto = document.querySelector( '.js-button-photo' );
  const buttonAgain = document.querySelector( '.js-button-again' );
  const buttonCancel = document.querySelector( '.js-button-cancel' );

  if ( isWebRTCsupported.test() ) {
    _captureMedia( _recordVideo );
  }

  buttonPhoto.addEventListener( 'click', () => {
    _takePicture( canvas, video, photo );
    //The stream is of type MediaStream, is available in the callback when we star recording
    //and we make it available here. The tracks is of type MediaStreamTrack. This object represents
    //a source of media available in the UserAgent, in our case is a video.
    mediaObjects.mediaStreamTracks = mediaObjects.mediaStream.getTracks()[ 0 ];

    //By calling stop, the mediaStreamTrack will be ended, this means that we will stop
    //recording the video. To start it again, we need to add a new track to the mediaStream
    mediaObjects.mediaStreamTracks.stop();
  } );

  buttonAgain.addEventListener( 'click', () => {
    _clearPhoto( canvas, photo, video );
    //As we have stoped completely the mediaStream when we took the photo,
    //in case we want to start it again, we need to get again the mediaStream
    _captureMedia( _recordVideo );
  } );

  buttonCancel.addEventListener( 'click', () => {
    //Whenever the user clicks on cancel, they are retrieved to
    //this screen. Therefore we need to restart again the video recording
    _captureMedia( _recordVideo );
  } );

  //Each device has a different aspect ratio on their cameras
  //This is a very simple version to detect aspect ratios, and sets the
  //size of our sizes object, this is used below when we set the size of the video and canvas
  detectAspectRatio();

  //It it is not yet playing, then sets up the size of the video and canvas
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
