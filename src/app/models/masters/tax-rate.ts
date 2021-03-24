import { BaseModel } from "../common/BaseModel";
import { RateType } from "./rate-type";
import { Tax } from "./tax";
export class TaxRate extends BaseModel { 
    tax: Tax;
    rateType: RateType;
    abbreviation : string;
    value: number;
    active:boolean;
    createdByUser: string;
    updatedByUser: string;

}