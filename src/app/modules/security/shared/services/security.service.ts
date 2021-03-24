import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SelectItem, TreeNode } from 'primeng/api';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

import { App } from 'src/app/models/security/App';
import { Module } from 'src/app/models/security/Module';
import { Permission } from 'src/app/models/security/Permission';
import { Software } from 'src/app/models/security/Software';
import { environment } from 'src/environments/environment';
import { Access } from 'src/app/models/security/Access';
import { Office } from 'src/app/models/security/Office';
import { UserPermission } from 'src/app/models/security/UserPermission';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(public httpClient: HttpClient) { }

  getSystems() {
    const software: SelectItem[] = [];
    return this.httpClient
    .get<Software[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftware`)
    .pipe(
      map((data: Software[]) => {
        data.map((item: Software) => {
          const option: SelectItem = {
            value: item.id,
            label: item.name
          };
          software.push(option);
        });
        return software;
     })
    );
  }

  getAppsBySystem(idSystem: number) {
    const apps: SelectItem[] = [];
    return this.httpClient
    .get<App[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetApps?idSoftware=${idSystem}`)
    .pipe(
      map((data: App[]) => {
        data.map((item: App) => {
          const option: SelectItem = {
            value: item.id,
            label: item.name
          };
          apps.push(option);
        });
        return apps;
     })
    );
  }

  getModulesByApp(idApp: number) {
    const url = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetModulesByApp?idApp=${idApp}`;
    return this.httpClient.get<Module[]>(url)
      .pipe(result => result,
      catchError((httpError: HttpErrorResponse) => {
        return throwError(this.catchError(httpError));
      })
    );
  }

  
  getModulesTree(idApp: number) {
    const url = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/Module/AllModulesTree?idApp=${idApp}`;
    return this.httpClient.get<TreeNode[]>(url)
      .pipe(result => result,
      catchError((httpError: HttpErrorResponse) => {
        return throwError(this.catchError(httpError));
      })
    );
  }
    
  getModulesTreePromise(idApp: number) {
    const url = `${environment.API_BASE_URL_AUTHORIZATION}/Permission/Module/AllModulesTree?idApp=${idApp}`;
    return this.httpClient.get<TreeNode[]>(url)
    .toPromise()
    .then(result => result)
    .catch( error => {
      return error;
    });
  }

  getPermissionByModule(idModule: number) {
    return this.httpClient
    .get<Permission[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByModule?idModule=${idModule}`)
    .pipe(
      map((res: any) => res)
    );
  }

  getPermissionByRole(idRole: number, status: number) {
    return this.httpClient
    .get<Access[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByRole?idRole=${idRole}&status=${status}`)
    .toPromise()
    .then(res => res)
    .catch( error => {
      return error;
    });
  }

  private catchError(httpError: HttpErrorResponse) {
    return {
      Code: httpError.status,
      ErrorMsg: httpError.error.error.message
    };
  }
  getOffices(idCompany?: number) {
    return this.httpClient
    .get<Office[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Company/GetSubsidiary?idCompany=${idCompany}`)
    .pipe(
      map((res: any) => res)
    );
  }

  getOfficesPromise(idCompany?: number) {
    return this.httpClient
    .get<Office[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Company/GetSubsidiary?idCompany=${idCompany}`)
    .toPromise()
    .then(res => res)
    .catch( error => {
      return error;
    });
  }

  getAccess(payload: any) {
    return this.httpClient.get<Access[]>(
      `${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByUser?idUser=${payload.idUser}&idCompany=${payload.idCompany}&idSubsidiary=${payload.idSubsidiary}`)
      .pipe(result => result,
        catchError((httpError: HttpErrorResponse) => {
          return throwError(this.catchError(httpError));
        })
      );
  }


  getSystemsByRole(idRole: number) {
    const software: SelectItem[] = [];
    return this.httpClient
    .get<Software[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftwareByRole?idRole=${idRole}`).toPromise()
    .then((data: Software[]) => {
        data.map((item: Software) => {
          const option: SelectItem = {
            value: item.id,
            label: item.name
          };
          software.push(option);
        });
        return software;
     })
     .catch( error => {
      return error;
    });
  }
  getSystemsPromise() {
    return this.httpClient
    .get<Software[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftware`).toPromise()
    .then(result => result)
    .catch( error => {
      return error;
    });
  }
  getAppsBySystemPromise(idSystem: number) {
    return this.httpClient
    .get<App[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetApps?idSoftware=${idSystem}`) .toPromise()
    .then(result => result)
    .catch( error => {
      return error;
    });
  }

  getModulesByAppPromise(idApp: number) {
    return this.httpClient.get<Module[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetModulesByApp?idApp=${idApp}`)
      .toPromise()
      .then(result => result)
      .catch( error => {
        return error;
      });
  }

  getAccessPromise(payload: any) {
    return this.httpClient.get<Access[]>(
      `${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByUser?idUser=${payload.idUser}&idCompany=${payload.idCompany}&idSubsidiary=${payload.idSubsidiary}`)
      .toPromise()
      .then(result => result )
      .catch( error => {
        return error;
      });
  }

  getModulesTreeByUser(payload: any) {
    return this.httpClient.get<MenuItem[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/Module/ModulesTreeByUser`,
      {
        params: payload
      })
      .toPromise()
      .then(result => result)
      .catch(error => {
        return error;
      });
  }

  addUserPermission(permission: UserPermission): Observable<boolean> {
    console.log(permission);
    return this.httpClient
    .post<boolean>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/AddUserPermissions`, permission)
    .pipe(map((res: boolean) => res));
  }

  getPermissionByModulePromise(idModule: number) {
    return this.httpClient
    .get<Permission[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Permission/GetPermissionsByModule?idModule=${idModule}`)
    .toPromise()
      .then(result => result)
      .catch( error => {
        return error;
      });
  }

}
