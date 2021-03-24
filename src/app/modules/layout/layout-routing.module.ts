import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { RoleDetailComponent } from '../security/roles/role-detail/role-detail.component';
import { RolesListComponent } from '../security/roles/roles-list/roles-list.component';
import { RegisterUserComponent } from '../security/users/register-user/register-user.component';
import { UserDetailComponent } from '../security/users/user-detail/user-detail.component';
import { UserRoleComponent } from '../security/users/user-role/user-role.component';
import { UsersListComponent } from '../security/users/users-list/users-list.component';
import { UserDashboardComponent } from '../users/dashboard-profile/user-dashboard/user-dashboard.component';
import { ProfileDetailsComponent } from '../users/profile-details/profile-details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LayoutComponent } from './layout/layout.component';
import { CompaniesListComponent } from '../masters/companies/companies-list/companies-list.component';
import { AttributeagrupationListComponent } from '../masters-mpc/attribute-agrupation/attributeagrupation-list/attributeagrupation-list.component';
import { TypeofpartsListComponent } from '../masters-mpc/parts-types/typeofparts-list/typeofparts-list.component';
import { ChangePasswordComponent } from '../security/users/change-password/change-password.component';
import { RegisterUsersWizard } from '../wizard/register-user-wizard/register-user-wizard.component';
import { UserPermission } from 'src/app/models/security/UserPermission';
import { UserPermissionsComponent } from '../security/users/user-permissions/user-permissions.component';
import { PackagingpresentationListComponent } from '../masters-mpc/packaging-presentation/packagingpresentation-list/packagingpresentation-list.component';
import { ProductorigintypeListComponent } from '../masters-mpc/product-origin-type/productorigintype-list/productorigintype-list.component';
import { ValidationRangeComponent } from '../masters-mpc/validation-range/validation-range/validation-range.component';
import { MultimediaUseComponent } from '../masters-mpc/multimedia-use/multimedia-use/multimedia-use.component';
import { CategoryListComponent } from '../masters-mpc/categories/category-list/category-list.component';
import { ClassificationComponent } from '../masters-mpc/classifications/classification/classification.component';
import { GroupingunitmeasureComponent } from '../masters-mpc/grouping-unit-measure/groupingunitmeasure/groupingunitmeasure.component';
import { GtintypeComponent } from '../masters-mpc/gtin-type/gtintype/gtintype.component';
import { MeasurementunitsListComponent } from '../masters-mpc/measurement-units/measurementunits-list/measurementunits-list.component';
import { BrandsListComponent } from '../masters/brand/brands-list/brands-list.component';
import { CountriesListComponent } from '../masters/country/countries-list/countries-list.component';
import { PortListComponent } from '../masters/port/port-list/port-list.component';
import { CoinsListComponent } from '../masters/coin/coins-list/coins-list.component';
import { DeviceTypeListComponent } from '../masters/device-types/device-type-list/device-type-list.component';
import { ProductcatalogComponent } from '../products/product-catalog/productcatalog/productcatalog.component';
import { BranchofficesListComponent } from '../masters/branchoffice/branchoffices-list/branchoffices-list.component';
import { MotiveListComponent } from '../masters/motives/motive/motive-list/motive-list.component';
import { MotivesTypeListComponent } from '../masters/motives/motives-type/motives-type-list/motives-type-list.component';
import { DeviceListComponent } from '../masters/device/device-list/device-list.component';
import { PriceGroupingListComponent } from '../masters/price-grouping/price-grouping-list/price-grouping-list.component';
import { TaxeTypeApplicationListComponent } from '../masters/taxe-type-application/taxe-type-application-list/taxe-type-application-list.component';
import { AreaListComponent } from '../masters/area/area-list/area-list.component';
import { MenuComponent } from '../products/common-mpc/menu/menu.component';
import { WastageListComponent} from '../masters-mpc/wastage/wastage-list/wastage-list.component';
import { DescriptionListComponent} from '../masters-mpc/description-type/description-list/description-list.component'
import { TaxListComponent } from '../masters/taxes/tax-list/tax-list.component';
import { BankListComponent } from '../masters/bank/banks-list/banks-list.component';
import { InsertTypeListComponent} from '../masters-mpc/insert-type/insert-type-list/insert-type-list.component';
import { ProductAssociationListComponent } from '../masters-mpc/product-association/product-association-list/product-association-list.component'
import { StateListComponent } from '../masters/state/state-list/states-list.component';
import { TaxRateListComponent } from '../masters/tax-rate/tax-rate-list/tax-rate-list.component';
import { UseofpackagingListComponent } from '../masters-mpc/use-of-packaging/useofpackaging-list/useofpackaging-list.component';
import { PriceTypeListComponent } from '../masters/price-type/price-type-list/price-type-list.component';
import { GroupingInventoryResasonListComponent } from '../ims/grouping-inventory-reasons/grouping-inventory-resason-list/grouping-inventory-resason-list.component';
import { InventoryReasonListComponent } from '../ims/inventory-reasons/inventory-reason-list/inventory-reason-list.component';
import { PaymentMethodListComponent } from '../masters/payment-method/payment-method-list/payment-method-list.component';
import { DocumentTypeListComponent } from '../masters/document-types/document-type-list/document-type-list.component';
import { DistrictListComponent } from '../masters/district/district-list/district-list.component';
import { AttributeListComponent } from '../masters-mpc/attribute/attribute-list/attribute-list.component';
import { AttributeOptionListComponent } from '../masters-mpc//attribute-option/attribute-option-list/attribute-option-list.component';
import { CityListComponent } from '../masters/city/city-list/city-list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children:
    [
      {path: '', component: LandingPageComponent},
      {path: 'role-list', component: RolesListComponent},
      {path: 'role-detail', component: RoleDetailComponent},
      {path: 'user-list', component: UsersListComponent},
      {path: 'user-detail/:id', component: UserDetailComponent},
      {path: 'user-register', component: RegisterUserComponent},
      {path: 'profile/:id', component: UserDashboardComponent},
      {path: 'profile-edit/:id', component: ProfileDetailsComponent},
      {path: 'user-role', component: UserRoleComponent},
      {path: 'company-list', component: CompaniesListComponent },
      {path: 'countries-list', component: CountriesListComponent },
      {path: 'change-password', component: ChangePasswordComponent },
      {path: 'user-detail/:id', component: UserDetailComponent},
      {path: 'register-wizard', component: RegisterUsersWizard,
            children:
            [
              {path: '', redirectTo: 'registro', pathMatch: 'full'},
              {path: 'registro', component: RegisterUserComponent},
              {path: 'roles/:id', component: UserRoleComponent},
              {path: 'permisos/:id', component: UserPermissionsComponent}
            ]
      },
      { path: 'port-list', component: PortListComponent},
      { path: 'brands-list', component: BrandsListComponent },
      { path: 'coins-list', component: CoinsListComponent },
      { path: 'company-list', component: CompaniesListComponent},
      { path: 'attributeagrupation-list', component: AttributeagrupationListComponent},
      { path: 'category-list', component: CategoryListComponent },
      { path: 'measurementunits-list', component: MeasurementunitsListComponent},
      { path: 'typeofparts-list', component: TypeofpartsListComponent },
      { path: 'classification-list', component: ClassificationComponent },
      { path: 'groupingunitmeasure', component: GroupingunitmeasureComponent },
      { path: 'countries-list', component: CountriesListComponent },
      { path: 'multimediause', component: MultimediaUseComponent },
      { path: 'packagingpresentation-list', component: PackagingpresentationListComponent },
      { path: 'productorigintype-list', component: ProductorigintypeListComponent },
      { path: 'validationrange', component: ValidationRangeComponent},
      { path: 'productorigintype-list', component: ProductorigintypeListComponent },
      { path: 'gtintype', component: GtintypeComponent },
      { path: 'classification-list', component: ClassificationComponent },
      { path: 'devicetype-list', component: DeviceTypeListComponent },
      { path: 'productcatalog-list', component: ProductcatalogComponent },
      { path: 'branchoffices-list', component: BranchofficesListComponent },
      { path: 'motives-list', component: MotiveListComponent },
      { path: 'motives-type-list', component: MotivesTypeListComponent },
      { path: 'pricegrouping-list', component: PriceGroupingListComponent },
      { path: 'device-list', component: DeviceListComponent },
      { path: 'area-list', component: AreaListComponent },
      { path: 'taxetypeapplication-list', component: TaxeTypeApplicationListComponent },
      { path: 'banks-list', component: BankListComponent },
      { path: 'pricegrouping-list', component: PriceGroupingListComponent },
      { path: 'taxes-list', component: TaxListComponent },
      { path: 'wastage-list', component: WastageListComponent},
      { path: 'description-list', component: DescriptionListComponent},
      { path: 'insert-type-list', component: InsertTypeListComponent},
      { path: 'productgeneralsection/:id', component: MenuComponent},
      { path: 'states-list', component: StateListComponent},
      { path: 'product-association-list', component: ProductAssociationListComponent},
      { path: 'taxrate-list', component: TaxRateListComponent },
      { path: 'useofpackaging-list', component: UseofpackagingListComponent },
      { path: 'pricetype-list', component: PriceTypeListComponent },
      { path: 'payment-method-list', component: PaymentMethodListComponent },

      { path: 'grouping-inventory-reason-list', component: GroupingInventoryResasonListComponent },

      { path: 'inventory-reason-list', component: InventoryReasonListComponent },
      { path: 'document-type-list', component: DocumentTypeListComponent },     
      { path: 'district-list', component: DistrictListComponent },
      { path: 'attribute-list', component: AttributeListComponent},
      { path: 'attribute-option-list', component: AttributeOptionListComponent},
      { path: 'city-list', component: CityListComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
