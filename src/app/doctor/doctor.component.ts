import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import {DomUtils, getName, mobileWidth} from 'src/app/shared/utils';
import {EventsService} from "../events/events.service";

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorComponent {

  @Input() d!: DoctorDto;
  isMobile: boolean;

  constructor(public readonly eventsService: EventsService) {
    this.isMobile = innerWidth < mobileWidth;
  }

  getName(d: DoctorDto): string {
    return getName(d);
  }

  getAvatarSize(): number {
    const AVATAR_SIZE_REM = innerWidth < mobileWidth ? 25 : 8
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
    return description.split("\n").slice(0, linesAmount).map(l => {
      l = l.trim();
      if (l.startsWith('—') || l.startsWith('-')) {
        l = l.substring(1).trim();
      }
      return l;
    });
  }
}
const MAX_AVATAR_WIDTH_PART = .98;
