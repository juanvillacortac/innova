import { AddressViewmodel } from "./address-viewmodel";
import { ContactNumberViewmodel } from "./contact-number-viewmodel";

export class CompanyViewModel {
  id: number;
  name: string;
  idClassification: number;
  idType: number;
  idGroup: number;
  idTypeIdentification: number;
  idTypeNit: number;
  socialName: string;
  identification: number;
  identifier: string;
  nit: string;
  type: string;
  country: string;
  classification: string;
  createdByUser: string;
  contactNumbers: ContactNumberViewmodel[];
  addresses: AddressViewmodel[];
}
