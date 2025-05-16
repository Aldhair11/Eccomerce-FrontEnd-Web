import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth/auth.service';
import {Card} from 'primeng/card';
import {Button, ButtonDirective} from 'primeng/button';
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {CartService} from '../../core/services/cart/cart.service';
import {AddressesService} from '../../core/services/users/addresses.service';
import {Dialog} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users/users.service';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-profile',
  imports: [
    Card,
    Button,
    NgClass,
    DatePipe,
    NgForOf,
    NgIf,
    Dialog,
    DropdownModule,
    FormsModule,
    InputText,
    ButtonDirective,
    RouterLink,
    Ripple
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  selectedUser: any = {};
  selectedAddress: any;
  viewDialog: boolean = false;
  editDialog: boolean = false;
  deactivateDialog: boolean = false;
  userInitial: string = "U";
  cartItems: any[] = [];
  addresses: any[] = [];
  countries: any[] = [];
  idCountry: number | null = null;
  states: any[] = [];
  idState: number | null = null;
  provinces: any[] = [];
  idProvinces: number | null = null;
  districts: any[] = [];
  idDistricts: number | null = null;

  addAddressDialog: boolean = false;
  addAddressContents: any[] = [];
  addAddressContent: {
    street_name: string;
    street_number: string;
    country: number | null;
    state: number | null;
    province: number | null;
    district: number | null;
  } = {
    street_name: '',
    street_number: '',
    country: null,
    state: null,
    province: null,
    district: null
  };

  editUserContetn = {
    idUser: 0,
    email: '',
    telephone: '',
    username: '',


  }

  constructor(private authService: AuthService,
              private cartService: CartService,
              private addressService: AddressesService,
            private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUser();
    this.userInitial = this.getUserInitial();
    this.loadCountries();
  }

  loadUser(): void {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getUserInfoFromToken().subscribe(
        (data) => {
          console.log('Información del usuario:', data);
          this.selectedUser = data;
          this.loadCartItems(data.idUser);
        },
        (error) => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    }
  }

  getUserInitial(): string {
    const token = this.authService.getToken();
    if (token) {
      const userName = this.authService.getUsernameFromToken(token) || "U";
      return userName.charAt(0).toUpperCase();
    }
    return "U";
  }

  viewInfo(user: any): void {
    this.selectedUser = { ...user };
    this.viewDialog = true;

    this.usersService.getUsersById(this.selectedUser.idUser).subscribe(
      (data) => {
        console.log("Usuario obtenido:", data);
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  // Cargar productos en el carrito
  loadCartItems(userId: number): void {
    this.cartService.getCartByUser(userId, 0, 100).subscribe(
      (response) => {
        console.log('Respuesta completa del carrito:', response);

        if (response?.content?.length > 0) {
          this.cartItems = response.content[0].cartItems.map((item: { product: { productName: any; productImg: any; productPrice: any; productDescription: any; category: any; }; quantity: any; }) => ({
            name: item.product?.productName,
            imageUrl: item.product?.productImg,
            price: item.product?.productPrice,
            description: item.product?.productDescription || 'Sin descripción',
            quantity: item.quantity,
            category: item.product?.category || 'Sin categoría'
          }));
        } else {
          this.cartItems = [];
        }

        console.log('Productos del carrito procesados:', this.cartItems);
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
      }
    );
  }

  addAddress() {
    this.addAddressContent = {
      street_name: '',
      street_number: '',
      country: this.idCountry ?? null,
      state: this.idState ?? null,
      province: this.idProvinces ?? null,
      district: this.idDistricts ?? null
    };
    this.addAddressDialog = true;
  }

  loadCountries() {
    this.addressService.getCountries().subscribe(
      data => this.countries = data,
      error => console.error('Error al cargar países', error)
    );
  }

  onCountryChange(countryId: number) {
    this.states = [];
    this.provinces = [];
    this.districts = [];
    this.addAddressContent.state = null;
    this.addAddressContent.province = null;
    this.addAddressContent.district = null;

    this.addressService.getStates(countryId).subscribe(
      data => this.states = data,
      error => console.error('Error al cargar estados', error)
    );
  }

  onStateChange(stateId: number) {
    this.provinces = [];
    this.districts = [];
    this.addAddressContent.province = null;
    this.addAddressContent.district = null;

    this.addressService.getProvinces(stateId).subscribe(
      data => this.provinces = data,
      error => console.error('Error al cargar provincias', error)
    );
  }

  onProvinceChange(provinceId: number) {
    this.districts = [];
    this.addAddressContent.district = null;

    this.addressService.getDistricts(provinceId).subscribe(
      data => this.districts = data,
      error => console.error('Error al cargar distritos', error)
    );
  }

  saveAddress() {
    if (this.addAddressContent.street_name && this.addAddressContent.street_number) {
      this.addAddressContents.push({ ...this.addAddressContent });
    }
  }

  sendSingleAddress() {
    if (this.addAddressContent.street_name && this.addAddressContent.street_number) {
      this.addAddressContents.push({ ...this.addAddressContent });
      this.sendAddresses();
    }
  }

  sendAddresses() {
    this.addressService.addAddress(this.addAddressContents).subscribe(
      response => {
        console.log('Direcciones agregadas:', response);
        this.addAddressDialog = false;
        this.addAddressContents = [];
        window.location.reload();
      },
      error => console.error('Error al agregar direcciones:', error)
    );
  }

  // Edit User
  editUser(user: any) {
    console.log('User recibido:', user);

    this.editUserContetn = {
      idUser: user.idUser,
      email: user.email,
      username: user.username,
      telephone: user.phoneNumber
    };

    console.log("Usuario preparado para editar:", this.editUser);
    this.editDialog = true;
  }

  updatedUser() {
    const updatedUser = {
      ...this.editUserContetn
    };
    console.log("Usuario antes de actualizar:", updatedUser);

    this.usersService.updatedUsers(updatedUser.idUser, updatedUser).subscribe(() => {
      console.log('Usuario Actualizado');
      this.editDialog = false;
      this.loadUser();
    })
  }

  //delete Address
  deleteLogAddressDialog(address: any) {
    this.selectedAddress = { ...address };
    this.deactivateDialog = true;
  }

  deleteAddress() {
    if (!this.selectedAddress || !this.selectedAddress.idAdress) {
      console.error('No hay dirección seleccionada para eliminar.');
      return;
    }

    this.addressService.deleteAddress(this.selectedAddress.idAdress).subscribe(() => {
      console.log('Dirección eliminada');
      this.deactivateDialog = false;
      this.loadUser();
    }, (error) => {
      console.error('Error al eliminar la dirección:', error);
    });
  }
}
