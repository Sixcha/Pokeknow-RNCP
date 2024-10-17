import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {CookieService} from 'ngx-cookie-service';

interface IUser {
  userId: number;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NgCookieService {

  constructor(private cookieService: CookieService) { }

  setCookie(name:string, content:string){
    this.cookieService.set(name, content);
  }

  readCookie(name:string){
    return this.cookieService.get(name);
  }

  deleteCookie(name:string){
    this.cookieService.delete(name); 
  }

  readCookieDecodeId(name:string){
    const {userId, isAdmin} =jwtDecode(this.cookieService.get(name)) as IUser
    return userId
  }
}
