import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';

import { MenuService } from 'src/app/design/app.menu.service';
import { Access } from 'src/app/models/security/Access';
import { Module } from 'src/app/models/security/Module';
import { ModuleP } from 'src/app/models/security/ModuleP';
import { Software } from 'src/app/models/security/Software';
import { SubModuleP } from 'src/app/models/security/SubModuleP';
import { AuthService } from '../../login/shared/auth.service';
import { SecurityService } from '../../security/shared/services/security.service';
import { LayoutService } from '../shared/layout.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('mask-anim', [
        state('void', style({
            opacity: 0
        })),
        state('visible', style({
            opacity: 0.8
        })),
        transition('* => *', animate('250ms cubic-bezier(0, 0, 0.2, 1)'))
    ])
]
})
export class LayoutComponent implements OnInit {
   items: MenuItem[];
   userId: number;
   fullName: '';
   availableSoftware: Software[] = [];
   parentModules: ModuleP[] = [];
   subModules: SubModuleP[] = [];
   accessByUser: Access[] = [];
   menu: MenuItem[];
   horizontalMenu: boolean;
   darkMode = false;
   menuColorMode = 'light';
   menuColor = 'layout-menu-light';
   themeColor = 'blue';
   layoutColor = 'blue';
   rightPanelClick: boolean;
   rightPanelActive: boolean;
   menuClick: boolean;
   staticMenuActive: boolean;
   menuMobileActive: boolean;
   megaMenuClick: boolean;
   megaMenuActive: boolean;
   megaMenuMobileClick: boolean;
   megaMenuMobileActive: boolean;
   topbarItemClick: boolean;
   topbarMobileMenuClick: boolean;
   topbarMobileMenuActive: boolean;
   sidebarActive: boolean;
   activeTopbarItem: any;
   topbarMenuActive: boolean;
   menuHoverActive: boolean;
   configActive: boolean;
   configClick: boolean;
   ripple = true;
   inputStyle = 'outlined';

  constructor(private _layoutSerice: LayoutService,
    private _securityService: SecurityService,
    private _authService: AuthService,
    public renderer: Renderer2,
    private menuService: MenuService,
    private primengConfig: PrimeNGConfig ,
    private router: Router,
    private messageService: MessageService) {
      this.fullName = this._authService.entityName;
      this.userId = Number(this._authService.idUser);
      const payload = this.userId;
      this.staticMenuActive = true;

      this.menu = [{
              label: 'Inicio',
              icon: 'pi pi-fw pi-home',
              routerLink:  ['home'],
      }];

      this._securityService.getModulesTreeByUser({
        idUser: Number(this.userId),
        idCompany: 1,
        idSubsidiary: 1
      })
      .then(modulesTree => {
        this.menu = this.menu.concat(modulesTree);
        const payLoadAccess = {
            idUser: Number(this.userId),
            idCompany: 1,
            idSubsidiary: 1
        };
        this._securityService.getAccessPromise(payLoadAccess).then(accesses => {
            this._layoutSerice.sendToStorage(accesses);
        });
      });
}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  onLayoutClick() {
    if (!this.topbarItemClick) {
        this.activeTopbarItem = null;
        this.topbarMenuActive = false;
    }

    if (!this.rightPanelClick) {
        this.rightPanelActive = false;
    }

    if (!this.megaMenuClick) {
        this.megaMenuActive = false;
    }

    if (!this.megaMenuMobileClick) {
        this.megaMenuMobileActive = false;
    }

    if (!this.menuClick) {
        if (this.isHorizontal()) {
            this.menuService.reset();
        }

        if (this.menuMobileActive) {
            this.menuMobileActive = false;
        }

        this.menuHoverActive = false;
    }

    if (this.configActive && !this.configClick) {
        this.configActive = false;
    }

    this.configClick = false;
    this.menuClick = false;
    this.topbarItemClick = false;
    this.megaMenuClick = false;
    this.megaMenuMobileClick = false;
    this.rightPanelClick = false;
}

onMegaMenuButtonClick(event) {
    this.megaMenuClick = true;
    this.megaMenuActive = !this.megaMenuActive;
    event.preventDefault();
}

onMegaMenuClick(event) {
    this.megaMenuClick = true;
    event.preventDefault();
}

onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
        this.activeTopbarItem = null; } else {
        this.activeTopbarItem = item; }

    event.preventDefault();
}

onRightPanelButtonClick(event) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;

    event.preventDefault();
}

onRightPanelClose(event) {
    this.rightPanelActive = false;
    this.rightPanelClick = false;

    event.preventDefault();
}

onRightPanelClick(event) {
    this.rightPanelClick = true;

    event.preventDefault();
}

onTopbarMobileMenuButtonClick(event) {
    this.topbarMobileMenuClick = true;
    this.topbarMobileMenuActive = !this.topbarMobileMenuActive;

    event.preventDefault();
}

onMegaMenuMobileButtonClick(event) {
    this.megaMenuMobileClick = true;
    this.megaMenuMobileActive = !this.megaMenuMobileActive;

    event.preventDefault();
}

onMenuButtonClick(event) {
    this.menuClick = true;
    this.topbarMenuActive = false;

    if (this.isMobile()) {
        this.menuMobileActive = !this.menuMobileActive;
    }

    event.preventDefault();
}

onSidebarClick(event: Event) {
    this.menuClick = true;
}

onToggleMenuClick(event: Event) {
    this.staticMenuActive = !this.staticMenuActive;
    event.preventDefault();
}

onConfigClick(event) {
    this.configClick = true;
}

onRippleChange(event) {
    this.ripple = event.checked;
}

isDesktop() {
    return window.innerWidth > 991;
}

isMobile() {
    return window.innerWidth <= 991;
}

isHorizontal() {
    return this.horizontalMenu === true;
}

onChangePassword() {
    this.router.navigate(['change-password']);
    }
}
