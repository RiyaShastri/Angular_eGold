import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { AlertDialogBoxComponent } from "app/custom-component/alert-dialog-box/alert-dialog-box.component";
import { ConfigApiService } from "app/services/config/config-api.service";
import { TABLE_COLUMNS } from "./couriers-delivery-regions";
import { MatDialog } from "@angular/material/dialog";
import { CommonService, TableServiceService } from "app/themefolders/shared";

@Component({
  selector: "app-couriers-delivery-regions",
  templateUrl: "./couriers-delivery-regions.component.html",
  styleUrls: ["./couriers-delivery-regions.component.scss"],
})
export class CouriersDeliveryRegionsComponent implements OnInit {
  metMenuArr: any = [
    {
      id: 1,
      name: "Same Day deliveries",
      options: [],
    },
    {
      id: 2,
      name: "Next Day deliveries",
      options: [],
    },
    {
      id: 3,
      name: "Locker deliveries",
      options: [],
    },
  ];
  configData: any = {};
  tableColumns = TABLE_COLUMNS;
  displayedTableColumns: any = [];
  depositorMainTableForm: FormGroup;
  tableDataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isFooterBtnActive: any = { btnStatus: false };
  isFooterFomrSubmitting = false; // for  Footer Row Subtmition
  tableEditedField: any = []; // for Edit table Edit Field Column
  isPreventDragDrop = false; // for Prevent Drag Column when edit
  ApiDataConfig: any = {}; // for Api Configuration
  tableSelectedRow: any; // for select table Row
  isAPILoading: boolean = true;
  dublicateTableDataSource: any = []; //for store copy of Data source
  pageTitle = "Couriers Delivery Regions";

  constructor(
    public dialog: MatDialog,
    private configApi: ConfigApiService,
    private commonService: CommonService,
    private tableService: TableServiceService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const configTypes = ["dim_shipping_types"];

    this.configApi.configType(configTypes).subscribe(async (res: any) => {
      configTypes.map((configType) => {
        this.configData[configType] =
          res?.api_response?.records?.[configType]?.records;
      });

      this.metMenuArr.forEach((ele: any) => {
        ele.options = this.configData.dim_shipping_types;
      });
    });

    if (this.tableColumns) {
      this.displayedTableColumns = this.tableColumns.map(
        (c: any) => c.columnDef
      );
    }
    this.depositorMainTableForm = this.tableService.initializeTableDataForm();
    this.getTableRecord();
  }

  getTableRecord() {
    this.isAPILoading = true;
    const apiConfigTypes = ["settings_couriers"];
    this.isAPILoading = true;
    this.configApi.configSettingType("GET", apiConfigTypes, null).subscribe(
      async (res: any) => {
        apiConfigTypes.map((configType) => {
          this.ApiDataConfig[configType] =
            res?.api_response?.records?.[configType]?.dim_couriers?.records;
        });

        this.isFooterBtnActive["btnStatus"] = false;
        this.tableEditedField = [];

        if (this.ApiDataConfig.settings_couriers?.length > 0) {
          this.tableUpdateForms(this.ApiDataConfig.settings_couriers);
        }
        this.isAPILoading = false;
      },
      (error) => {
        this.isAPILoading = false;
      }
    );
  }

  get tableData(): FormArray {
    return this.depositorMainTableForm.get("tableData") as FormArray;
  }

  tableUpdateForms(records: any[], renderForm = true) {
    this.tableDataSource = new MatTableDataSource<any>([]);
    if (renderForm) {
      this.tableData.reset();
      this.tableData.clear();
      this.ref.detectChanges();
      this.tableService.manageTableDataForm(
        records,
        this.tableColumns,
        this.tableData,
        this.tableEditedField
      );
    }
    this.tableDataSource = new MatTableDataSource<any>(records);
    this.dublicateTableDataSource = [...this.tableDataSource.data];
  }

  enableEditRow(index: any) {
    this.isPreventDragDrop = true;
    this.tableData.controls[index].patchValue({
      isEditBtnClicked: true,
    });
  }

