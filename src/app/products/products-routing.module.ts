import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductsComponent } from "./products.component";
import { ProductListInfoComponent } from "./product-list-info/product-list-info.component";
import { CanDeactivatGuard } from "app/themefolders/core";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      {
        path: "products-list-info",
        component: ProductListInfoComponent,
        canDeactivate: [CanDeactivatGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
