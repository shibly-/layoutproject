import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { AppModule } from './app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

// for enterprise customers
// LicenseManager.setLicenseKey("your license key");

platformBrowserDynamic().bootstrapModule(AppModule);