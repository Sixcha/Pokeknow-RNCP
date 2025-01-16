import { Component, HostBinding, OnInit, model } from '@angular/core';
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
  filteredPokemons: any[] = [];
  currentPokemons: any[] = [];
  pokemonImages: { [key: string]: string } = {};
  currentPage: number = 1;
  pokemonPerPage: number = 30
  totalPages: number = 0;

  constructor(private pokemonService: PokemonService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getPokemons();

  }

  getPokemons(): void {
    this.pokemonService.getPokemons().subscribe((data) => {
      this.pokemons = data;
      this.filteredPokemons = data;
      this.totalPages = Math.ceil(data.length / this.pokemonPerPage);
      this.updatePages()
    });
  }

  updatePages(){
    const startIndex = (this.currentPage - 1) * this.pokemonPerPage;
    const endIndex = startIndex + this.pokemonPerPage;
    this.currentPokemons = this.filteredPokemons.slice(startIndex, endIndex)
    console.log(startIndex, endIndex, this.currentPokemons)
    this.getPokemonImages();
  }

  changePage(pageChange:number) {
    if (this.currentPage + pageChange <= this.totalPages  && this.currentPage + pageChange >= 0){
      this.currentPage += pageChange
      this.updatePages()
    }
  }

  getPokemonImages(){
    this.currentPokemons.forEach((pokemon) => {
      const nameLowerCase = pokemon.name.toLowerCase();
      this.pokemonService.getPokemonImageFromApi(nameLowerCase).subscribe((res: any) =>{
        this.pokemonImages[pokemon.name] = res.sprites.front_default;
      })
    })
  }
}