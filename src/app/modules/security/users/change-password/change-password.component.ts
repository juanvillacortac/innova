import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ChangePassword } from 'src/app/models/security/ChangePassword';
import { Result } from 'src/app/models/common/Result';
import { BaseError } from 'src/app/models/common/errors/BaseError';
import {ConfirmedValidator} from 'src/app/helpers/confirmed.validator';
import { PasswordRecovery } from 'src/app/models/security/PasswordRecovery';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  get userByRoute() { return this.actRoute.snapshot.params['id'] }
  user_id: string;
  changePasswordForm: FormGroup;
  hideOldP: Boolean = false;
  hideNewP: Boolean = false;
  hideConfirmP: Boolean = false;
  isRecovery: Boolean;
  dark: Boolean = false;
  constructor(
     private fb: FormBuilder,
     private router: Router,
     private _authService: AuthService,
     private actRoute: ActivatedRoute,
     private messageService: MessageService,
     private breadcrumbService: BreadcrumbService,
     ) {
       
    }

ngOnInit() {
  if (this.userByRoute) {
    this.user_id = this.userByRoute;
    this.isRecovery = true;
    this.changePasswordForm = this.fb.group({
      idUser: this.user_id,
      mainEmail: '',
      password: '',
      newpassword: ['', Validators.required],
      verificationPassword: ['', Validators.required],
      userModified: 0
    },
    {validators: ConfirmedValidator('newpassword', 'verificationPassword')});
  } else {
    this.user_id = this._authService.idUser;
    this.isRecovery = false;
    this.changePasswordForm = this.fb.group({
      idUser: this.user_id,
      mainEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      newpassword: ['', Validators.required],
      verificationPassword: ['', Validators.required],
      userModified: 0
    }, {validators: ConfirmedValidator('newpassword', 'verificationPassword')});
  }
  this.setBreadCrumbItems()
}
private setBreadCrumbItems() {
  this.breadcrumbService.setItems([
    { label: 'Perfil', routerLink: ['/profile', this.user_id] },
    { label: 'Editar Perfil'}
  ]);
}
async onSubmit() {
  console.log(this.changePasswordForm.valid)
 if (this.changePasswordForm.valid) {
        if (this.isRecovery) {
            this.executeRecoverypassword();
        } else {
            this.executeChangePassWord();
        }
      }
  }

  private executeChangePassWord() {
    const formValues = {...this.changePasswordForm.value};
    const payload: ChangePassword = {
         idUser: formValues.idUser ?? 0,
         mainEmail: formValues.mainEmail ?? '',
         newPassword: formValues.newpassword ?? '',
         password: formValues.password ?? '',
         userModified: 0
      };
    return this._authService.changePassword(payload).subscribe( (res: Result) => {
      this.messageService.add({severity:'success', summary:'Modificar contraseña', detail: res.message});
         this.router.navigate(['landing']);
      },
      (error: BaseError) => {
        console.log(error);
        this.messageService.add({severity:'error', summary:'Modificar contraseña', detail: error.ErrorMsg});
      });

  }

  private executeRecoverypassword() {
    const formValues = {...this.changePasswordForm.value};
    const payload: PasswordRecovery = {
         id: Number(formValues.idUser),
         newPassword: formValues.newpassword ?? ''
      };
    return this._authService.recoveryPassword(payload).subscribe( (res: boolean) => {
        console.log(res);
        this.messageService.add({severity:'success', summary:'Recuperar contraseña', detail: 'Se ha actualizado la contraseña exitosamente'});
          this.router.navigate(['']);
      },
      (error: BaseError) => {
        console.log(error);
        this.messageService.add({severity:'error', summary:'Recuperar contraseña', detail: error.ErrorMsg});
      });


  }
}
