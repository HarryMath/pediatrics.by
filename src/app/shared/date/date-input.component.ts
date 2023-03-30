import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BaseCalendarComponent, DayInfo } from 'src/shared/ui/base.calendar.component';
import { DateUtils } from '@utils/date.utils';

@Component({
  selector: 'date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent extends BaseCalendarComponent<{date: Date}> {

  @ViewChild('el') el!: ElementRef;
  @Input() dayW = 2.9;
  @Input() dayH = 2.2;
  @Input() lineSize = 1.125;
  @Input() label = '';
  @Input() isInline = true;
  @Input() disabled = false;
  @Input() background = '';
  d: Date = new Date();
  display = '';
  style = '';
  error = false;
  isSelecting = false;
  @Input() set date(d: Date) {
    if (d) {
      d = new Date(d);
      const m = d.getMonth();
      const date = d.getDate();
      this.display = DateUtils.toString(d);

      columnsLoop:
      for (let c of this.columns) {
        for (let d of c.days) {
          if (d.month === m && d.date === date) {
            d.isSelected = true;
            break columnsLoop;
          }
        }
      }
    } else {
      this.display = '';
    }
    this.error = this.display === '';
  }
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  constructor() {
    super();
    const date = new Date();
    this.loadPage(date.getFullYear(), date.getMonth())
  }

  select(): void {
    if (this.disabled) {
      return;
    }
    this.isSelecting = !this.isSelecting;
    if (this.isSelecting) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      this.style = `position:fixed;left:${rect.left}px;top:calc(${rect.top + rect.height}px + 1rem);background:${this.background}`;
    }
  }

  afterSelect(day: DayInfo<any>): void {
    const date = DateUtils.getDate({
      year: this.selectedYear,
      month: day.month,
      date: day.date,
    });
    this.columns.forEach(c => {
      c.days.forEach(d => d.isSelected = false);
    });
    day.isSelected = true;
    this.isSelecting = false;
    this.display = DateUtils.toString(date);
    this.dateChange.emit(date);
  }
}
