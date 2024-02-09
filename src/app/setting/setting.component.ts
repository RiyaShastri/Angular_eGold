import { Component } from "@angular/core";
import { CommonService } from "app/themefolders/shared";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent {
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
