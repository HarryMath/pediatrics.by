import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { BaseCalendarComponent } from 'src/app/shared/base.calendar.component';

@Component({
  selector: 'select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.css']
})
export class SelectDateComponent<T extends { date: Date }> extends BaseCalendarComponent<T> implements OnInit {

  @ViewChild('calendar') calendar!: ElementRef<HTMLDivElement>;
  heightCalculated = false;

  @ViewChild('el') el!: ElementRef;
  @Input() loading = false;
  @Input() canSelect = false;
  @Input() set data(dayDay: T[]) {
    this.dayData = dayDay;
    this.loadPage(this.selectedYear, this.selectedMonth);
    if (this.el) {
      const w = this.el.nativeElement.getBoundingClientRect().width;
      this.dayH = (w / 8) + 'px'
      this.headerH = (w / 7) + 'px'
    } else {
      const val = parseFloat(this.dayH);
      this.headerH = val * 1.3 + this.dayH.replace('' + val, '');
    }
    this.selectedDay = [-1, -1];
    setTimeout(() => this.calculateHeight(), 10);
  }
  @Output() onSelect: EventEmitter<T[]> = new EventEmitter();
  dayH = '2.2rem';
  headerH = '2.8rem';

  constructor() {
    super();
    const date = new Date();
    this.loadPage(date.getFullYear(), date.getMonth());
  }

  selectedDay = [-1, -1];

  select(column: number, day: number): void {
    const data = this.columns[column].days[day].data;
    if (data.length < 1) {
      return;
    }
    this.selectedDay = [column, day];
    this.onSelect.emit(data);
  }

  isSelected(column: number, day: number): boolean {
    return this.selectedDay[0] === column && this.selectedDay[1] === day;
  }

  isAvailable(data: T[]): boolean {
    return data?.length > 0;
  }

  ngOnInit(): void {
    setTimeout(() => this.calculateHeight(), 10);
  }

  calculateHeight(): void {
    if (this.heightCalculated) {
      return;
    }
    const element = this.calendar?.nativeElement;
    if (element) {
      const h = element.querySelector('.date')!.getBoundingClientRect().width;
      Array.from(element.querySelectorAll<HTMLDivElement>('.date'))
        .forEach(el => el.style.cssText = 'height: ' + h + 'px');
      this.heightCalculated = true;

    }
  }
}
