import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import { DomUtils } from 'src/app/shared/utils';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorComponent {

  @Input() d!: DoctorDto;

  constructor() { }

  getName(d: DoctorDto): string {
    return d.lastName + ' ' + d.firstName + ' ' + d.fatherName
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

const AVATAR_SIZE_REM = 20;
const MAX_AVATAR_WIDTH_PART = .8;
