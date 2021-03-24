export interface Address {
 id?: number;
 name?: string;
 code?: string;
 isActive?: boolean;
 idEntity: string;
 idAddressType: number;
 addressType?: string;
 idCity: 0;
 city?: string;
 idDistrict: 0;
 district?: string;
 idProvince: 0;
 province?: string;
 idPlaceType: 0;
 placeType?: string;
 idCountry?: number;
 country?: string;
 avenue: string;
 street: string;
 building: string;
 floor: string;
 apartment: string;
 reference?: string;
 latitude?: number;
 longitude?: number;
}
