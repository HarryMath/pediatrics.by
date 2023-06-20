import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { mobileWidth } from './shared/utils';
import { EventsService } from './components/events/events.service';
import { MENU_LIST } from './commons/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  menu = MENU_LIST;

  isMobile: boolean;

  constructor(
    readonly eventsService: EventsService,
    readonly cdr: ChangeDetectorRef
  ) {
    this.isMobile = innerWidth <= mobileWidth;
  }
}
