import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CharacteristicsService {

  private baseUrl = 'http://localhost:8081/api/v1/characteristics';

  constructor(private http: HttpClient) {}

  // Get Characteristics
  getAllCharacteristics(
    page: number,
    size: number
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/getAllCharacteristics`, { params });
  }

  //add Characteristics
  addCharacteristic(idProduct: number, characteristicDate: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/addCharacteristics/${idProduct}`, characteristicDate, { headers });
  }

  // Updated Characteristics
  updateCharacteristic(idCharacteristic: number, updatedCharacteristic: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/updateCharacteristic/${idCharacteristic}`, updatedCharacteristic, { headers });
  }

  // Deactivate Characteristics
  deactivateCharacteristic(idCharacteristic: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.baseUrl}/deactivateCharacteristic/${idCharacteristic}`, null, { headers });
  }
}
