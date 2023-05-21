import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {BasePopupComponent} from "../shared/base-popup.component";
import {EventsService} from "../events/events.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../shared/pop-up.css', './menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent extends BasePopupComponent {

  menu = ['Услуги', 'Программы', 'Специалисты', /*'Наши преимущества',*/ 'Контакты'];
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
    })
  }

}
