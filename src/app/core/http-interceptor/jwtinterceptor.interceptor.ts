import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { catchError, retry } from "rxjs/operators";
import { throwError } from "rxjs";
@Injectable()
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem("accessToken");
    const tokenPrefix = "Bearer";
    // const apiUrl = environment.apiRoot;
    const reqUrl = request.url.trim();
    // const url = reqUrl[0] === "/" ? apiUrl + reqUrl : reqUrl;
    const headerObj: any = { Accept: "application/json" };
    if (token) {
      headerObj.Authorization = tokenPrefix + " " + token;
    }
    if (request.headers.get("isFile")) {
      headerObj["Content-Type"] = "multipart/form-data";
    }
    return next
      .handle(
        request.clone({
          headers: new HttpHeaders(headerObj),
        })
      )
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "";
          if (error && error.error && error.error === "Unauthorized") {
            errorMessage = "Unauthorized";
          }
          return throwError(error);
        })
      );
  }
}
