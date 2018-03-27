import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.getElementsByTagName('title')[0].innerHTML = environment.organization.name;
document.getElementById('favicon').setAttribute('href', environment.organization.assetsPath + 'favicon.ico');

platformBrowserDynamic().bootstrapModule(AppModule);
