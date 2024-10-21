import { Component, input, model } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import  TypeColours from '../../../assets/TypeColours.json'
import { CommonModule } from '@angular/common';
import { PokemonType } from '../../services/pokemon.service';


@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss',
})
export class PokemonCardComponent {
  
  pokemon = input<any>()
  image = input('')
  // typecolors = TypeColours
  // type = input<PokemonType>("normal")

}
