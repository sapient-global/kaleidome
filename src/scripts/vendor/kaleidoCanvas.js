//Based on: http://codepen.io/soulwire/pen/pwchL
//TODO: update the logic to be able to receive a canvas that is already in the dom and update its
//props
//Maybe get ideas from: https://github.com/kazuhikoarase/kaleidoscope/blob/master/kaleidoscope.html
'use strict';

export default class {
  constructor( opts ) {
    let key, ref, ref1, val;
    this.options = ( !opts ) ? opts : {};
    this.defaults = {
      offsetRotation: 0,
      offsetScale: 1,
      offsetX: 0,
      offsetY: 0,
      radius: 260,
      slices: 12,
      zoom: 1
    };
    ref = this.defaults;
    for ( key in ref ) {
      val = ref[ key ];
      this[ key ] = val;
    }

    ref1 = this.options;
    for ( key in ref1 ) {
      val = ref1[ key ];
      this[ key ] = val;
    }

    if ( this.domElement == null ) {
      this.domElement = document.createElement( 'canvas' );
    }
    if ( this.context == null ) {
      this.context = this.domElement.getContext( '2d' );
    }
    if ( this.image == null ) {
      this.image = document.createElement( 'img' );
    }
  }

  draw() {
    const HALF_PI = Math.PI / 2;
    const TWO_PI = Math.PI * 2;
    var cx, i, index, ref, results, scale, step;
    this.domElement.width = this.domElement.height = this.radius * 2;
    this.context.fillStyle = this.context.createPattern( this.image, 'repeat' );
    scale = this.zoom * ( this.radius / Math.min( this.image.width, this.image.height ) );
    step = this.TWO_PI / this.slices;
    cx = this.image.width / 2;
    results = [];
    for ( index = i = 0, ref = this.slices; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i ) {
      this.context.save();
      this.context.translate( this.radius, this.radius );
      this.context.rotate( index * step );
      this.context.beginPath();
      this.context.moveTo( -0.5, -0.5 );
      this.context.arc( 0, 0, this.radius, step * -0.51, step * 0.51 );
      this.context.lineTo( 0.5, 0.5 );
      this.context.closePath();
      this.context.rotate( this.HALF_PI );
      this.context.scale( scale, scale );
      this.context.scale( [ -1,
        1
      ][ index % 2 ], 1 );
      this.context.translate( this.offsetX - cx, this.offsetY );
      this.context.rotate( this.offsetRotation );
      this.context.scale( this.offsetScale, this.offsetScale );
      this.context.fill();
      results.push( this.context.restore() );
    }

    return results;
  };
};
