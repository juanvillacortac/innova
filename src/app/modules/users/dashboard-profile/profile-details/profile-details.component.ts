import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { Access } from 'src/app/models/security/Access';
import { ModuleP } from 'src/app/models/security/ModuleP';
import { RoleByUser } from 'src/app/models/security/RoleByUser';
import { Software } from 'src/app/models/security/Software';
import { SubModuleP } from 'src/app/models/security/SubModuleP';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { RoleService } from 'src/app/modules/security/roles/shared/role.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { PermissionViewModel } from 'src/app/modules/security/shared/view-models/Permissions.viewmodel';

@Component({
  selector: 'app-profile-details-dashboard',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsDashboardComponent implements OnInit {

  allModules: TreeNode[] = [];
  modules: TreeNode[] = [];
  availableSoftware: Software[] = [];
  parentModules: ModuleP[] = [];
  subModules: SubModuleP[] = [];
  roles: SelectItem[] = [];
  permissionsByRole: Access[] = [];
  idUser: number;
  idCompany: number;
  idOffice: number;
  selectedSubModule: string;
  userRoles: RoleByUser[] = [];
  userRole: number;
  permisionsView: PermissionViewModel[] = [];
  permissionShowing: PermissionViewModel[] = [];
  accessByUser: Access[] = [];

  constructor(
    private layoutSerice: LayoutService,
    public securityService: SecurityService,
    public service: RoleService,
    private actRoute: ActivatedRoute,
    private _authService: AuthService,
    private messageService: MessageService) {

      this.idUser = Number(this._authService.idUser);
      this.idCompany = 1;
      this.idOffice = 1;
      const payload = this.idUser;
      this.layoutSerice.getSoftwareByUser(payload).then(softwareList => {
        this.availableSoftware = softwareList;
        const appId = 1;
      });
    }
  ngOnInit(): void {
    this.idUser = this.actRoute.snapshot.params['id'];
    this.getUserRoles();
    this.getUserModulesTree().then(result =>{
      
      this.getAccessByUser().then(access =>{

        this.moduleTreeRange(this.allModules);
      })
    });
  }
  onRoleSelected(role) {
    if(role)
    {
      this.getPermissionsOfRole(role);
    }
  }

  getUserRoles() {
    const idUser = this.idUser;
    const idCompany = this.idCompany;
    this.service.getUserRoles(idCompany, idUser).then(result => {
      this.groupRoles(result);
    }, (error) => {
      this.messageService.add({severity:'error', summary:'Cargar roles del usuario', detail: error.message});
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
    });
    }, (error) => {
      this.messageService.add({key: 'user-role',severity: 'error', summary: 'Cargar roles', detail: error.error.message});
      console.log(error.error.message);
    });
  }
  getUserModulesTree = () => {
    return  this.securityService.getModulesTreeByUser({
      idUser: Number(this.idUser),
      idCompany: 1,
      idSubsidiary: 1
    })
    .then(modulesTree => {
      this.allModules = modulesTree;
    });
  }
  getAccessByUser = () => {
    const payloadAccess = {
      idUser: Number(this.idUser),
      idCompany: 1,
      idSubsidiary: 1
    };
  return  this.securityService.getAccessPromise(payloadAccess).then(accesses => {
      this.accessByUser = accesses;
    })
  }
  getPermissionsOfRole = (idRole: number) =>{
    return  this.securityService.getPermissionByRole(idRole, 1)
        .then(permissions => {
          this.permissionsByRole = permissions;
        }, (error) => {
          this.messageService.add({severity:'error', summary:'Cargar permisos del rol', detail: error.error.message});
          console.log(error.error.message);
        });
    }
  
   moduleTreeRange = (node: TreeNode[]) =>
  {
    node.forEach((modules: TreeNode) => {
      let permissionNode: TreeNode[] = [];
      let permisions  = this.accessByUser.filter( p=> p.module === modules.label);
      modules.expanded= true;
      if (modules.children) {     
        if(permisions)
        { 
          permisions.forEach((permission : Access)=>{
            modules.children.push({
              label: permission.name,
              key  : String(permission.id),
              expanded: true,
              icon: 'pi pi-circle-off'
          });
        })
        }
        this.moduleTreeRange(modules.children);
      }
      else
      {
        if(permisions)
        {
          permisions.forEach((permission : Access)=>{
            permissionNode.push({
              label: permission.name,
              key  : String(permission.id),
              expanded: true,
              icon: 'pi pi-circle-off'
          });
        })
          modules.children=permissionNode;
        }
      }
    })
    this.modules= this.allModules;
  }


  private groupRoles(result: RoleByUser[]) {
    const roles: RoleByUser[] = [];
    result.forEach(element => { this.pushIfNotExist(roles, element); });
   this.RoleToSelectItem(roles);
  }
  private pushIfNotExist(roles: RoleByUser[], element: RoleByUser) {
    if (roles.find(item => Number(item.idRole) === element.idRole ) == null) {
      roles.push(element);
    }
  }

  private RoleToSelectItem(result: RoleByUser[]){
    const roles: SelectItem[] = [];
    result.map((data) => {
      const option: SelectItem = {
        value: data.idRole,
        label: data.name
      };
      roles.push(option);
    this.roles = roles;
    this.userRole = result[0].idRole;
    });

  }


}
