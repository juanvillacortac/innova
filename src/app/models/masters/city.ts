import { BaseModel } from "../common/BaseModel";
import { District } from "./district";

export class City extends BaseModel { 
    district: District;
    abbreviation : string;
    active:boolean;
    createdByUser: string;
    updatedByUser: string;
    latitude: number;
    longitude: number;

}