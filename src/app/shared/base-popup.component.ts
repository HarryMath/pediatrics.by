import {ChangeDetectorRef} from "@angular/core";
import {mobileWidth} from "./utils";

let animationDuration = 200;

export abstract class BasePopupComponent {

  isVisible = false;
  isOpened = false;

  getPopUpClass(): string {
    console.log('class: ', this.isOpened ? '' : 'collapsed');
    return this.isOpened ? '' : 'collapsed';
  }

  protected constructor(protected cdr: ChangeDetectorRef) {}

  open(): void {
    animationDuration = innerWidth < mobileWidth ? 400 : 200
    this.isVisible = true;
    this.isOpened = false;
    this.cdr.markForCheck();
    requestAnimationFrame(() => {
      this.isOpened = true;
      this.cdr.markForCheck();
      this.afterOpen();
    });
  }

  close(): void {
    this.isOpened = false;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.isVisible = false;
      this.onClose()
      this.cdr.markForCheck();
    }, animationDuration);
  }

  onClose(): void {};

  afterOpen(): void {};
}
