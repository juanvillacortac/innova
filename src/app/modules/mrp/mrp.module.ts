import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MrpRoutingModule } from './mrp-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonDirectiveModule } from '../common/common.module';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListboxModule } from 'primeng/listbox';
import { DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DerivatesRoomsListComponent } from './derivates-room/derivates-rooms-list/derivates-rooms-list.component';


@NgModule({
  declarations: [DerivatesRoomsListComponent],
  imports: [
    CommonModule,
    MrpRoutingModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    CheckboxModule,
    CommonDirectiveModule,
    ToggleButtonModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    InputTextareaModule,
    FieldsetModule,
    ConfirmDialogModule,
    ListboxModule,
    DataViewModule,
    ToastModule,
    InputSwitchModule,
    TooltipModule,
    MultiSelectModule,
    InputNumberModule,
    ScrollPanelModule
  ]
})
export class MrpModule { }
