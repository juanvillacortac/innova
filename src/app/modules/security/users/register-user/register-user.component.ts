import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MessageService, SelectItem} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';

import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Entity } from 'src/app/models/security/Entity';
import { User } from 'src/app/models/security/User';
import { Address } from 'src/app/models/users/Address';
import { Phone } from 'src/app/models/users/Phones';
import { EntityViewModel } from '../../shared/view-models/Entity.viewmodel';
import { IdentityViewModel } from '../../shared/view-models/Identity.viewmodel';
import { UserViewModel } from '../../shared/view-models/User.viewmodel';
import { UserService } from '../shared/user.service';
import { CountryViewModel } from 'src/app/modules/users/shared/view-model/country.viewmodel';
import { MastersService } from 'src/app/modules/users/shared/masters.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  providers:[]
})

export class RegisterUserComponent implements OnInit {
  userForm: FormGroup;
  entityExistsForm: FormGroup;
  id: string;
  submitted = false;
  isAddMode: boolean;
  isWizardMode: boolean;
  genderOptions = [{'value': 'F', 'label': 'Femenino'} , {'value': 'M', 'label': 'Masculino'}];
  maritalOptions = [{'value': 'C', 'label': 'Casado(a)'}, {'value': 'D', 'label': 'Divorciado(a)'},
                    {'value': 'S', 'label': 'Soltero(a)'}, {'value': 'V', 'label': 'Viudo(a)'}];
  identifierTypeOptions = [];
  statusOptions = [{'value': 1, 'label': 'Activo'} , {'value': 0, 'label': 'Inactivo'}];
  minDate: Date;
  maxDate: Date;
  phonePrefixes: SelectItem<CountryViewModel[]> = {value: null};
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _mastersService: MastersService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Seguridad' },
      { label: 'Usuarios', routerLink: ['/user-list'] }
  ]);
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadIdentifierTypes();
  }

async ngOnInit() {
    this.isWizardMode = this.route.snapshot.url[0].path === 'registro' ?? false;
    this.id = this.route.snapshot.params['id'] ?? '';
    this.isAddMode = !this.id;
    this.entityExistsForm = this.setNewEntityExistsForm();
    this.userForm = this.setNewUserForm();
    this.enableUserForm(false);
    this.enableInputDni(false);
    this.getPrefixes().then(() => { this.getUser() });
}

getPrefixes() {
 return this._mastersService.getCountries( -1, -1)
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
    this.phonePrefixes.value = phonePrefixes
  }).catch(error => {
    this.messageService.add({key:'register-user',severity: 'error', summary: 'Cargar datos', detail: error.message});
  });
}

getUser() {
  if (this.id) {
    this._userService.getUserEntity(Number(this.id)).subscribe(
     (user: User) => {
       if (user && user.person) {
        const person = this.personToViewModel(user.person);
        const userViewModel = this.userToViewModel(person, user);
        const identityViewModel = this.identityToViewModel(user.person);
        this.userForm.patchValue(userViewModel);
        this.entityExistsForm.patchValue(identityViewModel);
        this.enableUserForm(false);
        this.entityExistsForm.disable();
       } else {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Datos incompletos', detail: "El usuario seleccionado posee datos incompletos"});
       }
      }
    );
  }
}

phoneToSave() {
  const formValues = {...this.userForm.value};
  const phonesToSave: Phone[] = [];
  if (formValues.person.phones) {
      const formPhoneValues = {...formValues.person.phones};
      phonesToSave.push({
        id: -1,
        idEntity: Number(formValues.person.id),
        idPhoneType: 1,
        idCountry: Number(formPhoneValues.prefix.id),
        phoneType: '',
        phoneNumber: formPhoneValues.phoneNumber,
        prefix: formPhoneValues.prefix.prefix
      });
  }
  return phonesToSave;

}

async onSubmitEntity() {
  this.submitted = true;

  if (this.userForm.invalid && this.entityExistsForm.invalid) {
    return null;
  }
  const formValues = {...this.userForm.value};
  let payload: User = this.getPayloadFromForm(formValues);
  if (this.isAddMode) {
    return this._userService.createEntity(payload)
      .subscribe(
          result => {
            this.messageService.add({key:'register-user',severity: 'success', summary: 'Creacion de Usuario', detail: 'Usuario creado de forma exitosa'});
            this.userForm.reset(this.setNewUserForm());
            this.entityExistsForm.reset(this.setNewEntityExistsForm());
            if (this.isWizardMode) {
              this.router.navigate(['register-wizard/roles', result]);
            }
          },
          (error) => {
            this.messageService.add({key:'register-user',severity: 'error', summary: 'Creacion de Usuario', detail: error.message});
          }
      );
  } else {
    return null
  }
}

