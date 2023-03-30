import { DateUtils } from 'src/app/shared/utils/date.utils';

export interface DayInfo<DayData> {
  isSelected?: boolean
  readonly date: number,
  readonly month: number,
  readonly isToday: boolean,
  readonly data: DayData[],
}

export abstract class BaseCalendarComponent<DayData extends { date: Date }> {
  readonly months = ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  readonly columns: readonly ({
    readonly name: string,
    days: DayInfo<DayData>[]
  }) [] = [
    { name: 'Пн', days: [] },
    { name: 'Вт', days: [] },
    { name: 'Ср', days: [] },
    { name: 'Чт', days: [] },
    { name: 'Пт', days: [] },
    { name: 'Сб', days: [] },
    { name: 'Вс', days: [] }
  ];
  dayData: DayData[] = [];
  selectedMonth = 0;
  selectedYear = 0;

  loadPage(year: number, month: number): void {
    this.columns.forEach(c => {
      c.days = []
    });

    while (month > 11) {
      month -= 12;
      year++;
    }
    while (month < 0) {
      month += 12;
      year--;
    }
    this.selectedMonth = month;
    this.selectedYear = year;

    const firstDay = DateUtils.getWeekDayNumber(new Date(year, month)); // 1
    const daysInMonth = DateUtils.daysInMonth(year, month); // 30
    const startDate = new Date(year, month, 1 - firstDay).getDate(); // 31
    const today = new Date().getDate();

    const dayDataCopy = [...this.dayData];

    for (
      let i = 0,
      monthIndex = 0,
      currentDate = 0,
      currentData: DayData[] = [];
      i < 42; i++
    ) {
      monthIndex =
        i < firstDay ? -1 : // previous month
        i >= daysInMonth + firstDay ? 1 : // next month
        0; // selected month
      currentDate =
        monthIndex < 0 ? startDate + i : // if previous month
        monthIndex > 0 ? i - daysInMonth - firstDay : // if next month
        1 + i - firstDay; // if current month

      currentData = [];
      for (let i = 0, m = 0, d = 0; i < dayDataCopy.length; i++) {
        m = dayDataCopy[i].date.getMonth();
        d = dayDataCopy[i].date.getDate();
        if (m === month + monthIndex && d === currentDate) {
          currentData.push(dayDataCopy[i]);
          dayDataCopy.splice(i, 1);
        }
      }

      this.columns[i % 7].days.push({
        date: currentDate,
        isToday: currentDate === today &&
          monthIndex === 0 &&
          month == new Date().getMonth() &&
          this.selectedYear === new Date().getFullYear(),
        month: month + monthIndex,
        data: [...currentData]
      });
    }
  }
}
