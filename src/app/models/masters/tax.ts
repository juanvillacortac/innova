import { BaseModel } from "../common/BaseModel";
import { Country } from "./country";
import { TaxeTypeApplication } from "./taxe-type-application";

export class Tax extends BaseModel { 
    taxeTypeApplication: TaxeTypeApplication[];
    country: Country;
    abbreviation : string;
    active:boolean;
    createdByUser: string;
    updatedByUser: string;
}