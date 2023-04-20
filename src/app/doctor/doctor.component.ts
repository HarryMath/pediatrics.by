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
    const AVATAR_SIZE_REM = innerWidth < mobileWidth ? 17 : 8
    const initialSize = DomUtils.remToPX(AVATAR_SIZE_REM);
    const maxSize = innerWidth * MAX_AVATAR_WIDTH_PART;
    if (initialSize > maxSize) {
      return DomUtils.pxToRem(maxSize);
    }
    return AVATAR_SIZE_REM;
  }
}
const MAX_AVATAR_WIDTH_PART = .8;
