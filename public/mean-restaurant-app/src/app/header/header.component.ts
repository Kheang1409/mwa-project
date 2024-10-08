import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  title: string = environment.application.name;
  username: string = ''

  home: string = environment.urlFrontend.home;

  constructor(private _authService: AuthService, private _router: Router) {
  }

  ngOnInit(): void {
    if (this._authService.getToken()) {
      const token = `${this._authService.getToken()}`
      const userPayload: any = jwtDecode(token);
      this.username = userPayload.name;
    }
  }

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }
  logout() {
    this._authService.logout();
    this._router.navigate([environment.urlFrontend.signIn]);
  }
}
