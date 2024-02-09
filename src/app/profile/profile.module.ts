import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CustomComponentModule } from "app/custom-component/custom-component.module";
import { MaterialModule } from "app/material.module";
import { ThemeModule } from "app/themefolders/theme/theme.module";
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [ProfileComponent, OverviewComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    CustomComponentModule,
    ThemeModule,
    MatMenuModule,
  ],
})
export class ProfileModule {}
