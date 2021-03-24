import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from 'src/app/models/users/Profile';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public httpClient: HttpClient) { }

  getEntityProfile(idUser: number) {
  return this.httpClient.get<Profile>(`${environment.API_BASE_URL_AUTHENTICATION}/User/GetUserProfile?idUser=${Number(idUser)}`)
  .toPromise()
  .then( response => <Profile>response)
  .catch( error => {
    return error;
  });
}
saveProfile(profile: Profile) {
  return this.httpClient.post<Profile>(`${environment.API_BASE_URL_AUTHENTICATION}/User/Update`, profile)
  .toPromise()
  .then( response => <boolean>response)
  .catch( error => {
    return error;
  });
}


}
