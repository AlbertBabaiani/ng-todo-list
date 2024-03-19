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

  addTodo(): void{
    const trimed_searched: string = this.search.trim()

    if(trimed_searched){
      this.service.addNewTodo(trimed_searched)
      this.search = ''
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

  fun(): void{
    console.log('sdd')
  }
}
