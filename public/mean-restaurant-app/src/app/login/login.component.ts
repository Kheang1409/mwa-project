import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersDataService } from '../users-data.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  token!: string;
  loginForm!: FormGroup;
  user!: User

  unauthorizedMessage: string = '';
  isUnauthorized: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _usersService: UsersDataService, private _authService: AuthService, private _router: Router) {
    this.user = new User();
    this.redirectToHomePageIfLogged();
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: '',
      password: '',
    });
  }
  login() {
    if (!this.isBlank()) {
      this.user.fill(this.loginForm);
      this.getToken(this.user);
    }
  }
  getToken(user: User) {
    this._usersService.getToken(user).subscribe(
      {
        next: (token) => {
          this.unauthorizedMessage = '';
          this.isUnauthorized = false;
          this._authService.setToken(token);
        },
        error: (error) => {
          this.unauthorizedMessage = environment.message.unauthorizedMessage;
          this.isUnauthorized = true;
        },
        complete: () => {
          if (!this.isUnauthorized) {
            this.unauthorizedMessage = '';
            this.isUnauthorized = false;
            this.redirectToHomePageIfLogged();
          }
        }
      }
    )
  }
  redirectToHomePageIfLogged() {
    if (this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.home]);
    }
  }
  isBlank(): boolean {
    if (this.loginForm.value.password === '' || this.loginForm.value.username === '') {
      this.unauthorizedMessage = environment.message.missingUsernamePassword;
      this.isUnauthorized = true;
      return true;
    }
    return false;
  }
}
