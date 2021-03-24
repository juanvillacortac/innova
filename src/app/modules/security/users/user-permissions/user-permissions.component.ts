import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Module } from 'src/app/models/security/Module';
import { Office } from 'src/app/models/security/Office';
import { Permission } from 'src/app/models/security/Permission';
import { SecurityService } from '../../shared/services/security.service';
import { UpdatePermission } from 'src/app/models/security/UpdatePermission';
import { UserPermission } from 'src/app/models/security/UserPermission';
import { Access } from 'src/app/models/security/Access';
import { MessageService, SelectItem } from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { PermissionViewModel } from '../../shared/view-models/Permissions.viewmodel';


@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html'
})
export class UserPermissionsComponent implements OnInit {
  permissionsForm: FormGroup;
  systems: SelectItem[] = [];
  apps: SelectItem[] = [];
  modules: TreeNode[] = [];
  permissions: Permission[] = [];
  offices: SelectItem[] = [];

  selectedSubModule: string;
  permisionsView: PermissionViewModel[] = [];
  permissionShowing: PermissionViewModel[] = [];
  permissionsEdited: PermissionViewModel[] = [];
  accessByUser: Access[] = [];
  selectAll: boolean;
  selectAllLabel = 'Todos';
  showModules = false;
  constructor(
      public securityService: SecurityService,
      private formBuilder: FormBuilder,
      private actRoute: ActivatedRoute,
      private messageService: MessageService) {
    this.permissionsForm = this.formBuilder.group({
      idUser: 0,
      idUserModifing: 0,
      idOffice: [0, Validators.required],
      idSystem: [0, Validators.required],
      idApp: [0, Validators.required],
      idCompany: 1,
      permissionsUpdate: [],
      permissionsSelected:  [false, Validators.requiredTrue]
    });
  }

  get permissionCount() {
    return this.permissionShowing.length;
  }
  ngOnInit(): void {
    const id = this.actRoute.snapshot.params['id'];
    if (id) {
     this.permissionsForm.controls.idUser.setValue(id);
    }
    this.getSystems();
    this.getOfficeByCompany(this.permissionsForm.get('idCompany').value);
  }

  onSystemSelected(system) {
    this.apps=[];
    this.modules =[];
    if(system)
    {
      this.getApps(system);
    }
    else
    {
      this.permissionsForm.controls.idApp.setValue(-1);
      this.showModules = false;
    }
  }
onCleanModules(){
  this.modules =[];
  this.permissionsEdited= [];
  this.permissionShowing = [];
  this.selectedSubModule ="";
  this.permissionsForm.controls.idOffice.setValue(-1);
}
  onAppSelected(app) {
    this.onCleanModules();
    if(app) {
      this.getModulesTree(app);
    } else {
      this.permissionsForm.controls.idApp.setValue(-1);
      this.showModules = false;
    }
  }

  onModuleSelected(module) {
    this.getPermissionByModulePromise(module.key).then(permissions => {
      if (module.parent) {
        this.selectedSubModule = module.label;
        this.permissionShowing = this.permisionsView.filter(x => x.idModule === Number(module.key));
        if (this.permissionShowing.length > 0) {
          this.selectPermission(module);
        } else {
          this.messageService.add({key:'user-permissions',severity: 'warn', summary: 'Módulo ' + module.label  , detail: 'No posee acciones'});
        }
        this.selectAll = false;
      }
    });
  }

  onSubModuleSelected(selected: Module) {
    this.selectedSubModule = selected.name;
    this.permissionShowing = this.permisionsView.filter(x => x.idModule === selected.id);
    this.cleanPermissionSelected();
    this.selectPermission(selected);
  }

  onPermissionSelected() {
    let selectedItems = this.permisionsView.filter(x => x.selected);
    console.log(selectedItems)
    this.enableCheckList(selectedItems.length > 0)
  }
  
  enableCheckList(enabled: boolean) {
    this.permissionsForm.get('permissionsSelected').setValue(enabled);  
  }

