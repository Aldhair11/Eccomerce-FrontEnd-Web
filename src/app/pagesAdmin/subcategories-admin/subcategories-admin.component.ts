import { Component } from '@angular/core';
import { SubcategoriesService } from '../../core/services/products/subcategories.service';
import { Subcategories } from '../../Models/subcategories.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Paginator } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {Ripple} from 'primeng/ripple';
import {InputText} from 'primeng/inputtext';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-subcategories-admin',
  imports: [TableModule, ButtonModule, Paginator, DialogModule, FormsModule, Ripple, InputText, NgIf, NgForOf, NgClass, DropdownModule],
  templateUrl: './subcategories-admin.component.html',
  styleUrl: './subcategories-admin.component.css'
})
export class SubcategoriesAdminComponent {

  subcategories: any[] = [];
  attributes: any[] = [];
  selectdSubCategory: any = [];
  visibleDialog:boolean=false;
  attributesDialog: boolean = false;
  addDialog:boolean=false;
  viewDialog:boolean=false;
  deactivateDialog:boolean=false;
  filters = {
    isActive: null as boolean | null
  }

  editSubCategories = {
    idSubCategory: 0,
    subCategoryName: '',
  };

  addSubcategoryContent = {
    subCategoryName: ''
  }

  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;

   constructor(private subcategoriesService: SubcategoriesService) {}

   ngOnInit(): void {
    this.loadSubCategory();
  }

  loadSubCategory(page: number = 0, size: number = 10): void {
    this.subcategoriesService.getAllSubCategories(page, size, this.filters.isActive ?? null)
      .subscribe((res) => {
        console.log('Sub-Categorias cargados:', res);
        this.subcategories = res.content;
        this.totalRecords = res.totalElements;
      });
  }

   //Add SubCategories
   addSubCategory() {
    this.addSubcategoryContent = {
      subCategoryName: '',
    }
    this.addDialog = true;
  }

  saveSubCategory() {
    this.subcategoriesService.addSubCategory(this.addSubcategoryContent).subscribe(
    (response) => {
    console.log('Sub-Categoria agregada:', response);
    this.loadSubCategory();
    this.addDialog = false;
    },
    (error) => {
    console.error('Error al agregar Sub-categoria:', error);
    }
    );
  }

   //Edita
  editSubCategory(subcategories: any) {
    this.selectdSubCategory = { ...subcategories };
    this.editSubCategories = {
      idSubCategory: subcategories.idSubCategory,
      subCategoryName: subcategories.subCategoryName,
    };
    console.log('SubCategoria editada:', this.editSubCategories);
    this.visibleDialog = true;
  }


  updateSubCategory() {
    const updateSubCategory = {
      ...this.editSubCategories,
    };

    console.log('SubCategoria antes de actualizar:', updateSubCategory);

    this.subcategoriesService.updateSubCategory(
      updateSubCategory.idSubCategory,
      updateSubCategory
    ).subscribe(() => {
        console.log('SubCategoria actualizado');
        this.visibleDialog = false;
        this.loadSubCategory();
      },
      (error) => {
        console.error('Error al actualizar el SubCategoria:', error);
      }
    );
  }

   // Desactiva
    deactivateSubCategory(subcategories: Subcategories) {
      this.selectdSubCategory = { ...subcategories };
      this.deactivateDialog = true;
    }

    deleteSubCategory() {
      const deactivateSubCategory = {
        ...this.selectdSubCategory
      };

      this.subcategoriesService.deactivateSubCategory(this.selectdSubCategory.idSubCategory).subscribe(() => {
        console.log('SubCategoria desactivada');
        this.deactivateDialog = false;
        this.loadSubCategory();
        }
      );
    }


    onPageChange(event: any): void {
      this.first = event.first;
      this.rows = event.rows;
      const page = event.first / event.rows;
      this.loadSubCategory(page, this.rows);
    }


  showAttributes(subcategory: any) {
    this.attributes = subcategory.attributes || [];
    this.attributesDialog = true;
  }

}
