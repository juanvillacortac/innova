import {Component,OnInit,ViewEncapsulation} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './register-user-wizard.component.html',
    styleUrls: ['register-user-wizard.component.scss'],
    providers: [MessageService]
})
export class RegisterUsersWizard implements OnInit {

    items: MenuItem[];
    
    subscription: Subscription;
    activeIndex: number = 0;
    constructor(public messageService: MessageService) {}


    ngOnInit() {
        this.items = [{
            label: 'Registro',
            routerLink: 'register-wizard/registro'
        },
        {
            label: 'Roles',
            routerLink: 'register-wizard/roles'
        },
        {
            label: 'Permisos',
            routerLink: 'register-wizard/permisos'
        }
    ];
    }   

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}