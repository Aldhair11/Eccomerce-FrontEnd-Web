import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-slider-img',
  imports: [CarouselModule, CommonModule],
  templateUrl: './home-slider-img.component.html',
  styleUrl: './home-slider-img.component.css'
})
export class HomeSliderImgComponent {
  images: string[] = [
    'https://i.imgur.com/IGcpG4E.jpg',
    'https://i.imgur.com/IGcpG4E.jpg',
    'https://i.imgur.com/IGcpG4E.jpg'
  ]

  responsiveOptions: any[] | undefined;


  ngOnInit() {
    this.responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ]
  }
  
}
