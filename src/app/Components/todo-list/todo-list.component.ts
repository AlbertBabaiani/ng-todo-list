import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/Models/ToDo';
import { LogicService } from 'src/app/Services/logic.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})

export class TodoListComponent implements OnInit, OnDestroy{
  private service: LogicService = inject(LogicService)

  todos!: Todo[]
  private todos_subscription!: Subscription

  todos_quantity: number = 0

  ngOnInit(): void {
    this.todos_subscription = this.service.todos$.subscribe({
      next: (todos: Todo[]) => {
        this.todos = todos
        this.todos_quantity = todos.length
      }
    })
  }

  deleteAll(btn: HTMLButtonElement): void{
    this.service.deleteAll()
    btn.blur()
  }

  ngOnDestroy(): void {
    this.todos_subscription.unsubscribe()
  }
}
