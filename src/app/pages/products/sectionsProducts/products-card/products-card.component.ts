import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductsService} from '../../../../core/services/products/products.service';

@Component({
  selector: 'app-products-card',
  imports: [CommonModule],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css'
})
export class ProductsCardComponent {
}
