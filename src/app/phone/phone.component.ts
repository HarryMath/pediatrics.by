import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {BasePopupComponent} from "../shared/base-popup.component";

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['../shared/pop-up.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneComponent extends BasePopupComponent {
  onClose(): void {}

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

}
