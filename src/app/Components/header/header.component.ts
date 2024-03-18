import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly author: string = 'Albert Babayan'
  readonly git_Hub_Link: string = 'https://github.com/AlbertBabaiani'
}
