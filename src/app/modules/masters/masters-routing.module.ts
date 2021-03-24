import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesListComponent } from './companies/companies-list/companies-list.component';
import { CountriesListComponent } from './country/countries-list/countries-list.component';
import { PortListComponent } from './port/port-list/port-list.component';
import { BrandsListComponent } from './brand/brands-list/brands-list.component';
import { CoinsListComponent } from './coin/coins-list/coins-list.component';
import { DeviceTypeListComponent } from './device-types/device-type-list/device-type-list.component';
import { BranchofficesListComponent } from './branchoffice/branchoffices-list/branchoffices-list.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { PriceGroupingListComponent } from './price-grouping/price-grouping-list/price-grouping-list.component';
import { AreaListComponent } from './area/area-list/area-list.component';

const routes: Routes = [
  { path: 'company-list', component: CompaniesListComponent },
  { path: 'countries-list', component: CountriesListComponent },
  { path: 'port-list', component: PortListComponent },
  { path: 'brands-list', component: BrandsListComponent },
  { path: 'branchoffices-list', component: BranchofficesListComponent },
  { path: 'coins-list', component: CoinsListComponent },
  { path: 'device-list', component: DeviceListComponent },
  { path: 'devicetype-list', component: DeviceTypeListComponent },
  { path: 'pricegrouping-list', component: PriceGroupingListComponent },
  { path: 'area-list', component: AreaListComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class MastersRoutingModule { }
