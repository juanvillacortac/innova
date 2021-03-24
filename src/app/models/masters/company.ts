import { ContactNumber } from "./contact-number";
import { Address } from "./address";

export class Company {
    id: number = -1 ;
    name: string = "" ;
    idClassification = -1;
    idType: number = -1;
    idGroup: number = -1;
    idTypeIdentification: number =-1;
    idTypeNIT: number =-1;
    socialName: string ="";
    identification: string="";
    nit: string="";
    idCountry: number=-1;
    contactNumbers: ContactNumber[];
    addresses: Address[];
    active: boolean = false;
}