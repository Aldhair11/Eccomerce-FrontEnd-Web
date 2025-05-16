import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {ProductsService} from '../../../../core/services/products/products.service';
import {NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CartService} from '../../../../core/services/cart/cart.service';
import {HttpHeaders} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-home-offers-card',
  imports: [CarouselModule, ButtonModule, TagModule, RouterLink, Toast],
  templateUrl: './home-offers-card.component.html',
  styleUrl: './home-offers-card.component.css'
})
export class HomeOffersCardComponent {
  filters = {
    brand: null,
    category: null,
    minPrice: null,
    maxPrice: null,
    stock: null,
    isOffer: true,
    isActive: null,
    page: 0,
    size: 10,
    searchTerms: null
  }

  totalElements: number = 0;
  pageSize: number = 10;

  products: {
    idProduct: number,
  name: string;
  price: number;
  image: string;
  offer: number;
  priceOffer: number;
  category: string;
  isActive: boolean;
  isOffer: boolean;
  }[] = [];


  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  constructor(private productsService: ProductsService,
              private route: ActivatedRoute,
              private cartService: CartService,
              private messageService: MessageService,
                ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  addToCart(product: any) {
    this.cartService.addToCart(product.idProduct, 1).subscribe(
      response => {
        console.log('Producto agregado correctamente:', response);
        this.messageService.add({
          key: 'confirm',
          severity: 'success',
          summary: 'Producto agregado satisfactoriamente',
          detail: `${product.name} se ha agregado al carrito.`,
        });

        product.addedToCart = true;
      },
      error => {
        console.error('Error al agregar producto al carrito:', error);
      }
    );
  }


  loadProducts(): void {
    const { brand, category, minPrice, maxPrice, stock, isOffer, isActive, page, size, searchTerms } = this.filters;

    this.productsService.getProductsFilter(
      brand, category, minPrice, maxPrice, stock, null, null, isOffer, isActive, page, size, searchTerms
    ).subscribe((data) => {
      if (data && data.content) {
        this.products = data.content.map((product: any) => ({
          idProduct: product.idProduct,
            name: product.productName,
            price: product.productPrice,
            image: product.productImg,
            offer: product.productOfferDiscount,
            category: product.categoryName,
            priceOffer: product.priceOffer,
            isActive: product.isActive,
            isOffer: product.isOffer
        }));
        this.totalElements = data.totalElements;
      }
    }, (error) => {
      console.error('Error al cargar productos:', error);
    });
  }


}



