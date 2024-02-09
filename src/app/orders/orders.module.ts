import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrdersRoutingModule } from "./orders-routing.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomComponentModule } from "../custom-component/custom-component.module";
import { OrdersComponent } from "./orders.component";
import { OrderListInfoComponent } from "./order-list-info/order-list-info.component";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "app/material.module";
import { CdkDrag, CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import { OrderChildTableComponent } from "./order-list-info/order-child-table/order-child-table.component";
import { SharedModule } from "app/themefolders/shared";
import { CanDeactivatGuard } from "app/themefolders/core";
import { OrderFilterPopComponent } from './order-list-info/order-filter-pop/order-filter-pop.component';
@NgModule({
  declarations: [
    OrderListInfoComponent,
    OrdersComponent,
    OrderChildTableComponent,
    OrderFilterPopComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    CustomComponentModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    SharedModule,
  ],
  providers:[
    CanDeactivatGuard
  ]
})
export class OrdersModule {}
