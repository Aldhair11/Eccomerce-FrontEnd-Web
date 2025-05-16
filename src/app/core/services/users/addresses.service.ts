import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AddressesService {

  private baseUrl = 'http://localhost:8080/api/v1/addresses';
  constructor(private http: HttpClient) { }

  getAddresses(page: number, size: number): Observable<any> {
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

    return this.http.get<any>(`${this.baseUrl}/getAllAddresses`, { headers, params });
  }

  // Add Address
   addAddress(addressDate: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/addAddress`, addressDate, { headers });
  }

  // Updated Address
  updateAddress(idAddress: number, updatedAddress: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.baseUrl}/updatedAddress/${idAddress}`, updatedAddress, { headers });
  }

  // Delete Address
  deleteAddress(idAddress:number):Observable<any>{
    const token = sessionStorage.getItem("authToken");
    if(!token){
      throw new Error ('Token no Encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.baseUrl}/deleteAddress/${idAddress}`,  { headers }) 
  }

  // Get all Countries
  getCountries(): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}/getAllCountries`, { headers });
  }

  // Get all States
  getStates(countryId: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}/getAllStates/${countryId}`, { headers });
  }

  // Get all Provinces
  getProvinces(stateId: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}/getAllProvinces/${stateId}`, { headers });
  }

  // Get all Districts
  getDistricts(provinceId: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}/getAllDistricts/${provinceId}`, { headers });
  }
}
