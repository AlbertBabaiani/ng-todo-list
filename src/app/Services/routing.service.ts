import { Injectable, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Filters } from '../Models/Filter_types';

@Injectable({
  providedIn: 'root'
})
export class RoutingService implements OnDestroy{

  private router: Router = inject(Router)

  private activated_route: ActivatedRoute = inject(ActivatedRoute)
  private activated_route_subscription!: Subscription

  constructor() {
    this.activated_route_subscription = this.activated_route.queryParamMap.subscribe({
      next: (query: ParamMap) => {
        const route = this.router.url

        if(route.slice(0, 6) !== '/Error'){
          const response_names = this.check_all_queries(query)
          
          if(response_names){
            this.default_filter_type(query)
          }
          else{
            this.router.navigate(['Error'])
          }
        }
      }
    })
  }

  private check_all_queries(queryParams: ParamMap): boolean{
    return queryParams.keys.every((query: string) => {
      return query === 'Sort' || query === 'Filter' || query === '' || query === null || query === undefined;
    });
  }

  private check_filter_query(raw_query: ParamMap): boolean{
    const query: string | null | undefined = raw_query.get('Filter')

    if(query === 'All' || query === 'Completed' || query === 'Uncompleted' || query === undefined || query === null){
      return true
    }
    else return false
  }

  private default_filter_type(query: ParamMap): void{   

    const response = this.check_filter_query(query)

    if(response){
      const filter_temp = query.get('Filter')
      
      if(filter_temp === '' || filter_temp === undefined || filter_temp === null){
        this.router.navigate(['List'], {relativeTo: this.activated_route, queryParams: { Filter: 'All' }, queryParamsHandling: 'merge'})
      }
      else{
        this.router.navigate(['List'], {relativeTo: this.activated_route, queryParams: { Filter: filter_temp }, queryParamsHandling: 'merge'})
      }
    }
    else{
      this.router.navigate(['Error'])
    }
  }

  change_filter_type(filter: Filters): void{
    this.router.navigate(['List'], {relativeTo: this.activated_route, queryParams: { Filter: filter }, queryParamsHandling: 'merge'})
  }

  ngOnDestroy(): void {
    if(this.activated_route_subscription){
      this.activated_route_subscription.unsubscribe()
    }
  }
}
