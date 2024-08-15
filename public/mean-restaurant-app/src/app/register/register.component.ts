import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../user';
import { UsersDataService } from '../users-data.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  user!: User;


  createdFailMessage: string = '';
  isCreatedFail: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _usersService: UsersDataService, private _authService: AuthService, private _router: Router) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.userForm = this._formBuilder.group(
      {
        name: '',
        username: '',
        password: '',
        comfirm_password: ''
      }
    )
  }

  register() {
    this.user.fill(this.userForm);
    this._usersService.createUser(this.user).subscribe(
      {
        next: (user) => {
          this.createdFailMessage = '';
          this.isCreatedFail = false;
        },
        error: (error) => {
          this.createdFailMessage = 'Create unsuccessfully!';
          this.isCreatedFail = true;
        },
        complete: () => {
          if (!this.isCreatedFail) {
            this.loginToken(this.user)
          }
        }
      }
    )
  }
  loginToken(user: User) {
    this._usersService.getToken(user).subscribe(
      {
        next: (token) => {
          this._authService.setToken(token);
        },
        error: (error) => {

        },
        complete: () => {
          this.redirectToHomePageIfLogged();
        }
      }
    )
  }
  redirectToHomePageIfLogged() {
    if (this._authService.isLoggedIn()) {
      this._router.navigate(['/home']);
    }
  }
}
