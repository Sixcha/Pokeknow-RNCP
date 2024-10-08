import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-individual-pokemon-page',
  templateUrl: './individual-pokemon-page.component.html',
})
export class IndividualPokemonPageComponent implements OnInit {
  pokemon: any;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.getPokemon(id);
  }

  getPokemon(id: string): void {
    this.pokemonService.getPokemon(id).subscribe((data) => {
      this.pokemon = data;
    });
  }
}