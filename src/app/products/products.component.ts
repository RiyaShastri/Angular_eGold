import { Component } from "@angular/core";
import { CommonService } from "app/themefolders/shared";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent {
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
