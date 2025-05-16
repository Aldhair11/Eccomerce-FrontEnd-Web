import {Component, OnInit, EventEmitter, ViewChild} from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTableDataSource} from "@angular/material/table";
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../core/services/products/products.service';
import { Products } from '../../Models/products.model';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { Output } from '@angular/core';
import { LoginModalComponent } from "../login/login-sections/login-modal/login-modal.component";
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {AutoComplete} from 'primeng/autocomplete';
import {InputGroupModule} from 'primeng/inputgroup';
import {Avatar} from 'primeng/avatar';
import {Toast} from 'primeng/toast';
import {ConfirmPopup} from 'primeng/confirmpopup';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgFor,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    RouterModule,
    InputGroupModule,
    AutoComplete,
    Avatar,
    ConfirmPopup,
  ]

})
export class HeaderComponent implements OnInit{
  @Output() openUserDrawer = new EventEmitter<void>();

  @Output() openLogin = new EventEmitter<void>();
  @ViewChild('confirmPopup') confirmPopup: any;

  isLoggedIn: boolean = false;
  userInitial: string = '';
  userRole: string = '';

  openLoginModal() {
    console.log("Abiendo Modal...");
    this.openLogin.emit();
  }

  menuItems = [
    { label: 'Inicio', link: '/home' },
    { label: 'Nosotros', link: '/about' },
    { label: 'Categorias', link: '/categories' },
    { label: 'FAQ', link: '/FAQ' },
    { label: 'Contacto', link: '/contact' }
  ];

  filters = {
    page: 0,
    size: 10,
    searchTerms: '' };
  products: any[] = [];
  filteredProducts: any[] = [];

  dataSource = new MatTableDataSource<Products>();

  menuOpen = false;

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private productsService: ProductsService,
              private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.search();
    this.checkUser();
    this.getUserRole();
  }

  getUserRole(): void {
    this.authService.getUserInfoFromToken().subscribe(
      (userInfo) => {
        console.log('Información del usuario:', userInfo);
        this.userRole = userInfo.roleName;
      },
      (error) => {
        console.error('Error obteniendo el usuario:', error);
      }
    )
  }

  handleAvatarClick(event: Event): void {
    if (this.userRole === 'ADMIN' || this.userRole === 'PERSONAL') {
      this.openUserDrawer.emit();
    } else if (this.userRole === 'USUARIO') {
      this.showConfirmPopup(event);
    }
  }

  showConfirmPopup(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Opciones de usuario',
      icon: 'pi pi-user',
      acceptLabel: 'Perfil',
      rejectLabel: 'Cerrar sesión',
      accept: () => this.goToProfile(),
      reject: () => this.logout()
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Logout
  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        this.snackBar.open('Closing session', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        console.log('Logout successfull', response);
        sessionStorage.removeItem('authToken');
        window.location.reload();
      },
      (error) => {
        this.snackBar.open('Error logging out', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        console.error('Logout error', error);
      }
    );
  }

  // Navigation - Hamburguer
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }


  closeMenu(): void {
    this.menuOpen = false;
  }

  cerrarMenu() {
    this.menuOpen = false;
  }

  checkUser() {
    const token = this.authService.getToken();
    if (token) {
      this.isLoggedIn = true;
      const username = this.authService.getUsernameFromToken(token);
      this.userInitial = username ? username.charAt(0).toUpperCase() : '';
    } else {
      this.isLoggedIn = false;
      this.userInitial = '';
    }
  }


  // Filter Products for Search Input
  search(event?: any): void {
    const searchTerm = event?.query?.trim().toLowerCase() || '';
    console.log("🔎 Término de búsqueda:", searchTerm);

    this.productsService.getProductsFilter(null, null, null, null, null, null, null, null, null, 0, 10, this.filters.searchTerms)
      .subscribe(
        (data) => {
          console.log("📢 Respuesta de la API:", data);
          console.log("🔍 Datos de content:", data.content);

          if (data && Array.isArray(data.content) && data.content.length > 0) {
            this.filteredProducts = data.content.map((producto: any) => ({
              id: producto.idProduct,
              productName: producto.productName,
              category: producto.categoryName,
              imageUrl: producto.productImg,
              price: producto.productPrice,
            }));
          } else {
            console.warn("⚠️ No se encontraron productos en content.");
            this.filteredProducts = [];
          }

          console.log("🔍 Productos filtrados:", this.filteredProducts);
        },
        (error) => {
          console.error("❌ Error al buscar productos:", error);
        }
      );
  }

  goToProduct(product: any): void {
    const url = `/${product.category}/products/${product.id}`;
    this.router.navigateByUrl(url).then(() => {
      window.location.reload();
    });
  }
}
