import { Component } from '@angular/core';
import { HomeSliderImgComponent } from './sectionsHome/home-slider-img/home-slider-img.component';
import { CarouselModule } from 'primeng/carousel';
import { HomeBrandsComponent } from "./sectionsHome/home-brands/home-brands.component";
import { HomeOffersCardComponent } from "./sectionsHome/home-offers-card/home-offers-card.component";
import { HomeIconsInfoComponent } from './sectionsHome/home-icons-info/home-icons-info.component';
import { HomeCategoriesComponent } from './sectionsHome/home-categories/home-categories.component';
import { HomeNewsletterComponent } from './sectionsHome/home-newsletter/home-newsletter.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeSliderImgComponent, CarouselModule, HomeBrandsComponent, HomeOffersCardComponent, HomeIconsInfoComponent,HomeCategoriesComponent,HomeNewsletterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
