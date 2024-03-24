import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/Models/ToDo';
import { LogicService } from 'src/app/Services/logic.service';
import { SweetAlert2PopUpsService } from 'src/app/Services/sweet-alert2-pop-ups.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, AfterViewChecked, OnDestroy{
  private service: LogicService = inject(LogicService)
  private sweetAlert: SweetAlert2PopUpsService = inject(SweetAlert2PopUpsService)


  @ViewChild('updateTodo', { static: false }) updateTodoInput!: ElementRef

  @Input() todo!: Todo

  isEditing: boolean = false
  editingText_length: number = 0
  private isEditing_subscription!: Subscription

  sameTextOrNot: boolean = true

  resized: boolean = false


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
    this.sameTextOrNot = true

    this.editingText_length = this.todo.task.length
    this.service.choose_todo_to_edit(this.todo.id)
  }

  async submit_editing(): Promise<void>{
    const response = await this.service.edit_todo(this.updateTodoInput.nativeElement.value.trim(), this.todo.id, new Date())

    if(response){ 
      this.isEditing = false
      this.sameTextOrNot = false
    }
  }

  submit_editing_ctrl_s(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    
    if (event.ctrlKey && event.key === 's' &&
        focusedElement.tagName === 'TEXTAREA' &&
        this.isEditing) {

          event.preventDefault();

          if(!this.sameTextOrNot){
            this.submit_editing();
          }
    }
  }

  cancel_editing(): void{
    this.isEditing = false
    this.sameTextOrNot = true
  }

  riseArea(area: HTMLTextAreaElement): void{
    this.editingText_length = area.value.trim().length

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

  copy_task_name(btn: HTMLButtonElement): void{
    navigator.clipboard.writeText(this.todo.task)
    .then(() => {
      this.sweetAlert.copy_message(this.todo.task)
    })
    .catch(err => {
      this.sweetAlert.copy_message(this.todo.task, true)
    });

    btn.blur()
  }

  deleteTask(btn: HTMLButtonElement): void{
    this.service.deleteTask(this.todo.task, this.todo.id)
    this.isEditing_subscription.unsubscribe()

    btn.blur()
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      // this.updateTodoInput.nativeElement.focus();

      if(this.updateTodoInput){
        const inputElement = this.updateTodoInput.nativeElement;
        inputElement.focus();
        inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;

        this.updateTodoInput.nativeElement.style.height = '';
        this.updateTodoInput.nativeElement.style.height = (this.updateTodoInput.nativeElement.scrollHeight + 2) + 'px';
      }
    }
  }
  
  ngOnDestroy(): void {
    if(this.isEditing_subscription){
      this.isEditing_subscription.unsubscribe()
    }
  }
}
