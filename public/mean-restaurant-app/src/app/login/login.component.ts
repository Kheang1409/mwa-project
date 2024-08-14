import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User, UsersDataService } from '../users-data.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  token!: string;
  loginForm!: FormGroup;
  user!: User
  constructor(private _formBuilder: FormBuilder, private _usersService: UsersDataService, private _authService: AuthService, private _router: Router) {
    this.user = new User("", "", "", "");
    this.redirectToHomePageIfLogged();
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: "",
      password: "",
    });
  }
  login() {
    this.user = new User(
      "",
      "",
      this.loginForm.value.username,
      this.loginForm.value.password
    );
    this.getToken(this.user);
  }
  getToken(user: User) {
    this._usersService.getToken(user).subscribe(token => {
      this._authService.setToken(token);
      this.redirectToHomePageIfLogged();
    })
  }
  redirectToHomePageIfLogged() {
    if (this._authService.isLoggedIn()) {
      this._router.navigate(['/home']);
    }
  }
}
