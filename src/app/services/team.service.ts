import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTeam(currentUser: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/team/${currentUser}`);
  }

  addToTeam(currentUser: number, pokemonId: string) {
    this.http.post<any>(`${this.apiUrl}/user/team/${currentUser}`, { pokemonId }).subscribe(data => {
      console.log(data)
    });
  }

  removeFromTeam(currentUser: number, pokemonId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${currentUser}/team/remove/${pokemonId}`);
  }

}