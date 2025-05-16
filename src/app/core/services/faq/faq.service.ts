import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Faq } from '../../../Models/faq.model';


export interface FaqResponse {
    content: Faq[];
    totalElements: number;
}

@Injectable({
    providedIn: 'root'
})

export class FaqService {
    private ApibaseUrl = 'http://localhost:8081/api/v1/faq';

    constructor(private http: HttpClient) { }

    // Faq
    getAllFaq(
        page: number,
        size: number,
        isActive: boolean | null
    ): Observable<FaqResponse> {

        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (isActive !== null) {
          params = params.set('isActive', isActive.toString());
        }

        return this.http.get<FaqResponse>(`${this.ApibaseUrl}/getAllFaq`, { params });
    }
    getFaqById(idFaq:number): Observable<any> {
      return this.http.get<any>(`${this.ApibaseUrl}/getFaq/${idFaq}`);
    }

    //add Categorias
   addFaq(faqDate: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.ApibaseUrl}/addFaq`, faqDate, { headers });
  }

    // Updated Faq
  updateFaqs(idFaq: number, updatedFaqs: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.ApibaseUrl}/updateFaq/${idFaq}`, updatedFaqs, { headers });
  }

  // Deactivate Faq
  deactivateFaq(idFaq: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.ApibaseUrl}/deactivateFaq/${idFaq}`, null, { headers });
    }
}
