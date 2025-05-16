import {Component} from '@angular/core';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {Button} from 'primeng/button';
import {AuthService} from '../../core/services/auth/auth.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-passwordrecovery',
  imports: [
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    Button,
    FormsModule,
    NgIf
  ],
  templateUrl: './passwordrecovery.component.html',
  styleUrl: './passwordrecovery.component.css'
})
export class PasswordrecoveryComponent {
  sendEmail = {
    email: ''
  }

  changePassword = {
    code: '',
    password: ''
  }
  errorMessage: string = '';

  currentStep: number = 1;

  constructor(private authService: AuthService,
              private router: Router) { }

  submitEmail() {
    this.errorMessage = '';
    this.authService.sendRecoveryCode(this.sendEmail.email).subscribe(
      (response) => {
        console.log('Email enviado:', response);
        this.nextStep();
      },
      (error) => {
        console.error('Error al enviar el email:', error);
        this.errorMessage = error.error?.message || 'Ocurrió un error. Inténtalo nuevamente.';
      }
    );
  }

  submitChangePassword() {
    this.errorMessage = '';
    this.authService.changePassword(this.changePassword.code, this.changePassword.password).subscribe(
      (response) => {
        console.log('Contraseña cambiada:', response);
        this.router.navigate(['/home']).then(r => false);
      },
      (error) => {
        console.error('Error al cambiar la contraseña:', error);
        this.errorMessage = error.error?.message || 'Ocurrió un error. Inténtalo nuevamente.';
      }
    );
  }

  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
