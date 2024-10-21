import { Component, OnInit, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { TeamService } from '../../services/team.service';
import { NgCookieService } from '../../services/ng-cookie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-individual-pokemon-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './individual-pokemon-page.component.html',
  styleUrl: './individual-pokemon-page.component.scss'

})
export class IndividualPokemonPageComponent implements OnInit {
  pokemon: any;
  abilities: any;
  moves: any;
  image = signal('')

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private teamService: TeamService,
    private cookieService: NgCookieService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap) => {
      this.image.set(paramMap.get('image')!);

    });
    const id = this.route.snapshot.paramMap.get('id')!;
    this.getPokemon(id);
    this.getMoves(id);
    // this.getAbilities(id);
  }

  getPokemon(id: string): void {
    this.pokemonService.getPokemon(id).subscribe((data) => {
      this.pokemon = data[0];
    });
  }

  getMoves(id: string): void {
    this.pokemonService.getPokemonMoves(id).subscribe((data) => {
      this.moves = data;
    });
  }

  // getAbilities(id: string): void {
  //   this.pokemonService.getPokemonAbilities(id).subscribe((data) => {
  //     this.abilities = data[0];
  //   });
  // }

  addToTeam(pokemonId:string){
    const user = this.cookieService.readCookieDecodeId("SESSION")
    this.teamService.addToTeam(user , pokemonId)
  }
}