import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Button, ButtonDirective} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {Products} from '../../Models/products.model';
import {ProductsResponse, ProductsService} from '../../core/services/products/products.service';
import {map} from 'rxjs';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {Dialog} from 'primeng/dialog';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {Categories} from '../../Models/categories.model';
import {Brands} from '../../Models/brands.model';
import {CategoriesService} from '../../core/services/products/categories.service';
import {BrandsService} from '../../core/services/products/brands.service';
import {InputNumber} from 'primeng/inputnumber';
import {Paginator} from 'primeng/paginator';
import {InputTextarea} from 'primeng/inputtextarea';
import {SubcategoriesService} from '../../core/services/products/subcategories.service';
import {CharacteristicsService} from '../../core/services/products/characteristics.service';
import {AttributesService} from '../../core/services/products/attributes.service';

@Component({
  selector: 'app-products-admin',
  imports: [
    TableModule,
    Button,
    Tag,
    CurrencyPipe,
    NgClass,
    Ripple,
    Dialog,
    InputText,
    FormsModule,
    DropdownModule,
    NgIf,
    InputNumber,
    InputTextModule,
    ButtonDirective,
    Paginator,
    NgForOf,
  ],
  templateUrl: './products-admin.component.html',
  styleUrl: './products-admin.component.css'
})
export class ProductsAdminComponent implements OnInit {
  products: Products[] = [];
  productsResponse!: ProductsResponse;
  categories: { id: number; categoryName: string }[] = [];
  brands: Brands[] = [];
  subcategories: any[] = [];
  selectedSubcategoryId: number | null = null;
  selectedAttributes: any[] = [];
  selectedCharacteristics: any[] = [];

  filtersProducts = {
    searchTerms: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    stock: null as number | null,
    isOffer: null as boolean | null,
    brandId: null as number | null,
    page: 0,
    size: 10,
    categoryId: null as number | null,
    isActive: null as boolean | null
  }

  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;

  addProductContent = {
    productName: '',
    productDescription: '',
    sku: '',
    price: 0,
    quantity: 0,
    stock: 0,
    brand: 0,
    category: 0,
    product_image: ''
  }

  addCharacteristicContents: any[] = [];
  addCharacteristicContent = {
    name: '',
    description: ''
  };

  addAttributeContents: any[] = [];
  addAttributeContent = {
    attributeName: '',
    subCategories: 0
  }

  editProductContent = {
    idProduct: 0,
    productName: '',
    productDescription: '',
    sku: '',
    price: 0,
    price_creditcard: 0,
    quantity: 0,
    product_image: '',
    stock: 0,
    offerDescount: 0,
    priceOffer: 0,
    pdfFile: '',
    brand: 0,
    isOffer: true,
    isActive: true,
    category: 0
  }

  editProductOfferContent = {
    idProduct: 0,
    offerDescount: 0,
    isOffer: true
  }

  offerDialog: boolean = false;
  attributesDialog: boolean = false;
  characteristicsDialog: boolean = false;
  addCharacteristicDialog: boolean = false;
  addAttributeDialog: boolean = false;
  visibleDialog: boolean = false;
  deactivateDialog: boolean = false;
  viewDialog: boolean = false;
  addDialog: boolean = false;
  selectedProduct: Products = {} as Products;

  constructor(private productService: ProductsService,
              private categoryService: CategoriesService,
              private brandService: BrandsService,
              private subCategoryService: SubcategoriesService,
              private characteristicService: CharacteristicsService,
              private attributeService: AttributesService) {}

  ngOnInit() {
    this.loadProducts(0, this.rows);
    this.loadCategories();
    this.loadBrands();
    this.loadSubcategories();
  }

  applyFilters() {
    console.log("Aplicando filtros:", JSON.stringify(this.filtersProducts, null, 2));
    this.loadProducts(0, this.rows);
  }

  resetFilters() {
    this.filtersProducts = {
      searchTerms: '',
      minPrice: null,
      maxPrice: null,
      stock: null,
      isOffer: null,
      brandId: null,
      page: 0,
      size: 10,
      categoryId: null,
      isActive: null,
    }
    this.loadProducts(0, this.rows);
  }

