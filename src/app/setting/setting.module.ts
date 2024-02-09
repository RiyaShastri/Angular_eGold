import { CanDeactivatGuard } from "./../themefolders/core/authentication/route-alert.guard";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingRoutingModule } from "./setting-routing.module";
import { SettingComponent } from "./setting.component";
import { GeneralComponent } from "./general/general.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CustomComponentModule } from "../custom-component/custom-component.module";
import { SmsNotificationsComponent } from "./sms-notifications/sms-notifications.component";
import { DepositorSelectionComponent } from "./depositor-selection/depositor-selection.component";
import { DriversComponent } from "./drivers/drivers.component";
import { UserManagementComponent } from "./user-management/user-management.component";
import { CouriersDeliveryRegionsComponent } from "./couriers-delivery-regions/couriers-delivery-regions.component";
import { CouriersStatusMappingComponent } from "./couriers-status-mapping/couriers-status-mapping.component";
import { MaterialModule } from "app/material.module";
import { ThemeModule } from "app/themefolders/theme/theme.module";
import { MatMenuModule } from "@angular/material/menu";
import { SharedModule } from "app/themefolders/shared";
import { CdkDrag, CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import { MatTableModule } from "@angular/material/table";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ContentdModalComponent } from "./sms-notifications/contentd-modal/contentd-modal.component";
import { ProductConstraintsComponent } from "./product-constraints/product-constraints.component";

@NgModule({
  declarations: [
    SettingComponent,
    GeneralComponent,
    SmsNotificationsComponent,
    DepositorSelectionComponent,
    DriversComponent,
    UserManagementComponent,
    CouriersDeliveryRegionsComponent,
    CouriersStatusMappingComponent,
    ContentdModalComponent,
    ProductConstraintsComponent,
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    CustomComponentModule,
    ThemeModule,
    MatMenuModule,
    MatTableModule,
    SharedModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    CKEditorModule,
  ],
  providers: [CanDeactivatGuard],
})
export class SettingModule {}
