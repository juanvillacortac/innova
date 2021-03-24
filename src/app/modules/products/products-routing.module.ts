import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductcatalogComponent } from './product-catalog/productcatalog/productcatalog.component';
import { MenuComponent } from './common-mpc/menu/menu.component';

const routes: Routes = [  
  { path: 'productcatalog-list', component: ProductcatalogComponent },
  { path: 'productgeneralsection/:id', component: MenuComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
