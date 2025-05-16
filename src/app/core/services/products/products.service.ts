import { Injectable } from '@angular/core';
import { Products } from '../../../Models/products.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductsResponse {
  content: Products[];
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = 'http://localhost:8081/api/v1/products';

  constructor(private http: HttpClient) { }

  // Products
  getProductsFilter(
    brandId: number | null,
    categoryId: number | null,
    subCategoryId: number | null,
    attributeIds: number[] | null,
    minPrice: number | null,
    maxPrice: number | null,
    stock: number | null,
    isOffer: boolean | null,
    isActive: boolean | null,
    page: number,
    size: number,
    searchTerms: string | null
  ): Observable<ProductsResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (brandId !== null && brandId !== undefined) {
      params = params.set('brandId', brandId.toString());
    }

    if (categoryId !== null && categoryId !== undefined) {
      params = params.set('categoryId', categoryId.toString());
    }

    if (subCategoryId !== null) {
      params = params.set('subCategoryId', subCategoryId.toString());
    }

    if (attributeIds !== null && attributeIds.length > 0) {
      params = params.set('attributeIds', attributeIds.join(','));
    }

    if (minPrice !== null) {
      params = params.set('minPrice', minPrice.toString());
    }

    if (maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    if (stock !== null) {
      params = params.set('stock', stock.toString());
    }

    if (isOffer !== null) {
      params = params.set('isOffer', isOffer.toString());
    }

    if (isActive !== null) {
      params = params.set('isActive', isActive.toString());
    }

    if (searchTerms !== null) {
      params = params.set('searchTerms', searchTerms);
    }

    return this.http.get<ProductsResponse>(`${this.baseUrl}/getProductsByFilters`, {  params });
  }


  getProductsById(idProducts:number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getProductsById/${idProducts}`);
  }

  // Add Product
  addProduct(productDate: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/addProduct`, productDate, { headers });
  }

  // Update Product Offer
  updateProductOffer(idProduct: number, updatedProductOffer: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.baseUrl}/updateProductOffer/${idProduct}`, updatedProductOffer, { headers });
  }

  // Updated Product
  updateProduct(idProduct: number, updatedProduct: any): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/updateProduct/${idProduct}`, updatedProduct, { headers });
  }

  // Desactivate Product
  deactivateProduct(idProduct: number): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<any>(`${this.baseUrl}/deactivateProduct/${idProduct}`, null, { headers });
  }
}
