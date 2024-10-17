import { Component, OnInit, computed, effect, model, signal } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { NgCookieService } from '../../services/ng-cookie.service';
import { Router } from '@angular/router';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';


@Component({
  selector: 'app-user-team',
  standalone: true,
  imports: [
    PokemonCardComponent
  ],
  templateUrl: './user-team.component.html',
})
export class UserTeamComponent implements OnInit {
  team = model<any[]>([])
  pokemonImages: { [key: string]: string } = {};
  test = computed(() => {
    return this.team().map(row => row = row.pokemon_no)
  })
  pokemonTreated = model<any[]>([])

  test2 = effect(() =>{
    if (!!this.test()[0]){
      for (const row of this.test()) {
        this.loadIndividualPokemon(row)
      }
    }
  })
    
  constructor(private teamService: TeamService, private cookieService: NgCookieService, private router: Router, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    const currentSession = this.cookieService.readCookieDecodeId("SESSION").toString()
    if(currentSession){
      this.loadTeam(currentSession);
    }
    else{
      this.router.navigate(['/login'])

    }
  }

  loadTeam(user: string): void {
    this.teamService.getTeam(user).subscribe((data) => {
      this.team.set(data)
    });
    // this.loadIndividualPokemon()

  }

  loadIndividualPokemon(data: string){

      this.pokemonService.getPokemon(data).subscribe((data: any[]) => {
        this.pokemonTreated().push(data[0]);
      });
  }
}