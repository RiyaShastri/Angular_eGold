import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class ConfigApiService {
  apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  configSettingType(
    ApiMethod: any,
    configType: any = [],
    payload: any,
    extraPayLoad?: any
  ) {
    let reqPayload: any = {
      api_request: {
        records: {},
      },
    };

    if (configType && configType?.length > 0) {
      if (configType[0] === "settings_couriers" && ApiMethod === "PUT") {
        reqPayload = extraPayLoad;
      } else if (configType[0] === "settings_general" && ApiMethod === "PUT") {
        reqPayload = extraPayLoad;
      } else if (configType[0] === "settings_sms" && ApiMethod === "PUT") {
        reqPayload.api_request.records[configType[0]] = {
          max_text_msg_length: extraPayLoad,
          records: payload,
        };
      } else {
        reqPayload.api_request.records[configType[0]] = {
          records: payload,
        };
      }
    }

    if (ApiMethod == "POST") {
      return this.http.post(this.apiUrl + "/config", reqPayload);
    } else if (ApiMethod == "PUT") {
      return this.http.put(this.apiUrl + "/config", reqPayload);
    } else if (ApiMethod == "DELETE") {
      return this.http.delete(this.apiUrl + "/config", { body: reqPayload });
    } else {
      let apiURL = this.apiUrl + "/config";
      if (configType.length > 0) {
        apiURL += `?settings_items=${JSON.stringify(configType)}`;
      }
      return this.http.get(apiURL);
    }
  }

  configType(type: any = []) {
    let apiURL = this.apiUrl + "/config";
    if (type.length > 0) {
      apiURL += `?config_items=${JSON.stringify(type)}`;
    }
    return this.http.get(apiURL);
  }

  orderTableNew(filterOptions: any = []) {
    let apiURL = this.apiUrl + "/order";
    let queryParams = filterOptions.join("&");
    apiURL += `?${queryParams}`;
    return this.http.get(apiURL);
  }

  orderTableProducts(products_Id_Token: any[]) {
    let apiURL = this.apiUrl + "/product";
    let queryParams = products_Id_Token.join("&");
    apiURL += `?${queryParams}`;
    return this.http.get(apiURL);
  }

  productTable(Options: any[]) {
    let apiURL = this.apiUrl + "/product";
    let queryParams = JSON.stringify(Options);
    apiURL += `?depositor_ids=${queryParams}`;
    return this.http.get(apiURL);
  }
}
