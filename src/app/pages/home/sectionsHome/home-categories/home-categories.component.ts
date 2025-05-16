import { Component } from '@angular/core';
import {CategoriesService} from '../../../../core/services/products/categories.service';
import {NgFor} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-categories',
  imports: [NgFor, RouterLink],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css'
})
export class HomeCategoriesComponent {
  categories: any[] = [];

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getCategories(0, 4, true).subscribe(
      response => {
        this.categories = response.content.map(category => ({
          image: category.categoryImage,
          label: category.categoryName,
          value: category.idCategory
        }));
        console.log('Categorías obtenidas: ', this.categories);
      },
      error => {
        console.log('Error al obtener categorías: ', error);
      }
    );
  }

}
