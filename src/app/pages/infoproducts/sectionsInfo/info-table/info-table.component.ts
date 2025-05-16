import {Component, Input, OnInit} from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ProductsService } from '../../../../core/services/products/products.service';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-info-table',
  imports: [TabsModule, TableModule, NgIf],
  templateUrl: './info-table.component.html',
  styleUrl: './info-table.component.css'
})
export class InfoTableComponent implements OnInit{
  @Input() idProduct!: number;
  productData: any = {};
  characteristics: any[] = [];
  attributes: any[] = [];
  pdfFileUrl: string = '';

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    if (this.idProduct) {
      this.loadProductData(this.idProduct);
    } else {
      console.warn("⚠️ No se recibió idProduct, no se cargan datos.");
    }
  }

  loadProductData(idProduct: number): void {
    this.productService.getProductsById(idProduct).subscribe(
      (data) => {
        console.log(" Datos del producto recibidos:", data);
        this.productData = data;
        this.characteristics = data.characteristics || [];
        this.attributes = data.attributes || [];
        if (data.pdfFile) {
          this.pdfFileUrl = data.pdfFile;
          console.log("PDF encontrado:", this.pdfFileUrl);
        } else {
          console.warn("No se encontró pdfFile en la respuesta del backend.");
        }
      },
      (error) => console.error("Error al cargar datos del producto:", error)
    );
    
  }
  
}