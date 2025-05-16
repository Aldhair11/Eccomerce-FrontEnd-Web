import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  username: string | null = null;
  private isAuthenticated = false;

  private apiBaseUrl = 'http://localhost:8081/api/v1/auth';

  constructor( private http: HttpClient ) { }

  registerUser(user: any, idRole: number): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/register/user/${idRole}`, user).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error("Error en la API:", error);
    return throwError(() => new Error('Error al registrar usuario.'));
  }

  login (username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/login`, { username, password }).pipe(
      map((response) => {
        this.isAuthenticated = true;
        return response;
      }),
      catchError((error) => {
        this.isAuthenticated = false;
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiBaseUrl}/logout`, {}, { headers });
  }

  saveToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsernameFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || payload.sub || '';
    } catch (error) {
      return '';
    }
  }

  getUserInfoFromToken(): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }

    const decodedToken: any = jwtDecode(token);
    const username = decodedToken.sub;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    const url = 'http://localhost:8081/api/v1/User/me';
    return this.http.get(url, { headers });
  }

  sendRecoveryCode(email: string): Observable<any> {
    let params = new HttpParams()
      .set('email', email.toString());

    return this.http.post<any>(`${this.apiBaseUrl}/reset-password`, {}, { params });
  }

  changePassword(code: string, password: string): Observable<any> {
    let params = new HttpParams()
      .set('code', code.toString())
      .set('newPassword', password.toString());

    return this.http.post<any>(`${this.apiBaseUrl}/change-password`, {}, { params });
  }
}
