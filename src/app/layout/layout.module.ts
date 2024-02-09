import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "app/material.module";
import { NgProgressModule } from "ngx-progressbar";
import { ThemeModule } from "app/themefolders/theme/theme.module";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

@NgModule({
  declarations: [AdminLayoutComponent, AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    NgProgressModule,
    ThemeModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LayoutModule {}
