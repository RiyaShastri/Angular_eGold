import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { OverviewComponent } from "./overview/overview.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    children: [
      {
        path: "overview",
        component: OverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
