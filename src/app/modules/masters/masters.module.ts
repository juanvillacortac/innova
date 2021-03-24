import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListboxModule } from 'primeng/listbox';
import { DataViewModule } from 'primeng/dataview';
import { MenuModule } from 'primeng/menu';
import {TooltipModule} from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { CompanyFiltersPanelComponent } from './companies/companies-list/company-filters-panel/company-filters-panel.component';
import { CompaniesListComponent } from './companies/companies-list/companies-list.component';
import { CommonDirectiveModule } from '../common/common.module';
import { SidebarModule } from 'primeng/sidebar';
import { EditDialogComponent } from './companies/companies-list/company-edit-dialog/edit-dialog.component';
import { DeviceTypeListComponent } from './device-types/device-type-list/device-type-list.component';
import { DeviceTypePanelComponent } from './device-types/device-type-panel/device-type-panel.component';
import { DevicetypeFiltersPanelComponent } from './device-types/device-type-list/devicetype-filters-panel/devicetype-filters-panel.component';
import { BrandsListComponent } from './brand/brands-list/brands-list.component';
import { CoinFiltersPanelComponent } from './coin/coins-list/coin-filters-panel/coin-filters-panel.component';
import { CoinsListComponent } from './coin/coins-list/coins-list.component';
import { CountriesDetailsComponent } from './country/countries-details/countries-details.component';
import { CountriesListComponent } from './country/countries-list/countries-list.component';
import { FiltersPanelComponentCountries } from './country/countries-list/filters-panel/filters-panel.component';
import { PortListComponent } from './port/port-list/port-list.component';
import { PortsFiltersPanelComponent } from './port/port-list/ports-filters-panel/ports-filters-panel.component';
import { PortPanelComponent } from './port/port-panel/port-panel.component';
import { CoinPanelComponent } from './coin/coin-panel/coin-panel.component';
import { BrandFiltersPanelComponent } from './brand/brands-list/brand-filters-panel/brand-filters-panel.component';
import { BrandPanelComponent } from './brand/brand-panel/brand-panel.component';
import { BranchofficesListComponent } from './branchoffice/branchoffices-list/branchoffices-list.component';
import { BranchofficesFiltersPanelComponent } from './branchoffice/branchoffices-list/branchoffices-filters-panel/branchoffices-filters-panel.component';
import { BranchofficesEditDialogComponent } from './branchoffice/branchoffices-list/branchoffices-edit-dialog/branchoffices-edit-dialog.component';
import { MotivesTypeListComponent } from './motives/motives-type/motives-type-list/motives-type-list.component';
import { MotivesTypeFiltersComponent } from './motives/motives-type/motives-type-filters/motives-type-filters.component';
import { MotivesTypeDetailComponent } from './motives/motives-type/motives-type-detail/motives-type-detail.component';
import { MotiveListComponent } from './motives/motive/motive-list/motive-list.component';
import { MotiveFiltersComponent } from './motives/motive/motive-filters/motive-filters.component';
import { MotiveDetailComponent } from './motives/motive/motive-detail/motive-detail.component';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { DeviceFiltersPanelComponent } from './device/device-list/device-filters-panel/device-filters-panel.component';
import { DevicePanelComponent } from './device/device-panel/device-panel.component';
import { PriceGroupingListComponent } from './price-grouping/price-grouping-list/price-grouping-list.component';
import { PriceGroupingPanelComponent } from './price-grouping/price-grouping-panel/price-grouping-panel.component';
import { PriceGroupingFiltersPanelComponent } from './price-grouping/price-grouping-list/price-grouping-filters-panel/price-grouping-filters-panel.component';
import { AreaListComponent } from './area/area-list/area-list.component';
import { AreaPanelComponent } from './area/area-panel/area-panel.component';
import { AreaFiltersPanelComponent } from './area/area-list/area-filters-panel/area-filters-panel.component';
import { TaxeTypeApplicationListComponent } from './taxe-type-application/taxe-type-application-list/taxe-type-application-list.component';
import { TaxeTypeApplicationFiltersComponent } from './taxe-type-application/taxe-type-application-filters/taxe-type-application-filters.component';
import { TaxeTypeApplicationDetailComponent } from './taxe-type-application/taxe-type-application-detail/taxe-type-application-detail.component';
import { TaxListComponent } from './taxes/tax-list/tax-list.component';
import { TaxFiltersComponent } from './taxes/tax-filters/tax-filters.component';
import { TaxDetailComponent } from './taxes/tax-detail/tax-detail.component';
import { MultiSelectModule} from 'primeng/multiselect';
import { BankListComponent } from './bank/banks-list/banks-list.component';
import { BankFiltersComponent } from './bank/bank-filters/bank-filters.component';
import { BankDetailComponent } from './bank/bank-detail/bank-detail.component';
import { StateListComponent } from './state/state-list/states-list.component';
import { StateFilterComponent } from './state/state-filter/state-filters.component';
import { StateDetailComponent } from './state/state-detail/state-detail.component';
import { TaxRateListComponent } from './tax-rate/tax-rate-list/tax-rate-list.component';
import { TaxRateFiltersComponent } from './tax-rate/tax-rate-filters/tax-rate-filters.component';
import { TaxRateDetailComponent } from './tax-rate/tax-rate-detail/tax-rate-detail.component';
import { PriceTypeListComponent } from './price-type/price-type-list/price-type-list.component';
import { PriceTypeFiltersComponent } from './price-type/price-type-filters/price-type-filters.component';
import { PriceTypeDetailComponent } from './price-type/price-type-detail/price-type-detail.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaymentMethodListComponent } from './payment-method/payment-method-list/payment-method-list.component';
import { PaymentMethodFiltersComponent } from './payment-method/payment-method-filters/payment-method-filters.component';
import { PaymentMethodDetailComponent } from './payment-method/payment-method-detail/payment-method-detail.component';
import { DocumentTypeListComponent } from './document-types/document-type-list/document-type-list.component';
import { DocumentTypeFiltersComponent } from './document-types/document-type-filters/document-type-filters.component';
import { DocumentTypeDetailComponent } from './document-types/document-type-detail/document-type-detail.component';
import { DistrictFiltersComponent } from './district/district-filters/district-filters.component';
import { DistrictDetailComponent } from './district/district-detail/district-detail.component';
import { DistrictListComponent } from './district/district-list/district-list.component';
import { CityFiltersComponent } from './city/city-filters/city-filters.component';
import { CityListComponent } from './city/city-list/city-list.component';
import { CityDetailComponent } from './city/city-detail/city-detail.component';



