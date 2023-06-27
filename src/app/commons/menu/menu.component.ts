import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BasePopupComponent } from '../../shared/base-popup.component';
import { EventsService } from '../../components/events/events.service';

export const MENU = [
  {
    link: '#Услуги',
    name: 'Услуги'
  },
  {
    link: '#Программы',
    name: 'Программы'
  },
  {
    link: '#Специалисты',
    name: 'Специалисты'
  },
  {
    link: '/цены',
    name: 'Цены'
  },
  {
    link: '#Контакты',
    name: 'Контакты'
  }
];

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../../shared/pop-up.css', './menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent extends BasePopupComponent {

  menu = MENU;

  constructor(
    private readonly service: EventsService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
    service.menuSubject.subscribe(open => {
      if (open) {
        this.open();
      } else {
        this.close();
      }
    });
  }

}
