import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
} from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AlertDialogBoxComponent } from "app/custom-component/alert-dialog-box/alert-dialog-box.component";
import { ConfigApiService } from "app/services/config/config-api.service";
import { CommonService } from "app/services/tableFunction/common.service";
import { TableServiceService } from "app/services/tableServies/table-service.service";
import { TABLE_COLUMNS } from "./user-management-columns";

@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.scss"],
})
export class UserManagementComponent {
  tableColumns = TABLE_COLUMNS;
  displayedTableColumns: any = [];
  TableControlForm: FormGroup;
  TableForm: FormGroup;
  tableDataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isFooterBtnActive: any = { btnStatus: false };
  isFooterFomrSubmitting = false; // for  Footer Row Subtmition
  tableEditedField: any = []; // for Edit table Edit Field Column
  isPreventDragDrop = false; // for Prevent Drag Column when edit
  ApiDataConfig: any = {};
  tableSelectedRow: any; // for select table Row
  isAPILoading: boolean = true;
  dublicateTableDataSource: any = []; //for store copy of Data source
  pageTitle = "User Management";
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private configApi: ConfigApiService,
    private commonService: CommonService,
    private tableService: TableServiceService,
    private ref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    if (this.tableColumns) {
      this.displayedTableColumns = this.tableColumns.map(
        (c: any) => c.columnDef
      );
    }
    this.TableControlForm = this.tableService.initializeTableControlForm();
    this.TableForm = this.tableService.initializeTableDataForm();

