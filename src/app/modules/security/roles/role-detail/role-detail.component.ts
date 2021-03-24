import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { Access } from 'src/app/models/security/Access';
import { Module } from 'src/app/models/security/Module';
import { Permission } from 'src/app/models/security/Permission';
import { Role } from 'src/app/models/security/Role';
import { UpdatePermission } from 'src/app/models/security/UpdatePermission';
import { SecurityService } from '../../shared/services/security.service';
import { PermissionViewModel } from '../../shared/view-models/Permissions.viewmodel';
import { RoleService } from '../shared/role.service';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {
  roleForm: FormGroup;
  systemId: number;
  idApp : number;
  systems: SelectItem[] = [];
  rolTypes: SelectItem[] = [];
  apps: SelectItem[] = [];
  modules: TreeNode[] = [];
  permissions: Permission[] = [];
  permissionsByRole: Access[] = [];
  newRole = new Role();
  roleStatus = Boolean();
  isEdit= false;
  formTitle: string;
  permissionsEdited: PermissionViewModel[] = [];
  @Output() public onHideEditForm: EventEmitter<boolean> = new EventEmitter();
  @Input() roleSelected: Role;

  selectedSubModule = '';
  permisionsView: PermissionViewModel[] = [];
  permissionShowing: PermissionViewModel[] = [];


  constructor(public securityService: SecurityService, 
    public roleService: RoleService, 
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    this.roleForm = this.formBuilder.group({
      id:-1,
      name: ['', Validators.required],
      systemId: 0,
      idApp: 0,
      idType: ['', Validators.required],
      idCompany: 1,
      isActive: true,
      permissions: [],
      permissionsSelected:  [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    if(this.roleSelected)
    { 
      this.formTitle="Editar rol"
      this.isEdit = true;
    }
    else
    {
     this.formTitle="Nuevo rol"
     this.isEdit = false;
     this.roleForm.controls.isActive.setValue(true);

    }
    this.getModulesTree(-1);
    this.getRolesType();

  }

  onEditForm(){
    this.getPermissionsOfRole(this.roleSelected.id).then(permissions =>{
      this.roleForm.controls.id.setValue(this.roleSelected.id);
      this.roleForm.controls.name.setValue(this.roleSelected.name);
      this.roleForm.controls.idType.setValue(this.roleSelected.idType);
      this.roleForm.controls.isActive.setValue(this.roleSelected.isActive);
      this.roleForm.controls.permissionsSelected.setValue(true);

    });

  }
  onModuleSelected(module) {
    this.getPermissionByModulePromise(module.key).then(permissions => {
    if (module.parent) {
      this.selectedSubModule = module.label;
      this.permissionShowing = this.permisionsView.filter(x => x.idModule === Number(module.key));
      if( this.permissionShowing.length > 0)
      {
        this.selectPermission(module);
      }
      else
      {
        this.messageService.add({key: 'role-detail', severity:'warn', summary: "Módulo " + module.label  , detail: 'No posee acciones'});
      }     
    } 
  })
  }


  onSubModuleSelected(selected: Module) {
    this.selectedSubModule = selected.name;
    this.permissionShowing = this.permisionsView.filter(x => x.idModule === selected.id);
    this.selectPermission(selected);
  }

  onPermissionSelected() {
    const isSelected = this.permisionsView.filter(x => x.selected);
    let hasSelectedItems = isSelected.length > 0
    this.roleForm.get('permissionsSelected').setValue(hasSelectedItems);
  }

  onSave() {
    let permissions = this.permissionVMToUpdatePermissionModel();
    this.roleForm.get('permissions').setValue(permissions);
    const newRole = this.roleForm.getRawValue();
    this.roleService.createRole(newRole).subscribe(result => {
      if (result) {
        this.messageService.add({key: 'role-detail',severity:'success', summary: (this.isEdit ? 'Editar'  : 'Crear' ) + ' rol'  , detail: 'Rol ' + (this.isEdit ? 'editado'  : 'creado' ) + ' de forma correcta'});
          this.onEmitHideForm(true);
      } else {
        this.messageService.add({key: 'role-detail',severity:'error', summary: (this.isEdit ? 'Editar'  : 'Crear' ) + ' rol', detail: 'Error al '+ (this.isEdit ? 'editar'  : 'crear' )  + ' rol'});
        this.onEmitHideForm(false);
      }
    }, (error) => {
      this.messageService.add({key: 'role-detail',severity:'error', summary: (this.isEdit ? 'Editar'  : 'Crear' ) + ' rol', detail: error.error.message});
      this.onEmitHideForm(false);
      console.log(error.error.message);
    });
  }

  getRolesType() {
    const roleType: SelectItem[] = [];
    this.roleService.getRoleTypes().subscribe(result => {
      result.map((data) => {
        const option: SelectItem = {
          value: data.id,
          label: data.name
        };
      roleType.push(option);
      this.rolTypes = roleType;
    });
    this.rolTypes.sort((a, b) => a.label.localeCompare(b.label))
    if(this.isEdit)
    {
      this.onEditForm();
    }
    }, (error) => {
      this.messageService.add({key: 'role-detail',severity:'error', summary:'Cargar tipos de roles', detail: error.error.message});
      console.log(error.error.message);
    });
  }


  getModulesTree(idApp) {
    this.securityService.getModulesTree(idApp)
      .subscribe(result => {
      this.modules = result;
      }, (error) => {
        this.messageService.add({key: 'role-detail',severity:'error', summary:'Cargar módulos', detail: error.message});
        console.log(error.message);
      });
  }
  getPermissionsOfModule(idModule) {
    this.securityService.getPermissionByModule(idModule)
      .subscribe(permissions => {
        this.permissionsToViewModel(permissions);
      }, (error) => {
        this.messageService.add({key: 'role-detail',severity:'error', summary:'Cargar permisos del módulo', detail: error.error.message});
        console.log(error.error.message);
      });
  }

  getPermissionByModulePromise = (idModule : number)=>{
    return  this.securityService.getPermissionByModulePromise(idModule)
    .then(permissions => {
      this.permissionsToViewModel(permissions);
    }, (error) => {
      this.messageService.add({key: 'role-detail',severity:'error', summary:'Cargar permisos del modulo', detail: error.error.message});
      console.log(error.error.message);
    });

  }

  getPermissionsOfRole = (idRole: number) =>{
  return  this.securityService.getPermissionByRole(idRole, 1)
      .then(permissions => {
        this.permissionsByRole = permissions;
      }, (error) => {
        this.messageService.add({key: 'role-detail',severity:'error', summary:'Cargar permisos del rol', detail: error.error.message});
        console.log(error.error.message);
      });
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
    const rolePermissionsFiltered = this.permissionsByRole.filter(x => x.idModule === Number(selected.key));
    rolePermissionsFiltered.forEach(element => {
      if (!this.permissionsEdited.find(p => element.id === p.id)) {
      this.permissionShowing.find(x => x.id === element.id).selected = true;
      }
    });
    this.AddPermissionSelected();
  }

  private permissionVMToUpdatePermissionModel()
  {
    const permissions: UpdatePermission[] = [];
    this.permisionsView.forEach(element => {
      permissions.push({IdPermission: element.id, IsActive: element.selected});
    });
    return permissions;
  }
  public onEmitHideForm(reload: boolean): void {
    this.onHideEditForm.emit(reload);
}
public resetForm() {
  if (this.roleForm.dirty) {
    this.confirmationService.confirm({
      message: '¿Desea cancelar el proceso de registrar rol?',
      accept: () => {
        this.roleForm.reset(this.setNewRoleForm());
        this.onHideEditForm.emit(false);
      }
    });
  } else {
    this.onHideEditForm.emit(false);
  }
}
private setNewRoleForm() {
  return this.formBuilder.group({
    id:-1,
    name: ['', Validators.required],
    systemId: 0,
    idApp: 0,
    idType: ['', Validators.required],
    idCompany: 1,
    isActive: true,
    permissions: [],
    permissionsSelected:  [false, Validators.requiredTrue]
  });
}


}
