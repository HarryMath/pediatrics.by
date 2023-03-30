export const DateUtils = {

  months: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
  months2: ["Января", "Февраля", "Марта", "Апреля", "Maя", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"],
  days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],

  toDateTime: (date: Date, time: Date): Date => {
    return DateUtils.getDate({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      hours: time.getHours(),
      minute: time.getMinutes()
    })
  },

  toString: (d: Date, options?: { hideYear?: boolean, hideMonth?: boolean, hideDay?: boolean, monthString?: boolean }): string => {
    if (!d) {
      return '';
    }
    const data = [];
    if (!options?.hideDay) {
      const day = d.getDate();
      data.push(day > 9 ? day : '0' + day);
    }
    if (!options?.hideMonth) {
      const month = d.getMonth() + 1;
      data.push(options?.monthString ? DateUtils.months2[month - 1] :month > 9 ? month : '0' + month);
    }
    if (!options?.hideYear) {
      data.push(d.getFullYear())
    }
    return data.join(options?.monthString && !options?.hideMonth ? ' ' : '.')
  },

  dateDiffInDays(d1: Date, d2: Date): number {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
  },

  getDayLabel(d?: Date): string {
    if (!d) {
      return ""
    }
    d = new Date(d);
    const difference = DateUtils.dateDiffInDays(d, new Date());
    switch (difference) {
      case 0 : return 'Сегодня';
      case 1 : return 'Завтра';
      default : return DateUtils.getWeekDay(d)
    }
  },

  toStringTime(d?: Date): string {
    if (!d) {
      return '';
    }
    d = new Date(d);
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}`
  },

  getWeekDayNumber: (d: Date): number => {
    return (d.getDay() || 7) - 1;
  },

  getWeekDay: (d: Date, full = false): string => {
    return DateUtils[full ? 'days' : 'daysShort'][(d.getDay() || 7) - 1];
  },

  getIntervalForMonth: (monthOffset: number, onlyFuture = true): { start: Date, end: Date } => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    return {
      start: DateUtils.getDate({
        month: currentMonth + monthOffset,
        date: onlyFuture && monthOffset === 0 ? 0 : 1,
        hours: 0, minute: 0
      }),
      end: DateUtils.getDate({
        month: currentMonth + monthOffset + 1,
        date: 1, hours: 0, minute: 0
      })
    }
  },

  getDateWithOffset: (source: Date, offset: {
    months?: number,
    days?: number,
    hours?: number,
    minutes?: number,
  }): Date => {
    return new Date(
      source.getFullYear(),
      source.getMonth() + (offset.months || 0),
      source.getDate() + (offset.days || 0),
      source.getHours() + (offset.hours || 0),
      source.getMinutes() + (offset.minutes || 0)
    );
  },

  getDayStartFromSource: (source: Date, dayOffset = 0): Date => {
    source = new Date(source);
    return new Date(
      source.getFullYear(),
      source.getMonth(),
      source.getDate() + dayOffset,
    );
  },

  getDayStart: (dayOffset = 0): Date => {
    const source = new Date();
    return new Date(
      source.getFullYear(),
      source.getMonth(),
      source.getDate() + dayOffset,
    );
  },

  getDayEnd: (dayOffset = 0): Date => {
    const source = new Date();
    return new Date(
      source.getFullYear(),
      source.getMonth(),
      source.getDate() + dayOffset + 1,
    );
  },

  getDate: (d: {
    year?: number,
    month?: number,
    date?: number,
    hours?: number,
    minute?: number
  }): Date => {
    const date = new Date();
    return new Date(
      d.year || date.getFullYear(),
      typeof d.month === 'number' ? d.month : date.getMonth(),
      d.date || date.getDate(),
      typeof d.hours === 'number' ? d.hours : date.getHours(),
      typeof d.minute === 'number' ? d.minute : date.getMinutes()
    );
  },

  getTimeFromString: (t: string): Date => {
    const hours = parseInt(t.split(':')[0]);
    const minute = parseInt(t.split(':')[1]);
    return DateUtils.getDate({ hours, minute });
  },

  daysInMonth: (y: number, m: number): number => {
    return 32 - new Date(y, m, 32).getDate();
  },

  getMothOffset(d: Date) {
    const current = new Date();
    return (d.getFullYear() * 12 + d.getMonth()) - (current.getFullYear() * 12 + current.getMonth());
  },

  getISODate(d: Date): Date|string {
    return d.toISOString().split('T')[0];
  }
}
