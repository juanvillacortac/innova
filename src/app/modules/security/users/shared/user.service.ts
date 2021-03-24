import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Identity } from 'src/app/models/security/Identity';
import { Result } from 'src/app/models/common/Result';
import { Entity } from 'src/app/models/security/Entity';
import { NotFoundError } from 'src/app/models/common/errors/NotFoundError';
import { User } from 'src/app/models/security/User';
import { UserFilter } from 'src/app/models/security/UserFilter';
import { IdentifierType } from 'src/app/models/security/IdentifierType';
import { Address } from 'src/app/models/users/Address';
import { Phone } from 'src/app/models/users/Phones';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public httpClient: HttpClient) { }

getEntity(getIdentity: Identity): Observable<any> {
return this.httpClient.post<any>(`${environment.API_BASE_URL_AUTHENTICATION}/User/CheckEntity`,
       getIdentity).pipe(
        tap(response => {
            let entity: Entity;
            const addresses: Address[] = [];
            entity = {
                birthDate: response.birthDate,
                businessReason: response.businessReason,
                id: response.id,
                dniNumber: response.dniNumber,
                gender: response.gender,
                identifierType: response.identifierType,
                lastName: response.lastName,
                maritalStatus: response.maritalStatus,
                name: response.name,
                nit: response.nit,
                observations: response.observations,
                secondLastName: response.secondLastName,
                tradeName: response.tradeName,
                secondName: response.secondName,
                status: response.status,
                createdDate: response.createdDate,
                imagen: response.imagen,
                modifiedDate: response.modifiedDate,
                userCreated: response.userCreated,
                userModified: response.userModified,
                address: addresses,
                phones: response.phones
            };
            return entity;
         }), catchError((error: HttpErrorResponse) => {
           if (error.status === 404) {
            let errorBase: NotFoundError;
             errorBase = {
               ErrorMsg: error.error.error.message,
               Code: error.status
              };
              return throwError(errorBase);
           } else {
            return throwError(error);
           }
         })
       );
}

createEntity(entity: User): Observable<Result> {
    return this.httpClient.post<Result>(`${environment.API_BASE_URL_AUTHENTICATION}/User/CreateUser`,
    entity).pipe(
      tap(response => {
        return response;
      }), catchError((error: HttpErrorResponse) => {
        if (error.status === 404 || error.status === 0) {
          alert('No se pudo validar el documento, debido a un problema de conexión.');
          return throwError(error.error);
        } else {
          return throwError(error.error);
        }
       })
    );
}

getAllUsers(userFilter: UserFilter): Observable<User[]> {
    return this.httpClient.post<User[]>(`${environment.API_BASE_URL_AUTHENTICATION}/User/GetAllUsers`, userFilter);
}

getIdentifierTypes(idIdentifierType: number, idEntityType: number ): Observable<IdentifierType[]> {
  return this.httpClient.get<IdentifierType[]>(`${environment.API_BASE_URL_AUTHENTICATION}/User/GetIdentifierTypes?idIdentifierType=${idIdentifierType}&idEntityType=${idEntityType}`);
}
getUserEntity(idUser: number): Observable<any> {
  return this.httpClient.get<User>(`${environment.API_BASE_URL_AUTHENTICATION}/User/GetUserEntity?idUser=${idUser}`);
}

getAllUsersPromise(userFilter: UserFilter): Promise<User[]> {
  return this.httpClient.post<User[]>
  (`${environment.API_BASE_URL_AUTHENTICATION}/User/GetAllUsers`, userFilter)
  .toPromise()
  .then(users => <User[]> users)
  .then(usersList => usersList);
}

}
