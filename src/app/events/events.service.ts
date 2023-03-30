import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DoctorDto, DoctorMin } from 'src/app/sdk/dto/Doctor';

@Injectable({ providedIn: 'root' })
export class EventsService {
  subject = new Subject<DoctorMin | undefined>();

  requestEvent(doctor?: DoctorMin): void {
    this.subject.next(doctor)
  }
}