  onOfficeSelected(office) {
    this.cleanPermissionSelected();
    this.permissionsEdited= [];
    this.permissionShowing = [];
    this.selectedSubModule ="";
    if(office)
    {
      this.showModules = this.modules.length > 0 ? true: false;
      this.getUserPermission(office);
    }
    else
    {
      this.showModules = false;
    }
  }
  getSystems() {
    this.securityService.getSystems().subscribe(result => {
       this.systems = result;
    }, (error) => {
      this.messageService.add({key:'user-permissions',severity: 'error', summary: 'Cargar sistemas', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  getApps(systemId) {
    this.securityService.getAppsBySystem(systemId).subscribe(result => {
      this.apps = result;
    }, (error) => {
      this.messageService.add({key:'user-permissions',severity: 'error', summary: 'Cargar aplicaciones', detail: error.error.message});
      console.log(error.error.message);
    });
  }
 getOfficeByCompany(companyId) {
  const officeByCompany: SelectItem[] = [];
  this.securityService.getOffices(companyId).subscribe(result => {
    result.map((data: Office) => {
        const option: SelectItem = {
          value: data.id,
          label: data.name
        };
        officeByCompany.push(option);
      this.offices = officeByCompany;
    });
  }, (error) => {
    this.messageService.add({key:'user-permissions',severity: 'error', summary: 'Cargar sucursales', detail: error.error.message});
    console.log(error.error.message);
  });
}
 getPermissionsOfModule(idModule) {
  this.securityService.getPermissionByModule(idModule)
    .subscribe(permissions => {
      this.permissionsToViewModel(permissions);
    }, (error) => {
      this.messageService.add({key:'user-permissions',severity: 'error', summary: 'Cargar permisos del modulo', detail: error.error.message});
      console.log(error.error.message);
    });
  }

  getPermissionByModulePromise = (idModule: number) => {
    return  this.securityService.getPermissionByModulePromise(idModule)
    .then(permissions => {
      this.permissionsToViewModel(permissions);
    }, (error) => {
      this.messageService.add({key:'user-permissions',severity: 'error', summary: 'Cargar permisos del modulo', detail: error.error.message});
      console.log(error.error.message);
    });

  }
  getModulesTree(idApp) {
    this.securityService.getModulesTree(idApp)
      .subscribe(result => {
      this.modules = result;
      //this.showModules = this.permissionsForm.get('idOffice').value ? true: false;
      }, (error) => {
        this.messageService.add({key:'user-permissions',severity: 'error', summary: 'Cargar módulos', detail: error.message});
        console.log(error.message);
      });
  }
  getUserPermission(idOffice) {
    const payloadAccess = {
      idUser: Number(this.permissionsForm.controls.idUser.value),
      idCompany: this.permissionsForm.controls.idCompany.value,
      idSubsidiary: idOffice
    };
    this.securityService.getAccessPromise(payloadAccess).then(accesses => {
      this.accessByUser = accesses;
      },
      (error) => {
        this.messageService.add({key:'user-permissions',severity: 'error', summary: 'Cargar permisos',
          detail: 'Ocurrio un error al obtener los permisos del usuario'});
      });
  }
  onSave() {
    const permission: UpdatePermission[] = [];
    this.permisionsView.forEach(element => {
      permission.push({IdPermission: element.id, IsActive: element.selected});
    });
    let userPermissionViewModel: UserPermission;
    userPermissionViewModel = {
      IdUser: Number(this.permissionsForm.controls.idUser.value),
      IdUserModifing: Number(this.permissionsForm.controls.idUser.value),
      IdCompany: this.permissionsForm.controls.idCompany.value,
      IdOffice: this.permissionsForm.controls.idOffice.value,
      PermissionsUpdate: permission
    };
    this.securityService.addUserPermission(userPermissionViewModel).subscribe(result => {
      if (result) {
        this.messageService.add({key:'user-permissions',severity:'success', summary:'Asignar permisos', detail:'Permisos agregados al usuario'});
        this.getUserPermission(this.permissionsForm.controls.idOffice.value);
      } else {
        this.messageService.add({key:'user-permissions',severity:'error', summary:'Asignar permisos', detail:'Error al asignar permisos al usuario'});
      }
    }, (error) => {
      this.messageService.add({key:'user-permissions',severity:'error', summary:'Asignar permisos', detail:error.error.message});
      console.log(error.error.message);
    });
  }

  private getSubModules(idModule: any) {
    const subModules: TreeNode[] = [];
    console.log(this.permisionsView);
    this.permisionsView
    .filter(x => x.idModuleParent === Number(idModule))
    .forEach(element => { this.pushIfNotExist(subModules, element); });
    this.modules.find(x => Number(x.key) === Number(idModule)).children = subModules;
  }
  private pushIfNotExist(subModules: TreeNode[], element: PermissionViewModel) {
    if (subModules.find(item => Number(item.key) === element.idModule ) == null) {
      subModules.push({ label: element.module, key: String(element.idModule)});
    }
  }


  private permissionsToViewModel(result: Permission[]) {
    result.map(item => {
      if (this.permisionsView.find(p => item.id === p.id ) == null) {
        const perms: PermissionViewModel = {
          id: item.id,
          idModule: item.idModule,
          idModuleParent: item.idModuleParent,
          module: item.module,
          name: item.name,
          selected: item.selected
        };
          this.permisionsView.push(perms);
      }
    });
  }

  private cleanPermissionSelected() {
    this.permissionShowing.forEach(element => {
     element.selected = false;
    });

  }
  private AddPermissionSelected() {
    this.permissionShowing.forEach(element => {
      const permissionEdited =this.permissionsEdited.find(p => element.id === p.id)
        if (!permissionEdited) {
          this.permissionsEdited.push(element);
        }
    });
    this.onPermissionSelected();
  }
  private selectPermission(selected) {
    const userPermissionsFiltered = this.accessByUser.filter(x => x.idModule === Number(selected.key));
    userPermissionsFiltered.forEach(element => {
      if (!this.permissionsEdited.find(p => element.id === p.id)) {
      this.permissionShowing.find(x => x.id === element.id).selected = true;
      }
    });
    this.AddPermissionSelected();
  }

  onSelectAll = ($event) => {
    this.permissionShowing.forEach(perm => {
      perm.selected = $event.checked;
    });
    this.onPermissionSelected();
  }
}
