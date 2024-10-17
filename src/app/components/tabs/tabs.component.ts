import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgCookieService } from '../../services/ng-cookie.service';



@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  
  constructor(private cookieService: NgCookieService){}

  isLoggedIn = signal<boolean>(!!this.cookieService.readCookie('SESSION'))

}
