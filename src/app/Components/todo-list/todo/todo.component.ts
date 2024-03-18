import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/Models/ToDo';
import { LogicService } from 'src/app/Services/logic.service';
import { SweetAlert2PopUpsService } from 'src/app/Services/sweet-alert2-pop-ups.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, AfterViewChecked{
  private service: LogicService = inject(LogicService)
  private sweetAlert: SweetAlert2PopUpsService = inject(SweetAlert2PopUpsService)

  isEditing: boolean = false
  private isEditing_subscription!: Subscription

  sameTextOrNot: boolean = true

  resized: boolean = false

  @ViewChild('updateTodo', { static: false }) updateTodoInput!: ElementRef

  @Input() todo!: Todo


  ngOnInit(): void {
    this.isEditing_subscription = this.service.isEditing$.subscribe({
      next: (index: number | null) =>{
        if(index !== null){
          if(index !== this.todo.id){
            this.isEditing = false
          }
        }
      }
    })
  }

  check_uncheck(): void{
    this.service.check_uncheck(this.todo.id)
  }


  textTransform(label: HTMLLabelElement): void{
    label.classList.toggle('expanded')
  }


  edit(): void{
    this.isEditing = true
    this.service.choose_todo_to_edit(this.todo.id)
  }

  async submit_editing(): Promise<void>{
    const response = await this.service.edit_todo(this.updateTodoInput.nativeElement.value.trim(), this.todo.id)

    if(response){ 
      this.isEditing = false
      this.sameTextOrNot = false
    }
  }

  cancel_editing(): void{
    this.isEditing = false
    this.sameTextOrNot = false
  }

  riseArea(area: HTMLTextAreaElement): void{
    if(area.value.trim() !== this.todo.task){
      this.sameTextOrNot = false
    }
    else{
      this.sameTextOrNot = true
    }

    if(!this.resized){
      area.style.height = '';
      area.style.height = (area.scrollHeight + 2) + 'px';
    }
  }

  copy_task_name(): void{
    navigator.clipboard.writeText(this.todo.task)
    .then(() => {
      this.sweetAlert.copy_message(this.todo.task)
    })
    .catch(err => {
      this.sweetAlert.copy_message(this.todo.task, true)
    });
  }

  deleteTask(): void{
    this.service.deleteTask(this.todo.task, this.todo.id)
    this.isEditing_subscription.unsubscribe()
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      this.updateTodoInput.nativeElement.focus();
    }
  }
}
