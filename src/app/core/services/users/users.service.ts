import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private baseUrl = 'http://localhost:8080/api/v1/User';

  constructor(private http: HttpClient) {}

  getAllUsers(page: number, size: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/getAllUsers`, { params, headers });
  }

  getUsersFilters(
    searchTerms: string | null,
    roleId: number | null,
    isActive: boolean | null,
    page: number,
    size: number
  ): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerms !== null) {
      params = params.set('searchTerms', searchTerms.toString());
    }

    if (roleId !== null) {
      params = params.set('roleId', roleId.toString());
    }

    if (isActive !== null) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http.get<any>(`${this.baseUrl}/getUsersByFilters`, { params, headers });
  }

  getUsersById(idUser: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}/getUserById/${idUser}`, { headers });
  }

  updatedUsers(idUser: number, updatedUser: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/updateUser/${idUser}`, updatedUser, { headers })
  }

  deactivateUser(idUser: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.baseUrl}/deactivateUser/${idUser}`, null, { headers })
  }

  getRoles(): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/getRolesAll`, { headers });
  }
}
