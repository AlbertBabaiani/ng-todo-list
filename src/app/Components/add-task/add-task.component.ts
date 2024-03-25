import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { LogicService } from 'src/app/Services/logic.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements AfterViewInit{
  private service: LogicService = inject(LogicService)

  search: string = ''

  @ViewChild('label') label!: ElementRef
  @ViewChild('input') input!: ElementRef

  addTodo(btn?: HTMLButtonElement): void{
    const trimed_searched: string = this.search.trim()

    if(btn){
      btn.blur()
      this.blur_for_phone()
    }

    if(trimed_searched){
      const respone =  this.service.addNewTodo(trimed_searched)

      if(respone){
        this.search = ''

        
      }
    }
  }
  
  labelAnimation(): void{
    
    if(this.label){
      if(this.search.length === 0){
        this.input.nativeElement.classList.remove('active-input')
        this.label.nativeElement.classList.remove('active-label')
      }
      else{
        this.input.nativeElement.classList.add('active-input')
        this.label.nativeElement.classList.add('active-label')
      }
    }
  }
  
  ngAfterViewInit(): void {
    this.input.nativeElement.focus()
  }

  blur_for_phone(): void{
    document.body.focus()
  }
}
