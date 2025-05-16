import { Component } from '@angular/core';
import { LoginModalComponent } from './login-sections/login-modal/login-modal.component';



@Component({
  selector: 'app-login',
  imports: [LoginModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLoginModal = false;

  openLoginModal() {
    this.showLoginModal = true;
  }

}
