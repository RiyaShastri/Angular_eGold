import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipientComponent } from "./recipient.component";
import { ChangeLockerComponent } from "./change-locker/change-locker.component";
import { UpdateShippingAddressComponent } from "./update-shipping-address/update-shipping-address.component";

const routes: Routes = [
  {
    path: "",
    component: RecipientComponent,
    children: [
      {
        path: "update-shipping-address",
        component: UpdateShippingAddressComponent,
      },
      {
        path: "wrong-address",
        component: UpdateShippingAddressComponent,
      },
      {
        path: "change-locker",
        component: ChangeLockerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipientRoutingModule {}
