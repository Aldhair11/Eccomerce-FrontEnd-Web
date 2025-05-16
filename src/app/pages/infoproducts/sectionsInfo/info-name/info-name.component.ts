import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import { ProductsService } from '../../../../core/services/products/products.service';
import {ActivatedRoute} from '@angular/router';
import { CategoriesService } from '../../../../core/services/products/categories.service';
import {NgForOf, NgIfContext} from '@angular/common';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {MenuItem} from 'primeng/api';
import {CartService} from '../../../../core/services/cart/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-info-name',
  standalone:true,
  imports: [NgForOf, CommonModule, FormsModule,BreadcrumbModule,ToastModule,AvatarModule,ButtonModule,RouterLink],
  templateUrl: './info-name.component.html',
  styleUrls: ['./info-name.component.css'],
  providers:[MessageService]
})
export class InfoNameComponent implements OnInit{
  @Input('idProduct') idProduct: number | null = null;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  products: {
    name: string;
    description: string;
    price: number;
    priceCreditCard: number;
    image: string;
    brandImage: string;
    offer: number;
    stock: number;
    sku: string;
    priceOffer: number;
    category: string;
    isActive: boolean;
    isOffer: boolean;
    quantity: number;
  }[] = [];
  

  constructor(private productsService: ProductsService,
              private route: ActivatedRoute,
              private cartService: CartService,
              private messageService: MessageService,
              private router: Router) {}

              ngOnInit(): void {
                this.route.paramMap.subscribe(params => {
                  this.idProduct = Number(params.get('idProduct'));
                  
                  if (this.idProduct) {
                    this.loadProducts(this.idProduct);
                  }
                });
              
                this.items = [
                  { label: 'Category' },
                  { label: 'Products' },
                  { label: 'ProductName' }
                ];
                this.home = { icon: 'pi pi-home', routerLink: "/home" };
              }

  loadProducts(id: number): void {
    this.productsService.getProductsById(id).subscribe(
      (data) => {
        console.log("Respuesta API:", data);

        if (!data) {
          console.warn("⚠ No se encontraron productos.");
          return;
        }

        if (Array.isArray(data)) {
          this.products = data.map((product: any) => this.mapProduct(product));

        } else if (data.content && Array.isArray(data.content)) {
          this.products = data.content.map((product: any) => this.mapProduct(product));
        } else {
          this.products = [this.mapProduct(data)];

          if (this.products.length > 0) {
            const firstProduct = this.products[0];
            this.items = [
              { label: firstProduct.category, routerLink: "/categories" },
              { label: "Productos", routerLink: "/" + firstProduct.category + "/products" },
              { label: firstProduct.name }
            ];
          }
        }
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  private mapProduct(product: any): any {
    return {
      idProduct: product.idProduct,
      name: product.productName,
      description: product.productDescription,
      price: product.productPrice,
      priceCreditCard: product.priceCreditCard,
      brandImage: product.brandImage,
      image: product.productImg,
      category: product.categoryName,
      isActive: product.isActive,
      sku: product.productSku,
      isOffer: product.isOffer,
      priceOffer: product.priceOffer,
      stock: product.stock,
      quantity: 1
    };
  }

  addToCart(product: any) {
    if (!product.idProduct || !product.quantity) {
      console.error('Error: idProduct o quantity es undefined');
      return;
    }

    this.cartService.addToCart(product.idProduct, product.quantity).subscribe(
      response => {
        console.log('Producto agregado correctamente:', response);
        
        this.messageService.add({
          key: 'confirm', 
          severity: 'success', 
          summary: 'Producto agregado',
          detail: `${product.name} se ha agregado al carrito.`, 
        });

        product.addedToCart = true;
        
      },
      error => {
        console.error('Error al agregar producto al carrito:', error);
      }
    );
  }

}
