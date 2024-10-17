import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { TeamService } from '../../services/team.service';
import { NgCookieService } from '../../services/ng-cookie.service';

@Component({
  selector: 'app-individual-pokemon-page',
  templateUrl: './individual-pokemon-page.component.html',
})
export class IndividualPokemonPageComponent implements OnInit {
  pokemon: any;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private teamService: TeamService,
    private cookieService: NgCookieService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.getPokemon(id);
  }

  getPokemon(id: string): void {
    this.pokemonService.getPokemon(id).subscribe((data) => {
      this.pokemon = data[0];
    });
  }

  addToTeam(pokemonId:string){
    const user = this.cookieService.readCookieDecodeId("SESSION")
    console.log(typeof user, user,typeof pokemonId, pokemonId)

    this.teamService.addToTeam(user , pokemonId)
  }
}