import { Component, OnInit } from '@angular/core';
import { Wastage } from 'src/app/models/masters-mpc/wastage';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { WastageFilter } from '../../shared/filters/wastage-filter';
import { WastageService } from '../../shared/services/WastageService/wastage.service';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-wastage-list',
  templateUrl: './wastage-list.component.html',
  styleUrls: ['./wastage-list.component.scss']
})
export class WastageListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  wastagesDialog: boolean = false;
  wastageId : WastageFilter = new WastageFilter();
  wastageFilters: WastageFilter = new WastageFilter();
  wastageModel: Wastage = new Wastage();
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Wastage>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   { template: (data) => {return data.abbreviation;}, header:'Abreaviatura', field:'abbreviation', display:'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
  ];
  
  constructor(public _wastageservice: WastageService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Mermas', routerLink: ['/wastage-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._wastageservice.getWastagebyfilter(this.wastageFilters).subscribe((data: Wastage[]) => {
      this._wastageservice._wastageList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las mermas."});
    });
  }

  onEdit(id: number, name: string, abbreviaton:string, active: boolean) {
    this.wastageModel = new Wastage();
    this.wastageModel.id = id;
    this.wastageModel.name = name;
    this.wastageModel.abbreviation= abbreviaton;
    this.wastageModel.active = active;
    console.log(this.wastageModel.active);
    this.wastagesDialog = true;
  }

}
