import { registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import localeES from '@angular/common/locales/es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private config: PrimeNGConfig, private translateService: TranslateService) {
    this.translate('es')
  }
  translate(lang: string) {
    registerLocaleData(localeES, lang);
    this.translateService.setDefaultLang('es');
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}
