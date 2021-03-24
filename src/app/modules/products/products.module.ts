import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ProgressBarModule} from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import {TreeTableModule} from 'primeng/treetable';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {FieldsetModule} from 'primeng/fieldset';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import { ProductsRoutingModule } from './products-routing.module';
import { SidebarModule } from 'primeng/sidebar';
import {MultiSelectModule} from 'primeng/multiselect';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'primeng/tooltip';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuModule} from 'primeng/menu';
import {CardModule} from 'primeng/card';
import {KeyFilterModule} from 'primeng/keyfilter';
import {PanelModule} from 'primeng/panel';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RadioButtonModule} from 'primeng/radiobutton';

import { CommonDirectiveModule } from './../shared/common-directive/common-directive.module';
import { ProductcatalogComponent } from './product-catalog/productcatalog/productcatalog.component';
import { ProductcatalogFilterPanelComponent } from './product-catalog/productcatalog-filter-panel/productcatalog-filter-panel.component';
import { MenuComponent } from './common-mpc/menu/menu.component';
import { GeneralSectionComponent } from './product-general-section/general-section/general-section.component';
import { BarproductComponent } from './common-mpc/barproduct/barproduct.component';
import { ProductComplementaryComponent } from './product-complementary/product-complementary.component';
import { BarcodePanelComponent } from './product-general-section/barcode-panel/barcode-panel.component';
import { WastagePanelComponent } from './product-general-section/wastage-panel/wastage-panel.component';
import { DurabililyPanelComponent } from './product-complementary/durabilily-panel/durabilily-panel.component';
import { DescriptionsPanelComponent } from './product-complementary/descriptions-panel/descriptions-panel.component';
import { PublicationsListComponent } from './publications-section/publications-list/publications-list.component';
import { PublicationsDialogComponent } from './publications-section/publications-dialog/publications-dialog.component';



@NgModule({
  declarations: [ProductcatalogComponent,
    ProductcatalogFilterPanelComponent,
    MenuComponent,
    GeneralSectionComponent,
    BarproductComponent,
    ProductComplementaryComponent,
    BarcodePanelComponent,
    WastagePanelComponent,
    DurabililyPanelComponent,
    DescriptionsPanelComponent,
    PublicationsListComponent,
    PublicationsDialogComponent],
  imports: [
    TableModule,
    ConfirmDialogModule,
    TabMenuModule,
    MenuModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    CheckboxModule,
    ProductsRoutingModule,
    ButtonModule,
    ToggleButtonModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    FieldsetModule,
    InputTextareaModule,
    ToastModule,
    CommonDirectiveModule,
    SidebarModule,
    MultiSelectModule,
    CascadeSelectModule,
    OverlayPanelModule,
    TreeModule,
    TreeTableModule,
    CalendarModule,
    SliderModule,
    ContextMenuModule,
    ProgressBarModule,
    TooltipModule,
    SplitButtonModule,
    CardModule,
    KeyFilterModule,
    PanelModule,
    InputSwitchModule,
    RadioButtonModule,
    
  ]
})
export class ProductsModule { }
