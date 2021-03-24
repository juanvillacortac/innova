import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/models/masters/company';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CompaniesFilter } from '../filters/companies-filter';
import { CompanyType } from 'src/app/models/masters/company-type';
import { CompanyTypeFilter } from '../filters/company-type-filter';
import { CompanyClassificationFilter } from '../filters/company-classification-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { CompanyGroupFilter } from '../filters/company-group-filter';
import { CompanyGroup } from 'src/app/models/masters/company-group';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  _companiesList:Company[];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getCompaniesList(filters: CompaniesFilter = new CompaniesFilter()) {
    return this._httpClient
      .get<Company[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getCompany(idCompany: number) {
    return this._httpClient
      .get<Company>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/${idCompany}`);
  }

  insertCompany(company: Company){
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company`,company);
  }

  getCompanyTypesList(filters: CompanyTypeFilter = new CompanyTypeFilter()) {
    return this._httpClient
      .get<CompanyType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/Types/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getCompanyClassificationList(filters: CompanyClassificationFilter = new CompanyClassificationFilter()) {
    return this._httpClient
      .get<CompanyType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/Classifications/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getCompanyGroupList(filters: CompanyGroupFilter = new CompanyGroupFilter()) {
    return this._httpClient
      .get<CompanyGroup[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/Groups/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
}
