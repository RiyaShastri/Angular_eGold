import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
} from "@angular/core";
import { SettingsService } from "app/themefolders/core";
import { Subscription } from "rxjs";

import { DashboardService } from "./dashboard.service";
import { CommonService } from "app/themefolders/shared";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = this.dashboardSrv.getStats();

  invent = this.dashboardSrv.getInver();

  notifySubscription!: Subscription;

  constructor(
    private ngZone: NgZone,
    private dashboardSrv: DashboardService,
    private settings: SettingsService,
    private commonService: CommonService
  ) {
    this.commonService.setPageTitle("");
  }

  ngOnInit() {
    this.notifySubscription = this.settings.notify.subscribe((res) => {
    });
  }

  ngOnDestroy() {
    this.notifySubscription.unsubscribe();
  }
}
