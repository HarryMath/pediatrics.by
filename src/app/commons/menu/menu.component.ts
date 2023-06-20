import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BasePopupComponent } from '../../shared/base-popup.component';
import { EventsService } from '../../components/events/events.service';

export const MENU_LIST = ['Услуги', 'Программы', 'Специалисты', /*'Наши преимущества',*/ 'Контакты'];

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../../shared/pop-up.css', './menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent extends BasePopupComponent {

  menu = MENU_LIST;

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
