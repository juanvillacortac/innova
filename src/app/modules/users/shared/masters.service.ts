import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { environment } from 'src/environments/environment';
import { Country } from 'src/app/models/masters/country';

@Injectable({
  providedIn: 'root'
})
export class MastersService {

  constructor(public httpClient: HttpClient) { }

  getCountries(idStatus: number, idCountry: number) {
    return this.httpClient.get<Country[]>
    (`${environment.API_BASE_URL_AUTHENTICATION}/Master/Countries?idCountry=${Number(idCountry)}&idStatus=${Number(idStatus)}`)
    .toPromise()
    .then(response => response)
    .then(response => <Country[]>response);
  }

  getProvinces(idProvince: number, idCountry: number, idStatus: number) {
    return this.httpClient.get<BaseModel[]>
    (`${environment.API_BASE_URL_AUTHENTICATION}/Master/Provinces?idProvince=${Number(idProvince)}&idCountry=${Number(idCountry)}&idStatus=${Number(idStatus)}`)
    .toPromise()
    .then(response => {
        console.log(response);
        return response;
      })
    .then( response => response);
  }

  getDistricts(filter: any) {
    return this.httpClient.get<BaseModel[]>
    (`${environment.API_BASE_URL_AUTHENTICATION}/Master/Districts?idDistrict=${filter.idDistrict}&idProvince=${filter.idProvince}&idStatus=${filter.idStatus}`).toPromise()
    .then( response => <BaseModel[]>response)
    .catch( error => {
      return error;
    });
  }

  getCities(filter: any) {
    return this.httpClient.get<BaseModel[]>
    (`${environment.API_BASE_URL_AUTHENTICATION}/Master/Cities?idCity=${filter.idCity}&idDistrict=${filter.idDistrict}&idStatus=${filter.idStatus}`).toPromise()
    .then( response => <BaseModel[]>response)
    .catch( error => {
      return error;
    });
  }

  getPhonetypes(filter: any) {
    return this.httpClient.get<BaseModel[]>
    (`${environment.API_BASE_URL_AUTHENTICATION}/Master/PhoneType?idPhoneType=${filter.idPhoneType}`).toPromise()
    .then( response => <BaseModel[]>response)
    .catch( error => {
      return error;
    });
  }

  getPlaceTypes() {
    return this.httpClient.get<BaseModel[]>
    (`${environment.API_BASE_URL_AUTHENTICATION}/Master/PlaceTypes`).toPromise()
    .then( response => <BaseModel[]>response)
    .catch( error => {
      return error;
    });
  }

  getAddressTypes() {
    return this.httpClient.get<BaseModel[]>
    (`${environment.API_BASE_URL_AUTHENTICATION}/Master/AddressTypes`).toPromise()
    .then( response => <BaseModel[]>response)
    .catch( error => {
      return error;
    });
  }
}
