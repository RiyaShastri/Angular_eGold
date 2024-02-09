import { Component } from "@angular/core";
import { CommonService } from "app/themefolders/shared";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent {
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  onActivate(componentReference: any) {
    if (componentReference?.pageTitle) {
      this.commonService.setPageTitle(componentReference?.pageTitle);
    } else {
      this.commonService.setPageTitle("");
    }
  }
}
