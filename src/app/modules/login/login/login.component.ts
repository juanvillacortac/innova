import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { BaseError } from 'src/app/models/common/errors/BaseError';
import { Credentials } from 'src/app/models/security/Credentials';
import { AuthService } from '../shared/auth.service';
import { CredentialsViewModel } from '../shared/view-models/CredentialsViewModel';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginInvalid: boolean;
  rememberMe: boolean;
  dark = false;
  private formSubmitAttempt: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private _authService: AuthService
    ) {
      if (this._authService.isLoggedIn()) {
        this.router.navigate(['home']);
      } else {
        this._authService.getReadyLogin();
      }
    }

  async ngOnInit() {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.rememberMe = false;
    this.onChange();
  }

  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.loginForm.valid) {
      try {
        const credentials = new CredentialsViewModel();
        credentials.password = this.loginForm.controls.password.value;
        credentials.user = this.loginForm.controls.user.value;
        credentials.rememberMe = this.rememberMe;
        this.doLogin(credentials);
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  onChange(): void {
    this.loginForm.valueChanges.subscribe( () => {
      if (this.loginInvalid) {
        this.loginInvalid = false;
      }
    });
  }

  private doLogin(credentialsVM: CredentialsViewModel) {
    let credentials: Credentials;
    credentials = {
      password: credentialsVM.password,
      user: credentialsVM.user,
      rememberme: credentialsVM.rememberMe
    };
    this.authService.login(credentials)
      .subscribe(result => {
        if (result) {
          this.router.navigate(['home']);
          this.loginInvalid = false;
        } else {
          this.loginInvalid = true;
        }
      },
      (error: BaseError) => {
        this.loginInvalid = true;
        this.messageService.add({severity: 'error', summary: 'Autenticación', detail: error.ErrorMsg});
      });
  }
  onChangeRememberMe() {
    this._authService.updateRememberMe(!this.rememberMe);
    this.rememberMe = !this.rememberMe;
  }

  get user() {return this.loginForm.get('user'); }
  get password() {return this.loginForm.get('passwords'); }
}
