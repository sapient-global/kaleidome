/**
 * Detects if the device is a mobile.
 * This is based on the information on this article
 * https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 */

export default {
  test() {
    const regex = /Mobi/g;
    return regex.test( navigator.userAgent );
  }
};
