export interface Phone {
    id: number;
    name?: string;
    code?: string;
    isActive?: boolean;
    idEntity: number;
    idPhoneType: number;
    phoneType: string;
    phoneNumber: string;
    idCountry: number;
    prefix: string;
}
