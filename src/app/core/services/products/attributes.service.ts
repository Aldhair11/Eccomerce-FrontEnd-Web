import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AttributesService {

  private baseUrl = 'http://localhost:8081/api/v1/attributes';

  constructor(private http: HttpClient) {}

  // Get Attributes
  getAllAttributes(
    page: number,
    size: number
  ): any {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/getAllAttributes`, { params });
  }

  //add Attributes
  addAttribute(idProduct: number, attributeDate: any): any {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/addAttributes/${idProduct}`, attributeDate, { headers });
  }

  // Updated Attributes
  updateAttribute(idAttribute: number, updatedAttribute: any): any {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/updateAttribute/${idAttribute}`, updatedAttribute, { headers });
  }

  // Deactivate Attributes
  deactivateAttribute(idAttribute: number): any {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.baseUrl}/deactivateAttribute/${idAttribute}`, null, { headers });
  }
}
