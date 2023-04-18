import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import {IProgram} from "../app.component";

@Injectable({ providedIn: 'root' })
export class EventsService {
  createEventSubject = new Subject<DoctorDto | undefined>();
  phoneSubject = new Subject();
  programSubject = new Subject<IProgram>();

  call(): void {
    this.phoneSubject.next(0);
  }

  openDetails(p: IProgram): void {
    this.programSubject.next(p);
  }

  requestEvent(doctor?: DoctorDto): void {
    this.createEventSubject.next(doctor)
  }
}