  loadProducts(page: number, size: number) {
    console.log("Filtros aplicados:", JSON.stringify(this.filtersProducts, null, 2));

    this.productService.getProductsFilter(
      this.filtersProducts.brandId || null,
      this.filtersProducts.categoryId || null,
      null,
      null,
      this.filtersProducts.minPrice || null,
      this.filtersProducts.maxPrice || null,
      this.filtersProducts.stock || null,
      this.filtersProducts.isOffer ?? null,
      this.filtersProducts.isActive ?? null,
      page,
      size,
      this.filtersProducts.searchTerms || null
    ).subscribe((res) => {

      this.products = res.content;
      this.totalRecords = res.totalElements;
    });
  }


  loadCategories(): void {
    this.categoryService.getCategories(0, 100, true).subscribe(
      (data) => {
        this.categories = data.content.map((category: Categories) => ({
          id: category.idCategory,
          categoryName: category.categoryName
        }));
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  loadSubcategories(): void {
    this.subCategoryService.getAllSubCategories(0, 100, true).subscribe(
      (data) => {
        this.subcategories = data.content.map((subcategory: any) => ({
          id: subcategory.idSubCategory,
          categoryName: subcategory.subCategoryName
        }));
        console.log('Subcategorias cargadas:', this.subcategories);
      },
      (error) => {
        console.error('Error al cargar subcategorías:', error);
      }
    );
  }

  showAttributes(product: any) {
    this.selectedProduct = product;
    this.selectedAttributes = product.attributes || [];
    this.attributesDialog = true;
  }

  showCharacteristics(product: any) {
    console.log('Caracteristicas del producto:', product.characteristics);
    this.selectedProduct = product;
    this.selectedCharacteristics = product.characteristics || [];
    this.characteristicsDialog = true;
  }


  loadBrands(): void {
    this.brandService.getAllBrands(0, 100, true).subscribe(
      (data) => {
        this.brands = data.content.map((brand: { brandName: string; idBrand: number }) => ({
          id: brand.idBrand,
          name: brand.brandName
        }));
      },
      (error) => {
        console.error('Error al cargar marcas:', error);
      }
    );
  }

  getSeverity(stock: number) {
    if (stock > 3) {
      return 'success';
    } else if (stock > 0 && stock <= 3) {
      return 'warn';
    } else {
      return 'danger';
    }
  }
  //Add Product
  addProduct() {
    this.addProductContent = {
      productName: '',
      productDescription: '',
      sku: '',
      price: 0,
      quantity: 0,
      stock: 0,
      brand: 0,
      category: 0,
      product_image: ''
    }
    this.addDialog = true;
  }

  saveProduct() {
    this.productService.addProduct(this.addProductContent).subscribe(
      (response) => {
        console.log('Producto agregado:', response);
        this.loadProducts(0, this.rows);
        this.addDialog = false;
      },
      (error) => {
        console.error('Error al agregar producto:', error);
      }
    );
  }
  //Add Caracteristica
  addCharacteristic() {
    if (!this.selectedProduct || !this.selectedProduct.idProduct) {
      console.error('Error: selectedProduct no está definido o no tiene idProduct.');
      return;
    }
    this.addCharacteristicContent = { name: '', description: '' };
    this.addCharacteristicDialog = true;
  }


  saveCharacteristic() {
    if (this.addCharacteristicContent.name && this.addCharacteristicContent.description) {
      this.addCharacteristicContents.push({ ...this.addCharacteristicContent });
      this.addCharacteristicContent = { name: '', description: '' };
    }
  }

  sendSingleCharacteristic() {
    if (this.addCharacteristicContent.name && this.addCharacteristicContent.description) {
      this.addCharacteristicContents.push({ ...this.addCharacteristicContent });
      this.sendCharacteristics();
    }
  }


  sendCharacteristics() {
    if (this.addCharacteristicContents.length === 0) {
      console.warn('No hay características para enviar.');
      return;
    }

    this.characteristicService.addCharacteristic(this.selectedProduct.idProduct, this.addCharacteristicContents)
      .subscribe(
        (response) => {
          console.log('Características agregadas:', response);
          this.loadProducts(0, this.rows);
          this.addCharacteristicDialog = false;
          this.addCharacteristicContents = [];
          window.location.reload();
        },
        (error) => {
          console.error('Error al agregar características:', error);
        }
      );
  }



  //Add Atributo
  addAttribute() {
    if (!this.selectedProduct || !this.selectedProduct.idProduct) {
      console.error('Error: selectedProduct no está definido o no tiene idProduct.');
      return;
    }
    this.addAttributeContent = {
      attributeName: '',
      subCategories: this.selectedSubcategoryId || 0
    }
    this.addAttributeDialog = true;
  }

  saveAttribute() {
    if (this.addAttributeContent.attributeName && this.addAttributeContent.subCategories) {
      this.addAttributeContents.push({ ...this.addAttributeContent });
      this.addAttributeContent = { attributeName: '', subCategories: 0 };
    }
  }

  sendSingleAttribute() {
    if (this.addAttributeContent.attributeName && this.addAttributeContent.subCategories) {
      this.addAttributeContents.push({ ...this.addAttributeContent });
      this.sendAttributes();
    }
  }

 sendAttributes() {
    if (this.addAttributeContents.length === 0) {
      console.warn('No hay atributos para enviar.');
      return;
    }
    this.attributeService.addAttribute(this.selectedProduct.idProduct, this.addAttributeContents)
      .subscribe(
        (response: any) => {
          console.log('Atributos agregados:', response);
          this.loadProducts(0, this.rows);
          this.addAttributeDialog = false;
          this.addAttributeContents = [];
          window.location.reload();
        },
        (error: any) => {
          console.error('Error al agregar atributos:', error);
        }
      );
  }

  // Edit Product Offer
  editProductOffer(product: Products) {
    console.log("Producto recibido:", product);
    this.editProductOfferContent = {
      idProduct: product.idProduct,
      offerDescount: product.productOfferDiscount,
      isOffer: product.isOffer
    };
    console.log("Producto preparado para editar:", this.editProductOffer);
    this.offerDialog = true;
  }

  updatedProductOffer() {
    const updatedProductOffer = {
      ...this.editProductOfferContent,
      isOffer: true
    };

    console.log('Producto antes de actualizar:', updatedProductOffer);

    this.productService.updateProductOffer(
      updatedProductOffer.idProduct,
      updatedProductOffer
    ).subscribe(() => {
        console.log('Producto actualizado');
        this.offerDialog = false;
        this.loadProducts(0, this.rows);
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );
  }

  //EditProducts
  editProduct(product: Products) {
    console.log("Producto recibido:", product);

    this.editProductContent = {
      idProduct: product.idProduct,
      productName: product.productName,
      productDescription: product.productDescription,
      sku: product.productSku,
      price: product.productPrice,
      price_creditcard: product.priceCreditCard,
      quantity: product.quantity,
      product_image: product.productImg,
      stock: product.stock,
      offerDescount: product.productOfferDiscount,
      priceOffer: product.priceOffer,
      pdfFile: product.pdfFile,
      brand: typeof product.idBrand === 'object' ? (product.idBrand as any).idBrand ?? 0 : product.idBrand ?? 0,
      isOffer: product.isOffer,
      isActive: product.isActive,
      category: typeof product.idCategory === 'object' ? (product.idCategory as any).idCategory ?? 0 : product.idCategory ?? 0
    };

    console.log("Producto preparado para editar:", this.editProductContent);
    this.visibleDialog = true;
  }


  updatedProduct() {
    const updatedProduct = {
      ...this.editProductContent,
      price: this.editProductContent.price,
      category: this.editProductContent.category,
      brand: this.editProductContent.brand
    };

    console.log('Producto antes de actualizar:', updatedProduct);

    this.productService.updateProduct(updatedProduct.idProduct, updatedProduct).subscribe(() => {
      console.log('Producto actualizado');
      this.visibleDialog = false;
      this.loadProducts(0, this.rows);
    });
  }


  deactivateProduct(product: Products) {
    this.selectedProduct = { ...product };
    this.deactivateDialog = true;
  }

  // Desactivate Products
  deleteProduct() {
    const deactivateProduct = {
      ...this.selectedProduct
    };

    this.productService.deactivateProduct(this.selectedProduct.idProduct).subscribe(() => {
      console.log('Producto desactivado');
      this.deactivateDialog = false;
      this.loadProducts(0, this.rows);
    })
  }

  //View Producto
  viewProduct(product: Products) {
    this.selectedProduct = { ...product };
    this.viewDialog = true;

    this.productService.getProductsById(this.selectedProduct.idProduct).subscribe(
      (data) => {
        console.log('Producto obtenido:', data);
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
      }
    );
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.first / event.rows;
    this.loadProducts(page, this.rows);
  }
}
