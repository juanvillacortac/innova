import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { UserFilter } from 'src/app/models/security/UserFilter';
import { UserListViewModel } from '../../shared/view-models/UserList.viewmodel';
import { UserService } from '../shared/user.service';
import { User } from 'src/app/models/security/User';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Columns } from 'src/app/models/common/columns';
import { MessageService } from 'primeng/api';
import * as Permissions from '../shared/user-const-permissions';



@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})

export class UsersListComponent implements OnInit {
  displayedColumns: Columns[] =
  [
   {field: 'id', header: 'Id', display: 'none'},
   {field: 'name', header: 'Nombre', display: 'table-cell'},
   {field: 'lastName', header: 'Apellido', display: 'table-cell'},
   {field: 'email', header: 'Correo', display: 'table-cell'},
   {field: 'status', header: 'Estado', display: 'table-cell'}
  ];

  UserListVM: UserListViewModel[] = [];
  userFilter: UserFilter = {
    idCompany: 0,
    idRole: 0,
    idSubsidiary: 0,
    idUser: 0,
    mainEmail: '',
    status: -1
  };
  permissions: number[] = [];
  first = 0;
  rows = 10;
  permissionsIDs = {...Permissions};

constructor(private _userService: UserService,
            private router: Router,
            public _getAccesses: UserPermissions,
            private breadcrumbService: BreadcrumbService,
            private messageService: MessageService,
            public userPermissions: UserPermissions) {
              this.breadcrumbService.setItems([
                { label: 'Seguridad' },
                { label: 'Usuarios', routerLink: ['/user-list'] }
            ]);
            }

 ngOnInit(): void {

    this.getAllUsersPromise(this.userFilter).then(list => this.UserListVM = list);
  }

getAllUsersPromise = (userFilter: UserFilter) => {
  return this._userService.getAllUsersPromise({...userFilter})
  .then(res => this.fromUserListToUserListViewModel(res));
}

fromUserListToUserListViewModel = (userList: User[]) => {
const tempList: UserListViewModel[] = [];
  userList.forEach((user: User) => {
      this.pushIfNotExist(tempList, user);
    });
    return tempList;
}

private pushIfNotExist(tempList: UserListViewModel[], element: User) {
  if (tempList.find(item => Number(item.id) === element.id ) == null) {
    tempList.push({
      lastName : element.person.lastName,
      email: element.mainEmail,
      id: element.id,
      name: element.person.name,
      status: Boolean(element.status) === false ? 'INACTIVO' : 'ACTIVO'
    });
  }
}
async onEdit(id) {
  this.router.navigate(['user-detail', id]);
}

openNew = () => {
  this.router.navigate(['register-wizard']);
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
  return this.UserListVM ? this.first === (this.UserListVM.length - this.rows) : true;
}

isFirstPage(): boolean {
  return this.UserListVM ? this.first === 0 : true;
}


}





