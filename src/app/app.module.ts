import { APP_INITIALIZER, Component, NgModule, ViewEncapsulation } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";


import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { UIIconsModule } from "@solenopsys/ui-icons";
import { UILayoutsModule } from "@solenopsys/ui-layouts";
import { HttpClientModule } from "@angular/common/http";
import { ModulesService } from "@solenopsys/fl-globals";
import { RouteLoaderService } from "./route-loader.service";
import { BootstrapComponent, UITemplatesModule, GridState } from "@solenopsys/ui-templates";
import { environment } from "../environments/environment";
import { ClusterState } from "@solenopsys/fl-clusters";
import { createNgxs, DataStorageModule } from "@solenopsys/fl-storage";
import { UIListsModule, RowsState } from "@solenopsys/ui-lists";
import { DataHstreamModule, HStreamService, HStreamsState, StreamsPool, WsPool } from "@solenopsys/fl-hyperstreams";
import { MountModule } from "./mount.module";
import { PluginsComponent } from "./plugins/plugins.component";
import { UIFormsModule } from "@solenopsys/ui-forms";
import { HelmRepositoriesState } from "@solenopsys/fl-helm";
import { InstallationsState } from "@solenopsys/fl-installer";
import { NGXS_PLUGINS } from "@ngxs/store";
import { NgxsLoggerPlugin } from "@ngxs/logger-plugin";
import { Router, RouterModule } from "@angular/router";
import { DgraphDataProvider, DgraphDataProviderService } from "@solenopsys/fl-dgraph";


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





}

export const staticRoutes = [

 { path: "plugins", component: PluginsComponent },


];



@NgModule({
  declarations: [ LoadingComponent,
    PluginsComponent,
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
    UIIconsModule,
    UILayoutsModule,

    UITemplatesModule,
    UIListsModule,
    UIFormsModule

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
