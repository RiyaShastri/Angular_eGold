import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { DragDropModule } from "@angular/cdk/drag-drop";

import { MaterialModule } from "../../material.module";

import { NgProgressModule } from "ngx-progressbar";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { NgProgressRouterModule } from "ngx-progressbar/router";
import { NgxPermissionsModule } from "ngx-permissions";
import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";

import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { PageHeaderComponent } from "./components/page-header/page-header.component";
import { ErrorCodeComponent } from "./components/error-code/error-code.component";

const MODULES: any[] = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
  DragDropModule,
  MaterialModule,
  NgProgressModule,
  NgProgressRouterModule,
  NgProgressHttpModule,
  NgxPermissionsModule,
  ToastrModule,
  TranslateModule,
];
const COMPONENTS: any[] = [
  BreadcrumbComponent,
  PageHeaderComponent,
  ErrorCodeComponent,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class SharedModule {}
