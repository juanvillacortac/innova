import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleDetailComponent } from './roles/role-detail/role-detail.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RegisterUserComponent } from './users/register-user/register-user.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UserPermissionsComponent } from './users/user-permissions/user-permissions.component';
import { UserRoleComponent } from './users/user-role/user-role.component';

const routes: Routes = [
    {path: 'role-list', component: RolesListComponent},
    {path: 'role-detail', component: RoleDetailComponent},
    {path: 'user-detail/:id', component: UserDetailComponent},
    {path: 'user-role', component: UserRoleComponent},
    {path: 'user-permissions', component: UserPermissionsComponent},
    {path: 'user-register', component: RegisterUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
