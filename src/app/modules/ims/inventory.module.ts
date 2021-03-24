import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FieldsetModule } from "primeng/fieldset";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MultiSelectModule } from "primeng/multiselect";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { TreeTableModule } from "primeng/treetable";
import { CommonDirectiveModule } from "../common/common.module";
import { InventoryRoutingModule } from "./inventory-routing.module";
import { GroupingInventoryResasonListComponent } from './grouping-inventory-reasons/grouping-inventory-resason-list/grouping-inventory-resason-list.component';
import { GroupingInventoryReasonsPanelComponent } from './grouping-inventory-reasons/grouping-inventory-reasons-panel/grouping-inventory-reasons-panel.component';
import { GroupingInventoryReasonsFilterComponent } from './grouping-inventory-reasons/grouping-inventory-resason-list/grouping-inventory-reasons-filter/grouping-inventory-reasons-filter.component';
import { InventoryReasonListComponent } from './inventory-reasons/inventory-reason-list/inventory-reason-list.component';
import { InventoryReasonPanelComponent } from './inventory-reasons/inventory-reason-panel/inventory-reason-panel.component';
import { InventoryReasonFiltersPanelComponent } from './inventory-reasons/inventory-reason-list/inventory-reason-filters-panel/inventory-reason-filters-panel.component';



@NgModule({
    declarations:[
      GroupingInventoryResasonListComponent,
       GroupingInventoryReasonsPanelComponent,
        GroupingInventoryReasonsFilterComponent,
        InventoryReasonListComponent,
        InventoryReasonPanelComponent,
        InventoryReasonFiltersPanelComponent],
imports: [
   CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ToggleButtonModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule,
    FieldsetModule,
    InputTextareaModule,
    InventoryRoutingModule,
    TreeTableModule,
    CommonDirectiveModule,
    SidebarModule,
    MultiSelectModule,
    TooltipModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class InventoryModule {
}
