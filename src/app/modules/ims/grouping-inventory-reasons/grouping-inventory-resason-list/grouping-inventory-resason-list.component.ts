import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { groupingInventoryReason } from 'src/app/models/ims/grouping-inventory-reasons';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { groupingInventoryReasonFilter } from '../shared/filter/grouping-inventory-reason-filter';
import { GroupinginventoryreasonService } from '../shared/service/groupinginventoryreason.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-grouping-inventory-resason-list',
  templateUrl: './grouping-inventory-resason-list.component.html',
  styleUrls: ['./grouping-inventory-resason-list.component.scss']
})
export class GroupingInventoryResasonListComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = false
  showDialog: boolean = false
  GroupingShowDialog: boolean = false;
  _groupingViewModel: groupingInventoryReason=new groupingInventoryReason();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  groupingFilter: groupingInventoryReasonFilter = new groupingInventoryReasonFilter();
  
  displayedColumns: ColumnD<groupingInventoryReason>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return data.name; }, header: 'Agrupación motivo', display: 'table-cell',field: 'name' }, 
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
      { template: (data) => { return data.updateByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updateByUser' }
    ];
  constructor(public _groupingService: GroupinginventoryreasonService,private breadcrumbService: BreadcrumbService,private messageService: MessageService,public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Agrupación motivo inventario', routerLink: ['/grouping-inventory-reason-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.loading = true;
    this._groupingService.getgroupingInventoryReasonsList(this.groupingFilter).subscribe((data: groupingInventoryReason[]) => {
      this._groupingService._groupingList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  Edit(grouping:groupingInventoryReason) {
    this._groupingViewModel=new groupingInventoryReason();
    this._groupingViewModel.id=grouping.id;
    this._groupingViewModel.name=grouping.name;
    this._groupingViewModel.active=grouping.active;
    this.GroupingShowDialog = true;    
  }

}
