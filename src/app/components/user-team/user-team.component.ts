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
  styleUrl: './user-team.component.scss'

})
export class UserTeamComponent implements OnInit {
  team = model<any[]>([])
  // pokemonImages: { [key: string]: string } = {};
  pokemonImages =signal<{ [key: string]: string }>({});

  teamMapped = computed(() => {
    return this.team().map(row => row = row.pokemon_no)
  })
  pokemonTreated = model<any[]>([])

  loadTrigger = effect(() =>{
    if (!!this.teamMapped()[0]){
      for (const row of this.teamMapped()) {
        this.loadIndividualPokemon(row)
      }
    }
    this.getPokemonImages()

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

  }

  loadIndividualPokemon(data: string){

      this.pokemonService.getPokemon(data).subscribe((data: any[]) => {
        this.pokemonTreated().push(data[0]);
      });
  }

  getPokemonImages(){

    this.pokemonTreated().forEach((pokemon) => {
    console.log(pokemon)

      const nameLowerCase = pokemon.name.toLowerCase();
      this.pokemonService.getPokemonImageFromApi(nameLowerCase).subscribe((res: any) =>{
        this.pokemonImages()[pokemon.name] = res.sprites.front_default;
      })
    })
  }

  removeFromTeam(pokemonId:string){
    const user = this.cookieService.readCookieDecodeId("SESSION")
    this.teamService.removeFromTeam(user , pokemonId).subscribe(
      () => {
        this.pokemonTreated.set(this.pokemonTreated().filter(pokemon => pokemon.id !== pokemonId)) 
      }
    )
  }

}