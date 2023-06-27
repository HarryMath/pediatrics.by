import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { EventsService } from '../../components/events/events.service';
import { mobileWidth } from '../../shared/utils';
import { NgForOf, NgIf } from '@angular/common';
import { IconDirective } from '../../shared/icon/icon.directive';
import { MENU } from '../menu/menu.component';

@Component({
  standalone: true,
  imports: [
    NgForOf,
    IconDirective,
    NgIf
  ],
  selector: 'app-header',
  templateUrl: 'header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() hide: boolean = false;

  menu = MENU;

  isMobile: boolean;

  constructor(
    readonly eventsService: EventsService,
    readonly cdr: ChangeDetectorRef
  ) {
    this.isMobile = innerWidth <= mobileWidth;
  }
}
