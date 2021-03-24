import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpHelpersService {

  constructor() { } 

  getHttpParamsFromPlainObject(object: any, addNulls: boolean = true) {
    var params = new HttpParams();
    for (const key in object) {
        if(object[key]===null && !addNulls)
          continue;
        
        params = params.set(key,object[key]);
    }

    return params;
  }
}
