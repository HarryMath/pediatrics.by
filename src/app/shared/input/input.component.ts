import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { DateUtils } from 'src/app/shared/utils/date.utils';

export type InputType =
  'text' | 'email' | 'phone' | 'textarea' | 'time' | 'year' | // supported
  'select' | 'select-own'; // unsupported

@Component({
  selector: 'ng-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent<T> extends BaseInputComponent<T> implements AfterViewInit {

  @ViewChild('el') element!: ElementRef;

  @Input() id?: string;
  @Input() label!: string;
  @Input() height: string = 'fit-content';

  @Input() override error = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = true;
  @Input() validateOnInit: boolean = false;
  @Input() type: InputType = 'text';
  @Input() dataList: T|string[] = [];
  @Input() next?: string;

  @Input() set value(val: T) {
    this.valueObject.value = val;
    if (this.type === 'time') {
      this.valueObject.display = DateUtils.toStringTime(val as any);
    }
    else if (this.type === 'year') {
      this.valueObject.display = String(val);
      if (isNaN(parseInt(this.valueObject.display))) {
        this.valueObject.display = ''
      }
    }
    else if (typeof val === 'string') {
      this.valueObject.display = val;
    }
    else {
      console.warn('unknown input type for object: ', val);
    }
    // console.log('input display: ', this.valueObject.display);
    this.prevDisplay = this.valueObject.display;
    if (this.required || this.validateOnInit) {
      this.validate(this.valueObject.display);
    }
  }

  @Output() valueChange: EventEmitter<T|string> = new EventEmitter();
  @Output() blur: EventEmitter<unknown> = new EventEmitter();
  @Output() enter: EventEmitter<unknown> = new EventEmitter();

  ngAfterViewInit(): void {
    this.prevDisplay = this.valueObject.display;
  }

}
