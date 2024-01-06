import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BasePopupComponent } from '../../shared/base-popup.component';
import { EventsService } from '../events/events.service';
import { IProgram } from '../../pages/landing/landing-page.component';
import { IconDirective } from '../../shared/icon/icon.directive';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['../../shared/pop-up.css', './program.component.css'],
  imports: [
    IconDirective,
    NgClass,
    NgForOf,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramComponent extends BasePopupComponent {

  p?: IProgram;

  constructor(
    private readonly service: EventsService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
    service.programSubject.subscribe((p: IProgram) => {
      // console.log('open program: ', p);
      this.p = p;
      this.open();
    });
  }
}
