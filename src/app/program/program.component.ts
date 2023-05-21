import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {BasePopupComponent} from "../shared/base-popup.component";
import {EventsService} from "../events/events.service";
import {IProgram} from "../app.component";

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['../shared/pop-up.css', './program.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramComponent extends BasePopupComponent implements OnInit {

  p?: IProgram;

  ngOnInit(): void {
    console.count('init app-component');
  }

  constructor(
    private readonly service: EventsService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
    service.programSubject.subscribe(p => {
      console.log('open program: ', p);
      this.p = p;
      this.open();
    })
  }

}
