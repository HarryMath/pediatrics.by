import { ElementRef, EventEmitter } from '@angular/core';
import { InputType } from 'src/app/shared/input/input.component';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { phoneTransformer } from 'src/app/shared/utils/phone.transformer';

export abstract class BaseInputComponent<T> {

  public readonly valueObject: {value?: T, display: string} = {
    value: undefined,
    display: ''
  };

  abstract element: ElementRef;

  error: boolean = false;
  abstract type: InputType;
  abstract required: boolean;
  abstract validateOnInit: boolean;
  abstract next?: string;
  abstract id?: string;

  abstract valueChange: EventEmitter<T|string>;
  abstract blur: EventEmitter<unknown>;
  abstract enter: EventEmitter<unknown>;

  handleEnter(event: any): void {
    this.enter.emit();
    if (this.next?.length) {
      event.preventDefault();
      document.getElementById(this.next)?.focus();
    }
    this.element?.nativeElement?.blur();
  }

  handleBlur(): void {
    if (!this.validateOnInit) {
      this.validate(this.valueObject.display);
    }
    this.blur.emit();
  }

  protected prevDisplay = '';

  protected validate(value: string): void {
    // console.log('validate: ' + value);

    if (this.type === 'time') {

      if (value.length > this.prevDisplay.length) {
        const lastChar = value.charAt(value.length - 1);
        if (!/^\d+$/.test(lastChar) && lastChar !== ':') {
          value = this.prevDisplay;
          // console.log('removing last char');
        }
      }
      if (value.length > 5) {
        // console.log('cutting to 5');
        value = this.prevDisplay;
      }
      if (value.length === 2 && this.prevDisplay.length < 2) {
        console.log('adding ":"');
        value += ':'
      }
      if (value.endsWith(':') && value.replace(':', '').includes(':')) {
        value = this.prevDisplay;
      }
      this.valueObject.display = value;
      this.error = !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);

      if (!this.error) {
        this.valueObject.value = DateUtils.getTimeFromString(this.valueObject.display) as any;
      }
    }

    else if (this.type === 'email') {
      this.valueObject.value
      this.valueObject.display = value
      if (!value.includes('@')) {
        this.error = true;
      } else {
        const parts = value.split('@');
        this.error = parts.length !== 2 || parts[0].length < 2 ||
          !parts[1].includes('.') || parts[1].length < 3
      }
      this.valueObject.value = value as any;
    }

    else if (this.type === 'phone') {
      value = phoneTransformer.normalize(value);
      this.valueObject.display = phoneTransformer.toBelarusFormat(value);
      this.error = !value || value.length !== 9 || !/^\d+$/.test(value);
      this.valueObject.value = value as any;
    }

    else if (this.type === 'year') {
      if (!/^\d+$/.test(value) || value.length > 4) {
        value = this.prevDisplay;
      }
      this.error = !/^\d+$/.test(value) && value.length !== 4;
      if (!this.error) {
        this.valueObject.value = parseInt(value) as any;
      }
    }

    else {
      this.valueObject.display = value
      this.error = this.required && (!value || value.length < 2)
      this.valueObject.value = value as any;
    }

    this.prevDisplay = this.valueObject.display;
  }

  handleChange(event: unknown, label = 'event'): void {
    console.log('handleChange [' + label + ']: ' + (event as any)?.target?.value || event);
    if (typeof event === 'string') {
      this.validate(event);
    } else {
      this.validate((event as any).target.value);
      (event as any).target.value = this.valueObject.display;
    }
    if (this.type !== 'time' || !this.error) {
      this.valueChange.emit(this.valueObject.value);
    }
  }
}
