import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import { DomUtils, getName } from 'src/app/shared/utils';
import {EventsService} from "../events/events.service";

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorComponent {

  @Input() d!: DoctorDto;

  constructor(public readonly eventsService: EventsService) { }

  getName(d: DoctorDto): string {
    return getName(d);
  }

  getAvatarSize(): number {
    const initialSize = DomUtils.remToPX(AVATAR_SIZE_REM);
    const maxSize = innerWidth * MAX_AVATAR_WIDTH_PART;
    if (initialSize > maxSize) {
      return DomUtils.pxToRem(maxSize);
    }
    return AVATAR_SIZE_REM;
  }
}

const AVATAR_SIZE_REM = 17;
const MAX_AVATAR_WIDTH_PART = .8;
