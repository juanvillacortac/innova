import { BaseModel } from "../common/BaseModel";


export class TaxeTypeApplication extends BaseModel { 
    abbreviation : string;
    active:boolean;
    createdByUser: string;
    createdByUserId?:number;
    updatedByUser: string;
    updatedByUserId?:number;  

}