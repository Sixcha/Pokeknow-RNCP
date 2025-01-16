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
    if(this.validatePassword(this.password)){
      console.log("Password is valid")
    }
    if(this.username.length < 4 ){
      this.errors.push('Username must be more than 3 characters')
    }
    if (this.errors.length>0){
      console.log(this.errors) 
      this.errors = []
      return
    }
    this.authService.signup(this.escapeHtml(this.username), this.escapeHtml(this.password)).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Signup failed', err),
    });
  }

  validatePassword(password: string) {

    const minLength = /.{8,}/; 
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/; 
    const hasNumber = /\d/;

  
    if (!minLength.test(password)) this.errors.push("Password must be at least 8 characters long.");
    if (!hasUppercase.test(password)) this.errors.push("Password must contain at least one uppercase letter.");
    if (!hasLowercase.test(password)) this.errors.push("Password must contain at least one lowercase letter.");
    if (!hasNumber.test(password)) this.errors.push("Password must contain at least one number.");

    if(this.errors.length ===0){
      return true
    }
    else return false
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
