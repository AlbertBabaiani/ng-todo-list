import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToDoFocus]'
})
export class ToDoFocusDirective implements AfterViewInit{

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) { }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus()

    this.elementRef.nativeElement.selectionStart =
    this.elementRef.nativeElement.selectionEnd =
    this.elementRef.nativeElement.value.length;
  }
}
