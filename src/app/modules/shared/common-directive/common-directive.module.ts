import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoneSpecialCharactersDirective, OnlyLettersDirective, OnlyNumberDirective } from 'src/app/directives/form-validations.directive';
import { ActiveLabelComponent } from 'src/app/modules/shared/common-directive/components/active-label/active-label.component';

 

@NgModule({
  declarations: [NoneSpecialCharactersDirective, OnlyNumberDirective, OnlyLettersDirective, ActiveLabelComponent], 
  imports: [
    CommonModule
  ],
  exports: [
    NoneSpecialCharactersDirective,
    OnlyNumberDirective,
    OnlyLettersDirective,
    ActiveLabelComponent
  ]
})
export class CommonDirectiveModule { }
