import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgCookieService } from '../../services/ng-cookie.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private cookieService: NgCookieService) {}

  onLogin() {
    this.authService.login(this.escapeHtml(this.username), this.escapeHtml(this.password)).subscribe({
      next: (res) => this.onComplete(res),
      error: (err) => console.error('Login failed', err),
    });
  }

  onComplete(res:any){
    this.cookieService.setCookie("SESSION", res.token);
    window.location.href= "https://pokeknow-rncp.vercel.app"
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
