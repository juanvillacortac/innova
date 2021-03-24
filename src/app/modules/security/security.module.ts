import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule , FormsModule  } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';
import {TreeModule} from 'primeng/tree';
import {CheckboxModule} from 'primeng/checkbox';
import {TabViewModule} from 'primeng/tabview';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CalendarModule} from 'primeng/calendar';
import {InputMaskModule} from 'primeng/inputmask';
import {PasswordModule} from 'primeng/password';
import {SidebarModule} from 'primeng/sidebar';

import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { RoleDetailComponent } from './roles/role-detail/role-detail.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { UserRoleComponent } from './users/user-role/user-role.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { RegisterUserComponent } from './users/register-user/register-user.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserPermissionsComponent } from './users/user-permissions/user-permissions.component';
import { CommonDirectiveModule } from '../common/common.module';
import { UserRoleListComponent } from './users/user-role-list/user-role-list.component';  
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
  declarations: [
    RoleDetailComponent,
    RolesListComponent,
    UserRoleComponent,
    UsersListComponent,
    UserPermissionsComponent,
    RegisterUserComponent,
    UserDetailComponent,
    UserRoleListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    ToastModule,
    DropdownModule,
    TreeModule,
    CheckboxModule,
    TabViewModule,
    FormsModule,
    InputSwitchModule,
    ToggleButtonModule,
    CalendarModule,
    InputMaskModule,
    PasswordModule,
    CommonDirectiveModule,
    SidebarModule,
    CalendarModule,
    ConfirmDialogModule
    
  ],
  exports:[UserRoleComponent, RegisterUserComponent, UserPermissionsComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
   ]
})
export class SecurityModule { }
