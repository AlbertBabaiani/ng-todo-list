import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/Models/ToDo';
import { LogicService } from 'src/app/Services/logic.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, OnDestroy{
  private service: LogicService = inject(LogicService)

  private quantity_subscription!: Subscription
  tasks_quantity: number = 0

  completed_tasks: number = 0

  ngOnInit(): void {
    this.quantity_subscription = this.service.todos$.subscribe({
      next: (task_list: Todo[]) => {
        this.tasks_quantity = task_list.filter((todo: Todo) => !todo.checked).length

        this.completed_tasks = task_list.filter((todo: Todo) => todo.checked).length
      }
    })
  }

  deleteAllCompletedTasks(): void{
    this.service.deleteChecked()
  }
  
  ngOnDestroy(): void {
    this.quantity_subscription.unsubscribe()
  }
}
