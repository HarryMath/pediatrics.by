import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import { DomUtils, getName, mobileWidth } from 'src/app/shared/utils';
import { EventsService } from '../events/events.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  imports: [
    AvatarComponent,
    NgIf,
    NgTemplateOutlet,
    NgForOf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorComponent implements OnInit {

  @Input() d!: DoctorDto;
  isMobile: boolean;
  nextAvailable = "";

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
}

const MAX_AVATAR_WIDTH_PART = .98;
