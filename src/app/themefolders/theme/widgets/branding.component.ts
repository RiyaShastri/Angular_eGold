import { Component } from "@angular/core";

@Component({
  selector: "app-branding",
  template: `
    <a class="d-inline-block text-nowrap r-full text-reset" href="/">
      <img
        src="assets/img/brand/eGold-logo.png"
        class="brand-logo align-middle m-r-2 full"
        alt="logo"
      />
    </a>
  `,
  styles: [
    `
      .brand-logo {
        width: 200px;
        height: 50px;
      }
    `,
  ],
})
export class BrandingComponent {}
