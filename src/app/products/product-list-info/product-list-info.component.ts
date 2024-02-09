import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
  Component,
  ChangeDetectorRef,
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
import { TableServiceService } from "app/themefolders/shared";
import { TABLE_COLUMNS } from "./product-lis-columns";
import { ProductFilterModalComponent } from "./product-filter-modal/product-filter-modal.component";

@Component({
  selector: "app-product-list-info",
  templateUrl: "./product-list-info.component.html",
  styleUrls: ["./product-list-info.component.scss"],
})
export class ProductListInfoComponent {
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
  configData: any = {};
  tableSelectedRow: any; // for select table Row
  isAPILoading: boolean = true;
  dublicateTableDataSource: any = []; //for store copy of Data source
  deposId: any = null;
  pageTitle = "Product List";

  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private configApi: ConfigApiService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private tableService: TableServiceService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.tableColumns) {
      this.displayedTableColumns = this.tableColumns.map(
        (c: any) => c.columnDef
      );
    }

    this.TableControlForm = this.tableService.initializeTableControlForm();
    this.TableForm = this.tableService.initializeTableDataForm();

    const configTypes = ["dim_depositors"];
    this.configApi.configType(configTypes).subscribe(async (res: any) => {
      configTypes.map((configType) => {
        this.configData[configType] =
          res?.api_response?.records?.[configType]?.records;
      });

      this.deposId = this.configData.dim_depositors.map((ele: any) => {
        return ele.idx;
      });

      this.getProduct(this.deposId);
    });
  }

  get form() {
    return this.TableControlForm.controls;
  }

  get tableData(): FormArray {
    return this.TableForm.get("tableData") as FormArray;
  }

  getProduct(depoIds: any = []) {
    this.isAPILoading = true;

    this.configApi.productTable(depoIds).subscribe(
      (res: any) => {
        this.isFooterBtnActive["btnStatus"] = false;
        this.tableEditedField = [];

        if (res?.api_response?.records.length >= 0) {
          this.tableUpdateForms(res?.api_response?.records);
          // for Add Total Records in Pagination
          this.TableControlForm.get("totalRecords")?.setValue(
            res?.api_response?.records.length
          );
        }
        this.isAPILoading = false;
      },
      (error) => {
        this.isAPILoading = false;
      }
    );
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
      this.dublicateTableDataSource = [...this.tableDataSource.data];
      await this.tableUpdateForms(this.tableData.value);
      this.isFooterBtnActive["btnStatus"] = true;
    }
  }

  searchBtnClick() {
    const searchValue = this.form.searchTxt.value.toLowerCase();
    if (searchValue) {
      const filterRecord = this.commonService.searchRecord(
        searchValue,
        [...this.dublicateTableDataSource],
        "id",
        "name"
      );
      if (filterRecord.length > 0) {
        this.tableUpdateForms(filterRecord);
      } else {
        this.tableDataSource = new MatTableDataSource<any>(filterRecord);
      }
    } else {
      this.getProduct(this.deposId);
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
          this.getProduct(this.deposId);
        }
      });
    }
  }

  resetSearchField() {
    this.TableControlForm.get("searchTxt")?.setValue("");
    this.getProduct(this.deposId);
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
        data: {
          message: "Your unsaved changes will be lost",
          type: "alter",
          subMessage:
            "Are you sure, You want to get more records without saving your changes ?",
        },
        width: "400px",
      });

      dialogRef.afterClosed().subscribe((res: any) => {
        if (res.resetPage === true) {
          this.TableControlForm.patchValue({
            currentPageSize: event.pageSize ? event.pageSize : 50,
            pageIndex: event.pageIndex ? event.pageIndex : 0,
          });
          this.getProduct(this.deposId);
        }
      });
    } else {
      this.TableControlForm.patchValue({
        currentPageSize: event.pageSize ? event.pageSize : 50,
        pageIndex: event.pageIndex ? event.pageIndex : 0,
      });
    }
  }

  // Sort Data
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
          this.getProduct(this.deposId);
        }
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

  resetWholePage() {
    const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
      data: {
        message: "warning",
      },
      width: "400px",
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.resetPage === true) {
        this.getProduct(this.deposId);
      }
    });
  }

  async updateAllRecord() {
    let finalDataset: any = [];
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
        this.selection.clear();
        this.tableSelectedRow = 0;
      } else {
        this.selection.clear();
        this.tableSelectedRow = 0;
      }
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

  onSelectedOversized(event: any, index: any) {
    this.tableData.controls[index].patchValue({
      oversized: event.checked ? 1 : 0,
    });
  }

  openFilterPop() {
    const dialogRef = this.dialog.open(ProductFilterModalComponent, {
      data: {
        depositors: this.configData.dim_depositors,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
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
              this.TableControlForm.get("searchTxt")?.setValue("");
            }
          });
        } else {
          if (res.depositor_ids) {
            this.getProduct(res.depositor_ids);
          } else {
            this.getProduct(this.deposId);
          }
        }
      }
    });
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
