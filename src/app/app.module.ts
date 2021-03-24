import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipe } from './safe.pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/httpconfig.interceptor';
import { LoginModule } from './modules/login/login.module';
import { SecurityModule } from './modules/security/security.module';
import { LayoutModule } from './modules/layout/layout.module';
import { UsersModule } from './modules/users/users.module';
import { MastersModule } from './modules/masters/masters.module';
import { MastersMPCModule} from './modules/masters-mpc/masters-mpc.module'
import { NotFoundComponent } from './notFound/notFound.component';
import { WizardModule } from './modules/wizard/wizard.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/ims/inventory.module';
import { MrpModule } from './modules/mrp/mrp.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    NotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
  }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LoginModule,
    SecurityModule,
    LayoutModule,
    AppRoutingModule,
    UsersModule,
    MastersModule,
    MastersMPCModule,
    WizardModule,
    ProductsModule,
    InventoryModule,
    MrpModule
  ],
  providers: [
      { provide: 'API_BASE_URL', useFactory: getBaseUrl },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      HttpClient
],
  exports: [
    TranslateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseUrl(): string {
  return environment.API_BASE_URL_AUTHENTICATION;
}
