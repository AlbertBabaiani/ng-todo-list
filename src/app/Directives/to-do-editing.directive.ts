import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToDoEditing]'
})
export class ToDoEditingDirective implements OnChanges{
  @Input('appToDoEditing')
  isEditing: boolean = false

  constructor(private elemenRef: ElementRef, private renderer2: Renderer2) { }

  ngOnChanges(): void {
    if(this.isEditing){
      this.renderer2.addClass(this.elemenRef.nativeElement, 'selected')
    }
    else{
      this.renderer2.removeClass(this.elemenRef.nativeElement, 'selected')
    }
  }
}
