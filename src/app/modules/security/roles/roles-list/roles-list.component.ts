import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Columns } from 'src/app/models/common/columns';
import { Role } from 'src/app/models/security/Role';
import { UserPermissions } from '../../users/shared/user-permissions.service';
import { RolePermissions } from '../shared/role-permissions.service';
import { RoleService } from '../shared/role.service';
import * as Permissions from '../../users/shared/user-const-permissions';


@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  displayedColumns: Columns[] =
  [
   {field: 'id', header: 'Id', display: 'none'},
   {field: 'name', header: 'Nombre', display: 'table-cell'},
   {field: 'companyName', header: 'Empresa', display: 'table-cell'},
   {field: 'type', header: 'Tipo', display: 'table-cell'},
   {field: 'softwares', header: 'Sistemas', display: 'table-cell'},
   {field: 'isActive', header: 'Estatus', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];
  roleList: Role[] = [];
  shownEditRole = false;
  roleSelected: Role;
  idRole = 0;
  first = 0;
  rows = 10;
  permissionsIDs = {...Permissions};
  constructor(public service: RoleService,
    public _getAccesses: RolePermissions,
    public router: Router,
    private breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Seguridad' },
      { label: 'Roles', routerLink: ['/role-list'] }
  ]);
   }

  ngOnInit(): void {
    this.getRoles();

  }

  getRoles() {
    this.service.getRoles(-1, 1).subscribe(result => {
      this.roleList = result;
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar roles', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.roleList ? this.first === (this.roleList.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.roleList ? this.first === 0 : true;
  }

  openNew() {
    this.roleSelected = null;
    this.idRole = -1;
    this.shownEditRole = true;
  }
  onEdit(role) {
    this.roleSelected = role;
    this.idRole = role.id;
    this.shownEditRole = true;
  }

  public childCallBack(reload: boolean): void {
    this.shownEditRole = false;
    if (reload) {
      this.getRoles();
    }
}

}
