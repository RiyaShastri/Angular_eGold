import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RecipientRoutingModule } from "./recipient-routing.module";
import { RecipientComponent } from "./recipient.component";
import { MaterialModule } from "app/material.module";
import { NgProgressModule } from "ngx-progressbar";
import { ThemeModule } from "app/themefolders/theme/theme.module";
import { ChangeLockerComponent } from './change-locker/change-locker.component';
import { UpdateShippingAddressComponent } from './update-shipping-address/update-shipping-address.component';
@NgModule({
  declarations: [
    RecipientComponent, 
    ChangeLockerComponent, 
    UpdateShippingAddressComponent
  ],
  imports: [
    CommonModule,
    RecipientRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgProgressModule,
    ThemeModule,
  ],
})
export class RecipientModule { }
