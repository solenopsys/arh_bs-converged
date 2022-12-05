import {environment} from "./environments/environment";
import {enableProdMode, ViewEncapsulation} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "./app/app.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule,
    {
      defaultEncapsulation: ViewEncapsulation.Emulated,
    }
    )
  .catch((err) => console.error(err));

