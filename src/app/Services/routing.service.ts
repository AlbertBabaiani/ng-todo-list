import { Injectable, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Filters } from '../Models/Filter_types';

type FilterQueryResponse = Filters | null | false

@Injectable({
  providedIn: 'root'
})
export class RoutingService implements OnDestroy{

  private router: Router = inject(Router)
  private router_navigation_subscription!: Subscription

  private activated_route: ActivatedRoute = inject(ActivatedRoute)
  private activated_route_subscription!: Subscription

  

  constructor() {
    this.router_navigation_subscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      let url = event.url.slice(0,5)

      if (url === '/List' || url === '/') {       
        this.observing_queries()
      }
    });
  }

  private observing_queries(): void{
    this.activated_route_subscription = this.activated_route.queryParamMap.subscribe({
      next: (query: ParamMap) => {

        const query_names_check = this.check_all_queries(query)


        if(query_names_check){
 
          const query_filter_check: FilterQueryResponse = this.check_filter_query(query)
          
          if(query_filter_check === 'All' || query_filter_check === 'Completed' || query_filter_check === 'Uncompleted'){

            this.router.navigate(['./'], {
              relativeTo: this.activated_route,
              queryParams: { Filter: query_filter_check },
              queryParamsHandling: 'merge'
            });
          }

          else if(query_filter_check === null){
            this.router.navigate(['./'], {
              relativeTo: this.activated_route,
              queryParams: { Filter: 'All' },
              queryParamsHandling: 'merge'
            });
          }

          else{
  
            this.router.navigate(['Error']);
          }

        }
        else{
          this.router.navigate(['Error']);
        }
      }
    })
  }

  private check_all_queries(queryParams: ParamMap): boolean{
    return queryParams.keys.every((query: string) => {
      return query === 'Filter' || query === '' || query === null || query === undefined;
    });
  }

  private check_filter_query(raw_query: ParamMap): FilterQueryResponse {
    const query: string | null | undefined = raw_query.get('Filter')

    if(query === 'All' || query === 'Completed' || query === 'Uncompleted'){
      return query
    }
    else if(query === null || query === undefined){
      return null
    }
    else{
      return false
    }
  }


  change_filter_type(filter: Filters): void{
    this.router.navigate(['List'], {relativeTo: this.activated_route, queryParams: { Filter: filter }, queryParamsHandling: 'merge'})
  }

  ngOnDestroy(): void {
    if(this.activated_route_subscription){
      this.activated_route_subscription.unsubscribe()
    }

    if(this.router_navigation_subscription){
      this.router_navigation_subscription.unsubscribe()
    }
  }
}
