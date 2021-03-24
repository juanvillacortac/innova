import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveLabelComponent } from './components/active-label/active-label.component';
import { NoneSpecialCharactersDirective, OnlyLettersDirective, OnlyNumberDirective } from 'src/app/modules/common/directives/form-validations.directive';
import { EditContactNumbersComponent } from './components/add-contact-numbers/edit-contact-numbers.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditAddressComponent } from './components/edit-address/edit-address.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckListComponent } from './components/check-list/check-list.component';
import { CheckboxModule } from 'primeng/checkbox';
import { GMapModule } from 'primeng/gmap';
import { KeyFilterModule} from 'primeng/keyfilter';
import { DecimalAmountDirective } from '../masters-mpc/shared/Utils/Validations/Validations';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';


@NgModule({
  declarations: [
     NoneSpecialCharactersDirective,
     OnlyNumberDirective,
     OnlyLettersDirective,
     ActiveLabelComponent,
     EditContactNumbersComponent,
     EditAddressComponent,
     CheckListComponent,
     DecimalAmountDirective,
     ImagePickerComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextareaModule,
    CheckboxModule,
    GMapModule,
    KeyFilterModule
  ],
  exports: [
    NoneSpecialCharactersDirective,
    OnlyNumberDirective,
    OnlyLettersDirective,
    ActiveLabelComponent,
    DecimalAmountDirective,
    EditContactNumbersComponent,
    EditAddressComponent,
    CheckListComponent,
    ImagePickerComponent
  ]
})
export class CommonDirectiveModule { }
