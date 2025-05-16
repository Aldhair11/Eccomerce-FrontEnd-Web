import { Output } from '@angular/core';
import { Component, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login-modal',
  imports: [FormsModule, NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})

export class LoginModalComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  rememberPassword = false;
  showPassword: boolean = false;

  isRegistering = false;

  user: any = {
    names: '',
    lastnames: '',
    dni: '',
    socialReason: '',
    telephone: '',
    email: '',
    username: '',
    password: '',
    birthDate: ''
  };


  idRole: number = 3;

  @Output() closeModal = new EventEmitter<void>();

  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private fb: FormBuilder) {}

  private showSnackBar(message: string, type: string = 'snackbar-success') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [type]
    });
  }

  ngOnInit() {
    this.loadRememberedCredentials();
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (this.rememberPassword) {
          this.saveRememberMe();
        }
        this.showSnackBar('Sesión iniciada con éxito');
        this.authService.saveToken(response.token);

        window.location.reload();
      },
      (err) => {
        this.errorMessage = err.error.message || 'Ocurrió un error en el inicio de sesión.';
        this.showSnackBar(this.errorMessage, 'error-snackbar');
        console.log('Login error', err);
      }
    ).add(() => this.isLoading = false);
  }

  loadRememberedCredentials() {
    const savedRemember = localStorage.getItem('rememberPassword') === 'true';
    this.rememberPassword = savedRemember;

    if (savedRemember) {
      this.username = localStorage.getItem('savedUsername') || '';
      this.password = localStorage.getItem('savedPassword') || '';
    }
  }

  saveRememberMe() {
    if (this.rememberPassword) {
      localStorage.setItem('rememberPassword', 'true');
      localStorage.setItem('savedUsername', this.username);
      localStorage.setItem('savedPassword', this.password);
    } else {
      localStorage.removeItem('rememberPassword');
      localStorage.removeItem('savedUsername');
      localStorage.removeItem('savedPassword');
    }
  }

  register() {
    console.log('Datos del usuario antes de enviar:', this.user);

    if (
      !this.user.username ||
      !this.user.password ||
      !this.user.email ||
      !this.user.names ||
      !this.user.lastnames ||
      !this.user.dni ||
      !this.user.socialReason ||
      !this.user.telephone ||
      !this.user.birthDate
    ) {
      console.warn('Faltan datos para registrar usuario.');
      return;
    }

    this.authService.registerUser(this.user, this.idRole).subscribe({
      next: (response) => {
        console.log("Registro exitoso: ", response);
        alert("Registro exitoso.");
        window.location.reload();
      },
      error: (error) => {
        console.error("Error al registrar usuario: ", error);
        alert("Error al registrar usuario.");
      }
    });
  }


  close() {
    console.log("Cerrando modal...");
    this.closeModal.emit();
  }

  toggleForm(): void {
    this.isRegistering = !this.isRegistering;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
