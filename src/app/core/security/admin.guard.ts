import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthService} from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      this.router.navigate(['/home']).then(r => false);
      return of(false);
    }

    return this.authService.getUserInfoFromToken().pipe(
      map((userInfo) => {
        if (userInfo && (userInfo.roleName === 'ADMIN' || userInfo.roleName === 'PERSONAL')) {
          return true;
        } else {
          this.router.navigate(['/home']).then(r => false);
          return false;
        }
      }),
      catchError((error) => {
        this.router.navigate(['/home']).then(r => false);
        return of(false);
      })
    );
  }
}
