import { Component } from '@angular/core';
import {CategoriesService} from '../../../../core/services/products/categories.service';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {Paginator} from 'primeng/paginator';

@Component({
  selector: 'app-categories-card',
  imports: [
    RouterLink,
    NgForOf,
    Paginator
  ],
  templateUrl: './categories-card.component.html',
  styleUrl: './categories-card.component.css'
})
export class CategoriesCardComponent {
  categories: any[] = [];
  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories(0, this.rows);
  }

  loadCategories(page: number, size: number): void {
    this.categoriesService.getCategories(page, size, true).subscribe(
      response => {
        this.categories = response.content.map(category => ({
          image: category.categoryImage,
          label: category.categoryName,
          value: category.idCategory
        }));
        this.totalRecords = response.totalElements;
        console.log('Categorías obtenidas: ', this.categories);
      },
      error => {
        console.log('Error al obtener categorías: ', error);
      }
    );
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.first / event.rows;
    this.loadCategories(page, this.rows);
  }
}
