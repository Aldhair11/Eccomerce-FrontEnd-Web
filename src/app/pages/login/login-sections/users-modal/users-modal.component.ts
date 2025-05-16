import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Drawer} from 'primeng/drawer';
import {Avatar} from 'primeng/avatar';
import {Ripple} from 'primeng/ripple';
import {Button} from 'primeng/button';
import {StyleClass} from 'primeng/styleclass';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-modal',
  imports: [
    CommonModule,
    Drawer,
    Button,
  ],
  templateUrl: './users-modal.component.html',
  styleUrl: './users-modal.component.css'
})
export class UsersModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar) { }

  closeModal() {
    this.close.emit();
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
        this.closeModal();
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
  activeMenu: string | null = null;

  toggleMenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }
}
