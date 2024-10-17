import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { UserTeamComponent } from './components/user-team/user-team.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { IndividualPokemonPageComponent } from './components/individual-pokemon-page/individual-pokemon-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    {path: 'pokemon-list', component: PokemonListComponent},
    {path: 'user-team', component: UserTeamComponent},
    {path: 'profile', component: ProfilePageComponent},
    {path: 'pokemon/:id', component: IndividualPokemonPageComponent},
    {path: 'signup', component: SignupComponent },
    {path: 'login', component: LoginComponent },
    {path: 'admin', component: AdminComponent },


];
