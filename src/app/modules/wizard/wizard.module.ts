import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardRoutingModule } from './wizard-routing.module';
import { RegisterUsersWizard } from './register-user-wizard/register-user-wizard.component';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [RegisterUsersWizard],
  imports: [
    CommonModule,
    StepsModule,
    ToastModule
  ]
})
export class WizardModule { }
