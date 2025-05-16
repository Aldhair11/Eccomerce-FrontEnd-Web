import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./pages/header/header.component";
import { FooterComponent } from "./pages/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LoginModalComponent } from "./pages/login/login-sections/login-modal/login-modal.component";
import {UsersModalComponent} from './pages/login/login-sections/users-modal/users-modal.component';





@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FormsModule, NgIf, LoginModalComponent, UsersModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isUserModalOpen = false;
  showLoginModal = false;
  title = 'Empresa-app';


  openUserModal() {
    this.isUserModalOpen = false;
    setTimeout(() => {
      this.isUserModalOpen = true;
    }, 10);
  }

  openLoginModal() {
    console.log("Abiendo Modal...")
    this.showLoginModal = true;
  }

  closeLoginModal() {
    console.log("Cerrando modal en AppComponent...");
    this.showLoginModal = false;
  }
}
