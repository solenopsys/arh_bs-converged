import {APP_INITIALIZER, Component, NgModule, ViewEncapsulation} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";


import {APP_BASE_HREF, CommonModule} from "@angular/common";
import {UIIconsModule} from "@solenopsys/ui-icons";
import {UILayoutsModule} from "@solenopsys/ui-layouts";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ModulesService} from "@solenopsys/fl-globals";
import {RouteLoaderService} from "./route-loader.service";
import {
  BootstrapComponent,
  UITemplatesModule,
  GridState,
  InterfaceState,
  MenuState,
  MenuLoaderService
} from "@solenopsys/ui-templates";
import {environment} from "../environments/environment";
import {Cluster, ClusterState} from "@solenopsys/fl-clusters";
import {createNgxs, DataStorageModule} from "@solenopsys/fl-storage";
import {UIListsModule, RowsState} from "@solenopsys/ui-lists";
import {DataHstreamModule, HStreamService, HStreamsState, StreamsPool, WsPool} from "@solenopsys/fl-hyperstreams";
import {MountModule} from "./mount.module";
import {PluginsComponent} from "./plugins/plugins.component";
import {UIFormsModule} from "@solenopsys/ui-forms";
import {HelmRepositoriesState} from "@solenopsys/fl-helm";
import {InstallationsState} from "@solenopsys/fl-installer";
import {NGXS_PLUGINS, Store} from "@ngxs/store";
import {NgxsLoggerPlugin} from "@ngxs/logger-plugin";
import {Router, RouterModule} from "@angular/router";
import {DgraphDataProvider, DgraphDataProviderService} from "@solenopsys/fl-dgraph";
import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {ColorSchemesService} from "@solenopsys/ui-themes";
import {ClustersMenuProvider} from "./cluster-menu-provider";


//todo should be integrated
// const tabs$ = clusters$.pipe(map((clusters: Cluster[]) => {
//   return clusters?.map(item => {
//     return {id: item.host, title: item.title};
//   });
// }));


const menu$ = new Subject()

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
export class LoadingComponent {


}

export const staticRoutes = [

    {path: "plugins", component: PluginsComponent},


];


@NgModule({
    declarations: [LoadingComponent,
        PluginsComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,

        ...createNgxs(!environment.production, [InterfaceState,
          MenuState, ClusterState, GridState, RowsState, HStreamsState, HelmRepositoriesState, InstallationsState], true),

        RouterModule.forRoot(
            [...staticRoutes, {path: '**', component: LoadingComponent}]
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
    providers: [WsPool, HStreamService, StreamsPool,
        {
            provide: APP_INITIALIZER,
            useFactory: ensureRoutesExist,
            multi: true,
            deps: [ModulesService, RouteLoaderService],
        },
        {provide: 'sc', useValue: DgraphDataProviderService},
        {
            provide: NGXS_PLUGINS,
            useClass: NgxsLoggerPlugin,
            multi: true
        },
        {provide: 'logo', useValue: "converged"},
        {provide: 'menu', useValue: menu$.asObservable()},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: 'assets_dir', useValue: ''},
    ],
    bootstrap: [BootstrapComponent],
})
export class AppModule {
  constructor(
      private http: HttpClient,
      private store: Store, menuLoaderService: MenuLoaderService,
      private colorService: ColorSchemesService) {


    menuLoaderService.addProvider("clusterMenuProvider", new ClustersMenuProvider( ))
    menuLoaderService.addMapping("components", "clusterMenuProvider")
  }
}
