import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Company } from 'src/app/models/masters/company';
import { CompaniesFilter } from '../shared/filters/companies-filter';
import { CompanyService } from '../shared/services/company.service';
import { CompanyViewModel } from '../shared/view-models/company-viewmodel';
import { EditDialogComponent } from './company-edit-dialog/edit-dialog.component';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  // _companiesList: Company[];
 

  @ViewChild(EditDialogComponent) editDialogComponent: EditDialogComponent; 

  companiesFilters: CompaniesFilter = new CompaniesFilter();

  displayedColumns: ColumnD<CompanyViewModel>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field:'id', display: 'none' },
      { template: (data) => { return data.name; }, header: 'Razón social',field:'name' , display: 'table-cell' },
      { template: (data) => { return `${data.identifier}-${data.identification}`; }, header: 'Documento',field:'identifier' ,display: 'table-cell' },
      { template: (data) => { return data.type; }, header: 'Tipo',field:'type' ,display: 'table-cell' },
      { template: (data) => { return data.country; }, header: 'País',field:'country' ,display: 'table-cell' },
      { template: (data) => { return data.classification; }, header: 'Clasificación',field:'classification' ,display: 'table-cell' },
      { field: 'active', header: 'Activo',display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell' }
    ];

  constructor(public _companyService: CompanyService, public breadcrumbService: BreadcrumbService , public messageService: MessageService,public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Empresas', routerLink: ['/company-list'] }
    ]);
  }
  permissionsIDs = {...Permissions};

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this._companyService.getCompaniesList(this.companiesFilters).subscribe((data: Company[]) => {
      this._companyService._companiesList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las empresas." });
    });
  }

  editOrNewCompany(idCompany: number = -1){
    this.editDialogComponent.edit(idCompany);
  }
}
