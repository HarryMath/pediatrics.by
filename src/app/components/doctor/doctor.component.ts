import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Day, DoctorDto } from 'src/app/sdk/dto/Doctor';
import { DomUtils, getName, mobileWidth } from 'src/app/shared/utils';
import { EventsService } from '../events/events.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { DateUtils } from '../../shared/utils/date.utils';
import { TimestampInterval } from '../../sdk/dto/Interval';
import { ScheduleSdk } from '../../sdk/schedule.sdk';
import { TooltipDirective } from '../../shared/tooltip/tooltip.directive';

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
    NgClass,
    TooltipDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorComponent implements AfterViewInit, OnDestroy {

  _d!: DoctorDto;
  @Input() set d(d: DoctorDto) {
    this._d = d;
    this.name = getName(d);
    this.speciality = (d.speciality || []).join(' · ');
    this.category = d.category;
    this.hasAdmission = !!d.nextAvailable && new Date(d.nextAvailable) > new Date();
    this.labels = [];

    const workStart = (d.experience || [])
      .map(e => e.start)
      .sort((y2, y1) => y1 - y2)
      .shift();

    if (workStart) {
      const workStage = new Date().getFullYear() - workStart;
      this.labels.push({
        color: '#26364b',
        bg: '#f2f6fb',
        text: `стаж ${ workStage } лет`
      });
    }

    const desc = d.description?.toLowerCase() || '';
    const specialLabels = ['кандидат медицинских наук', 'доктор медицинских наук'];
    for (const l of specialLabels) {
      if (desc.includes(l)) {
        this.labels.push({ color: '#de7ee3', text: l, bg: '#fbeefb' });
      }
    }
  }

  isMobile(): boolean {
    return innerWidth < mobileWidth;
  }

  labels: { color: string; text: string; bg: string }[] = [];
  speciality?: string;
  category?: string;
  name = '';

  hasAdmission = false;
  loadingAdmissions = true;
  days: Day[] = [];
  selectedDay?: Day;

  constructor(
    public readonly eventsService: EventsService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  private async loadNearestAdmissions(start: Date): Promise<void> {
    this.loadingAdmissions = true;
    this.cdr.markForCheck();

    this.days = [];
    try {
      for (let i = 0; i < 3; i++) {
        this.days.push({
          date: DateUtils.getDateWithOffset(new Date(start), { days: i }),
          options: []
        });
      }
    } catch (err) {
      console.error(err);
    }

    for (const d of this.days) {
      try {
        d.options = await ScheduleSdk.doctors.getDayTickets(this._d.id, d.date);
      } catch (ignore) {
      }
    }

    this.selectedDay = this.days.find(d => d.options.length);

    this.loadingAdmissions = false;
    this.cdr.markForCheck();
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
    return DateUtils.getDayLabel(d.date, true) + ', ' + DateUtils.toString(d.date, { hideYear: true });
  }

  getTimeDisplay(t: TimestampInterval) {
    return DateUtils.toStringTime(t.start, 3);
  }

  handleTimeClick(t: TimestampInterval) {
    this.eventsService.requestEvent({ doctorId: this._d.id, eventStart: new Date(t.start).getTime() })
  }

  @ViewChild('card') card!: ElementRef<HTMLDivElement>;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (this.hasAdmission) {
      this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        const el = entries[0];
        if (el.isIntersecting) {
          this.loadNearestAdmissions(this._d.nextAvailable as Date);
          this.observer?.unobserve(this.card.nativeElement);
          delete this.observer;
        }
      }, { threshold: [0] });
      this.observer.observe(this.card.nativeElement);
    }

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

  ngOnDestroy() {
    this.observer?.unobserve(this.card.nativeElement);
  }
}

const MAX_AVATAR_WIDTH_PART = .98;
