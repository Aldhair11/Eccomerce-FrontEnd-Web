import { Component } from '@angular/core';
import { ProductsFilterComponent } from './sectionsProducts/products-filter/products-filter.component';
import { ProductsCardComponent } from './sectionsProducts/products-card/products-card.component';
import { ProductsInfoComponent } from './sectionsProducts/products-info/products-info.component';

@Component({
  selector: 'app-products',
  imports: [ProductsInfoComponent, ProductsFilterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

}
