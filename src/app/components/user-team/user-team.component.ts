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
  pokemonImages =signal<{ [key: string]: string }>({});
  pokemonTreated = model<any[]>([])

  loadTrigger = effect(() =>{
    if (!!this.team()[0]){
      console.log('loadtrigger', this.team()[0])
      for (const row of this.team()) {
        console.log('loadtrigger row', row)
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
      console.log('loadTeam', data)
      this.team.set(data.map(row => row = row.pokemon_no))
    });

  }

  loadIndividualPokemon(data: string){
    let test:any[] = []
      this.pokemonService.getPokemon(data).subscribe((data: any[]) => {
        test.push(data[0])
        this.pokemonTreated().push(data[0]);
        console.log(this.pokemonTreated())
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
        window.location.href= "http://localhost:4200/user-team"
        // this.team.set(this.team().filter(no => no !== pokemonId))
        // this.pokemonTreated.set(this.pokemonTreated().filter(pokemon => pokemon.no !== pokemonId))
        // console.log(this.pokemonTreated())
      }
    )
  }

}