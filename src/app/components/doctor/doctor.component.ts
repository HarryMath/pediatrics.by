import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Day, DoctorDto } from 'src/app/sdk/dto/Doctor';
import { DomUtils, getName, mobileWidth } from 'src/app/shared/utils';
import { EventsService } from '../events/events.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { DateUtils } from '../../shared/utils/date.utils';
import { TimestampInterval } from '../../sdk/dto/Interval';

@Component({
  standalone: true,
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  imports: [
    AvatarComponent,
    NgIf,
    NgTemplateOutlet,
    NgForOf,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorComponent implements OnInit {

  _d!: DoctorDto;
  @Input() set d(d: DoctorDto) {
    this._d = d;
    this.name = getName(d);
    this.speciality = (d.speciality || []).join(' · ');
    this.category = d.category
    this.labels = [];

    const workStart = (d.experience || [])
      .map(e => e.start)
      .sort((y2, y1) => y1 - y2)
      .shift();

    if (workStart) {
      const workStage = new Date().getFullYear() - workStart;
      this.labels.push({
        color: '#000',
        text: `стаж ${workStage} лет`
      })
    }

    const desc = d.description?.toLowerCase() || '';
    const specialLabels = ['кандидат медицинских наук', 'доктор медицинских наук'];
    for (const l of specialLabels) {
      if (desc.includes(l)) {
        this.labels.push({ color: 'red', text: l });
      }
    }

  }
  isMobile: boolean;

  labels: { color: string; text: string }[] = [];
  speciality?: string;
  category?: string;
  name = '';

  hasAdmission = false;
  loadingAdmissions = true;
  days: Day[] = [];
  selectedDay?: Day;

  constructor(
    public readonly eventsService: EventsService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.isMobile = innerWidth < mobileWidth;
  }

  ngOnInit(): void {
    // ScheduleSdk.doctors.getNextAvailable(this.d.id).then(t => {
    //   if (!t) {
    //     return;
    //   }
    //   const dayDifference = DateUtils.dateDiffInDays(t, new Date());
    //   if (dayDifference < 2) {
    //     this.nextAvailable = dayDifference === 0 ? 'Сегодня' : 'Завтра';
    //   } else {
    //     this.nextAvailable = DateUtils.toString(t);
    //   }
    //   this.nextAvailable += ', ' + DateUtils.toStringTime(t);
    //   this.cdr.markForCheck();
    // })
  }

  getName(d: DoctorDto): string {
    return getName(d);
  }

  getAvatarSize(): number {
    const AVATAR_SIZE_REM = innerWidth < mobileWidth ? 25 : 8;
    const initialSize = DomUtils.remToPX(AVATAR_SIZE_REM);
    const maxSize = innerWidth * MAX_AVATAR_WIDTH_PART - DomUtils.remToPX(7);
    if (initialSize > maxSize) {
      return DomUtils.pxToRem(maxSize);
    }
    return AVATAR_SIZE_REM;
  }

  getDescription(description?: string): string[] {
    if (!description) {
      return [];
    }
    const linesAmount = innerWidth < mobileWidth ? 8 : 3;
    return description.split('\n').slice(0, linesAmount).map(l => {
      l = l.trim();
      if (l.startsWith('—') || l.startsWith('-')) {
        l = l.substring(1).trim();
      }
      return l;
    });
  }

  getSpeciality(d: DoctorDto): string {
    return typeof d.speciality === 'string' ? d.speciality : d.speciality?.join(', ') || '';
  }

  isSelected(d: Day) {
    return !!this.selectedDay && this.selectedDay.date === d.date;
  }

  selectDay(d: Day) {
    if (d.options.length) {
      this.selectedDay = d;
    }
  }

  getDayDisplay(d: Day): string {
    return DateUtils.getWeekDay(d.date, true) + ', ' + d.date.getDate();
  }

  getTimeDisplay(t: TimestampInterval) {
    return DateUtils.toStringTime(t.start, 3);
  }

  handleTimeClick() {
    throw new Error('not implemented');
  }
}

const MAX_AVATAR_WIDTH_PART = .98;
