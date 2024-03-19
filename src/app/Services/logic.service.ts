import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Todo } from '../Models/ToDo';
import { SweetAlert2PopUpsService } from './sweet-alert2-pop-ups.service';
import { Filters } from '../Models/Filter_types';
import { RoutingService } from './routing.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogicService implements OnDestroy{
  private sweetAlert: SweetAlert2PopUpsService = inject(SweetAlert2PopUpsService)
  private routing: RoutingService = inject(RoutingService)
  private activated_route: ActivatedRoute = inject(ActivatedRoute)

  private activated_route_subscription!: Subscription;

  private filter_type: string | null | undefined = 'All'

  constructor() { 
    this.activated_route_subscription = this.activated_route.queryParamMap.subscribe({
      next: (query: ParamMap) => {
        this.filter_type = query.get('Filter')
        this.filter_todos(this.filter_type)
      }
    })
  }

  

  private _todos: Todo[] = [
    new Todo(0, 'a', false),
    new Todo(1, 'b', true),
    new Todo(2, 'c', false),
  ]

  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(this._todos)
  isEditing$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null)
  todos_quantity$: BehaviorSubject<[number, number, number]> = new BehaviorSubject<[number, number, number]>(this.calculate_todos_quantity())

  private calculate_todos_quantity(): [number, number, number]{
    const all = this._todos.length
    const completed = this._todos.filter((todo: Todo) => todo.checked).length
    const uncompleted = this._todos.filter((todo: Todo) => !todo.checked).length

    return [all, completed, uncompleted]
  }

  private todos_quantity(): void{
    this.todos_quantity$.next(this.calculate_todos_quantity())
  }
  
  change_filter_type(filter: Filters): void{
    this.routing.change_filter_type(filter)
  }

  private filter_todos(filter: string | null | undefined){
    let filtered_tasks: Todo[] = []

    if(filter === 'All' || filter === null || filter === undefined){
      filtered_tasks = this._todos
      this.todos$.next(filtered_tasks)
    }
    else if(filter === 'Completed'){
      filtered_tasks = this._todos.filter((todo: Todo) => todo.checked)
      this.todos$.next(filtered_tasks)
    }
    else{
      filtered_tasks = this._todos.filter((todo: Todo) => !todo.checked)
      this.todos$.next(filtered_tasks)
    }
  }



  addNewTodo(new_todo: string): void{
    this._todos.push(new Todo(this._todos.length, new_todo, false))

    this.todos_quantity()
    this.filter_todos(this.filter_type)
  }

  async deleteTask(todo_name: string, todo_index: number): Promise<void>{
    const response = await this.sweetAlert.deletion_message(false, todo_name);

    if(response){
      this._todos = this._todos.filter((todo: Todo) => todo.id !== todo_index)
      this.reArange()
      this.todos_quantity()
      this.filter_todos(this.filter_type)
    }
  }


  choose_todo_to_edit(index: number): void{
    this.isEditing$.next(index)
  }

  async edit_todo(new_task: string, index: number): Promise<boolean>{
    const response = await this.sweetAlert.inserting_add_confirmation(new_task.length)

    if(response){
      if(new_task.length){
        const todoToUpdate = this._todos.find(todo => todo.id === index);

        if (todoToUpdate) {
          todoToUpdate.task = new_task;
        }
      }
      else{
        this._todos = this._todos.filter((todo: Todo) => todo.id !== index);
        this.reArange();
        this.todos_quantity()
      }
      
      this.isEditing$.next(null)
      this.todos$.next(this._todos)
      return true
    }
    
    this.isEditing$.next(index)
    return false
  }

  check_uncheck(index: number): void{
    this._todos[index].checked = !this._todos[index].checked
    this.todos_quantity()
    this.filter_todos(this.filter_type)
  }

  private reArange(): void{
    this._todos.forEach((todo: Todo, index: number) => {
      todo.id = index
    })
  }

  async deleteChecked(): Promise<void>{
    const response = await this.sweetAlert.deletion_message(true)

    if(response){
      this._todos = this._todos.filter((todo: Todo) => !todo.checked)
      this.reArange()
      this.todos_quantity()
      this.filter_todos(this.filter_type)
    }
  }

  async deleteAll(): Promise<void>{
    const response = await this.sweetAlert.deletion_message()

    if(response){
      this._todos = []
      this.todos$.next(this._todos)
      this.todos_quantity()
    }
  }

  ngOnDestroy(): void {
    if(this.activated_route_subscription){
      this.activated_route_subscription.unsubscribe()
    }
  }
}
