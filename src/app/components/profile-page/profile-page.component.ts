import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NgCookieService } from '../../services/ng-cookie.service';

export interface IUser {
  userId: number;
  isAdmin: boolean;
}


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  username = signal('')
  isAdmin = signal(false)

  constructor(private userService: UserService, private cookieService: NgCookieService, private router: Router) {}

  ngOnInit(): void {
    const currentSession = this.cookieService.readCookie("SESSION")
    if(currentSession){
      const {userId} =jwtDecode(currentSession) as IUser
      this.loadUserProfile(userId.toString());
    }
    else{
      this.router.navigate(['/signup'])

    }
  }

  loadUserProfile(session:string): void {
    this.userService.getUserProfile(session).subscribe((data) => {
      this.username.set(data[0].username);
      this.isAdmin.set(data[0].is_admin);
    });
  }
  
  disconnect(){
    this.cookieService.deleteCookie("SESSION")
    window.location.href= "https://pokeknow-rncp.vercel.app/pokemon-list"


  }
}