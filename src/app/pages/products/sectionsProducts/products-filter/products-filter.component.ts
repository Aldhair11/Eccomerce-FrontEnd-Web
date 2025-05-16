import { Component, HostListener, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import {NgForOf} from '@angular/common';
import {ProductsService} from '../../../../core/services/products/products.service';
import {Paginator} from 'primeng/paginator';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CategoriesService} from '../../../../core/services/products/categories.service';
import {SubcategoriesService} from '../../../../core/services/products/subcategories.service';
import {CartService} from '../../../../core/services/cart/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-products-filter',
  imports: [FormsModule, CommonModule, DividerModule, NgForOf, Paginator, RouterLink,ToastModule,ButtonModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css'
})
export class ProductsFilterComponent {
  filtros: any[] = [];

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

  filters = {
    brandId: null as number | null,
    categoryId: 1,
    minPrice: null as number | null,
    maxPrice: null as number | null,
    stock: null as number | null,
    isOffer: null as boolean | null,
    subCategoryId: null as number | null,
    attributeIds: null as number[] | null,
    isActive: true,
    page: 0,
    size: 10,
    searchTerms: null as string | null
  }

  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;

  constructor(private productsService: ProductsService,
              private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private subCategoriesService: SubcategoriesService,
              private cartService: CartService,
              private messageService: MessageService,
              ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryName = params.get('categoryName');
      if (categoryName) {
        this.categoriesService.getCategoryByName(categoryName).subscribe(category => {

          if (category && category.idCategory) {
            this.filters.categoryId = category.idCategory;

            this.loadSubcategories(category.idCategory);


            setTimeout(() => this.loadProducts(0, this.rows), 100);
          }
        });
      }
    });
  }



  loadProducts(page: number, size: number): void {
    const { brandId, categoryId, subCategoryId, attributeIds, minPrice, maxPrice, stock, isOffer, isActive, searchTerms } = this.filters;

    this.productsService.getProductsFilter(
      brandId, categoryId, subCategoryId, attributeIds, minPrice, maxPrice, stock, isOffer, isActive, page, size, searchTerms
    ).subscribe(
      (data) => {
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
          this.totalRecords = data.totalElements;
        } else {
          console.warn('⚠ La API devolvió una lista vacía.');
        }
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  loadSubcategories(categoryId: number): void {
    console.log('Cargando subcategorías para la categoría ID:', categoryId);

    this.subCategoriesService.getSubcategories(
      null, null, null, null, null, categoryId, null, true
    ).subscribe(
      (data) => {
        console.log('Respuesta de la API:', data);

        if (Array.isArray(data) && data.length > 0) {
          console.log('Subcategorías encontradas:', data);

          const atributosUnicos: { [key: string]: any } = {};

          data.forEach((sub: any) => {
            if (sub.attributes) {
              sub.attributes.forEach((attr: any) => {
                if (!atributosUnicos[attr.attributeName]) {
                  atributosUnicos[attr.attributeName] = {
                    id: attr.id,
                    nombre: attr.attributeName,
                    seleccionado: false,
                    subCategoryIds: [sub.idSubCategory]
                  };
                } else {
                  atributosUnicos[attr.attributeName].subCategoryIds.push(sub.idSubCategory);
                }
              });
            }
          });

          this.filtros = [{
            id: 'atributos',
            nombre: 'Atributos',
            abierto: false,
            opciones: Object.values(atributosUnicos)
          }];

          console.log('Filtros agrupados:', this.filtros);
        } else {
          console.warn('No se encontraron subcategorías en la respuesta.');
        }
      },
      (error) => {
        console.error('Error al cargar subcategorías y atributos:', error);
      }
    );
  }


  addToCart(product: any) {
    this.cartService.addToCart(product.idProduct, 1).subscribe(
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


  onFilterChange(): void {
    const selectedOptions = this.filtros[0].opciones.filter((opcion: any) => opcion.seleccionado);

    if (selectedOptions.length > 0) {
      this.filters.attributeIds = selectedOptions.map((opcion: { id: any; }) => opcion.id);
      this.filters.subCategoryId = selectedOptions.flatMap((opcion: { subCategoryIds: any; }) => opcion.subCategoryIds);
    } else {
      this.filters.attributeIds = null;
      this.filters.subCategoryId = null;
    }

    console.log('Filtros actualizados:', JSON.stringify(this.filters, null, 2));

    this.loadProducts(0, this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.first / event.rows;
    this.loadProducts(page, this.rows);
  }

  toggleFiltro(filtro: any) {
    filtro.abierto = !filtro.abierto;
  }

  filtrosVisibles = false;
  isDesktop = window.innerWidth > 768;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isDesktop = window.innerWidth > 768;
  }

  toggleFiltros() {
    this.filtrosVisibles = !this.filtrosVisibles;
    console.log('Estado de filtrosVisibles:', this.filtrosVisibles);
  }

  ordenarProductos(event: Event) {

    const selectElement = event.target as HTMLSelectElement;
    const criterio = selectElement.value;

    this.products.sort((a, b) => {
        const precioA = a.isOffer ? a.priceOffer : a.price;
        const precioB = b.isOffer ? b.priceOffer : b.price;

        return criterio === 'asc' ? precioA - precioB : precioB - precioA;
    });
}
}



