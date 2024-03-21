import { Component, OnInit, inject } from '@angular/core';
import { LogicService } from 'src/app/Services/logic.service';

@Component({
  selector: 'app-theme-changer',
  templateUrl: './theme-changer.component.html',
  styleUrls: ['./theme-changer.component.scss']
})
export class ThemeChangerComponent implements OnInit{
  private service: LogicService = inject(LogicService)
  dark_theme: boolean = false

  ngOnInit(): void {
    this.dark_theme = !this.service.get_theme
  }

  change_theme(){
    this.service.change_theme(this.dark_theme)
  }
}
