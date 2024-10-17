import { Component, input } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent {
  pokemon = input<any>()
  image = input('')


}
