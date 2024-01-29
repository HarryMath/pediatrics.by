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

  readonly state: Tooltip = { x: 0, y: 0, content: '' };
  private tooltipElement?: HTMLDivElement;
  private hideTimeout?: number;

  constructor(private el: ElementRef) {}

  @Input() zIndex: number = 2;

  @Input() set tooltip(content: string) {
    this.state.content = content;
  }

  @HostListener('mouseenter')
  onMouseHover() {
    if (!this.state.content) {
      return;
    }
    const alreadyShown = !!this.tooltipElement;

    const pos = this.el.nativeElement.getBoundingClientRect();
    console.log('pos: ', pos);
    this.state.x = pos.x + pos.width * 0.5;
    this.state.y = innerHeight - pos.y;
    this.tooltipElement = this.tooltipElement ?? document.createElement('div');
    this.tooltipElement.className = 'tooltip';
    this.tooltipElement.style.cssText = `position:fixed;top:unset;bottom:calc(${ this.state.y }px + .5rem);left:${ this.state.x }px;z-index:${ this.zIndex }`;
    this.tooltipElement.innerHTML = this.state.content;

    if (!alreadyShown) {
      this.tooltipElement.addEventListener('mouseleave', e => this.hideTooltip(e as MouseEvent));
      document.body.appendChild(this.tooltipElement);
      // document.body.appendChild(this.tooltipElement);
      requestAnimationFrame(() => this.tooltipElement!.className = 'tooltip visible');
    }
    else {
      this.tooltipElement!.className = 'tooltip visible';
      !!this.hideTimeout && clearTimeout(this.hideTimeout);
    }
  }

  isRelatedElement(el: Element | null): boolean {
    return !!el && (
      el === this.tooltipElement
      || el?.parentElement === this.el?.nativeElement
      || el?.parentElement?.parentElement === this.el?.nativeElement
      || el?.parentElement?.parentElement?.parentElement === this.el?.nativeElement
    );
  }

  @HostListener('mouseleave', ['$event'])
  hideTooltip(event: MouseEvent) {
    if (
      !this.tooltipElement || this.isRelatedElement(event.relatedTarget as Element)
    ) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    this.tooltipElement.className = 'tooltip';
    // @ts-ignore
    this.hideTimeout = setTimeout(() => {
      this.tooltipElement?.remove();
      delete this.tooltipElement;
    }, 200);
  }
}
