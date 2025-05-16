import { Component } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {ContactService} from '../../../../core/services/contact/contact.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [IconFieldModule, InputIconModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {

  newContactForm = {
    names: '',
    lastname: '',
    social_reason: '',
    email: '',
    dniRuc: '',
    telephone: '',
    message: '',
    is_agree: false
  }

  constructor(private contactService: ContactService) { }

  submitContactForm(): void {
    if (!this.newContactForm.is_agree) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    this.contactService.registerContactForm(this.newContactForm).subscribe(
      (response) => {
        console.log('Nuevo Contacto registrado: ', response);
        alert('Nuevo Contacto registrado con éxito.');
        window.location.reload();
      },
      (error) => {
        console.error('Error al registrar el nuevo Contacto:', error);
        alert('Error al registrar el nuevo Contacto.');
      }
    );
  }
}
