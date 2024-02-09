import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { authGuard } from "./themefolders/core";
import { DashboardComponent } from "./themefolders/routes/dashboard/dashboard.component";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { LoginComponent } from "./themefolders/routes/sessions/login/login.component";
import { RegisterComponent } from "./themefolders/routes/sessions/register/register.component";

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      {
        path: "setting",
        loadChildren: () =>
          import("./setting/setting.module").then((m) => m.SettingModule),
      },
      {
        path: "orders",
        loadChildren: () =>
          import("./orders/orders.module").then((m) => m.OrdersModule),
      },
      {
        path: "products",
        loadChildren: () =>
          import("./products/products.module").then((m) => m.ProductsModule),
      },

      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfileModule),
      },
    ],
  },
  {
    path: "recipient",
    loadChildren: () =>
      import("./recipient/recipient.module").then((m) => m.RecipientModule),
  },
  {
    path: "auth",
    component: AuthLayoutComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
    ],
  },

  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
