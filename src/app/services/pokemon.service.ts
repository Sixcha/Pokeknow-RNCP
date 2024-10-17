import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = environment.apiUrl;
  private outerApiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // All Pokemon
  getPokemons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pokemon/stats`);
  }

  // Single Pokemon
  getPokemon(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pokemon/stats/${id}`);
  }

  // Image
  getPokemonImage(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  // Moves
  getPokemonMoves(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pokemon/moves/${id}`);
  }

  // Abilities
  getPokemonAbilities(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pokemon/abilities/${id}`);
  }

  getPokemonListFromApi(): Observable<any> {
    return this.http.get<any>(`${this.outerApiUrl}/pokemon`);
  }

  // New method to get the image URL of a specific Pokémon
  getPokemonImageFromApi(pokemonName: string): Observable<any> {
    return this.http.get<any>(`${this.outerApiUrl}/pokemon/${pokemonName}`);
  }
}