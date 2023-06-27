import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
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

  private isHeaderVisible = false;
  private touchedFooter = false;

  @HostListener('window:scroll')
  handleScroll(): void {
    const isHeaderVisible = window.scrollY > 230;
    if (isHeaderVisible !== this.isHeaderVisible) {
      this.isHeaderVisible = isHeaderVisible;
      document.getElementById('header')!.classList?.[isHeaderVisible ? 'add' : 'remove']('visible');
    }

    const footer = document.querySelector('footer')!;
    const rect = footer.getBoundingClientRect();

    const touchedFooter = rect.bottom < innerHeight * 1.2 + 45;
    if (this.touchedFooter !== touchedFooter) {
      this.touchedFooter = touchedFooter;
      document.getElementById('Контакты')!.classList?.[touchedFooter ? 'add' : 'remove']('end');
      document.getElementById('header')!.classList?.[touchedFooter ? 'add' : 'remove']('end');
      if (touchedFooter) {
        window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight })
      }
    }
  }
}
