import { Component } from '@angular/core';
import {ContactService} from '../../core/services/contact/contact.service';
import {Button, ButtonDirective} from 'primeng/button';
import {CurrencyPipe, NgIf} from '@angular/common';
import {Paginator} from 'primeng/paginator';
import {Ripple} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Dialog} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextarea} from 'primeng/inputtextarea';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-contact-admin',
  imports: [
    Button,
    Paginator,
    Ripple,
    TableModule,
    Tag,
    ButtonDirective,
    Dialog,
    DropdownModule,
    InputTextarea,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './contact-admin.component.html',
  styleUrl: './contact-admin.component.css'
})
export class ContactAdminComponent {
  contacts: any[] = [];
  statuses: any[] = [];
  selectedContact: any = {};
  editDialog: boolean = false;
  editDialogCall: boolean = false;
  viewDialog: boolean = false;
  deactivateDialog: boolean = false;

  editContactContent = {
    idContact: 0,
    idStatus: 0,
    answer: ''
  }

  filters = {
    idStatus: null as number | null
  }

  statusMap: { [key: number]: string } = {
    1: 'PENDIENTE',
    2: 'REVISADO',
    3: 'RESPONDIDO'
  };

  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;

  constructor(private contactsService: ContactService) { }

  ngOnInit(): void {
    this.loadContacts(0, this.rows);
    this.loadStatuses();
  }

  applyFilters() {
    console.log("Aplicando filtros:", JSON.stringify(this.filters, null, 2));
    this.loadContacts(0, this.rows);
  }

  loadContacts(page: number, size: number): void {
    this.contactsService.getContacts(0, 10, this.filters.idStatus ?? null).subscribe(
      (data) => {
        console.log('Contactos cargados:', data.content);
        this.contacts = data.content;
        this.totalRecords = data.totalElements;
      },
      (error) => {
        console.error('Error al cargar contactos:', error);
      }
    );
  }

  loadStatuses(): void {
    this.contactsService.getContactStatus().subscribe(
      (data) => {
        console.log('Estatus de Contactos cargados:', data);
        this.statuses = data;
      },
      (error) => {
        console.error('Error al cargar estatus de contactos:', error);
      }
    );
  }

  getSeverity(statusContact: string) {
    if (statusContact === 'RESPONDIDO') {
      return 'success';
    } else if (statusContact === 'REVISADO' || statusContact === 'PENDIENTE') {
      return 'warn';
    } else {
      return 'danger';
    }
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.first / event.rows;
    this.loadContacts(page, this.rows);
  }

  // Edit Contact
  editContact(contact: any) {
    this.editContactContent = {
      idContact: contact.idContact,
      idStatus: contact.idStatus,
      answer: contact.answer
    };
    console.log('Contacto editado:', this.editContact);
    this.editDialog = true;
  }

  updatedContact() {
    const updatedContact = {
      ...this.editContactContent,
    }

    console.log('Contacto antes de actualizar:', updatedContact);
    this.contactsService.updateContact(
      this.editContactContent.idContact,
      3,
      this.editContactContent.answer).subscribe(() => {
        console.log('Contacto actualizado');
        this.editDialog = false;
        this.loadContacts(0, this.rows);
      },
      (error) => {
        console.error('Error al actualizar el contacto:', error);
      }
    );
  }

  editContactCall(contact: any) {
    this.editContactContent = {
      idContact: contact.idContact,
      idStatus: contact.idStatus,
      answer: contact.answer
    };
    console.log('Contacto editado:', this.editContact);
    this.editDialogCall = true;
  }

  updatedContactCall() {
    const updatedContactCall = {
      ...this.editContactContent,
    }

    console.log('Contacto antes de actualizar:', updatedContactCall);
    this.contactsService.updateContact(
      this.editContactContent.idContact,
      3,
      "Respondido por Llamada").subscribe(() => {
        console.log('Contacto actualizado');
        this.editDialogCall = false;
        this.loadContacts(0, this.rows);
      },
      (error) => {
        console.error('Error al actualizar el contacto:', error);
      }
    );
  }

  // View Contact
  viewContact(contact: any) {
    this.selectedContact = {...contact};
    this.viewDialog = true;

    this.contactsService.getContactById(this.selectedContact.idContact).subscribe(
      (data) => {
        console.log('Contacto obtenido:', data);
      },
      (error) => {
        console.error('Error al obtener el contacto:', error);
      }
    );
  }

  // Deactivate Contact
  deactivateContact(contact: any) {
    this.selectedContact = { ...contact };
    this.deactivateDialog = true;
  }

  deleteContact() {
    const deactivateContact = {
      ...this.selectedContact
    };

    this.contactsService.updateContact(
      this.selectedContact.idContact,
      4,
      this.selectedContact.answer
    ).subscribe(() => {
      console.log('Contacto desactivado');
      this.deactivateDialog = false;
      this.loadContacts(0, this.rows);
    })
  }
}
