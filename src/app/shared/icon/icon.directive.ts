import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[icon]'
})
export class IconDirective {
  @Input() set icon(iconId: string) {
    this.el.nativeElement.innerHTML = `<use xlink:href="#${iconId}"></use>`
  }

  constructor(private el: ElementRef) {}
}
