import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Authenticate } from 'src/app/models/security/Authenticate';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { BaseError } from 'src/app/models/common/errors/BaseError';
import { OtpCode } from 'src/app/models/security/OtpCode';
import { Tokens } from 'src/app/models/security/Tokens';
import { NotFoundError } from 'src/app/models/common/errors/NotFoundError';
import { ChangePassword } from 'src/app/models/security/ChangePassword';
import { Result } from 'src/app/models/common/Result';
import { PasswordRecovery } from 'src/app/models/security/PasswordRecovery';
import { Credentials } from 'src/app/models/security/Credentials';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_STATE = '_USER_STATE';
  private readonly REMEMBER_ME = '_REMEMBER_ME';
  private readonly ACCESS_STATE = '_ACCESS_STATE';
  private loggedUser: string;
  constructor(public httpClient: HttpClient) { }

  get rememberMe() {
    return localStorage.getItem(this.REMEMBER_ME) === 'true' ? true : false;
  }

  get idUser() {
    return this.storeUser?.id ?? '';
  }

  get entityName() {
    return this.storeUser?.fullName ?? '';
  }

  get userName() {
    return this.storeUser?.email ?? '';
  }

  get jwt() {
    return this.storeUser?.token ?? '';
  }

  get storeUser() {
    if (this.rememberMe === true) {
      return JSON.parse(localStorage.getItem(this.USER_STATE));
    }
    return JSON.parse(sessionStorage.getItem(this.USER_STATE));
  }

  login(credentials: Credentials): Observable<boolean> {
      return this.httpClient.post<any>
      (`${environment.API_BASE_URL_AUTHENTICATION}/Authentication/Authenticate`,
      credentials).pipe(
        tap(tokens => {
            const data = {
                id: tokens.id,
                name: tokens.name,
                lastName: tokens.lastName,
                email: tokens.email,
                token: tokens.token,
                refreshToken: tokens.refreshToken,
                rememberMe: credentials.rememberme
              };
            this.doLogin(credentials.user, {...data});
            return of(true);
          })
          , catchError((error) => {
            console.log(error);
             let errorBase: NotFoundError;
              errorBase = {
                ErrorMsg: error.error.message,
                Code: error.status
               };
               return throwError(errorBase);
          })
      );

  }

  logout() {
  return this.httpClient.post<any>(`${environment.API_BASE_URL_AUTHENTICATION}/Authentication/LogOut`,
  {'refreshToken': this.getRefreshToken()}
  ).pipe(
    tap(() => this.doLogout()),
    mapTo(true),
    catchError(error => {
      throwError(error.error);
      return of(false);
    }));
  }

  isLoggedIn() {
    return !!this.getUserState();
  }

  getReadyLogin() {
    localStorage.removeItem(this.REMEMBER_ME);
    localStorage.removeItem(this.USER_STATE);
    localStorage.removeItem(this.ACCESS_STATE);
  }

  refreshToken() {
  return this.httpClient.post<any>(`${environment.API_BASE_URL_AUTHENTICATION}/Authentication/RefreshToken`, {
    'refreshToken': this.getRefreshToken()
  }).pipe(tap((tokens: Tokens) => {
    this.storeJwtToken(tokens.token);
  }));
  }

  getUserState(): {} {
  let userState = {};
  const localStorageTmp = JSON.parse(localStorage.getItem(this.USER_STATE));
  const sessionStorageTmp = JSON.parse(sessionStorage.getItem(this.USER_STATE));
  if (localStorageTmp !== null) {
    userState = localStorageTmp;
  } else {
    userState = sessionStorageTmp;
  }
  return userState;
  }

  generateOtpCode(otpCode: OtpCode) {
  console.log(`${otpCode.user} ${otpCode.receiveByEmail}`);
  return this.httpClient.post<any>
  (`${environment.API_BASE_URL_AUTHENTICATION}/Authentication/GetOtpCode`, otpCode
  ).pipe(
    tap(response => {
        otpCode = {
            idUser: response.IdUser,
            otp: response.OTP
        };
        return otpCode;
    }), catchError((httpError: HttpErrorResponse) => {
      const errorBase: BaseError = {
         Code: httpError.status,
         ErrorMsg: httpError.error.message
      };
         return throwError(errorBase);
    })
  );
  }
  validateOtp(otpCode: OtpCode) {
  console.log(`${otpCode.idUser} ${otpCode.otp}`);
  return this.httpClient.post<boolean>
  (`${environment.API_BASE_URL_AUTHENTICATION}/Authentication/VerifyOtp`, otpCode
  ).pipe(
    map((res: any) => {
      return res;
    }),
    catchError((httpError: HttpErrorResponse) => {
        const errorBase: BaseError = {
           Code: httpError.status,
           ErrorMsg: httpError.error.error.message
        };
           return throwError(errorBase);
      })
  );
  }
  changePassword(changePassword: ChangePassword) {
  return this.httpClient.post<Result>(`${environment.API_BASE_URL_AUTHENTICATION}/Authentication/UserPasswordChange`,
  changePassword).pipe(
    map((response: Result) => {
      return response;
    }), catchError((httpError: HttpErrorResponse) => {
        const errorBase: BaseError = {
           Code: httpError.status,
           ErrorMsg: httpError.error.message
        };
           return throwError(errorBase);
      })
  );
  }
  recoveryPassword(passwordRecovery: PasswordRecovery) {
  console.log(passwordRecovery.id + '-' + passwordRecovery.newPassword);
  return this.httpClient.post<boolean>(`${environment.API_BASE_URL_AUTHENTICATION}/Authentication/UserPasswordRecovery`,
  passwordRecovery).pipe(
    map((response: boolean) => {
      return response;
    }), catchError((httpError: HttpErrorResponse) => {
        const errorBase: BaseError = {
           Code: httpError.status,
           ErrorMsg: httpError.error.message
        };
           return throwError(errorBase);
      })
  );
  }

  removeUserStateFromStorage() {
    localStorage.removeItem(this.USER_STATE);
    sessionStorage.removeItem(this.USER_STATE);
  }

  updateRememberMe(bol: boolean) {
    localStorage[this.REMEMBER_ME] = JSON.stringify(bol);
  }

  private doLogin(username: string, data: Authenticate) {
    this.loggedUser = username;
    this.storeTokens(data);
  }

  private doLogout() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem('');
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.USER_STATE, jwt);
  }

  private storeTokens(data: Authenticate) {
    const item = {
      id: data.id,
      token: data.token,
      refreshToken: data.refreshToken,
      fullName: data.name + ' ' + data.lastName,
      email: data.email
    };
    localStorage.setItem(this.REMEMBER_ME, JSON.stringify(data.rememberMe));

    if (data.rememberMe) {
      localStorage.removeItem(this.USER_STATE);
      localStorage.setItem(this.USER_STATE, JSON.stringify(item));
    } else {
      sessionStorage.removeItem(this.USER_STATE);
      sessionStorage.setItem(this.USER_STATE, JSON.stringify(item));
    }

  }

  private removeTokens() {
    if (this.rememberMe === true) {
      localStorage.removeItem(this.USER_STATE);
    } else {
      sessionStorage.removeItem(this.USER_STATE);
    }
    localStorage.removeItem(this.REMEMBER_ME);
  }
}
