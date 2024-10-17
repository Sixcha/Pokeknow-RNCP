import { Component, HostBinding, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';


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

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    // this.pokemonService.getPokemons().subscribe((data) => {
    //   this.pokemons = data;
    //   this.pokemons.forEach(pokemon => {
    //     this.pokemonService.getPokemonImageFromApi(pokemon.name).subscribe(image =>{
    //       this.pokemonImages[pokemon.name] = image.sprites.front_default;
    //     })
    //   })
    // });
    this.getPokemons();

  }

  getPokemons(): void {
    this.pokemonService.getPokemons().subscribe((data) => {
      this.pokemons = data;
    });
  }

  async getPokemonImages(){
    
  }
}