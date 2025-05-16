import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8081/api/v1/cart';

  constructor(private http: HttpClient) {}

  addToCart(idProduct: number, quantity: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('idProduct', idProduct.toString())
      .set('quantity', quantity.toString())
      .set('paymentMethod', '2');

    return this.http.post<any>(`${this.baseUrl}/addProductToCart`, null, { headers, params });
  }


  getCartByUser(idUser: number, page: number = 0, size: number = 10): Observable<any> {
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

    return this.http.get<any>(`${this.baseUrl}/getCartByUser/${idUser}`, { headers, params });
  }

  updateCartItemQuantity(idCartItem: number, quantity: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('idCartItem', idCartItem.toString())
      .set('quantity', quantity.toString());

    return this.http.put<any>(`${this.baseUrl}/updateQuantity`, null, { headers, params });
  }

  deleteCartItem(idCartItem: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.baseUrl}/items/${idCartItem}`, { headers });
  }

}


