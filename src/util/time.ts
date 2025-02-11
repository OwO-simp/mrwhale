import { Time } from "../types/time";

export class TimeUtilities {
  /**
   * Convert timestamp in miliseconds to days, hours, minutes and seconds.
   * @param ms Time in milliseconds.
   */
  static convertMs(ms: number): Time {
    const timestamp = new Time();

    let h, m, s;

    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    h = h % 24;

    timestamp.days = Math.floor(h / 24);
    timestamp.hours = h;
    timestamp.minutes = m;
    timestamp.seconds = s;

    return timestamp;
  }

  /**
   * Get a time difference between two timestamps.
   * @param a The first time.
   * @param b The second time.
   */
  static difference(a: number, b: number): Time {
    const ms = a - b;
    const difference = TimeUtilities.convertMs(ms);

    return difference;
  }
}
