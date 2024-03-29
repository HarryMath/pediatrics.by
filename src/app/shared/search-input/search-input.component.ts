import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

export type SearchType = 'text' | 'email' | 'phone';

export interface SelectOption<Entity extends any> {
  display: string,
  label?: string,
  toSelect?: string,
  photoUrl?: string,
  entity: Entity,
}

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['../input.css', '../input/input.component.css', 'search-input.component.css']
})
export class SearchInputComponent<T> extends BaseInputComponent<string> implements AfterViewInit {

  @ViewChild('el') element!: ElementRef;
  @ViewChild('datalist') datalist!: ElementRef;

  @Input() id?: string;
  @Input() label!: string;
  @Input() height: string = 'fit-content';

  @Input() override error = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = true;
  @Input() validateOnInit: boolean = false;
  @Input() type: SearchType = 'text';
  @Input() next?: string;

  _dataList: SelectOption<T>[] = [];
  @Input() set dataList(l: SelectOption<T>[]) {
    this._dataList = l;
    if (!l.some(row => row.display === this.valueObject.display)) {
      this.valueObject.display = '';
    }
  };

  @Input() withPhotos = false;
  @Input() canType = true;
  showDataList = false;
  width = 'fit-content';
  maxHeightStyle = '40rem';

  @Input() set value(val: string) {
    console.log('setting value: ' + this.label, val);
    this.valueObject.display = this.prevDisplay = val;
    if (this.required || this.validateOnInit) {
      this.validate(this.valueObject.display);
    }
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() onSelect: EventEmitter<T> = new EventEmitter();
  @Output() blur: EventEmitter<unknown> = new EventEmitter();
  @Output() enter: EventEmitter<unknown> = new EventEmitter();

  ngAfterViewInit(): void {
    this.prevDisplay = this.valueObject.display;
  }

  select(o: SelectOption<T>, e: any): void {
    // console.log('select called');
    this.valueObject.display = o.toSelect || o.display;
    this.valueObject.value = o.toSelect || o.display;
    this.showDataList = this.error = false;

    e?.preventDefault();
    e?.stopPropagation();
    this.onSelect.next(o.entity)
  }

  override handleChange(event: unknown, label = 'event'): void {
    super.handleChange(event, label);
    this.showOptions();
  }

  handleFocus(): void {
    // console.log('handle focus called');
    if (this.canType && this.valueObject.display?.length > 0) {
      return;
    }
    this.showOptions();
  }

  showOptions(): void {
    if (this.element) {
      const rect = this.element.nativeElement.getBoundingClientRect();
      this.width = rect.width + 'px';
      this.maxHeightStyle = `min(40rem, ${innerHeight - rect.bottom - 30}px)`;
    }
    this.showDataList = true;
  }

  @HostListener('document:keydown.escape')
  hideOptions(): void {
    console.log('hide options called')
    this.showDataList = false;
  }

  handleClick(e: any) {
    // console.log('click called');
    if (!this.canType) {
      e?.stopPropagation();
      e?.preventDefault();
      this.element?.nativeElement.blur();
    }
    this.handleFocus();
  }

  handleTouch(e: MouseEvent | TouchEvent) {
    if (!this.canType) {
      e?.preventDefault();
      // e?.stopPropagation();
    }
  }
}
