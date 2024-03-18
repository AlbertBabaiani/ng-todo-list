import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../Models/ToDo';
import { SweetAlert2PopUpsService } from './sweet-alert2-pop-ups.service';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  constructor() { }

  private sweetAlert: SweetAlert2PopUpsService = inject(SweetAlert2PopUpsService)

  private _todos: Todo[] = [
    new Todo(0, 'a', false),
    new Todo(1, 'b', true),
    new Todo(2, 'c', false),
  ]

  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(this._todos)
  isEditing$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null)
  

  addNewTodo(new_todo: string): void{
    this._todos.push(new Todo(this._todos.length, new_todo, false))
    this.todos$.next(this._todos)
  }

  async deleteTask(todo_name: string, todo_index: number): Promise<void>{
    const response = await this.sweetAlert.deletion_message(false, todo_name);

    if(response){
      this._todos = this._todos.filter((todo: Todo) => todo.id !== todo_index)
      this.reArange()
      this.todos$.next(this._todos)
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
    this.todos$.next(this._todos)
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
      this.todos$.next(this._todos)
    }
  }

  async deleteAll(): Promise<void>{
    const response = await this.sweetAlert.deletion_message()

    if(response){
      this._todos = []
      this.todos$.next(this._todos)
    }
  }
}
