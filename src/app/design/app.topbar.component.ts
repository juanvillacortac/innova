import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { LayoutComponent } from '../modules/layout/layout/layout.component';
import { LayoutService } from '../modules/layout/shared/layout.service';
import { AuthService } from '../modules/login/shared/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    activeItem: number;
    currentApplicationVersion : string;
    @Input() fullName: '';
    constructor(public app: LayoutComponent,
                private router: Router,
                private _authService: AuthService,
                private _layoutService: LayoutService) { this.currentApplicationVersion = environment.appVersion;}

    mobileMegaMenuItemClick(index) {
        this.app.megaMenuMobileClick = true;
        this.activeItem = this.activeItem === index ? null : index;
}

onOpenProfile() {
this.router.navigate(['profile', this._authService.idUser]);
}

onLogOut() {
this._layoutService.removeStateAccessFromStorage();
this._authService.removeUserStateFromStorage();
window.location.replace('');
}

}
