import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {Ripple} from 'primeng/ripple';
import {InputText} from 'primeng/inputtext';
import { NgClass} from '@angular/common';
import { FaqService } from '../../core/services/faq/faq.service';
import { Faq } from '../../Models/faq.model';
import { Paginator } from 'primeng/paginator';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-faq-admin',
  imports: [ButtonModule, TableModule, DialogModule, CommonModule, FormsModule, Ripple, InputText, Paginator, DropdownModule],
  templateUrl: './faq-admin.component.html',
  styleUrl: './faq-admin.component.css'
})
export class FaqAdminComponent {
  faqs: any[] = [];
  selectedFaqs: any = {};
  visibleDialog:boolean = false;
  addDialog: boolean = false;
  viewDialog: boolean = false;
  deactivateDialog: boolean = false;

  filters = {
    isActive: null as boolean | null
  }

  editFaq = {
    idFaq: 0,
    question: '',
    answer: ''
  };

  addFaqContent = {
    question: '',
    answer: ''
  }

  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;



    constructor(private faqService: FaqService) {}

    ngOnInit(): void {
      this.loadFaqs();
    }

  loadFaqs(page: number = 0, size: number = 10): void {
    this.faqService.getAllFaq(page, size, this.filters.isActive ?? null)
      .subscribe((res) => {
        console.log('FAQ cargados:', res);
        this.faqs = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  //Add Faq
     addFaq() {
    this.addFaqContent = {
      question: '',
      answer: '',
    }
    this.addDialog = true;
  }

  saveFaq() {
    this.faqService.addFaq(this.addFaqContent).subscribe(
    (response) => {
    console.log('FAQ agregada:', response);
    this.loadFaqs();
    this.addDialog = false;
    },
    (error) => {
    console.error('Error al agregar FAQ:', error);
    }
    );
  }

    //Edita
  editFaqs(faqs: any) {
    this.selectedFaqs = { ...faqs };
    this.editFaq = {
      idFaq: faqs.idFaq,
      question: faqs.questionFaq,
      answer: faqs.answerFaq
    };
    console.log('FAQ editado:', this.editFaq);
    this.visibleDialog = true;
  }


  updateFaqs() {
    const updatedFaqs = {
      ...this.editFaq,
    };

    console.log('FAQ antes de actualizar:', updatedFaqs);

    this.faqService.updateFaqs(
      updatedFaqs.idFaq,
      updatedFaqs
    ).subscribe(() => {
        console.log('FAQ actualizado');
        this.visibleDialog = false;
        this.loadFaqs();
      },
      (error) => {
        console.error('Error al actualizar el FAQ:', error);
      }
    );
  }

  // Deactivar FAQ
  deactivateFaq(faq: Faq) {
    this.selectedFaqs = { ...faq };
    this.deactivateDialog = true;
  }

  deleteFaq() {
    const deactivateFaq = {
      ...this.selectedFaqs
    };

    this.faqService.deactivateFaq(this.selectedFaqs.idFaq).subscribe(() => {
      console.log('FAQ desactivado');
      this.deactivateDialog = false;
      this.loadFaqs();
      }
    );
  }


  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.first / event.rows;
    this.loadFaqs(page, this.rows);
  }

}
