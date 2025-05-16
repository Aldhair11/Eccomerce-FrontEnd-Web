import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../core/services/faq/faq.service';

@Component({
  selector: 'app-faq',
  imports: [AccordionModule, CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FAQComponent {
  tabs: any[] = [];

  constructor(private faqService: FaqService) { }

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.faqService.getAllFaq(0, 10, true).subscribe(
      response => {
        this.tabs = response.content.map((faq, index) => ({
          title: `${index + 1}. ${faq.questionFaq}`,
          content: faq.answerFaq,
          value: index.toString()
        }));
        console.log('Preguntas frecuentes obtenidas: ', this.tabs);
      },
      error => {
        console.log('Error al obtener preguntas frecuentes: ', error);
      }
    );
  }
}
