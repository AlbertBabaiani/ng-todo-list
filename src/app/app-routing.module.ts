import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { ErrorPageComponent } from './Pages/error-page/error-page.component';

const routes: Routes = [
  {path: '', redirectTo: 'List', pathMatch: 'full'},
  {path: 'List', component: MainComponent},
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
