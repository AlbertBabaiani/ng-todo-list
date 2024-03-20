import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlert2PopUpsService {

  constructor() { }

  deletion_message(completed?: boolean, task_name?: string): Promise<boolean>{
    return new  Promise<boolean>(
      (resolve) => {
        Swal.fire({
          title: "Are you sure?",
          text: task_name ? `Task: '${task_name}' will be deleted` : `All ${completed ? 'completed ' : ''}todos will be removed`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#2f74c0",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              // text: "Your file has been deleted.",
              icon: "success"
            });
            resolve(true)
          }
          else{
            resolve(false)
          }
        });
      }
    )
  }

  inserting_add_confirmation(deletion: number): Promise<boolean>{
    return new  Promise<boolean>(
      (resolve) => {
        Swal.fire({
          title:  !deletion ? "Delete Todo?" : "Save changes?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#2f74c0",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Saved!",
              icon: "success"
            });
            resolve(true)
          }
          else{
            resolve(false)
          }
        });
      }
    )
  }

  adding_new_message(): void{
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "This task already exists in the list!",
    });
  }

  copy_message(task_name: string): void
  copy_message(task_name: string, error: true): void
  copy_message(task_name: string, error?: true): void{
    if(error){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
    else{
      Swal.fire(`'${task_name}' copied.`);
    }
  }
}
