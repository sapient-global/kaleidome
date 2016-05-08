/**
 * This is a library based on
 * http://codepen.io/soulwire/pen/pwchL
 * given an image, creates a Kaleidoscope out of it
 *
 * Here we are using the new class syntax of es2015.
 * Some people were strongly agains it, others strongly in favour, at the end,
 * the comittee decided to add it.
 *
 * We are neutral about it.
 */

export default class {
  // As in OOP, the constructor is called when you instatiate a class
  // when this class in instatiated, the kaleidoscope will be setup but not yet drawn
  constructor( opts ) {
    this.options = ( opts ) ? opts : {};
    this.image = new Image();
    this.defaults = {
      offsetRotation: 0,
      offsetScale: 1,
      offsetX: 0,
      offsetY: 0,
      radius: 260,
      slices: 12,
      zoom: 1
    };

    // Directly out of MDN documentation: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    // is used to copy the values of all enumerable own properties from one or
    // more source objects to a target object. It will return the target object.
    // In a brief, is the native way to merge objects, so no more jQuery or lodash for it.
    const mergedOptions = Object.assign( this.defaults, this.options );

    for ( let key in mergedOptions ) {
      let val = mergedOptions[ key ];
      this[ key ] = val;
    }

    if ( !this.domElement ) {
      this.domElement = document.querySelector( '.kaleidoscope' );
    }
    if ( !this.context ) {
      this.context = this.domElement.getContext( '2d' );
    }

    //When we assing this class the new image, this event will be called and the kaleidoscope will be drawn
    this.image.onload = () => {
      this.draw();
    };
  }

  draw() {
    const HALF_PI = Math.PI / 2;
    const TWO_PI = Math.PI * 2;
    const scale = this.zoom * ( this.radius / Math.min( this.image.width, this.image.height ) );
    const step = TWO_PI / this.slices;
    const cx = this.image.width / 2;
    const size = this.radius * 2;
    let i;
    let index;
    let ref;

    //First we set the size of the canvas
    this.domElement.width = size;
    this.domElement.height = size;
    //Then we tell it to use the image to create a pattern inside it.
    this.context.fillStyle = this.context.createPattern( this.image, 'repeat' );;

    //Then, we will start creating small triangles (12 is the default) with the image
    //And they will be rotated, scaled, translated, etc, etc. By using all those crazy
    //constants you saw on top of this function.
    for ( index = i = 0, ref = this.slices; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i ) {
      //Before we start messing around with the context of the canvas, we need to save it, and when we
      //end, we restore it
      this.context.save();
      this.context.translate( this.radius, this.radius );
      this.context.rotate( index * step );
      this.context.beginPath();
      this.context.moveTo( -0.5, -0.5 );
      this.context.arc( 0, 0, this.radius, step * -0.51, step * 0.51 );
      this.context.lineTo( 0.5, 0.5 );
      this.context.closePath();
      this.context.rotate( HALF_PI );
      this.context.scale( scale, scale );
      this.context.scale( [ -1, 1 ][ index % 2 ], 1 );
      this.context.translate( this.offsetX - cx, this.offsetY );
      this.context.rotate( this.offsetRotation );
      this.context.scale( this.offsetScale, this.offsetScale );
      //This function renders the image in the triangle
      this.context.fill();
      this.context.restore();
    }
  };
};
