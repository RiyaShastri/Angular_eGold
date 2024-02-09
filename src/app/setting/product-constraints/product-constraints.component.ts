import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfigApiService } from "app/services/config/config-api.service";

@Component({
  selector: "app-product-constraints",
  templateUrl: "./product-constraints.component.html",
  styleUrls: ["./product-constraints.component.scss"],
})
export class ProductConstraintsComponent {
  productMaximalDimensions: FormGroup;
  pageTitle = "Product Constraints";
  ApiDataConfig: any = {};
  productTitleObj: any = {
    getpackage_vm_constraints: "GETPACKAGE VM CONSTRAINTS",
    getdelivery_vm_constraints: "GETDELIVERY VM CONSTRAINTS",
    zigzag_vm_constraints: "ZIGZAG VM CONSTRAINTS",
    nd_to_sd_change_time_window: "ND TO SD CHANGE TIME WINDOW",
  };
  finalResponse: any = [];
  tableEditedField: any = [];
  isAPILoading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private configApi: ConfigApiService
  ) {}

  async ngOnInit() {
    this.initProductTableFormGroup();
    this.getConstraintDetail();
  }

  getConstraintDetail() {
    this.isAPILoading = true;
    const apiConfigTypes = ["settings_product_constraints"];
    this.configApi.configSettingType("GET", apiConfigTypes, null).subscribe(
      async (res: any) => {
        apiConfigTypes.map((configType) => {
          this.ApiDataConfig[configType] =
            res?.api_response?.records?.[configType]?.records;
        });
        const modifiedRes: any = await this.modifyObj();
        this.finalResponse = [
          ...new Map(
            modifiedRes.map((item: any) => [item["name"], item])
          ).values(),
        ];
        this.finalResponse.forEach((ele: any) => {
          this.ProducttableData.push(this.createItemFormGroup(ele));
        });
        this.tableEditedField = [...this.ProducttableData.value];
        this.isAPILoading = false;
      },
      (err) => {
        this.isAPILoading = false;
      }
    );
  }

  modifyObj() {
    return new Promise((resolve, reject) => {
      let modifiedResponse: any = [];
      let newObj: any = {};

      this.ApiDataConfig["settings_product_constraints"].forEach(
        async (responseObj: any) => {
          let temp: any[] = responseObj?.name.split(".");
          if (temp && temp.length > 0) {
            newObj["name"] = temp[0];
            newObj["title"] = this.productTitleObj[temp[0]];
            newObj[temp[1]] = {
              idx: responseObj.idx,
              value: responseObj.value,
            };
            modifiedResponse.push({ ...newObj });
          }
        }
      );

      if (modifiedResponse && modifiedResponse.length > 0) {
        resolve(modifiedResponse);
      } else {
        resolve([]);
      }
    });
  }

  initProductTableFormGroup() {
    this.productMaximalDimensions = this.formBuilder.group({
      ProducttableData: this.formBuilder.array([]),
    });
  }

  createItemFormGroup(item: any = {}) {
    const group = this.formBuilder.group({
      name: [item && item.name ? item.name : ""],
      title: [item && item.title ? item.title : ""],
      width: [item && item.width ? item.width.value : 1, [Validators.required]],
      length: [
        item && item.length ? item.length.value : 1,
        [Validators.required],
      ],
      height: [
        item && item.height ? item.height.value : 1,
        [Validators.required],
      ],
      weight: [
        item && item.weight ? item.weight.value : 1,
        [Validators.required],
      ],
    });
    return group;
  }

  get ProducttableData(): FormArray {
    return this.productMaximalDimensions.controls.ProducttableData as FormArray;
  }

  productMaximalFormSubmit() {
    let response: any = [];
    this.ProducttableData.value.forEach((element: any, index: any) => {
      if (
        JSON.stringify(element) !== JSON.stringify(this.tableEditedField[index])
      ) {
        for (const property in this.tableEditedField[index]) {
          if (this.tableEditedField[index][property] !== element[property]) {
            this.finalResponse[index][property]["value"] = element[property];
            response.push({ ...this.finalResponse[index][property] });
          }
        }
      }
    });
    if (response && response.length > 0) {
      this.ProductContraintDataUpdateFn(response);
    }
  }

  ProductContraintDataUpdateFn(updatePayLoad: any) {
    this.configApi
      .configSettingType("PUT", ["settings_product_constraints"], updatePayLoad)
      .toPromise()
      .then((res: any) => {
        if (
          res &&
          res["api_response"] &&
          res["api_response"]["records"]?.success
        ) {
          this.ProducttableData.clear();
          this.getConstraintDetail();
        }
      })
      .catch((err) => {
        console.log("Err....", err);
      });
  }

  resetClick() {
    this.ProducttableData.clear();
    this.getConstraintDetail();
  }
}
