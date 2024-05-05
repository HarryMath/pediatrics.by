import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventsService } from 'src/app/components/events/events.service';
import { BasePopupComponent } from '../../../shared/base-popup.component';


@Component({
  selector: 'app-event-create',
  templateUrl: './iframe.component.html',
  styleUrls: ['../../../shared/pop-up.css', './iframe.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IframeComponent extends BasePopupComponent implements OnDestroy, OnInit {

  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  subscription!: Subscription;
  iframeUrl = '';
  header = '';

  constructor(
    private readonly eventCreateService: EventsService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    this.subscription = this.eventCreateService.createEventSubject.subscribe(d => {
      this.iframeUrl = d.url;
      this.header = d.header;
      this.open();
    });
  }

  ready = false;
  override afterOpen(): void {
    if (!this.ready) {
      this.ready = true;
      requestAnimationFrame(() => this.afterOpen());
      return;
    }
    window.addEventListener('message', msg => {
      const event = JSON.parse(msg.data);
      if (event.event === 'heightChange') {
        // console.log("emit height change: ", event.h);
        this.iframe.nativeElement.style.height = `${ Math.max(event.h, 100) }px`;
      } else if (event.event === 'close') {
        this.close();
      }
    });
    this.iframe.nativeElement.src = this.iframeUrl;
    setTimeout(() => {
      this.iframe.nativeElement.style.opacity = '1';
    }, 200);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
