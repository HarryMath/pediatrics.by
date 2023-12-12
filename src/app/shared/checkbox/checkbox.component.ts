import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'ng-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass
  ],
  standalone: true
})
export class CheckboxComponent {
  @Input() size = 1.5;
  @Input() condition = false;
}
