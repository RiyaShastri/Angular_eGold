import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { CoreModule } from "app/themefolders/core/core.module";
import { ThemeModule } from "app/themefolders/theme/theme.module";
import { SharedModule } from "app/themefolders/shared/shared.module";
import { RoutesModule } from "./themefolders/routes/routes.module";
import { NgxPermissionsModule } from "ngx-permissions";
import { ToastrModule } from "ngx-toastr";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "@env/environment";
import {
  BASE_URL,
  httpInterceptorProviders,
  appInitializerProviders,
} from "app/themefolders/core";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemDataService } from "app/themefolders/shared/in-mem/in-mem-data.service";
import { AppRoutingModule } from "./app-routing.module";
import { LayoutModule } from "./layout/layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomComponentModule } from "./custom-component/custom-component.module";

// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeModule,
    LayoutModule,
    RoutesModule,
    SharedModule,
    CustomComponentModule,
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // Demo purposes only for GitHub Pages
    HttpClientInMemoryWebApiModule.forRoot(InMemDataService, {
      dataEncapsulation: false,
      passThruUnknownUrl: true,
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: "toast-top-right",
      progressBar: true,
      closeButton: true,
    }),
  ],
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    httpInterceptorProviders,
    appInitializerProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
