import { Component } from '@angular/core';
import { FAQImageComponent } from './sectionsAbout/faq-image/faq-image.component';
import { FAQInfoComponent } from './sectionsAbout/faq-info/faq-info.component';


@Component({
  selector: 'app-about',
  imports: [FAQImageComponent, FAQInfoComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
