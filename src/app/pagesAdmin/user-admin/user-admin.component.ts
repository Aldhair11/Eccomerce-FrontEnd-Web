import { Component } from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {UsersService} from '../../core/services/users/users.service';
import {Tag} from 'primeng/tag';
import {NgClass} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Paginator} from 'primeng/paginator';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {AuthService} from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-admin',
  imports: [
    Button,
    Ripple,
    TableModule,
    NgClass,
    ButtonDirective,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    Paginator,
    Dialog,
    InputText,
  ],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css'
})
export class UserAdminComponent {
  users: [] = [];
  viewDialog: boolean = false;
  addDialog: boolean = false;
  editDialog: boolean = false;
  deactivateDialog: boolean = false;
  selectedUser: any = {};
  roles: [] = [];

  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;

  filters = {
    searchTerms: '',
    roleId: null as number | null,
    isActive: null as boolean | null
  }

  addUserContet = {
    names: '',
    lastnames: '',
    dni: '',
    socialReason: '',
    telephone: '',
    email: '',
    birthDate: '',
    password: '',
    username: '',
    role: 0,
  }

  editUserContetn = {
    idUser: 0,
    role: 0,
    username: '',
    isActive: true
  }

  statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];


  constructor(private usersService: UsersService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers(0, this.rows);
    this.loadRoles();
  }

  applyFilters() {
    console.log("Aplicando filtros:", JSON.stringify(this.filters, null, 2));
    this.loadUsers(0, this.rows);
  }

  resetFilters() {
    this.filters = {
      searchTerms: '',
      roleId: null,
      isActive: null
    }
    this.loadUsers(0, this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.first / event.rows;
    this.loadUsers(page, this.rows);
  }

  // Listado de Usuarios
  loadUsers(page: number, size: number): void {
    console.log("Filtros aplicados:", JSON.stringify(this.filters, null, 2));

    this.usersService.getUsersFilters(
      this.filters.searchTerms || null,
      this.filters.roleId || null,
      this.filters.isActive ?? null,
      page,
      size
    ).subscribe({
      next: (data) => {
        console.log("Usuarios cargados:", data.content);
        this.users = data.content;
        this.totalRecords = data.totalElements;
      },
      error: (error) => {
        console.error("Error al cargar usuarios:", error);
      }
    });
  }

  loadRoles(): void {
    this.usersService.getRoles().subscribe({
      next: (data) => {
        console.log("Roles cargados:", data);
        this.roles = data;
      },
      error: (error) => {
        console.error("Error al cargar roles:", error);
      }
    });
  }


  //Información del usuario
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

  // Add User
  addUser() {
    this.addUserContet = {
      names: '',
      lastnames: '',
      dni: '',
      socialReason: '',
      telephone: '',
      email: '',
      birthDate: '',
      password: '',
      username: '',
      role: 0,
    }
    this.addDialog = true;
  }

  saveUser() {
    this.authService.registerUser(this.addUserContet, this.addUserContet.role).subscribe(
      (response) => {
        console.log('Usuario registrado:', response);
        this.addDialog = false;
        this.loadUsers(0, this.rows);
      },
      (error) => {
        console.error('Error al registrar el usuario:', error);
      }
    );
  }



  // Edit User
  editUser(user: any) {
    console.log('User recibido:', user);

    this.editUserContetn = {
      idUser: user.idUser,
      role: typeof user.idRole === 'object' ? (user.idRole as any).roleId ?? 0 : user.idRole ?? 0,
      username: user.username,
      isActive: user.isActive
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
      this.loadUsers(0, this.rows);
    })
  }

  // Desactivar Usuario
  deactivateUser(user: any) {
    this.selectedUser = { ...user };
    this.deactivateDialog = true;
  }

  deleteUser() {
    const deactivateUser = {
      ...this.selectedUser
    };

    this.usersService.deactivateUser(this.selectedUser.idUser).subscribe(() => {
      console.log('Usuario desactivado');
      this.deactivateDialog = false;
      this.loadUsers(0, this.rows);
    })
  }
}
