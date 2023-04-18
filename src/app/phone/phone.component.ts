import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {BasePopupComponent} from "../shared/base-popup.component";
import {EventsService} from "../events/events.service";

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['../shared/pop-up.css', './phone.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneComponent extends BasePopupComponent {
  constructor(
    private readonly service: EventsService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
    service.phoneSubject.subscribe(() => {
      this.open();
    })
  }

}
