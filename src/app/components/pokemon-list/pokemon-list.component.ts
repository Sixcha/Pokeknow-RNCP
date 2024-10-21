import { Component, HostBinding, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    PokemonCardComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'

})
export class PokemonListComponent implements OnInit {
  @HostBinding('class.flex-list') _class = true;
  pokemons: any[] = [];
  pokemonImages: { [key: string]: string } = {};

  constructor(private pokemonService: PokemonService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getPokemons();

  }

  getPokemons(): void {
    this.pokemonService.getPokemons().subscribe((data) => {
      this.pokemons = data;
      this.getPokemonImages();
    });
  }

  getPokemonImages(){

    this.pokemons.forEach((pokemon) => {
      const nameLowerCase = pokemon.name.toLowerCase();
      this.pokemonService.getPokemonImageFromApi(nameLowerCase).subscribe((res: any) =>{
        this.pokemonImages[pokemon.name] = res.sprites.front_default;
      })
    })
  }
}