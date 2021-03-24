import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Access } from 'src/app/models/security/Access';
import { Software } from 'src/app/models/security/Software';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly ACCESS_STATE = '_ACCESS_STATE';
  permissionsList: number[] = [];
  constructor(public httpClient: HttpClient) { }

get permissions() {
  const accesses: Access[] = JSON.parse(localStorage.getItem(this.ACCESS_STATE));
  Object.values(accesses).map(item => {
          this.permissionsList.push(item.id);
});
return this.permissionsList;
}

get access() {
  const accesses: Access[] = JSON.parse(localStorage.getItem(this.ACCESS_STATE));
  Object.values(accesses).map(item => {
      this.permissionsList.push(item.id);
});
  return accesses;
}

getSoftwareByUser(idUser: number) {
  return this.httpClient.get<Software[]>
  (`${environment.API_BASE_URL_AUTHORIZATION}/Software/GetSoftwareByUser?idUser=${idUser}`)
  .toPromise()
  .then( response => <Software[]>response)
  .catch( error => {
    return error;
  });
  }

sendToStorage(result: Access[]) {
      localStorage.setItem(this.ACCESS_STATE, JSON.stringify(result));
    }
removeStateAccessFromStorage() {
     localStorage.removeItem(this.ACCESS_STATE);
    }
}
