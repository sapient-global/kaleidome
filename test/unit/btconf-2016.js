import btconf2016 from '../../src/btconf-2016';

describe( 'btconf2016', () => {
  describe( 'Greet function', () => {
    beforeEach( () => {
      spy( btconf2016, 'greet' );
      btconf2016.greet();
    } );

    it( 'should have been run once', () => {
      expect( btconf2016.greet ).to.have.been.calledOnce;
    } );

    it( 'should have always returned hello', () => {
      expect( btconf2016.greet ).to.have.always.returned( 'hello' );
    } );
  } );
} );
