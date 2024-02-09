import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomComponentModule } from "../custom-component/custom-component.module";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "app/material.module";
import { CdkDrag, CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";
import { ProductListInfoComponent } from "./product-list-info/product-list-info.component";
import { SharedModule } from "app/themefolders/shared";
import { CanDeactivatGuard } from "app/themefolders/core";
import { ProductFilterModalComponent } from './product-list-info/product-filter-modal/product-filter-modal.component';
@NgModule({
  declarations: [ProductsComponent, ProductListInfoComponent, ProductFilterModalComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    CommonModule,
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
export class ProductsModule {}
