import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get user profile data
  getUserProfile(session: string, id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${session}`
    })
    return this.http.get<any>(`${this.apiUrl}/user/profile/${id.toString()}`, { headers });
  }
}