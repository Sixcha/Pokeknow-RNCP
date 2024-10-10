import { Component, HostBinding, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'

})
export class PokemonListComponent implements OnInit {
  @HostBinding('class.flex-list') _class = true;
  pokemons: any[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons(): void {
    this.pokemonService.getPokemons().subscribe((data) => {
      this.pokemons = data;
    });
  }
}