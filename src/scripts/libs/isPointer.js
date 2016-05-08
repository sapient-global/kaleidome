/**
 * Detects if the pointer events are available
 */

export default {
  test() {
    return ( window.PointerEvent ) ? true : false;
  }
};
