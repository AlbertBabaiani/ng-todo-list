import { Component, inject } from '@angular/core';
import { LogicService } from 'src/app/Services/logic.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  private service: LogicService = inject(LogicService)

  search: string = ''

  addTodo(): void{
    const trimed_searched: string = this.search.trim()

    if(trimed_searched){
      this.service.addNewTodo(trimed_searched)
      this.search = ''
    }
  }
  
}
