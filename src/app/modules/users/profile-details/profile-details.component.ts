import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem  } from 'primeng/api';
import { throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsersService } from '../shared/users.service';
import { Person } from 'src/app/models/users/Person';
import { Address } from 'src/app/models/users/Address';
import { Phone } from 'src/app/models/users/Phones';
import { AddressViewModel } from '../shared/view-model/address.viewmodel';
import { PhoneVieModel } from '../shared/view-model/phone.viewmodel';
import { Profile } from 'src/app/models/users/Profile';
import { MastersService } from '../shared/masters.service';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { CountryViewModel } from '../shared/view-model/country.viewmodel';
import { ConfirmedValidator } from 'src/app/helpers/confirmed.validator';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ProfileDetailsComponent implements OnInit {
addressForm: FormGroup;
phoneForm: FormGroup;
profileForm: FormGroup;
userId: number;
addressToEdit: -1;
phoneToEdit: number;
addressDialog: boolean;
phoneDialog: boolean;
profile: Profile;
addresses: Address[] = [];
addressesVM: AddressViewModel[] = [];
address: Address;
phones: Phone[] = [];
phone: Phone;
submitted = false;
phonesVM: PhoneVieModel[] = [];
addressType: SelectItem<BaseModel[]> = {value: null};
provinces: SelectItem<BaseModel[]> = {value: null};
districts: SelectItem<BaseModel[]> = {value: null};
cities: SelectItem<BaseModel[]> = {value: null};
places: SelectItem<BaseModel[]> = {value: null};
countries: SelectItem<BaseModel[]> = {value: null};
phonePrefixes: SelectItem<CountryViewModel[]> = {value: null};
phoneTypes: SelectItem<BaseModel[]> = {value: null};
formTittle: string;

  constructor(public _usersService: UsersService,
    private _mastersService: MastersService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private breadcrumbService: BreadcrumbService,
    private confirmationService: ConfirmationService ,
    private formBuilder: FormBuilder) {
    this.userId = this.route.snapshot.params['id'] ?? '';
    this.breadcrumbService.setItems([
      { label: 'Perfil', routerLink: ['/profile', this.userId] },
      { label: 'Editar Perfil'}
  ]);
   }

  ngOnInit(): void {
    this.getProfile(this.userId)
    .then(profile => {
      this.profile = profile;
      this.addresses = profile.person.address;
      this.addressesVM = this.fromAddressToAddressVM(profile.person.address);
      this.phones = profile.person.phones;
      this.phonesVM = this.fromPhoneToPhoneVM(profile.person.phones);
      this.profileForm = this.newProfileForm();
      this.profileForm.patchValue({
        mainEmail: profile.mainEmail,
        secondaryEmail: profile.secondaryEmail,
        repeatMainEmail: '',
        imagen: ''
      });
    })
    .catch(error => {
      this.messageService.add({severity: 'error', summary: 'Cargar perfil', detail: error.message});
      throwError(error);
    });


    this.profileForm =  this.newProfileForm();
    this._mastersService.getCountries( -1, -1)
    .then(countries => {
      const countriesBaseModel: BaseModel[] = [];
      const phonePrefixes: CountryViewModel[] = [];
      countries.forEach(country => {
        countriesBaseModel.push({
          id: country.id,
          name: country.name
        });
        phonePrefixes.push({
          id: country.id,
          code: country.code,
          codePrefix: country.code + ' +' +  country.prefix,
          prefix: country.prefix
        });
      });
      return {countries: countriesBaseModel, phonePrefixes: phonePrefixes};
    })
    .then(lists => {
      this.countries.value = lists.countries;
      this.phonePrefixes.value = lists.phonePrefixes;
    })
    .then(() => {
      this._mastersService.getPhonetypes({idPhoneType: -1})
        .then(response => {
          console.log(response);
          this.phoneTypes.value = response;
        });
    })
    .then(() => {
      this._mastersService.getAddressTypes()
      .then(addressTypes => {
          this.addressType.value = addressTypes;
      });
    })
    .then(() => {
      this._mastersService.getPlaceTypes()
      .then(placesTypea => {
          this.places.value = placesTypea;
      });
    })
    .catch(error => {
      this.messageService.add({severity: 'error', summary: 'Cargar datos', detail: error.message});
      throwError(error);
    });
  }

  getProfile = (userId: number) => {
    return this._usersService.getEntityProfile(Number(userId)).then(profile =>  profile);
  }

  getPersonFromProfile = (profile: Profile) => {
     return profile.person;
  }

  fromAddressToAddressVM = (addresses: Address[]) => {
    const tempVM: AddressViewModel[] = [];
    addresses.forEach((addr: Address) => {
      tempVM.push({
        id: addr.id,
        addressType: addr.addressType,
        apartment: addr.apartment,
        avenue: addr.avenue,
        building: addr.building,
        city: addr.city,
        district: addr.district,
        floor: addr.floor,
        placeType: addr.placeType,
        province: addr.province,
        reference: addr.reference,
        street: addr.street
      });
  });
  return tempVM;
  }

  fromPhoneToPhoneVM = (phones: Phone[]) => {
    const tempVM: PhoneVieModel[] = [];
      phones.forEach(phone => {
        tempVM.push({
          id: phone.id,
          idPhoneType: phone.idPhoneType,
          phoneNumber: phone.phoneNumber,
          phoneType: phone.phoneType,
          prefix: phone.prefix
        });
      });
    return tempVM;
  }

  newAddressHandler(isOpen: boolean) {
    this.addressDialog = isOpen;
    this.addressToEdit = -1;
    this.address = this.newAddress();
    this.addressForm = this.newAddressForm();
    this.submitted = false;
    this.formTittle = 'Nueva dirección';
  }

  editAddressHandler(idAddress: any) {
    this.editAddress(Number(idAddress));
    this.formTittle = 'Editar dirección';
  }

  newPhoneHandler(isOpen: boolean) {
    this.phoneDialog = isOpen;
    this.phoneToEdit = -1;
    this.phone = this.newPhone();
    this.phoneForm = this.newPhoneForm();
    this.submitted = false;
    this.formTittle = 'Nuevo telefono';
  }

  editPhoneHandler(idPhone: any) {
    this.editPhone(Number(idPhone));
    this.formTittle = 'Editar telefono';
  }

  onCloseDialog() {
    this.addressDialog = false;
    this.phoneDialog = false;
    this.submitted = false;
    this.phoneForm = null;
    this.addressForm = null;
  }

  saveAddress = (profile: Profile) => {
    return this._usersService.saveProfile(profile).then(result => result);
  }

  onSubmitProfile() {
    this.submitted = true;
    const addressesToSave: Address[] = [];
    const phonesToSave: Phone[] = [];

    if (this.addressForm) {
      if (this.addressForm.valid) {
        const formValues = {...this.addressForm.value};
        addressesToSave.push({
          idAddressType: formValues.idAddressType.id,
          idCity: formValues.idCity.id,
          idProvince: formValues.idProvince.id,
          idDistrict: formValues.idDistrict.id,
          idPlaceType: formValues.idPlaceType.id,
          avenue: formValues.avenue,
          street: formValues.street,
          building: formValues.building,
          floor: formValues.floor,
          apartment: formValues.apartment,
          reference: formValues.reference,
          idEntity: this.profile.person.id.toString(),
          id: this.addressToEdit
        });
      }
    }
    if (this.phoneForm) {
      if (this.phoneForm.value) {
        const formPhoneValues = {...this.phoneForm.value};
        phonesToSave.push({
          id: this.phoneToEdit,
          idEntity: Number(this.profile.person.id),
          idPhoneType: formPhoneValues.idPhoneType.id,
          idCountry: formPhoneValues.prefix.id,
          phoneType: '',
          phoneNumber: formPhoneValues.phoneNumber,
          prefix: formPhoneValues.prefix.prefix
        });
      }
    }
      const personToSave: Person = {
        address: addressesToSave,
        birthDate: this.profile.person.birthDate,
        gender: this.profile.person.gender,
        id: this.profile.person.id,
        imagen: this.profile.person.imagen,
        lastName: this.profile.person.lastName,
        maritalStatus: this.profile.person.maritalStatus,
        name: this.profile.person.name,
        phones: phonesToSave,
        secondLastName: this.profile.person.secondLastName,
        secondName: this.profile.person.secondName,
        status: true
      };
        const profileToSave: Profile = {
          person: personToSave,
          id: this.profile.id,
          mainEmail: this.profile.mainEmail,
          secondaryEmail: this.profile.secondaryEmail
        };

        this.saveAddress(profileToSave).then(result => {
          if (result) {
            this.messageService.add({severity: 'success', summary: 'Guardar datos', detail: 'Datos grabados de forma exitosa'});
            this.onCloseDialog();
            this.ngOnInit();
           }
        })
        .catch(error => {
          this.messageService.add({severity: 'error', summary: 'Guardar datos', detail: error.error.message});
          throwError(error);
        });
  }

  onSubmitDetailProfile() {
    let profileToSave: Profile = {};
    if (this.profileForm.valid) {
    this.submitted = true;
    const addressesToSave: Address[] = [];
    const phonesToSave: Phone[] = [];
    const formProfileValues = {...this.profileForm.value};
    const personToSave: Person = {
      address: addressesToSave,
      birthDate: this.profile.person.birthDate,
      gender: this.profile.person.gender,
      id: this.profile.person.id,
      imagen: formProfileValues.imagen,
      lastName: this.profile.person.lastName,
      maritalStatus: this.profile.person.maritalStatus,
      name: this.profile.person.name,
      phones: phonesToSave,
      secondLastName: this.profile.person.secondLastName,
      secondName: this.profile.person.secondName,
      status: true
    };
      profileToSave = {
        person: personToSave,
        id: this.profile.id,
        mainEmail: formProfileValues.mainEmail,
        secondaryEmail: formProfileValues.secondaryEmail
      };
      this.saveAddress(profileToSave).then(result => {
        if (result) {
        this.onCloseDialog();
        this.messageService.add({severity: 'success', summary: 'Modificación de datos', detail: 'Datos modificados exitosamente.'});
        this.ngOnInit();
      }
    })
    .catch(error => {
      this.messageService.add({severity: 'error', summary: 'Modificación de datos', detail: error.error.message});
      throwError(error); });
    }
  }

  getProvinces(country: BaseModel) {
    this._mastersService.getProvinces(Number(country.id), -1, -1)
      .then(response =>  this.provinces.value = response)
      .then(() => {
        this.districts.value = null;
        this.cities.value = null;
      })
      .catch(error => {
        this.messageService.add({severity: 'error', summary: 'Cargar estados', detail: error.message});
        throwError(error);
      });
  }

  getDistrics(province: BaseModel) {
    const payload: {idDistrict, idStatus, idProvince} = {idDistrict: -1, idStatus: -1, idProvince: Number(province.id)};
    this._mastersService.getDistricts(payload)
      .then(response => this.districts.value = response)
      .then(() => this.cities.value = null)
      .catch(error => {
        this.messageService.add({severity: 'error', summary: 'Cargar municipios', detail: error.message});
        throwError(error);
      });
  }

  getCities(district: BaseModel) {
    const payload: {idCity, idStatus, idDistrict} = {idCity: -1, idStatus: -1, idDistrict: Number(district.id)};
    this._mastersService.getCities(payload)
      .then(response => this.cities.value = response)
      .catch(error => {
        this.messageService.add({severity: 'error', summary: 'Cargar ciudades', detail: error.message});
        throwError(error);
      });
  }

  editAddress(idAddress: any) {
    this.addressForm = this.newAddressForm();
    this.addressToEdit = idAddress;
    const address: Address = this.addresses.find(addr => Number(addr.id) === Number(idAddress));
   this._mastersService.getCountries(-1, -1)
   .then(countries => {
        this.countries.value = countries;
        return address.idCountry;
      })
   .then(idCountry => {
      this._mastersService.getProvinces(-1, idCountry, -1)
      .then(provinces => {
        this.provinces.value = provinces;
        return address.idProvince;
      })
    .then(idProvince => {
      const filter: {} = {idProvince: idProvince, idDistrict: -1, idStatus: -1};
        this._mastersService.getDistricts(filter)
          .then(districts => {
            this.districts.value = districts;
            return address.idDistrict;
          })
          .then(idDistrict => {
            const cityFilter: {} = {idCity: -1, idDistrict: idDistrict, idStatus: -1};
            this._mastersService.getCities(cityFilter)
              .then(cities => {
                this.cities.value  = cities;
                })
                .then(() => {
                  this._mastersService.getAddressTypes()
                  .then(addressTypes => {
                    this.addressType.value = addressTypes;
                    });
                })
                .then(() => {
                  this._mastersService.getPlaceTypes()
                    .then(placesTypea => {
                  this.places.value = placesTypea;
                  });
              });
              })
              .then(() => {
                this.addressForm.patchValue({
                  idAddressType: this.addressType.value.find(place => Number(place.id) === Number(address.idAddressType)),
                  idCountry: this.countries.value.find(country => Number(country.id) === Number(address.idCountry)),
                  idProvince: this.provinces.value.find(province => Number(province.id) === Number(address.idProvince)),
                  idDistrict: this.districts.value.find(district => Number(district.id) === Number(address.idDistrict)),
                  idCity: this.cities.value.find(city => Number(city.id) === Number(address.idCity)),
                  idPlaceType: this.places.value.find(place => Number(place.id) === Number(address.idPlaceType)),
                  avenue: address.avenue,
                  street: address.street,
                  building: address.building,
                  floor: address.floor,
                  apartment: address.apartment,
                  reference: address.reference,
                  idEntity: this.profile.person.id.toString(),
                  id: this.addressToEdit
                });
                this.addressDialog = true;
              });
            });
          });
  }

  editPhone(idPhone: any) {
    this.phoneToEdit = idPhone;
    const phone: Phone = this.phones.find(addr => Number(addr.id) === Number(idPhone));

    this._mastersService.getCountries( -1, -1)
    .then(countries => {
      const phonePrefixes: CountryViewModel[] = [];
      countries.forEach(country => {
        phonePrefixes.push({
          id: country.id,
          code: country.code,
          codePrefix: country.code + ' +' +  country.prefix,
          prefix: country.prefix
        });
      });
      return {phonePrefixes: phonePrefixes};
    })
    .then(lists => {
      this.phonePrefixes.value = lists.phonePrefixes;
    })
    .then(() => {
      this._mastersService.getPhonetypes({idPhoneType: -1})
        .then(response => {
          this.phoneTypes.value = response;
        })
        .then(() => {
          this.setEditPhoneForm(phone);
        })
        .then(() => this.phoneDialog = true);
    })
    .catch(error => {
      this.messageService.add({severity: 'error', summary: 'Editar telefono', detail: error.message});
      throwError(error);
    });
  }

  setEditPhoneForm = (phone: Phone) => {
     this.phoneForm = this.newPhoneForm();
     this.phoneToEdit = phone.id;
       this.phoneForm.patchValue({
        idPhoneType: this.phoneTypes.value.find(type => type.id === phone.idPhoneType),
        prefix: this.phonePrefixes.value.find(prefix => prefix.prefix === phone.prefix),
        phoneNumber: phone.phoneNumber
      });
  }

  private newAddress = () => {
   const address: Address = {
    addressType: '',
    apartment: '',
    avenue: '',
    building: '',
    city: '',
    code: '',
    district: '',
    floor: '',
    id: 0,
    idAddressType : 0,
    idCity: 0,
    idDistrict: 0,
    idEntity: '',
    idPlaceType: 0,
    idProvince: 0,
    isActive: false,
    name: '',
    placeType: '',
    province: '',
    reference: '',
    street: '',
    latitude: 0,
    longitude: 0,
    country: '',
    idCountry: 0
  };
  return address;
  }

  private newAddressForm = () => {
  return this.formBuilder.group({
    id: -1,
    idAddressType: [0, Validators.required],
    idCountry: [0, Validators.required],
    idCity: [0, Validators.required],
    idDistrict: [0, Validators.required],
    idProvince: [0, Validators.required],
    idPlaceType: [0, Validators.required],
    avenue: [''],
    street: ['', Validators.required],
    building: ['', Validators.required],
    floor: ['', Validators.maxLength(2)],
    apartment: ['', Validators.maxLength(4)],
    reference: ''
  });
  }

  private newPhone = () => {
    const phone: Phone = {
     code: '',
     id: 0,
     idCountry: 0,
     idEntity: 0,
     idPhoneType: 0,
     isActive: false,
     name: '',
     phoneNumber: '',
     phoneType: '',
     prefix: ''
   };
   return phone;
  }

  private newPhoneForm = () => {
    return this.formBuilder.group({
      idPhoneType: [0, Validators.required],
      phoneNumber: ['', Validators.required],
      prefix: [0, Validators.required],
    });
  }

  private newProfileForm = () => {
      return this.formBuilder.group({
        mainEmail: ['', Validators.compose([
            Validators.pattern('^[_aA-zZ0-9._%+-]+@[_aA-zZ0-9.-]+\\.[Aa-zZ]{2,4}$'), Validators.required])],
        repeatMainEmail: ['', Validators.compose([
          Validators.pattern('^[_aA-zZ0-9._%+-]+@[_aA-zZ0-9.-]+\\.[Aa-zZ]{2,4}$'), Validators.required])],
        secondaryEmail: ['', Validators.pattern('^[aA-zZ0-9._%+-]+@[aA-zZ0-90-9.-]+\\.[a-z]{2,4}$')],
        imagen: ['']
    },
    {validators: ConfirmedValidator('mainEmail', 'repeatMainEmail')}
    );
  }

}
