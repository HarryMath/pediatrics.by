import { DateUtils } from './date.utils';

export class Time {

  hours: number;
  minutes: number;
  date: Date

  constructor(h: number, m: number, d?: Date) {
    this.hours = h;
    this.minutes = m;
    this.date = d ? new Date(d) : new Date()
  }

  static now(): Time {
    return Time.fromDate(new Date());
  }

  static fromDate(date: Date): Time {
    date = new Date(date);
    return new Time(date.getHours(), date.getMinutes(), date);
  }

  getFullTime(): number {
    return new Date(
      this.date.getFullYear(), this.date.getMonth(), this.date.getDate(),
      this.hours, this.minutes, 0, 0
    ).getTime();
  }

  getMinutesTime(): number {
    return this.hours * 60 + this.minutes;
  }

  ceil(m = 30): Time {
    const mins = Math.ceil(this.minutes / m) * m;
    return new Time(
      mins >= 60 ? this.hours + 1 : this.hours,
      mins >= 60 ? 0 : mins
    );
  }

  floor(m = 30): Time {
    const mins = Math.floor(this.minutes / m) * m;
    return new Time(this.hours, mins <= 0 ? 0 : mins);
  }

  toString(): string {
    return `${this.hours > 9 ? this.hours : '0' + this.hours}:${this.minutes > 9 ? this.minutes : '0' + this.minutes}`;
  }

  toTimeStamp() {
    return DateUtils.getDate({ hours: this.hours, minute: this.minutes });
  }
}

export interface TimestampInterval {
  start: Date
  end: Date
}

export class TimeInterval {
  constructor(public start: Time, public end: Time) {}

  static fromTimestamp(interval: TimestampInterval): TimeInterval {
    return new TimeInterval(Time.fromDate(interval.start), Time.fromDate(interval.end));
  }

  includes(i: TimeInterval): boolean {
    return this.includesTime(i.start) && this.includesTime(i.end);
  }

  splitBy(i: TimeInterval): TimeInterval[] {
    return [
      new TimeInterval(this.start, i.start),
      new TimeInterval(i.end, this.end)
    ]
  }

  includesDate(d: Date): boolean {
    return this.includesTime(Time.fromDate(d));
  }

  includesTime(t: Time): boolean {
    const mins = t.getMinutesTime();
    return this.start.getMinutesTime() <= mins && mins <= this.end.getMinutesTime();
  }

  toString(): string {
    return this.start.toString() + ' - ' + this.end.toString();
  }
}

export const TimeUtils = {
  /**
   * For sorted array only
   */
  getWaitingTime(intervals: TimestampInterval[]): number {
    let total = 0;
    for (let i = 1; i < intervals.length; i++) {
      total += intervals[i].start.getTime() - intervals[i - 1].end.getTime();
    }
    return total;
  },

  /**
   * For sorted array only
   */
  hasIntersections(intervals: TimestampInterval[]): boolean {
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i].start.getTime() < intervals[i - 1].end.getTime()) {
        return true;
      }
    }
    return false;
  },

  intersectsExclusive(t1: TimestampInterval, t2: TimestampInterval): boolean {
    return TimeUtils.includesTimeExcluding(t1, t2.start) ||
      TimeUtils.includesTimeExcluding(t1, t2.end) ||
      TimeUtils.includesTimeExcluding(t2, t1.end) ||
      TimeUtils.includesTimeExcluding(t2, t1.end);
  },

  includes(source: TimestampInterval, object: TimestampInterval): boolean {
    return TimeUtils.includesTimeIncluding(source, object.start) &&
      TimeUtils.includesTimeIncluding(source, object.end);
  },

  splitByPeriods(source: TimestampInterval, durationMinutes: number): TimestampInterval[] {
    const result: TimestampInterval[] = [];
    let start = source.start;
    let end = DateUtils.getDateWithOffset(source.start, { minutes: durationMinutes });
    while ( end <= source.end ) {
      result.push({ start, end });
      start = end;
      end = DateUtils.getDateWithOffset(end, { minutes: durationMinutes });
    }
    return result;
  },

  splitBy(source: TimestampInterval, object: TimestampInterval): TimestampInterval[] {
    return [
      { start: source.start, end: object.start },
      { start: object.end, end: source.end },
    ]
  },

  getDuration(i: TimestampInterval): number {
    return i.end.getTime() - i.start.getTime();
  },

  includesTimeIncluding(source: TimestampInterval, t: Date): boolean {
    const time = t.getTime();
    return source.start.getTime() <= time && time <= source.end.getTime();
  },

  includesTimeExcluding(source: TimestampInterval, t: Date): boolean {
    const time = t.getTime();
    return source.start.getTime() < time && time < source.end.getTime();
  },

  /**
   * method split source intervals by busyIntervals.
   * assume that sourceIntervals have no collisions
   * @param sourceIntervals
   * @param busyIntervals
   * @example
   * source: [{12:00, 13:00}, {14:00, 19:00}]
   * busy: [{12:00, 13:00}, {15:00, 16:00}]
   * result: [{14:00, 15:00}, {16:00, 19:00}]
   */
  getFreePeriods(
    sourceIntervals: TimestampInterval[],
    busyIntervals: TimestampInterval[]
  ): TimestampInterval[] {
    const intervals: TimestampInterval[] = [...sourceIntervals];

    for (let b of busyIntervals) {

      let interval: TimestampInterval;
      for (let  j = 0; j < intervals.length; j++) {
        interval = intervals[j];
        if (TimeUtils.includes(interval, b)) {
          intervals.push(
            ...TimeUtils.splitBy(interval, b)
              .filter(i => TimeUtils.getDuration(i) !== 0)
          )
          intervals.splice(j, 1);
          break;
        }
      }
    }
    return intervals;
  }
}
