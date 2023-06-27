import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { mobileWidth } from './shared/utils';
import { EventsService } from './components/events/events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  isMobile: boolean;

  constructor(
    readonly eventsService: EventsService,
    readonly cdr: ChangeDetectorRef
  ) {
    this.isMobile = innerWidth <= mobileWidth;
  }
}
