import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Filters } from 'src/app/Models/Filter_types';
import { Todo } from 'src/app/Models/ToDo';
import { LogicService } from 'src/app/Services/logic.service';
import { RoutingService } from 'src/app/Services/routing.service';

@Component({
  selector: 'app-data-changer',
  templateUrl: './data-changer.component.html',
  styleUrls: ['./data-changer.component.scss']
})
export class DataChangerComponent implements OnInit, OnDestroy {
  private service: LogicService = inject(LogicService)
  private activated_route: ActivatedRoute = inject(ActivatedRoute)

  filter_type: Filters = 'All';
  private active_filter_type_subscription!: Subscription;

  all_todos_quantity: number = 0
  completed_todos_quantity: number = 0
  uncompleted_todos_quantity: number = 0
  private todos_quantity_subscription!: Subscription

  show_delete_completed_button: boolean = false

  ngOnInit(): void {
    this.service.todos_quantity$.subscribe({
      next: (quantities: [number, number, number]) => {
        this.all_todos_quantity = quantities[0]
        this.completed_todos_quantity = quantities[1]
        this.uncompleted_todos_quantity = quantities[2]
      }
    })

    this.active_filter_type_subscription = this.activated_route.queryParamMap.subscribe({
      next: (active_filter: ParamMap) => {
        this.filter_type = active_filter.get('Filter') as Filters;

        if((active_filter.get('Filter') === 'All' || active_filter.get('Filter') === 'Completed')){
          this.show_delete_completed_button = true
        }
        else{
          this.show_delete_completed_button = false
        }
      }
    });
  }

  change_filter_type(): void {
    this.service.change_filter_type(this.filter_type)
  }

  deleteAllCompletedTasks(btn: HTMLButtonElement): void{
    if(this.completed_todos_quantity){
      this.service.deleteChecked()
    }
    
    btn.blur()
  }

  ngOnDestroy(): void {
    if (this.active_filter_type_subscription) {
      this.active_filter_type_subscription.unsubscribe();
    }

    if(this.todos_quantity_subscription){
      this.todos_quantity_subscription.unsubscribe()
    }
  }
}
