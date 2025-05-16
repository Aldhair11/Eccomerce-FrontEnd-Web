import {Component, OnInit} from '@angular/core';
import { InfoNameComponent } from './sectionsInfo/info-name/info-name.component';
import { InfoTableComponent } from './sectionsInfo/info-table/info-table.component';

import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-infoproducts',
  standalone: true,
  imports: [InfoNameComponent,InfoTableComponent],
  templateUrl: './infoproducts.component.html',
  styleUrl: './infoproducts.component.css'
})
export class InfoproductsComponent implements OnInit {
  idProduct: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idProduct = Number(params.get('idProduct'));
      console.log("✅ idProduct recibido de la URL:", this.idProduct);
    });
  }
}
