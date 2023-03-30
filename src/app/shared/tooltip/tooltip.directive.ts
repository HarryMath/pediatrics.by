import { Directive, ElementRef, HostListener, Input } from '@angular/core';

export interface Tooltip {
  x: number,
  y: number,
  content: string;
}

@Directive({
  standalone: true,
  selector: '[tooltip]',
})
export class TooltipDirective {

  readonly state: Tooltip = {x: 0, y: 0, content: ''};
  private tooltipElement?: Element;
  isShown = false;

  constructor(private el: ElementRef) {}

  @Input() zIndex: number = 2;

  @Input() set tooltip(content: string) {
    this.state.content = content;
  }

  @HostListener('mouseenter')
  onMouseHover() {
    if (this.isShown) {
      return;
    }
    const pos = this.el.nativeElement.getBoundingClientRect();
    this.state.x = pos.x + pos.width * 0.5;
    this.state.y = pos.y + pos.height;
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'tooltip'; // @ts-ignore
    this.tooltipElement.style.cssText = `position:fixed;top:${this.state.y}px;left:${this.state.x}px;z-index:${this.zIndex}`
    this.tooltipElement.innerHTML = this.state.content;
    this.el.nativeElement.appendChild(this.tooltipElement);
    // document.body.appendChild(this.tooltipElement);
    this.isShown = true;
    requestAnimationFrame(() => { this.tooltipElement!.className = 'tooltip visible' });
  }

  @HostListener('mouseleave', ['$event'])
  hideTooltip($event: MouseEvent) {
    if (!this.tooltipElement) {
      return;
    }
    this.tooltipElement.className = 'tooltip';
    setTimeout(() => {
      this.tooltipElement?.remove();
      delete this.tooltipElement;
      this.isShown = false;
    }, 200);
  }
}
