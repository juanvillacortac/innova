import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GroupingInventoryResasonListComponent } from "./grouping-inventory-reasons/grouping-inventory-resason-list/grouping-inventory-resason-list.component";
import { InventoryReasonListComponent } from "./inventory-reasons/inventory-reason-list/inventory-reason-list.component";

const routes: Routes = [
    { path: 'inventory-reason-list', component: InventoryReasonListComponent },
    { path: 'grouping-inventory-reason-list', component: GroupingInventoryResasonListComponent }
];

@NgModule({
    declarations: [],
    imports: [
      RouterModule.forChild(routes)
    ] 
  })

export class InventoryRoutingModule {
}
