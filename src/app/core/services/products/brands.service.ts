import { Brands } from '../../../Models/brands.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export interface BrandsResponse {
    content: Brands[];
    totalElements: number;
}

@Injectable({
    providedIn: 'root'
})

export class BrandsService {
    private baseUrl = 'http://localhost:8081/api/v1/brands';

    constructor(private http: HttpClient) {}
    getBrands(
        page: number,
        size: number,
      ): Observable<BrandsResponse> {

        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        return this.http.get<any>(`${this.baseUrl}/getAllBrands`, {params});
      }

  getAllBrands(page: number, size: number, isActive: boolean | null): Observable<any> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

      if (isActive !== null) {
        params = params.set('isActive', isActive.toString());
      }

      return this.http.get<any>(`${this.baseUrl}/getAllBrands`, { params });
  }

  getAllBrandsImages(): Observable<string[]> {

    return this.http.get<string[]>(`${this.baseUrl}/getAllBrandsImages`);
  }

  getBrandsById(idBrand:number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getBrands/${idBrand}`);
  }

   //add Brands
   addBrand(BrandDate: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/addBrand`, BrandDate, { headers });
  }

  //update Brands
  updateBrand(idBrand: number, updatedBrand: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/updateBrand/${idBrand}`, updatedBrand, { headers });
  }

   // Desactivate Brands
   deactivateBrand(idBrand: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.baseUrl}/deactivateBrand/${idBrand}`, null, { headers });
  }

  getAllBrandsByFilter(page: number, size: number, isActive: boolean | null): Observable<any> {
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

    if (isActive !== null) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http.get<any>(`${this.baseUrl}/getAllBrandsFilter`, { params, headers });
  }
}
