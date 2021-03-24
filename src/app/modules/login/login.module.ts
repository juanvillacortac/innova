import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { ChangePasswordComponent } from '../security/users/change-password/change-password.component';
import { PasswordModule } from 'primeng/password';


@NgModule({
  declarations: [LoginComponent, PasswordRecoveryComponent, RecoverPasswordComponent, ChangePasswordComponent],
  imports: [
    LoginRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    ToastModule,
    PasswordModule
    
  ]
})
export class LoginModule { }
