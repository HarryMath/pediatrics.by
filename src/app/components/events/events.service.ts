import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProgram } from '../../pages/landing/landing-page.component';

export interface EventRequest {
  doctorId?: number,
  eventStart?: number,
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  menuOpened = false;
  createEventSubject = new Subject<EventRequest>();
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

  requestEvent(request?: EventRequest): void {
    this.createEventSubject.next(request ?? {});
  }
}
