import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProgram } from '../../pages/landing/landing-page.component';
import { ScheduleSdk } from '../../sdk/schedule.sdk';

export interface EventRequest {
  doctorId?: number,
  eventStart?: number,
}

export interface IframeSubject {
  url: string,
  header: string,
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  menuOpened = false;
  createEventSubject = new Subject<IframeSubject>();
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

  openForm(header: string, id: number): void {
    const url = ScheduleSdk.getForm(id);
    this.createEventSubject.next({ header, url });
  }

  requestEvent(request?: EventRequest): void {
    const url = ScheduleSdk.getWidgetUrl(request?.doctorId, request?.eventStart);
    this.createEventSubject.next({ url, header: 'Запись на приём'});
  }
}
