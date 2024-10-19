import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  updateAdminStatus(userId: string, isAdmin: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/admin-status`, { isAdmin });
  }

  // Delete a user by ID
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }
}