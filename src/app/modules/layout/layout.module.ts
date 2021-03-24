import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {MenuModule} from 'primeng/menu';
import {SidebarModule} from 'primeng/sidebar';
import {PanelMenuModule} from 'primeng/panelmenu';

// *******Components *******//
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LayoutComponent } from './layout/layout.component';
import { SecurityModule } from '../security/security.module';
import { AppMenuComponent } from 'src/app/design/app.menu.component';
import { AppMenuitemComponent } from 'src/app/design/app.menuitem.component';
import { AppTopBarComponent } from 'src/app/design/app.topbar.component';
import { AppBreadcrumbComponent } from 'src/app/design/app.breadcrumb.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [LandingPageComponent, LayoutComponent, AppMenuComponent,
                  AppMenuitemComponent, AppTopBarComponent, AppBreadcrumbComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    MenuModule,
    SidebarModule,
    PanelMenuModule,
    SecurityModule,
    CardModule,
    CalendarModule,
    ToastModule
  ],
})
export class LayoutModule { }
