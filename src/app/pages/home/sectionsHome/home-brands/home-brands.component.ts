import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { NgFor } from '@angular/common';
import {BrandsService} from '../../../../core/services/products/brands.service';
import { Brands } from '../../../../Models/brands.model';


@Component({
  selector: 'app-home-brands',
  imports: [CarouselModule, NgFor],
  templateUrl: './home-brands.component.html',
  styleUrl: './home-brands.component.css'
})
export class HomeBrandsComponent {
  Brands: any[] = [];
  images: string[] = [];

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  constructor(private brandsService: BrandsService) {}

  ngOnInit(): void {
    this.loadBrandsImages();
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandsService.getBrands(0, 4).subscribe(
      response => {
        this.Brands = response.content.map(Brands => ({
          image: Brands.brandImage,
          label: Brands.brandName,
          value: Brands.idBrand
        }));
        console.log('Marcas obtenidas: ', this.Brands);
      },
      error => {
        console.log('Error al obtener las marcas: ', error);
      }
    );
  }

  loadBrandsImages(): void {
    this.brandsService.getAllBrandsImages().subscribe(
      response => {
        console.log("Imagenes recibidas: ", response);
        this.images = response;
      },
      error => {
        console.error("Error cargando imágenes:", error);
      }
    );
  }
}
