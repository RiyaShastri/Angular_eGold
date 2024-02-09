import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { MenuService } from "app/themefolders/core";
import { CommonService } from "app/themefolders/shared";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @HostBinding("class") class = "matero-header";
  @Input() showToggle = true;
  @Input() showBranding = false;
  pageTitle: any = null;
  value = false;
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  constructor(
    private menuService: MenuService,
    private commonService: CommonService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.commonService.pageTitle.subscribe((title) => {
      this.pageTitle = title ? title : null;
      this.ref.detectChanges();
    });
  }

  menuClose() {
    this.value = !this.value;
    this.menuService._menuClose$.next(this.value);
  }
}
