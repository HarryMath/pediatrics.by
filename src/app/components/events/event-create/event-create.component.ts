import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventsService } from 'src/app/components/events/events.service';
import { ScheduleSdk } from 'src/app/sdk/schedule.sdk';
import { BasePopupComponent } from '../../../shared/base-popup.component';


@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['../../../shared/pop-up.css', './event-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCreateComponent extends BasePopupComponent implements OnDestroy, OnInit {

  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  subscription!: Subscription;
  iframeUrl = '';

  constructor(
    private readonly eventCreateService: EventsService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    console.count('init event-create-component');
    this.subscription = this.eventCreateService.createEventSubject.subscribe(d => {
      this.iframeUrl = ScheduleSdk.getWidgetUrl(d?.id);
      this.open();
    });
  }

  override afterOpen(): void {
    window.addEventListener('message', msg => {
      const event = JSON.parse(msg.data);
      if (event.event === 'heightChange') {
        this.iframe.nativeElement.style.height = `${ Math.max(event.h, 100) }px`;
      } else if (event.event === 'close') {
        this.close();
      }
    });
    this.iframe.nativeElement.src = this.iframeUrl;
    setTimeout(() => {
      this.iframe.nativeElement.style.cssText = '';
    }, 300);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
