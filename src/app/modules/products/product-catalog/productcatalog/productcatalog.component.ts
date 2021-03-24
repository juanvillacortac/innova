import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { ProductcatalogService } from '../../shared/services/productcatalogservice/productcatalog.service';
import { ProductCatalog } from '../../shared/view-models/product-catalog.viewmodel';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-productcatalog',
  templateUrl: './productcatalog.component.html',
  styleUrls: ['./productcatalog.component.scss'],
  providers: [DatePipe]
})
export class ProductcatalogComponent implements OnInit {

  showFilters : boolean = true;
  loading : boolean = false;
  submitted: boolean;
  productcatalogFilters: ProductcatalogFilter = new ProductcatalogFilter();
  productcatalogModel: ProductCatalog = new ProductCatalog();
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<ProductCatalog>[] =
  [
   /* {template: (data) => { return data.productId; }, header: 'Id',field: 'Id', display: 'none'}, */
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.barcode; },field: 'barcode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.status; },field: 'status', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.structureType; },field: 'structureType', header: 'Estructura', display: 'table-cell'},
   {template: (data) => { return data.internalRef; },field: 'internalRef', header: 'Ref. Interna', display: 'table-cell'},
   {template: (data) => { return data.factoryRef; },field: 'factoryRef', header: 'Ref. Fábrica', display: 'table-cell'},
   {template: (data) => { return data.category; },field: 'category', header: 'Categoría', display: 'table-cell'},
   {template: (data) => { return data.classification; },field: 'classification', header: 'Clasificación', display: 'table-cell'},
   {template: (data) => { return data.brand; },field: 'brand', header: 'Marca', display: 'table-cell'},
   {template: (data) => { return this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); },field: 'dateCreate', header: 'Fecha creación', display: 'table-cell'},
   {template: (data) => { return this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha actualización', display: 'table-cell'}
  ];
  _selectedColumns: any[];

  constructor(public _productcatalogservice: ProductcatalogService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private router: Router,
    public datepipe: DatePipe) { 
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'MPC' },
        { label: 'Catalogo del producto', routerLink: ['/productcatalog-list'] }
      ]);
    }

  ngOnInit(): void {
    this.productcatalogFilters.productTypeId = 1;
    this.productcatalogFilters.structureTypeId = 1;
    this.productcatalogFilters.indHeavy = 0;
    this._selectedColumns = this.displayedColumns
    this.search();
  }

  search(){
    this.loading = true;
    this._productcatalogservice.getProductCatalogbyfilter(this.productcatalogFilters).subscribe((data: ProductCatalog[]) => {
      var dat: any[] = data;
      this._productcatalogservice._ProductCatalogList = dat.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los productos"});
    });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
  }

  openNew = () => {
    this.router.navigate(['productgeneralsection', 0]);
  }
  
  async onEdit(id) {
    this.router.navigate(['productgeneralsection', id]);
  }
}
