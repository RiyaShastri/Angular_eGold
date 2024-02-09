import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    const token = window.localStorage.getItem("accessToken");
    if (token !== null) {
      return true;
    } else {
      this.router.navigate(["/auth/"]);
      return false;
    }
  }
}
