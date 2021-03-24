import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/products/product';
import { ProductFilter } from '../../shared/filters/product-filter';
import { ProductService } from '../../shared/services/productservice/product.service';
import { StatusProduct } from '../../shared/Utils/status-product';
import { Generalsection } from '../../shared/view-models/generalsection.viewmodel';

@Component({
  selector: 'barproduct',
  templateUrl: './barproduct.component.html',
  styleUrls: ['./barproduct.component.scss']
})
export class BarproductComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  @Input("_statusproduct") _statusproduct : number = 0;
  @Output() StatusProductChange = new EventEmitter<number>();
  @Input("_product") _product : Product;
  @Input("complete") complete : number = 0;
 statusproduct: typeof StatusProduct = StatusProduct;
 
  constructor() { }

  ngOnInit(): void {
    
  }

  
}
