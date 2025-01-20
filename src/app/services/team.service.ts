import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTeam(session: string, currentUserID: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${session}`
    })
    return this.http.get<any[]>(`${this.apiUrl}/user/team/${currentUserID}`, { headers });
  }

  addToTeam(currentUser: number, pokemonId: string) {
    this.http.post<any>(`${this.apiUrl}/user/team/${currentUser}`, { pokemonId }).subscribe(data => {
      console.log(data)
    });
  }

  removeFromTeam(currentUser: number, pokemonId: string): Observable<any> {
    console.log('service', currentUser, pokemonId)
    return this.http.delete<any>(`${this.apiUrl}/${currentUser}/team/remove/${pokemonId}`);
  }

}