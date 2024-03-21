import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';


import { MainComponent } from './Pages/main/main.component';
import { HeaderComponent } from './Components/header/header.component';

import { AddTaskComponent } from './Components/add-task/add-task.component';
import { ErrorPageComponent } from './Pages/error-page/error-page.component';
import { TodoListComponent } from './Components/todo-list/todo-list.component';
import { TodoComponent } from './Components/todo-list/todo/todo.component';
import { ToDoEditingDirective } from './Directives/to-do-editing.directive';
import { DataChangerComponent } from './Components/data-changer/data-changer.component';
import { ArrowsComponent } from './Components/arrows/arrows.component';
import { ThemeChangerComponent } from './Components/theme-changer/theme-changer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,

    AddTaskComponent,

    ErrorPageComponent,
     TodoListComponent,
     TodoComponent,
     ToDoEditingDirective,
     DataChangerComponent,
     ArrowsComponent,
     ThemeChangerComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
