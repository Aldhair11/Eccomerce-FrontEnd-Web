import { Categories } from '../../../Models/categories.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export interface CategoryResponse{
  content: Categories[];
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})

export class CategoriesService {
  private baseUrl = 'http://localhost:8081/api/v1/categories';

  constructor(private http: HttpClient) {}

  getCategories(
    page: number,
    size: number,
    isActive: boolean | null
  ): Observable<CategoryResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (isActive !== null) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http.get<any>(`${this.baseUrl}/getAllCategories`, {params});
  }

  getCategoryByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getCategoryByName/${name}`);
  }

  getCategoryById(id:number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getCategory/${id}`);
  }

  //add Categorias
  addCategory(categoryDate: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/addCategory`, categoryDate, { headers });
  }

  // Updated Categorias
  updateCategory(idCategory: number, updatedCategory: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/updateCategory/${idCategory}`, updatedCategory, { headers });
  }

  deleteCategory(idCategory: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deactivateCategory/${idCategory}`);
  }



  // Desactivate Category
  deactivateCategory(idCategory: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.baseUrl}/deactivateCategory/${idCategory}`, null, { headers });
  }
}
