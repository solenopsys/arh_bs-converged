import { APP_INITIALIZER, Component, NgModule, ViewEncapsulation } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";


import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { FuiIconsModule } from "@solenopsys/uimatrix-icons";
import { FuiNavigateModule } from "@solenopsys/uimatrix-layouts";
import { HttpClientModule } from "@angular/common/http";
import { ModulesService } from "@solenopsys/lib-globals";
import { RouteLoaderService } from "./route-loader.service";
import { BootstrapComponent, FuiTemplatesModule, GridState } from "@solenopsys/uimatrix-templates";
import { environment } from "../environments/environment";
import { ClusterState } from "@solenopsys/lib-clusters";
import { createNgxs, DataStorageModule } from "@solenopsys/lib-storage";
import { FuiGridModule, RowsState } from "@solenopsys/uimatrix-lists";
import { DataHstreamModule, HStreamService, HStreamsState, StreamsPool, WsPool } from "@solenopsys/lib-hyperstreams";
import { MountModule } from "./mount.module";
import { PluginsComponent } from "./plugins/plugins.component";
import { LoginComponent } from "./login/login.component";
import { FuiFormsModule } from "@solenopsys/uimatrix-forms";
import { HelmRepositoriesState } from "@solenopsys/lib-helm";
import { InstallationsState } from "@solenopsys/lib-installer";
import { NGXS_PLUGINS } from "@ngxs/store";
import { NgxsLoggerPlugin } from "@ngxs/logger-plugin";
import { Router, RouterModule } from "@angular/router";
import { DgraphDataProvider, DgraphDataProviderService } from "@solenopsys/lib-dgraph";


export function ensureRoutesExist(
  http: ModulesService,
  routeLoader: RouteLoaderService
) {
  return () => routeLoader.load();
}

@Component({
  template: "Loading..",
  encapsulation: ViewEncapsulation.Emulated
})
export class LoadingComponent   {


  constructor( ) {
  }


}

export let staticRoutes = [

 { path: "plugins", component: PluginsComponent },
 { path: "login", component: LoginComponent },

];



@NgModule({
  declarations: [ LoadingComponent,
    PluginsComponent,LoginComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,

     ...createNgxs(!environment.production, [ClusterState, GridState, RowsState, HStreamsState,HelmRepositoriesState,InstallationsState], true),

     RouterModule.forRoot(
         [...staticRoutes,{ path: '**', component: LoadingComponent }]

     ),
    MountModule,
    DataStorageModule,

    HttpClientModule,
    DataHstreamModule,
    FuiIconsModule,
    FuiNavigateModule,

    FuiTemplatesModule,
    FuiGridModule,
    FuiFormsModule

  ],
  providers: [WsPool,HStreamService,StreamsPool,
    {
      provide: APP_INITIALIZER,
      useFactory: ensureRoutesExist,
      multi: true,
      deps: [ModulesService, RouteLoaderService],
    },
    { provide: 'sc',  useValue:  DgraphDataProviderService },
    { provide: 'single_start', useValue: false },
    {
      provide: NGXS_PLUGINS,
      useClass: NgxsLoggerPlugin,
      multi: true
    },
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: 'assets_dir', useValue: ''},
  ],
  bootstrap: [BootstrapComponent],
})
export class AppModule {
  constructor( router:Router) {



   //  router.navigateByUrl(currentRoute.snapshot.url, { skipLocationChange: true });
  }
}
