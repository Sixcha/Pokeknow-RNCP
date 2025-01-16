import { Component, OnInit } from '@angular/core';
import { NgCookieService } from '../services/ng-cookie.service';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../components/profile-page/profile-page.component';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  users: any[] = []

  constructor(private cookieservice: NgCookieService, private adminService: AdminService){}

  ngOnInit(): void {
    const {isAdmin} = jwtDecode(this.cookieservice.readCookie("SESSION")) as IUser
    if(!isAdmin){
      window.location.href= "http://localhost:4200/pokemon-list"
    }
    else{
      this.loadAdmin()
    }
  }

  loadAdmin(){
    this.adminService.getUsers().subscribe(
      (data) => {
        this.users = data;
      }
    );
  }

  deleteUser(userId: string): void {
    this.adminService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter(user => user.id !== userId);
      }
    );
  }

  toggleAdminStatus(user: any): void {
    const newStatus = !user.is_admin;

    this.adminService.updateAdminStatus(user.id, newStatus).subscribe(
      (response) => {
        user.is_admin = newStatus;
      }
    );
  }
}
