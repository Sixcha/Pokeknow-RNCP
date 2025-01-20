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
  team: any[] = []
  // pokemonImages =signal<{ [key: string]: string }>({});
  pokemonImages: { [key: string]: string } = {};

  pokemonTreated = model<any[]>([])

  // loadTrigger = effect(() =>{
  //   if (!!this.team[0]){
  //     console.log('loadtrigger', this.team[0])
  //     for (const row of this.team) {
  //       this.loadIndividualPokemon(row)
  //     }
  //   }

  // })
    
  constructor(private teamService: TeamService, private cookieService: NgCookieService, private router: Router, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    const currentSessionId = this.cookieService.readCookieDecodeId("SESSION").toString()
    const currentSession = this.cookieService.readCookie("SESSION")
    if(currentSession){
      this.loadTeam(currentSession, currentSessionId);
    }
    else{
      this.router.navigate(['/login'])

    }
  }

  loadTeam(user: string, id: string): void {
    this.teamService.getTeam(user, id).subscribe((data) => {
      // this.team.set(data.map(row => row = row.pokemon_no))
      this.team = data.map(row => row = row.pokemon_no)
      console.log(this.team)
      for (const row of this.team) {
        this.loadIndividualPokemon(row)
      }
    });
  }

  loadIndividualPokemon(data: string){
      this.pokemonService.getPokemon(data).subscribe((data: any[]) => {
        const currentPokemon = data[0]
        this.pokemonTreated().push(currentPokemon);
        this.getPokemonImages(currentPokemon)

      });

  }

  getPokemonImages(pokemon:any){

    // this.pokemonTreated().forEach((pokemon) => {
    // console.log(pokemon)

      const nameLowerCase = pokemon.name.toLowerCase();
      this.pokemonService.getPokemonImageFromApi(nameLowerCase).subscribe((res: any) =>{
        this.pokemonImages[pokemon.name] = res.sprites.front_default;
      })
    // })
  }

  // getPokemonImages(){
  //   this.currentPokemons.forEach((pokemon) => {
  //     const nameLowerCase = pokemon.name.toLowerCase();
  //     this.pokemonService.getPokemonImageFromApi(nameLowerCase).subscribe((res: any) =>{
  //       this.pokemonImages[pokemon.name] = res.sprites.front_default;
  //     })
  //   })
  // }

  removeFromTeam(pokemonId:string){
    const user = this.cookieService.readCookieDecodeId("SESSION")
    this.teamService.removeFromTeam(user , pokemonId).subscribe(
      () => {
        window.location.href= "http://localhost:4200/user-team"
        // this.team.set(this.team().filter(no => no !== pokemonId))
        // this.pokemonTreated.set(this.pokemonTreated().filter(pokemon => pokemon.no !== pokemonId))
        // console.log(this.pokemonTreated())
      }
    )
  }

}