    // for depositor multi-Select
    const apiConfigTypes = ["settings_depositors"];
    this.configApi
      .configSettingType("GET", apiConfigTypes, null)
      .subscribe(async (res: any) => {
        apiConfigTypes.map((configType) => {
          this.ApiDataConfig[configType] = res?.api_response?.records?.[
            configType
          ]?.records.map((ele: any) => {
            return {
              name: ele.name,
              value: ele.idx,
            };
          });
        });

        //for user role select
        const apiUserRoleTypes = ["dim_user_roles"];
        this.configApi
          .configType(apiUserRoleTypes)
          .subscribe(async (res: any) => {
            apiUserRoleTypes.map((configType) => {
              this.ApiDataConfig[configType] =
                this.tableService.transfromOptions(
                  res?.api_response?.records?.[configType]?.records,
                  "idx",
                  "name"
                );
            });
          });

        this.getTableRecord();
      });
  }

  getTableRecord() {
    this.isAPILoading = true;
    const apiConfigTypes = ["settings_users"];

    this.configApi.configSettingType("GET", apiConfigTypes, null).subscribe(
      async (res: any) => {
        apiConfigTypes.map((configType) => {
          this.ApiDataConfig[configType] =
            res?.api_response?.records?.[configType]?.records;
        });

        this.isFooterBtnActive["btnStatus"] = false;
        this.tableEditedField = [];

        // modify Api Multi-Select & Select Option Response
        if (
          this.ApiDataConfig.settings_depositors.length > 0 &&
          this.ApiDataConfig.settings_users.length > 0
        ) {
          for (const item of this.ApiDataConfig.settings_users) {
            item.allowed_depositors = item.allowed_depositors
              .map((allowedIdx: any) => {
                const match = this.ApiDataConfig.settings_depositors.find(
                  (depositors: any) => depositors.value === allowedIdx
                );

                return match ? match.name : allowedIdx;
              })
              .join(",")
              .split(",");

            this.optionValueModify(item);
          }
        }

        if (this.ApiDataConfig.settings_users?.length > 0) {
          this.tableUpdateForms(this.ApiDataConfig?.settings_users);
          this.TableControlForm.get("totalRecords")?.setValue(
            this.ApiDataConfig?.settings_users?.length
          );
        }
        this.isAPILoading = false;
      },
      (error) => {
        this.isAPILoading = false;
      }
    );
  }

  get form() {
    return this.TableControlForm.controls;
  }

  get tableData(): FormArray {
    return this.TableForm.get("tableData") as FormArray;
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

  async onSaveNewRecord() {
    this.isFooterFomrSubmitting = true;
    if (
      this.tableData.controls[this.tableData.value.length - 1].status == "VALID"
    ) {
      this.isFooterFomrSubmitting = false;

      // Add New Record with set tableEditedField  as true
      const lastFieldTrue = this.commonService.isLastEditedField(
        this.tableEditedField[this.tableEditedField.length - 1]
      );

      this.tableEditedField[this.tableEditedField.length - 1] = lastFieldTrue;
      this.dublicateTableDataSource = [...this.tableData.value];
      await this.tableUpdateForms(this.tableData.value);
      this.isFooterBtnActive["btnStatus"] = true;
      this.TableControlForm.get("searchTxt")?.setValue("");
    }
  }

  tableSortData() {
    // for check tableEditedField any field or value is true
    let isEditedFieldTrue: any = false;
    this.tableEditedField.forEach((ele: any) => {
      let elementValues = Object.values(ele);
      if (elementValues.includes(true)) {
        isEditedFieldTrue = true;
      }
    });

    if (isEditedFieldTrue) {
      // for check tableEditedField any field or value is true
      const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
        data: {
          message: "Your unsaved changes will be lost",
          type: "alter",
          subMessage:
            "Are you sure, You want to sort column without saving your changes ?",
        },
        width: "400px",
      });

      dialogRef.afterClosed().subscribe((res: any) => {
        if (res.resetPage === true) {
          this.getTableRecord();
        }
      });
    }
  }

  searchBtnClick() {
    const searchValue = this.form.searchTxt.value?.toLowerCase();
    if (searchValue) {
      const filterValue = this.commonService.searchRecord(
        searchValue,
        [...this.dublicateTableDataSource],
        "UserID",
        "Name"
      );
      if (filterValue.length > 0) {
        this.tableEditedField = [];
        this.tableUpdateForms(filterValue);
      } else {
        this.tableDataSource = new MatTableDataSource<any>(filterValue);
      }
    } else {
      this.getTableRecord();
    }
  }

  searchWarning() {
    let isEditedFieldTrue: any = false;
    this.tableEditedField.forEach((ele: any) => {
      let elementValues = Object.values(ele);
      if (elementValues.includes(true)) {
        isEditedFieldTrue = true;
      }
    });

    if (isEditedFieldTrue) {
      // for check tableEditedField any field or value is true
      const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
        data: {
          message: "Your unsaved changes will be lost",
          type: "alter",
          subMessage:
            "Are you sure, You want to search without saving your changes ?",
        },
        width: "400px",
      });

      dialogRef.afterClosed().subscribe((res: any) => {
        if (res.resetPage === true) {
          this.getTableRecord();
          this.TableControlForm.get("searchTxt")?.setValue("");
        }
      });
    }
  }

  resetSearchField() {
    this.TableControlForm.get("searchTxt")?.setValue("");
    this.getTableRecord();
  }

  // For Paginations
  getPaginationDetail(event: any) {
    let isEditedFieldTrue: any = false;
    this.tableEditedField.forEach((ele: any) => {
      let elementValues = Object.values(ele);
      if (elementValues.includes(true)) {
        isEditedFieldTrue = true;
      }
    });

    if (isEditedFieldTrue) {
      const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
        data: { message: "warning" },
        width: "400px",
      });

      dialogRef.afterClosed().subscribe((res: any) => {
        if (res.resetPage === true) {
          this.TableControlForm.patchValue({
            currentPageSize: event.pageSize ? event.pageSize : 50,
            pageIndex: event.pageIndex ? event.pageIndex : 0,
          });
          this.getTableRecord();
        }
      });
    } else {
      this.TableControlForm.patchValue({
        currentPageSize: event.pageSize ? event.pageSize : 50,
        pageIndex: event.pageIndex ? event.pageIndex : 0,
      });
    }
  }

  //For Table CheckBox Selection
  isAllCheckBoxSelected() {
    return this.commonService.isAllSelectedRow(
      this.selection,
      this.tableDataSource.data
    );
  }

  toggleTableAllRows() {
    if (this.isAllCheckBoxSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.tableDataSource.data);
  }

  onRowTableCheckBoxSelected() {
    const finalSelectedRowData = this.tableService.rowSelection(this.selection);
    this.tableSelectedRow = finalSelectedRowData.length;
  }

  // Table Drag & Drop Function
  tableColumnDragDrop(event: CdkDragDrop<string[]>) {
    this.commonService.handleTableDrop(event, this.displayedTableColumns);
  }

  // For CheckBoxLabel
  tableCheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllCheckBoxSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
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
        this.TableControlForm.get("searchTxt")?.setValue("");
        this.getTableRecord();
      }
    });
  }

  async updateAllRecord() {
    let modifiedDataset: any = [];
    let datasetForUpdate: any = [];
    let datasetForAdd: any = [];

    let currentTableData = [...this.tableData.value];

    if (currentTableData && currentTableData.length > 0) {
      currentTableData.forEach((ele: any) => {
        if (
          ele &&
          ele["allowed_depositors"] &&
          ele["allowed_depositors"].length > 0
        ) {
          const allowedDeposiArr = this.ApiDataConfig?.settings_depositors
            .filter((obj: any) => ele["allowed_depositors"].includes(obj.name))
            .map((obj: any) => obj.value);

          if (allowedDeposiArr && allowedDeposiArr.length > 0) {
            ele["allowed_depositors"] = allowedDeposiArr;
          } else {
            ele["allowed_depositors"] = [];
          }
        } else {
          ele["allowed_depositors"] = [];
        }
      });

      let modifyTableData: any = await this.commonService.modifySelectValue(
        currentTableData
      );

      if (
        this.tableEditedField &&
        this.tableEditedField.length > 0 &&
        modifyTableData &&
        modifyTableData.length > 0
      ) {
        modifiedDataset = await this.commonService.getEditedDataArr(
          this.tableEditedField,
          modifyTableData
        );
      }
    }

    // remove isEditBtnClicked & Iseditable & isDataEdited
    const removeFlagsModifiedDataset = modifiedDataset.map((item: any) => {
      const { isEditBtnClicked, isDataEdited, ...newItem } = item;
      return newItem;
    });

    if (removeFlagsModifiedDataset && removeFlagsModifiedDataset.length > 0) {
      datasetForUpdate = [];
      datasetForAdd = [];

      removeFlagsModifiedDataset.forEach((element: any) => {
        if (element && (element.idx || element.idx === 0)) {
          datasetForUpdate.push(element);
        } else {
          datasetForAdd.push(element);
        }
      });

      if (datasetForUpdate && datasetForUpdate.length > 0) {
        this.UserDataUpdateFn(datasetForUpdate);
      }

      if (datasetForAdd && datasetForAdd.length > 0) {
        this.UserDataAddFn(datasetForAdd);
      }
    }
  }

  UserDataAddFn(addPayLoad: any) {
    this.configApi
      .configSettingType("POST", ["settings_users"], addPayLoad)
      .toPromise()
      .then((res: any) => {
        if (
          res &&
          res["api_response"] &&
          res["api_response"]["records"]?.success
        ) {
          this.TableControlForm.get("searchTxt")?.setValue("");
          this.getTableRecord();
        }
      })
      .catch((err) => {
        console.log("Err....", err);
      });
  }

  UserDataUpdateFn(updatePayLoad: any) {
    this.configApi
      .configSettingType("PUT", ["settings_users"], updatePayLoad)
      .toPromise()
      .then((res: any) => {
        if (
          res &&
          res["api_response"] &&
          res["api_response"]["records"]?.success
        ) {
          this.TableControlForm.get("searchTxt")?.setValue("");
          this.getTableRecord();
        }
      })
      .catch((err) => {
        console.log("Err....", err);
      });
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
      data: {
        message: "delete",
        row: this.tableSelectedRow === 0 ? 0 : this.tableSelectedRow,
      },
      width: "400px",
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.isDeletTableData) {
        this.deleteApiCall();
        this.selection.clear();
        this.tableSelectedRow = 0;
      } else {
        this.selection.clear();
        this.tableSelectedRow = 0;
      }
    });
  }

  deleteApiCall() {
    const finalSelectedRowData = this.tableService.rowSelection(this.selection);
    let reqPayload: any = [];

    if (finalSelectedRowData && finalSelectedRowData.length > 0) {
      finalSelectedRowData.forEach((element: any) => {
        reqPayload.push({ idx: element.idx });
      });
    }

    this.configApi
      .configSettingType("DELETE", ["settings_users"], reqPayload)
      .toPromise()
      .then((res: any) => {
        if (
          res &&
          res["api_response"] &&
          res["api_response"]["records"]?.success
        ) {
          this.TableControlForm.get("searchTxt")?.setValue("");
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
      this.tableData.controls[i] && this.tableData.controls[i].get(columnDef);
    return this.commonService.isColumnValidation(control);
  }

  // For Footer Row Validation
  isFooterFormColumnInvalid(i: number, columnDef: string): boolean {
    const control =
      this.tableData.controls[i] && this.tableData.controls[i].get(columnDef);
    return this.commonService.isFooterColumnValidation(
      this.isFooterFomrSubmitting,
      control
    );
  }

  // for change option Id to Name  (Value to Name)
  optionValueModify(obj: any) {
    this.ApiDataConfig.dim_user_roles?.forEach((roles: any) => {
      if (roles.value === obj.role_id) {
        obj.role_id = roles;
      }
    });
    return obj;
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
