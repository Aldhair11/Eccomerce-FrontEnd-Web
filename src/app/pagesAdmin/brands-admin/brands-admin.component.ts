import { Component } from '@angular/core';
import { Brands } from '../../Models/brands.model';
import { BrandsService } from '../../core/services/products/brands.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {Ripple} from 'primeng/ripple';
import {InputText} from 'primeng/inputtext';
import { NgClass} from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import {DropdownModule} from 'primeng/dropdown';


@Component({
  selector: 'app-brands-admin',
  imports: [ButtonModule, TableModule, DialogModule, CommonModule, FormsModule, Ripple, InputText, NgClass, PaginatorModule, DropdownModule],
  templateUrl: './brands-admin.component.html',
  styleUrl: './brands-admin.component.css'
})
export class BrandsAdminComponent {
  brands: Brands[] = [];
    selectedBrand: Brands = {} as Brands;
    visibleDialog:boolean = false;
    addDialog: boolean = false;
  viewDialog: boolean = false;
  deactivateDialog: boolean = false;
  filters = {
    isActive: null as boolean | null
  }

    addBrandContent = {
      brandName: '',
      brandImage: ''
    }

    first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;


    constructor(private brandsService: BrandsService) {}

    ngOnInit(): void {
      this.loadBrand();
    }

  loadBrand(page: number = 0, size: number = 10): void {
    this.brandsService.getAllBrandsByFilter(page, size, this.filters.isActive ?? null)
      .subscribe((res) => {
        this.brands = res.content;
        this.totalRecords = res.totalElements;
      });
  }



  //Add Product
   addBrand() {
    this.addBrandContent = {
      brandName: '',
      brandImage: ''

    }
    this.addDialog = true;
  }

  saveBrand() {
    this.brandsService.addBrand(this.addBrandContent).subscribe(
      (response) => {
        console.log('Marca agregada:', response);
        this.loadBrand();
        this.addDialog = false;
      },
      (error) => {
        console.error('Error al agregar Marca:', error);
      }
    );
  }

    //Edit Brand
    editBrand(brand: Brands) {
      this.selectedBrand = { ...brand };
      this.visibleDialog = true;
    }

    updateBrand() {
      const updatedBrand = {
        ...this.selectedBrand,
        idBrand: this.selectedBrand.idBrand,
      };

      console.log('Marcas antes de actualizar:', this.selectedBrand);

      this.brandsService.updateBrand(this.selectedBrand.idBrand, updatedBrand).subscribe(() => {
        console.log('Marca actualizada');
        this.visibleDialog = false;
        this.loadBrand();
      })
      }

         // Desactivate Categories

         deactivateBrand(brands: Brands) {
          console.log('Marca recibida', brands);
            this.selectedBrand = { ...brands };
            this.deactivateDialog = true;
          }

         deleteBrand() {
           const deactivateCategory = {
             ...this.selectedBrand
           };

           this.brandsService.deactivateBrand(this.selectedBrand.idBrand).subscribe(() => {
             console.log('Marca desactivada');
             this.deactivateDialog = false;
             this.loadBrand();
           })
         }

         onPageChange(event: any): void {
          this.first = event.first;
          this.rows = event.rows;
          const page = event.first / event.rows;
          this.loadBrand(page, this.rows);
        }


}
