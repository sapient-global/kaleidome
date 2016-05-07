/**
 * Detects if pointer is available
 */

export default {
  test() {
    if ( window.PointerEvent ) {
      return true;
    }
    return false;
  }
};
