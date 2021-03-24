import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CardModule} from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {RatingModule} from 'primeng/rating';
import {ChartModule} from 'primeng/chart';
import {FieldsetModule} from 'primeng/fieldset';
import {TreeModule} from 'primeng/tree';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule} from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';


import { UserDetailsComponent } from './dashboard-profile/user-details/user-details.component';
import { ContactDetailsDashboardComponent } from './dashboard-profile/contact-details/contact-details.component';
import { RatingDetailsComponent } from './dashboard-profile/rating-details/rating-details.component';
import { ProfileDetailsDashboardComponent } from './dashboard-profile/profile-details/profile-details.component';
import { UserDashboardComponent } from './dashboard-profile/user-dashboard/user-dashboard.component';
import { PhoneDetailsDashboardComponent } from './dashboard-profile/contact-details/phone-details/phone-details.component';
import { AddressDetailsDashboardComponent } from './dashboard-profile/contact-details/address-details/address-details.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { AddressesDetailsComponent } from './profile-details/addresses-details/addresses-details.component';
import { CommonDirectiveModule } from '../common/common.module';
import { PhonesDetailsComponent } from './profile-details/phones-details/phones-details.component';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { UserOptionsComponent } from './dashboard-profile/user-options/user-options.component';


@NgModule({
  declarations: [
    UserDetailsComponent,
    ContactDetailsDashboardComponent,
    RatingDetailsComponent,
    ProfileDetailsDashboardComponent,
    UserDashboardComponent,
    PhoneDetailsDashboardComponent,
    AddressDetailsDashboardComponent,
    ProfileDetailsComponent,
    AddressesDetailsComponent,
    PhonesDetailsComponent,
    UserOptionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    RatingModule,
    ChartModule,
    FieldsetModule,
    TreeModule,
    DropdownModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonDirectiveModule,
    SidebarModule,
    TooltipModule,
    ToastModule,
    MenuModule
  ],
  providers:
  [
    [MessageService,
    ConfirmationService]
  ]
})
export class UsersModule { }
