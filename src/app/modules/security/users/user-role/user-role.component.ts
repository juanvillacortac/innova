import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';

import { SecurityService } from '../../shared/services/security.service';
import { RoleService } from '../../roles/shared/role.service';
import { RoleByUser } from 'src/app/models/security/RoleByUser';
import { Software } from 'src/app/models/security/Software';
import { Role } from 'src/app/models/security/Role';
import { CheckOption } from 'src/app/modules/common/components/check-list/check-list.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  user_id: string;
  addUserRoleForm: FormGroup;
  systems: Software[] = [];
  allRoles: Role[] = [];
  rolTypes: SelectItem[] = [];
  roles: SelectItem[] = [];
  apps: SelectItem[] = [];
  offices: Offices[] = [];
  newUserRole: RoleByUser[] = [];
  userRoles: RoleByUser[] = [];
  officesView: CheckOption[] = [];
  isEdit = false;
  isWizardMode: boolean;
  formTitle: string;
  selectAll: boolean;
  selectAllLabel = 'Todos';
  roleTypeSelected = false;
  roleAdded: boolean;
  @Output() public onHideEditForm: EventEmitter<boolean> = new EventEmitter();
  @Input() idRole: number;
  @Input() idRoleType: number;

  constructor(
      public securityService: SecurityService,
      public service: RoleService,
      private formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private actRoute: ActivatedRoute,
      private messageService: MessageService) {
    this.addUserRoleForm = this.formBuilder.group({
      idType: ['', Validators.required],
      idRole: ['', Validators.required],
      idCompany: [1, Validators.required],
      idSystem: '',
      isActive: true,
      idOffices: '',
      officesIds: [],
      idUser: ['', Validators.required],
      officesSelected:  [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
  
   this.isWizardMode = this.route.snapshot.url[0].path === 'roles' ?? false;
   const id = this.actRoute.snapshot.params['id'];
   if (id) {
    this.addUserRoleForm.controls.idUser.setValue(id);
   }
   if (this.idRole > 0) {
     this.formTitle = 'Editar rol';
     this.isEdit = true;
     this.getRoleByTypePromise(this.idRoleType).then(permissions =>{
      this.getRolesTypePromise().then(roleType =>{
        this.getOfficeByCompanyPromise(this.addUserRoleForm.get('idCompany').value).then(office =>{
          this.getUserRoles().then(user =>{
              this.onEditForm(); 
          });  
        });     
      });
     });
     
   } else {
    this.formTitle = 'Asignar rol';
    this.isEdit = false;
    this.getRolesType();
    this.getOfficeByCompany(this.addUserRoleForm.get('idCompany').value);
    this.getUserRoles();
   }
   
  }

  onEditForm() {
    this.onRoleSelected(this.idRole);
    this.addUserRoleForm.controls.idRole.setValue(this.idRole);
    this.addUserRoleForm.controls.idType.setValue(this.idRoleType);
    this.addUserRoleForm.controls.idSystem.setValue(1);
    this.addUserRoleForm.controls.officesSelected.setValue(true);
  }
  onRoleTypeSelected(roleType) {
    this.cleanOfficesSelected();
    if(roleType)
    {
      this.roleTypeSelected = true;
      this.getRoleByType(roleType);
    }
    else
    {
      this.roles =[];
      this.allRoles =[];
      this.systems = [];
      this.selectAll = false;
      this.roleTypeSelected = false;
    }

  }
  onRoleSelected(role) {
    this.cleanOfficesSelected();
    this.systems = [];
    this.selectAll = false;
    if(role)
    {
      this.selectOfficesByRole(role);
      this.getSystems(role);
      this.validateUserRole(role);
    }  
  }
  validateUserRole(role)
  {
    const roleAdded= this.userRoles.find(x => x.idRole === role);

    if(roleAdded && !this.isEdit)
    {
        this.roleAdded = true;
    }
    else
    {
      this.roleAdded = false;
    }

  }
  onOfficesSelected(_options: [CheckOption]): void {
    const isSelected = this.officesView.filter(x => x.selected);
    this.enableSaveButton(isSelected.length > 0 || this.isEdit)
    this.selectAll = this.officesView.every(x => x.selected)
  }

  enableSaveButton(enable: Boolean) {
    this.addUserRoleForm.get('officesSelected').setValue(enable);  
  }

  onSave() {
    const selectedIds = this.officesView.filter(x => x.selected).map(item => item.id);
    if(selectedIds.length == 0 && !this.isEdit)
    {   
      this.messageService.add({key: 'user-role', severity:'warn', summary: 'Asignar roles', detail: 'Debe seleccionar al menos una sucursal'});
      return;
    }
    this.addUserRoleForm.get('officesIds').setValue(selectedIds);
    const idUser = Number(this.addUserRoleForm.controls.idUser.value);
    const idRole = this.addUserRoleForm.get('idRole').value;
    const idCompany = this.addUserRoleForm.get('idCompany').value;
    const newUserRole: RoleByUser[] = [];
    this.officesView.forEach(element => {
      newUserRole.push({id: -1, idUser: idUser, idRole: idRole, idCompany: idCompany, idSubsidiary: element.id, isActive: element.selected})
    });
    this.service.addUserRole(newUserRole).subscribe(result => {
      if (result) {
        this.messageService.add({severity: 'success', summary: 'Asignar roles', detail: 'Roles agregados al usuario'});
        if(this.isWizardMode)
        {
          this.router.navigate(['register-wizard/permisos', idUser]);
        }
        else{
          this.getUserRoles();
          this.onEmitHideForm(true);
        }
      } else {
        this.messageService.add({key: 'user-role',severity: 'warn', summary: 'Asignar roles', detail: 'Ocurrio un error al asignar el rol al usuario'});
        if(!this.isWizardMode)
        {
          this.onEmitHideForm(false);
        }
        
      }
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Asignar roles', detail: error.error.message});
      this.onEmitHideForm(false);
      console.log(error.error.message);
    });
  }

  getSystems(role) {
    const softwaresByRole : Software[]=[];
    const rolesFiltered = this.allRoles.find(x => x.id === role).softwares;
    rolesFiltered.forEach(element => {
      softwaresByRole.push(element)
    });
    this.systems = softwaresByRole;
  }

  getRolesType() {
    const roleType: SelectItem[] = [];
    this.service.getRoleTypes().subscribe(result => {
      result.map((data) => {
        const option: SelectItem = {
          value: data.id,
          label: data.name
        };
        roleType.push(option);
      this.rolTypes = roleType;
    });
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Cargar tipo de roles', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  getRoleByTypePromise = (typeRole : number)=> {
    const roles: SelectItem[] = [];
    this.roles = roles;
    return this.service.getRolesPromise(typeRole, -1).then(result => {
      result.map((data) => {
        const option: SelectItem = {
          value: data.id,
          label: data.name
        };
        roles.push(option);
      this.roles = roles;
      this.allRoles = result;
    });
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Cargar roles', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  getRolesTypePromise = () => {
    const roleType: SelectItem[] = [];
    return this.service.getRoleTypesPromise().then(result => {
      result.map((data) => {
        const option: SelectItem = {
          value: data.id,
          label: data.name
        };
        roleType.push(option);
      this.rolTypes = roleType;
    });
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Cargar tipo de roles', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  getOfficeByCompanyPromise = (companyId : number)=> {
    return  this.securityService.getOfficesPromise(companyId).then(result => {
      result.map(item => {
        this.officesView.push({
          id: item.id,
          name: item.name,
          selected: false
        });
      });
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Cargar sucursales', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  getOfficeByCompany(companyId) {
    this.securityService.getOffices(companyId).subscribe(result => {
      result.map(item => {
        this.officesView.push({
          id: item.id,
          name: item.name,
          selected: false
        });
      });
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Cargar sucursales', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  getRoleByType(typeRole) {
    const roles: SelectItem[] = [];
    this.roles = roles;
    this.service.getRoles(typeRole, -1).subscribe(result => {
      result.map((data) => {
        const option: SelectItem = {
          value: data.id,
          label: data.name
        };
        roles.push(option);
      this.roles = roles;
      this.allRoles = result;
    });
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Cargar roles', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  getUserRoles= ()=> {
    const idUser = Number(this.addUserRoleForm.controls.idUser.value);
    const idCompany = this.addUserRoleForm.get('idCompany').value;

   return this.service.getUserRoles(idCompany, idUser).then(result => {
      this.userRoles = result;   
    }, (error) => {
      this.messageService.add({key: 'user-role',severity:'error', summary:'Cargar roles del usuario', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  private cleanOfficesSelected() {
    this.officesView.forEach(element => {
     element.selected = false;
    });
    this.enableSaveButton(false)
  }
  private selectOfficesByRole(role) {
    const userRolesFiltered = this.userRoles.filter(x => x.idRole === role);
    userRolesFiltered.forEach(element => {
      this.officesView.find(x => x.id === element.idSubsidiary).selected = true;
    });
  }
  public onEmitHideForm(reload: boolean): void {
    this.onHideEditForm.emit(reload);
}

}
export class RoleType {
  id: number;
  name: string;
}
export class Roles {
  id: number;
  name: string;
}

export class System {
  id: number;
  name: string;
}

export class App {
  id: number;
  name: string;
}

export class Offices {
  id: number;
  name: string;
  selected: boolean;
}
