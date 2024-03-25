import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appEditFieldHeight]'
})
export class EditFieldHeightDirective {
  @Input('appEditFieldHeight') isEditing!: boolean

  startY!: number;
  startHeight!: number;
  resizing: boolean = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.isEditing) return;
    this.resizing = true;
    this.startY = event.clientY;
    this.startHeight = this.elementRef.nativeElement.offsetHeight;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isEditing) return;
    if (!this.resizing) return;
    const deltaY = event.clientY - this.startY;
    this.elementRef.nativeElement.style.height = this.startHeight + deltaY + 'px';
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (!this.isEditing) return;
    this.resizing = false;
  }
}
