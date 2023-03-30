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
  styleUrls: ['../input/input.component.css', 'search-input.component.css']
})
export class SearchInputComponent<T> extends BaseInputComponent<string> implements AfterViewInit {

  @ViewChild('el') element!: ElementRef;

  @Input() id?: string;
  @Input() label!: string;
  @Input() height: string = 'fit-content';

  @Input() override error = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = true;
  @Input() validateOnInit: boolean = false;
  @Input() type: SearchType = 'text';
  @Input() next?: string;
  @Input() dataList: SelectOption<T>[] = [];
  @Input() withPhotos = false;
  showDataList = false;
  width = 'fit-content';

  @Input() set value(val: string) {
    this.valueObject.display = val;
    this.prevDisplay = this.valueObject.display;
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

  select(o: SelectOption<T>): void {
    this.valueObject.display = o.toSelect || o.display;
    this.valueObject.value = o.toSelect || o.display;
    this.showDataList = this.error = false;
    this.onSelect.next(o.entity)
  }

  override handleChange(event: unknown, label = 'event'): void {
    super.handleChange(event, label);
    this.showOptions();
  }

  handleFocus(): void {
    if (this.valueObject.display?.length > 0) {
      return;
    }
    this.showOptions();
  }

  showOptions(): void {
    if (this.element) {
      this.width = this.element.nativeElement.getBoundingClientRect().width + 'px';
    }
    this.showDataList = true;
  }

  @HostListener('document:keydown.escape')
  hideOptions(): void {
    this.showDataList = false;
  }

  // @HostListener('document:keydown.arrowdown')
  // selectNext(): void {
  //   console.log("key down pressed");
  //   this.showDataList = true;
  // }
  //
  // @HostListener('document:keydown.arrowup')
  // selectPrev(): void {
  //   console.log("key up pressed");
  //   this.showDataList = false;
  // }
}
