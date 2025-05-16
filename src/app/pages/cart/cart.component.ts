import { Component } from '@angular/core';
import { CartInfoComponent } from './sectionsCart/cart-info/cart-info.component';

@Component({
  selector: 'app-cart',
  imports: [CartInfoComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

}