getPayloadFromForm(formValues: any): User {
  const phones: Phone[] = this.phoneToSave();
  const address: Address[] = [];
  const birthDate = formValues.person.birthDate
  return {
    id: Number(formValues.id ?? 0),
    idEntity: -1,
    phone: phones.find(item => item.id === -1),
    mainEmail: formValues.mainEmail,
    observations: formValues.observations ?? '',
    secondaryEmail: formValues.secondaryEmail ?? '',
    status: this.statusOptions.find(status => status.value === 1)?.value ?? 1,
    person: {
      birthDate: this.utcToLocal(birthDate),
      businessReason: formValues.person.businessReason ?? '',
      dniNumber: this.entityExistsForm.value.dniNumber,
      gender: formValues.person.gender,
      id: Number(formValues.person.id ?? -1) ?? -1,
      identifierType: Number(this.entityExistsForm.value.identifierType),
      imagen: formValues.person.imagen ?? '',
      lastName: formValues.person.lastName,
      maritalStatus: formValues.person.maritalStatus,
      name: formValues.person.name,
      nit: formValues.person.nit ?? '',
      observations: formValues.person.observations ?? '',
      secondLastName: formValues.person.secondLastName ?? '',
      secondName: formValues.person.secondName ?? '',
      status: Number(formValues.person.status),
      tradeName: formValues.person.tradeName ?? '',
      address: address,
      phones: phones
    }
  };
}

async onCheckEntityExist() {
  let identityViewModel: IdentityViewModel;
  identityViewModel = {
    Id: 0,
    IdentifierTypeId: Number(this.entityExistsForm.controls.identifierType.value),
    DniNumber: this.entityExistsForm.controls.dniNumber.value
  };
  this.enableUserForm(false);
  return this._userService.getEntity(identityViewModel).subscribe(
    result => {
      if (result){
        const person: EntityViewModel = this.personToViewModel(result);
        const userActive: User = result.users?.find(p => p.status);
        const userViewModel = this.userToViewModel(person, userActive);
        this.userForm.setValue(userViewModel);
        this.enableUserForm(!userActive);
        if(userActive)
        {
          this.messageService.add({
            key:'register-user', 
            severity: 'error', 
            summary: 'Verificacion de persona', 
            detail: 'El usuario ya se encuentra registrado.'});
        }
      }
    },
    (error)  => {
      console.log("ERROR NUEVO", error);
      if(error.Code !== 404)
      {
        if (error.ErrorMsg !== undefined) {   
          this.messageService.add({key:'register-user',severity: 'warn', summary: 'Verificacion de persona', detail: error.ErrorMsg});
        } else {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Verificacion de persona',
          detail: 'Ocrurrio un error al consultar el documento'});
        }
      }
      else
      {
        this.enableUserForm(true);
        this.userForm.reset();
      }
    });
}

private setNewUserForm() {
    return this.formBuilder.group({
      mainEmail: ['', Validators.pattern('^[_aA-zZ0-9._%+-]+@[_aA-zZ0-9.-]+\\.[Aa-zZ]{2,4}$')],
      secondaryEmail: ['', Validators.pattern('^[aA-zZ0-9._%+-]+@[aA-zZ0-90-9.-]+\\.[a-z]{2,4}$')],
      status: [''],
      observations: [''],
      id: [0],
      phone: this.formBuilder.group({
        id: [0],
        idPhoneType: 0,
        phoneType:  '',
        idEntity : 0,
        idCountry : 0,
        prefix : [''],
        phoneNumber: [''],
      }),
      person: this.formBuilder.group({
        id: [{value: -1, disabled: true}],
        name: ['', Validators.required],
        secondName: [''],
        lastName: ['', Validators.required],
        secondLastName: [''],
        identifierType: [{value: '', disabled: true}],
        dniNumber: [''],
        birthDate : ['', Validators.required],
        maritalStatus : ['', Validators.required],
        status: [''],
        gender : ['', Validators.required],
        observations: [''],
        businessReason: [''],
        tradeName: [''],
        nit: [''],
        imagen: [''],
        phones: this.formBuilder.group({
          id: [0],
          idPhoneType: 0,
          phoneType:  '',
          idEntity : 0,
          idCountry : 0,
          prefix : ['', Validators.required],
          phoneNumber: ['', Validators.required],
        })
      }),
    }
    );
}

onidentifierTypeSelected() {
this.enableInputDni(true);
this.entityExistsForm.controls['dniNumber'].reset();
this.userForm.reset(this.setNewUserForm());
this.enableUserForm(false);

}
onDniNumberKeyUp() {
  this.userForm.reset(this.setNewUserForm());
  this.enableUserForm(false);
}

