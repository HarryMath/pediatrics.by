import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';

@Injectable({ providedIn: 'root' })
export class EventsService {
  subject = new Subject<DoctorDto | undefined>();

  requestEvent(doctor?: DoctorDto): void {
    this.subject.next(doctor)
  }
}
