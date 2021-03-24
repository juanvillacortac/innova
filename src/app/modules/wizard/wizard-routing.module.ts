import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterUserComponent } from '../security/users/register-user/register-user.component';
import { UserPermissionsComponent } from '../security/users/user-permissions/user-permissions.component';
import { UserRoleComponent } from '../security/users/user-role/user-role.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardRoutingModule { }
