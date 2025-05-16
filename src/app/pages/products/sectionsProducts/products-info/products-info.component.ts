import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-products-info',
  imports: [],
  templateUrl: './products-info.component.html',
  styleUrl: './products-info.component.css'
})
export class ProductsInfoComponent {
  selectedCategory: string = 'Products';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedCategory = params.get('categoryName') || 'Products';
    })
  }
}