private enableUserForm(isEnable: boolean) {
  if (isEnable) {
    this.userForm.enable();
  } else {
    this.userForm.disable();
  }
}

private enableInputDni(isEnable: boolean) {
  if (isEnable) {
    this.entityExistsForm.controls['dniNumber'].enable();
  } else {
    this.entityExistsForm.controls['dniNumber'].disable();
  }
}

private setNewEntityExistsForm() {
  return  this.formBuilder.group({
    identifierType: ['', Validators.required],
    dniNumber: ['', [Validators.required, Validators.maxLength(15)]],
  });
}

async loadIdentifierTypes() {
  return this._userService.getIdentifierTypes(-1, 1).subscribe( res => {
    res.map((data) => {
      this.identifierTypeOptions.push({
        value: data.id,
        label: data.type.toString().concat(' ( ' + data.identifier + ' )')
      });
    });
    this.identifierTypeOptions.sort((a, b) => a.label.localeCompare(b.label))
  },
  (error) => {
    this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documentos'});

  });
}

private personToViewModel(person: Entity) {
  const personViewModel: EntityViewModel = <EntityViewModel>{
    identifierType: person.identifierType ?? 0,
    dniNumber: person.dniNumber,
    birthDate: this.utcToLocal(new Date(person.birthDate)),
    businessReason: person.businessReason,
    gender: this.genderOptions.find(gender => gender.value === person.gender)?.value ?? 'A',
    id: Number(person.id ?? -1),
    imagen: person.imagen,
    lastName: person.lastName,
    maritalStatus: this.maritalOptions.find( marital => marital.value === person.maritalStatus)?.value ?? 'C',
    name: person.name,
    nit: person.nit,
    observations: person.observations,
    secondLastName: person.secondLastName,
    secondName: person.secondName,
    status: this.statusOptions.find(status => status.value === Number(person.status))?.value ?? 1,
    tradeName: person.tradeName,
    phones:  this.phoneToViewModel(person.phones)

  };
  return personViewModel;
}

private phoneToViewModel(phones: Phone[]) {
  let phone: Phone = this.resetPhoneModel();
  if (phones != null ) {
    if (phones.length > 0) {
      const phonesList = phones?.find(phoneType => phoneType.idPhoneType === Number(1));
        if (phonesList != null) {
                phone = <Phone> {
                id: phonesList?.id ?? 0,
                idPhoneType: phonesList?.idPhoneType ?? 0,
                phoneType:  phonesList?.phoneType ?? '',
                phoneNumber: phonesList?.phoneNumber ?? '',
                prefix:  this.phonePrefixes?.value.find(prefix => prefix.prefix === phonesList.prefix) ?? '',
                idEntity : phonesList?.idEntity ?? '',
                idCountry : phonesList?.idCountry ?? 0
              };
        }
    }
  }
return phone;
}

private resetPhoneModel() {
  let phone: Phone;
 return  phone = <Phone> {
  id: 0,
  idPhoneType: 0,
  phoneType:  '',
  phoneNumber:  '',
  prefix:  '',
  idEntity : 0,
  idCountry : 0
  };
}

private userToViewModel(person: EntityViewModel, user: User = null) {
  const userViewModel: UserViewModel = {
    mainEmail: user?.mainEmail ?? '',
    observations: user?.observations ?? '',
    secondaryEmail: user?.secondaryEmail ?? '',
    status: this.statusOptions.find(status => status.value === user?.status)?.value ?? 0,
    id: user?.id ?? -1,
    phone:  this.resetPhoneModel(),
    person: person
  };

  return userViewModel;
}
private identityToViewModel(person: Entity) {
  const identityViewModel: IdentityForm = {
    identifierType: person.identifierType ?? 0,
    dniNumber: person.dniNumber,
  };
  return identityViewModel;
}

private utcToLocal(date: Date): Date {
  return new Date(
    date.getUTCFullYear(), 
    date.getUTCMonth(), 
    date.getUTCDate(),  
    date.getUTCHours(), 
    date.getUTCMinutes(), 
    date.getUTCSeconds()
  );
}

public resetForm() {
  if (this.userForm.dirty || this.entityExistsForm.dirty) {
    this.confirmationService.confirm({
      message: '¿Desea cancelar el proceso de registrar usuario?',
      accept: () => {
        this.userForm.reset(this.setNewUserForm());
        this.entityExistsForm.reset(this.setNewEntityExistsForm());
        this.router.navigate(['user-list']);
      }
    });
  } else {
    this.router.navigate(['user-list']);
  }
}

}
export class IdentityForm {
  identifierType: number;
  dniNumber: string;
}
