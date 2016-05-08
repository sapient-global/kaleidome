// We could have done this with vanillaJS also
// but the logic behind date comparison can be quite tricky,
// so we save lines of code by using momentJS
import moment from 'moment';

export default {
  test( now ) {
    const dates = {
      day1: '2016-05-09',
      day2: '2016-05-10'
    };
    const times = {
      begin: '09:00',
      end: '18:00'
    };

    const day1Start = moment( `${dates.day1} ${times.start}` );
    const day1End = moment( `${dates.day1} ${times.end}` );

    const day2Start = moment( `${dates.day2} ${times.start}` );
    const day2End = moment( `${dates.day2} ${times.end}` );

    return ( moment( now ).isBetween( day1Start, day1End ) || moment( now ).isBetween( day2Start, day2End ) );
  }
};