  onTableActionFn(actionType: any, oldRowData: any, index: any) {
    this.tableData.controls[index].setValue(
      this.tableData.controls[index].value
    );
    const updatedData = this.tableService.tableActions(
      actionType,
      oldRowData,
      index,
      this.tableData,
      this.tableEditedField,
      this.isFooterBtnActive
    );
    if (updatedData) {
      this.tableUpdateForms(updatedData, false);
      this.isPreventDragDrop = false;
    }
  }

  // for change option value
  optionValueModify(obj: any) {
    this.ApiDataConfig.dim_couriers.forEach((courier: any) => {
      this.ApiDataConfig.dim_shop_plugin_types.forEach((plugin: any) => {
        if (plugin.value.toString() === obj.shop_plugin_type) {
          obj.shop_plugin_type = plugin.name;
        }
      });
    });
    return obj;
  }

  // Table Drag & Drop Function
  tableColumnDragDrop(event: CdkDragDrop<string[]>) {
    this.commonService.handleTableDrop(event, this.displayedTableColumns);
  }

  // Footer Button Functionality
  resetWholePage() {
    const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
      data: {
        message: "warning",
      },
      width: "400px",
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.resetPage === true) {
        this.getTableRecord();
      }
    });
  }

  async updateAllRecord() {
    let finalDataset: any = [];
    let datasetForUpdate: any = [];
    let currentTableData = [...this.tableData.value];

    if (currentTableData && currentTableData.length > 0) {
      if (
        this.tableEditedField &&
        this.tableEditedField.length > 0 &&
        currentTableData &&
        currentTableData.length > 0
      ) {
        finalDataset = await this.commonService.getEditedDataArr(
          this.tableEditedField,
          currentTableData
        );
      }
    }
    // remove isEditBtnClicked & Iseditable & isDataEdited
    const removeFlagsModifiedDataset = finalDataset.map((item: any) => {
      const { isEditBtnClicked, isDataEdited, daily_count, ...newItem } = item;
      return newItem;
    });

    if (removeFlagsModifiedDataset && removeFlagsModifiedDataset.length > 0) {
      datasetForUpdate = [];

      removeFlagsModifiedDataset.forEach((element: any) => {
        if (element && (element.idx || element.idx === 0)) {
          datasetForUpdate.push(element);
        }
      });

      if (datasetForUpdate && datasetForUpdate.length > 0) {
        // for Extra Payload
        let extraReqPayload: any = {
          api_request: {
            records: {
              settings_couriers: {
                dim_couriers: {
                  records: datasetForUpdate,
                },
              },
            },
          },
        };

        this.CouriersDeliveryUpdateFn(extraReqPayload);
      }
    }
  }

  CouriersDeliveryUpdateFn(updatePayLoad: any) {
    this.configApi
      .configSettingType("PUT", ["settings_couriers"], null, updatePayLoad)
      .toPromise()
      .then((res: any) => {
        if (
          res &&
          res["api_response"] &&
          res["api_response"]["records"]?.success
        ) {
          this.getTableRecord();
        }
      })
      .catch((err) => {
        console.log("Err....", err);
      });
  }

  // For Table Row Validation
  isColumnInvalid(i: number, columnDef: string): boolean {
    const control =
      this.tableData.controls[i] && this.tableData.controls[i]?.get(columnDef);
    return this.commonService.isColumnValidation(control);
  }

  // Your changes will be lost confirmation
  canDeactivate() {
    return this.commonService.doCanDeactivate(this.tableEditedField);
  }

  @HostListener("window:beforeunload", ["$event"])
  onbeforeunload(event: Event) {
    let isEditedFieldTrue: any = false;
    this.tableEditedField.forEach((ele: any) => {
      let elementValues = Object.values(ele);
      if (elementValues.includes(true)) {
        isEditedFieldTrue = true;
      }
    });
    if (isEditedFieldTrue) {
      event.preventDefault();
      event.returnValue = false;
    }
  }
}
