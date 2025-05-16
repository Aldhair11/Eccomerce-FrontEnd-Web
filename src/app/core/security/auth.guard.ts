import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return of(true);
    } else {
      this.router.navigate(['/home']);
      return of(false);
    }
  }
}

