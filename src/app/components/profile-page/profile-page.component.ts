import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { NgCookieService } from '../../services/ng-cookie.service';

export interface IUser {
  userId: number;
  isAdmin: boolean;
  userName: string;
}


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',

})
export class ProfilePageComponent implements OnInit {
  username = signal('')
  isAdmin = signal(false)

  constructor(private userService: UserService, private cookieService: NgCookieService, private router: Router) {}

  ngOnInit(): void {
    const currentSession = this.cookieService.readCookie("SESSION")
    if(currentSession){
      const {userId} = jwtDecode(currentSession) as IUser
      this.loadUserProfile(currentSession,userId);
    }
    else{
      this.router.navigate(['/signup'])

    }
  }

  loadUserProfile(session:string, id:number): void {
    this.userService.getUserProfile(session, id).subscribe((data) => {
      this.username.set(data[0].username);
      this.isAdmin.set(data[0].is_admin);
    });
  }
  
  disconnect(){
    this.cookieService.deleteCookie("SESSION")
    window.location.href= "https://pokeknow-rncp.vercel.app"


  }
}