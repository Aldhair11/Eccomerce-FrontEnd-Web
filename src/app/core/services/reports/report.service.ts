import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  private baseUrl = 'http://localhost:8080/api/v1/AuditLogs';

  constructor(private http: HttpClient) {}

  //get Reports All
  getReportsAll(
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

    return this.http.get<any>(`${this.baseUrl}/getAllAuditLogs`, { params, headers });
  }

  //get Reports by User
  getReportsByUser(
    page: number,
    size: number,
    idUser: number
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
      .set('size', size.toString())
    return this.http.get<any>(`${this.baseUrl}/getAuditLogsByUser/${idUser}`, { params, headers });
  }
}
