import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartService} from '../../../../core/services/cart/cart.service';
import {ButtonDirective} from 'primeng/button';
import { jwtDecode } from 'jwt-decode';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {RouterLink} from '@angular/router';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart-info',
  imports: [CommonModule, ButtonDirective, RouterLink],
  templateUrl: './cart-info.component.html',
  styleUrl: './cart-info.component.css'
})
export class CartInfoComponent implements OnInit {
  cart: any = {};
  subtotal: number = 0;

  constructor(private cartService: CartService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserInfoFromToken().subscribe({
      next: (user: any) => {
        if (!user || !user.idUser) {
          console.error('El usuario autenticado no tiene un ID válido');
          return;
        }

        this.cartService.getCartByUser(user.idUser).subscribe(response => {
          console.log('Respuesta del servicio:', response);

          if (response && response.content && response.content.length > 0) {
            this.cart = response.content[0];
            console.log('Carrito actualizado:', this.cart);
            this.calcularSubtotal();
          } else {
            console.warn('No se encontraron items en el carrito.');
          }
        });
      },
      error: (error) => {
        console.error('Error obteniendo el usuario:', error);
      }
    });
  }

  updateQuantity(cartItem: any, change: number) {
    const newQuantity = cartItem.quantity + change;

    if (newQuantity < 1) {
      if (!confirm("¿Deseas eliminar este producto del carrito?")) {
        return;
      }

      this.cartService.deleteCartItem(cartItem.idCartItem).subscribe(() => {
        this.cart.cartItems = this.cart.cartItems.filter(
          (item: { idCartItem: any; }) => item.idCartItem !== cartItem.idCartItem
        );
        this.calcularSubtotal();
      });

      return;
    }

    this.cartService.updateCartItemQuantity(cartItem.idCartItem, newQuantity)
      .subscribe(updatedItem => {
        if (updatedItem) {
          cartItem.quantity = updatedItem.quantity;
          cartItem.subTotal = updatedItem.subTotal;
        } else {
          this.cart = this.cart.filter((item: { idCartItem: any; }) => item.idCartItem !== cartItem.idCartItem);
        }
        this.calcularSubtotal();
      });
  }

  calcularSubtotal() {
    if (this.cart.cartItems) {
      this.subtotal = this.cart.cartItems.reduce(
        (acc: number, item: { product: { productPrice: any; }; quantity: any; }) =>
          acc + ((item.product?.productPrice || 0) * (item.quantity || 1)), 0
      );

      this.cart.total = this.subtotal;
    }
  }
}
