import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    console.log(this.username, this.password)
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
