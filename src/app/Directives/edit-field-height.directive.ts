import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appEditFieldHeight]'
})
export class EditFieldHeightDirective {
  @Input('appEditFieldHeight') isEditing!: boolean;

  startY!: number;
  startHeight!: number;
  resizing: boolean = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent) {
    if (!this.isEditing || !this.isResizeElement(event)) return;
    event.preventDefault()
    this.resizing = true;
    this.startY = this.getClientY(event);
    this.startHeight = this.elementRef.nativeElement.offsetHeight;
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.isEditing || !this.resizing) return;
    event.preventDefault()
    const deltaY = this.getClientY(event) - this.startY;
    this.elementRef.nativeElement.style.height = this.startHeight + deltaY + 'px';
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onMouseUp() {
    if (!this.isEditing) return;
    this.resizing = false;
  }

  getClientY(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientY;
    } else if (event instanceof TouchEvent) {
      return event.touches[0].clientY;
    }
    return 0;
  }

  isResizeElement(event: MouseEvent | TouchEvent): boolean {
    const target = event.target as HTMLElement;
    return target.classList.contains('resize-element');
  }
}