@NgModule({
    declarations: [
      CompaniesListComponent,
      CompanyFiltersPanelComponent,
      EditDialogComponent,
      CountriesListComponent,
      FiltersPanelComponentCountries,
      CountriesDetailsComponent,
      PortListComponent,
      PortsFiltersPanelComponent,
      PortPanelComponent,
      BrandsListComponent,
      BrandFiltersPanelComponent,
      BrandPanelComponent,
      CoinsListComponent,
      CoinFiltersPanelComponent,
      DeviceTypeListComponent,
      DeviceTypePanelComponent,
      CoinPanelComponent,
      DevicetypeFiltersPanelComponent,
      BranchofficesListComponent,
      BranchofficesFiltersPanelComponent,
      BranchofficesEditDialogComponent,
      MotivesTypeListComponent,
      MotivesTypeFiltersComponent,
      MotivesTypeDetailComponent,
      MotiveListComponent,
      MotiveFiltersComponent,
      MotiveDetailComponent,
      DeviceListComponent,
      DeviceFiltersPanelComponent,
      DevicePanelComponent,
      PriceGroupingListComponent,
      PriceGroupingPanelComponent,
      PriceGroupingFiltersPanelComponent,
      AreaListComponent,
      AreaPanelComponent,
      AreaFiltersPanelComponent,
      TaxeTypeApplicationListComponent,
      TaxeTypeApplicationFiltersComponent,
      TaxeTypeApplicationDetailComponent,
      TaxListComponent,
      TaxFiltersComponent,
      TaxDetailComponent,

      BankListComponent,
      BankFiltersComponent,
      BankDetailComponent,
      StateListComponent,
      StateFilterComponent,
      StateDetailComponent,
      TaxRateListComponent,
      TaxRateFiltersComponent,
      TaxRateDetailComponent,

      PriceTypeListComponent,
      PriceTypeFiltersComponent,
      PriceTypeDetailComponent,
      PaymentMethodListComponent,
      PaymentMethodFiltersComponent,
      PaymentMethodDetailComponent,

      DocumentTypeListComponent,
      DocumentTypeFiltersComponent,
      DocumentTypeDetailComponent,

      DistrictFiltersComponent,
      DistrictDetailComponent,
      DistrictListComponent,

      CityFiltersComponent,
      CityDetailComponent,
      CityListComponent

    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    CheckboxModule,
    CommonDirectiveModule,
    ButtonModule,
    ToggleButtonModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    InputTextareaModule,
    FieldsetModule,
    ConfirmDialogModule,
    ListboxModule,
    DataViewModule,
    MenuModule,
    SidebarModule,
    ToastModule,
    InputSwitchModule,
    TooltipModule,
    MultiSelectModule,
    InputNumberModule,
    ScrollPanelModule
  ],
  exports: [StateDetailComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class MastersModule { }
