import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Columns } from 'src/app/models/common/columns';
import { Role } from 'src/app/models/security/Role';
import { RoleByUser } from 'src/app/models/security/RoleByUser';
import { RolePermissions } from '../../roles/shared/role-permissions.service';
import { RoleService } from '../../roles/shared/role.service';
import { UserPermissions } from '../shared/user-permissions.service';
import * as Permissions from '../shared/user-const-permissions';


@Component({
  selector: 'app-user-roles-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.scss']
})
export class UserRoleListComponent implements OnInit {
  displayedColumns: Columns[] =
  [
   {field: 'idRole', header: 'IdRole', display: 'none'},
   {field: 'idType', header: 'IdRoleType', display: 'none'},
   {field: 'name', header: 'Rol', display: 'table-cell'},
   {field: 'companyName', header: 'Empresa', display: 'table-cell'},
   {field: 'type', header: 'Tipo', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  roleList: RoleByUser[] = [];
  first = 0;
  rows = 10;
  shownEditRole = false;
  idRole = 0;
  idRoleType = 0;
  permissionsIDs = {...Permissions};
  constructor(
    public service: RoleService,
    public _getAccesses: RolePermissions,
    private router: Router,
    private actRoute: ActivatedRoute,
    private messageService: MessageService,
    public userPermissions: UserPermissions) {
   }
  ngOnInit(): void {
    const idUser = Number(this.actRoute.snapshot.params['id']);
    this.getUserRoles(idUser);
  }
  getUserRoles(idUser: number) {
    const idCompany = 1;
    this.service.getUserRoles(idCompany, idUser).then(result => {
      this.groupRoles(result);
    }, (error) => {
      this.messageService.add({severity: 'error', summary: 'Cargar roles del usuario', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  private groupRoles(result: RoleByUser[]) {
    const roles: RoleByUser[] = [];
    result.forEach(element => { this.pushIfNotExist(roles, element); });
    this.roleList = roles;
  }
  private pushIfNotExist(roles: RoleByUser[], element: RoleByUser) {
    if (roles.find(item => Number(item.idRole) === element.idRole ) == null) {
      roles.push(element);
    }
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
    this.idRole = -1;
    this.idRoleType = -1;
    this.shownEditRole = true;
  }
  onEdit(id, idRoleType) {
    this.idRole = id;
    this.idRoleType = idRoleType;
    this.shownEditRole = true;
  }

  public childCallBack(reload: boolean): void {
    this.shownEditRole = false;
    if (reload) {
      const idUser = Number(this.actRoute.snapshot.params['id']);
      this.getUserRoles(idUser);
    }
}

}
