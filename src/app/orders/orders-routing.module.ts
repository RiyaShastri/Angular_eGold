import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdersComponent } from "./orders.component";
import { OrderListInfoComponent } from "./order-list-info/order-list-info.component";
import {CanDeactivatGuard} from "../themefolders/core/authentication/route-alert.guard";

const routes: Routes = [
  {
    path: "",
    component: OrdersComponent,
    children: [
      {
        path: "order-list-info",
        component: OrderListInfoComponent,
        canDeactivate: [CanDeactivatGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
