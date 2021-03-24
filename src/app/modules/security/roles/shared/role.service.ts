import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoleType } from 'src/app/models/security/RoleType';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/models/security/Role';
import { RoleByUser } from 'src/app/models/security/RoleByUser';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(public httpClient: HttpClient) { }

  getRoles(type?: number, company?: number): Observable<Role[]> {
    return this.httpClient
    .get<Role[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Roles/roles?type=${type}&company=${company}`)
    .pipe(
      map((res: any) => res)
    );
  }

  getRolesPromise(type?: number, company?: number) {
    return this.httpClient
    .get<Role[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Roles/roles?type=${type}&company=${company}`)
    .toPromise()
    .then(result => result)
    .catch( error => {
      return error;
    });
  }

  getRoleTypes() {
    return this.httpClient
    .get<RoleType[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Roles/types`)
    .pipe(
      map((res: any) => res)
    );
  }

  
  getRoleTypesPromise() {
    return this.httpClient
    .get<RoleType[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Roles/types`)
    .toPromise()
    .then(result => result)
    .catch( error => {
      return error;
    });
  }

  createRole(role: any): Observable<boolean> {
    return this.httpClient
    .post<boolean>(`${environment.API_BASE_URL_AUTHORIZATION}/Roles/Create`, role)
    .pipe(map((res: boolean) => res));
  }

  addUserRole(roles: RoleByUser[]): Observable<boolean> {
    return this.httpClient
    .post<boolean>(`${environment.API_BASE_URL_AUTHORIZATION}/Roles/AddUserRole`, roles)
    .pipe(map((res: boolean) => res));
  }

  getUserRoles(idcompany?: number, idUser?: number) {
    return this.httpClient
    .get<RoleByUser[]>(`${environment.API_BASE_URL_AUTHORIZATION}/Roles/GetUserRoles?company=${idcompany}&idUser=${idUser}`)
    .toPromise()
    .then(result => result )
  }
}
