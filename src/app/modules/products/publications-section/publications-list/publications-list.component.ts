import { Component, Input, OnInit } from '@angular/core';
import { Publication } from 'src/app/models/products/publication';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PublicationService } from '../../shared/services/publicationservice/publication.service';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PublicationFilter } from '../../shared/filters/publication-filter';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'publications-list',
  templateUrl: './publications-list.component.html',
  styleUrls: ['./publications-list.component.scss'],
  providers: [DatePipe]
})
export class PublicationsListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  publicationDialog: boolean = false;
  publicationId : PublicationFilter = new PublicationFilter();
  publicationModel: Publication = new Publication();
  publicationFilters: PublicationFilter = new PublicationFilter();
  @Input("idproduct") idproduct : number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Publication>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.nameInsert; },field: 'nameInsert', header: 'Tipo de encarte', display: 'table-cell'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre del catalágo', display: 'table-cell'},
   {template: (data) => { return data.page; },field: 'page', header: 'Página', display: 'table-cell'},
   {template: (data) => { return this.datepipe.transform(data.createdDate, "dd/MM/yyyy");},field: 'createdDate', header: 'Fecha de creación', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'}
    
  //  {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];
  
  constructor(public _publicationservice: PublicationService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    public datepipe: DatePipe,) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Publicaciones', routerLink: ['/publication-product'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this.publicationFilters.productId= this.idproduct;
    this._publicationservice.getPublications(this.publicationFilters).subscribe((data: Publication[]) => {
      this._publicationservice._publicationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las publicaciones."});
    });
  }

  onEdit(id: number, insertTypeid: number, name: string, page:number, active: boolean) {
    this.publicationModel = new Publication();
    this.publicationModel.id = id;
    this.publicationModel.name = name;
    this.publicationModel.insertId= insertTypeid;
    this.publicationModel.page= page;
    this.publicationModel.active = active;
    this.publicationDialog = true;
  }
}
