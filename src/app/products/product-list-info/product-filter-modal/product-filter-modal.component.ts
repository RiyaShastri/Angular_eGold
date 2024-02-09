import { Component, Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ConfigApiService } from "app/services/config/config-api.service";

@Component({
  selector: "app-product-filter-modal",
  templateUrl: "./product-filter-modal.component.html",
  styleUrls: ["./product-filter-modal.component.scss"],
})
export class ProductFilterModalComponent {
  filterForm: FormGroup;
  oversizedOption = [
    { name: "Yes", value: "Yes" },
    { name: "No", value: "No" },
  ];

  configData: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private configApi: ConfigApiService,
    public dialogRef: MatDialogRef<ProductFilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      productName: new FormControl(""),
      depositor_ids: new FormControl(""),
      oversized: new FormControl(""),
    });

    const configTypes = ["dim_depositors"];
    this.configApi.configType(configTypes).subscribe(async (res: any) => {
      configTypes.map((configType) => {
        this.configData[configType] =
          res?.api_response?.records?.[configType]?.records;
      });
    });
  }

  FilterData() {
    this.dialogRef.close(this.filterForm.value);
  }
}
