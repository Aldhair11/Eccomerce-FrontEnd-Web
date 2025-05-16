import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {
  constructor(private router: Router,
              private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return of(false);
    } else {
      return of(true);
    }
  }
}
