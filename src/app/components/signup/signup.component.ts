import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { error } from 'node:console';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  username = '';
  password = '';
  errors:string[] = []

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    if(this.username.length < 4 || this.password.length < 4){
      this.errors.push('Username and Password must be more than 3 characters')
      return
    }
    this.authService.signup(this.escapeHtml(this.username), this.escapeHtml(this.password)).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Signup failed', err),
    });
  }

  escapeHtml(text:any) {
    let map:any = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m:any) { return map[m]; });
  }
}
