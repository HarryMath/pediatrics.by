import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DoctorDto } from 'src/app/sdk/dto/Doctor';
import {IProgram} from "../app.component";

@Injectable({ providedIn: 'root' })
export class EventsService {
  menuOpened = false;
  createEventSubject = new Subject<DoctorDto | undefined>();
  phoneSubject = new Subject();
  menuSubject = new Subject<boolean>();
  programSubject = new Subject<IProgram>();

  menu(): void {
    this.menuOpened = !this.menuOpened;
    this.menuSubject.next(this.menuOpened);
  }

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
