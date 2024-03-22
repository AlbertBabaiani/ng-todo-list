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

  private local_storage_key: string = 'ng-user-list'

  private activated_route_subscription!: Subscription;

  private filter_type: string | null | undefined = 'All'

  private dark_theme: boolean = false
  private dark_theme_key: string = 'ng-user-list-theme'

  constructor() {
    this.load_local_storage()
    this.load_theme()

    this.activated_route_subscription = this.activated_route.queryParamMap.subscribe({
      next: (query: ParamMap) => {
        this.filter_type = query.get('Filter')
        this.filter_todos(this.filter_type)
      }
    })
  }

  

  private _todos: Todo[] = [
  ]

  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(this._todos)
  isEditing$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null)
  todos_quantity$: BehaviorSubject<[number, number, number]> = new BehaviorSubject<[number, number, number]>(this.calculate_todos_quantity())

  private load_local_storage(): void{
    const local_storage = localStorage.getItem(this.local_storage_key)

    if(local_storage){
      this._todos = JSON.parse(local_storage)
    }
    else{
      this._todos = []
    }

    this.todos_quantity()
  }

  private save_to_local_storage(): void{
    localStorage.setItem(this.local_storage_key, JSON.stringify(this._todos))
  }

  private load_theme(): void{
    const local_storage = localStorage.getItem(this.dark_theme_key)
    console.log(local_storage)

    if(local_storage === null || local_storage === undefined){
      this.dark_theme = false
    }
    else{
      this.dark_theme = Boolean(JSON.parse(local_storage))
    }

    this.change_theme(this.dark_theme)
  }

  get get_theme(): boolean{
    return this.dark_theme
  }

  change_theme(dark_theme: boolean): void{
    this.dark_theme = dark_theme
    const metaTag = document.querySelector('meta[name="theme-color"]');

    if(this.dark_theme){
      document.body.removeAttribute('data-bs-theme')

      if (metaTag) {
        metaTag.setAttribute('content', '#2f74c0')
      }
    }
    else{
      document.body.setAttribute('data-bs-theme', 'dark')

      if (metaTag) {
        metaTag.setAttribute('content', '#222222')
      }
    }
    localStorage.setItem(this.dark_theme_key, JSON.stringify(this.dark_theme))
  }

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

  private check_task_name(task_name: string): boolean{
    if(this._todos.find((todo: Todo) => todo.task === task_name) === undefined){
      return true
    }
    else{
      return false
    }
  }

  addNewTodo(new_todo: string): boolean{
    const response = this.check_task_name(new_todo)

    if(response){
      this._todos.push(new Todo(this._todos.length, new_todo, false, new Date()))
      
      this.todos_quantity()
      this.filter_todos(this.filter_type)
      this.save_to_local_storage()

      return true
    }
    else{
      this.sweetAlert.adding_new_message()
      return false
    }
  }

  async deleteTask(todo_name: string, todo_index: number): Promise<void>{
    const response = await this.sweetAlert.deletion_message(false, todo_name);

    if(response){
      this._todos = this._todos.filter((todo: Todo) => todo.id !== todo_index)
      this.reArange()
      this.todos_quantity()
      this.filter_todos(this.filter_type)
      this.save_to_local_storage()
    }
  }

  choose_todo_to_edit(index: number): void{
    this.isEditing$.next(index)
  }

  async edit_todo(new_task: string, index: number, new_date: Date): Promise<boolean>{
    const response = await this.sweetAlert.inserting_add_confirmation(new_task.length)

    if(response){
      if(new_task.length){
        this._todos = this._todos.map((todo: Todo) => {
          if(todo.id === index){
            todo.task = new_task
            todo.date = new_date
          }
          return todo
        });

      }
      else{
        this._todos = this._todos.filter((todo: Todo) => todo.id !== index);
        this.reArange();
        this.todos_quantity()
      }
      
      this.isEditing$.next(null)
      this.todos$.next(this._todos)
      this.save_to_local_storage()
      return true
    }
    
    this.isEditing$.next(index)
    return false
  }

  check_uncheck(index: number): void{
    this._todos[index].checked = !this._todos[index].checked
    this.todos_quantity()
    this.filter_todos(this.filter_type)
    this.save_to_local_storage()
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
      this.save_to_local_storage()
    }
  }

  async deleteAll(): Promise<void>{
    const response = await this.sweetAlert.deletion_message()

    if(response){
      this._todos = []
      this.todos$.next(this._todos)
      this.todos_quantity()
      this.save_to_local_storage()
    }
  }

  ngOnDestroy(): void {
    if(this.activated_route_subscription){
      this.activated_route_subscription.unsubscribe()
    }
  }
}
