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
import { OrderChildTableComponent } from "./order-child-table/order-child-table.component";
import { ConfigApiService } from "app/services/config/config-api.service";
import { CommonService } from "app/services/tableFunction/common.service";
import { TableServiceService } from "app/services/tableServies/table-service.service";
import { TABLE_COLUMNS } from "./order-list-columns";
import * as moment from "moment";
import { MatMenuTrigger } from "@angular/material/menu";
import { OrderFilterPopComponent } from "./order-filter-pop/order-filter-pop.component";

@Component({
  selector: "app-order-list-info",
  templateUrl: "./order-list-info.component.html",
  styleUrls: ["./order-list-info.component.scss"],
})
export class OrderListInfoComponent {
  tableColumns = TABLE_COLUMNS;
  displayedTableColumns: any = [];
  TableControlForm: FormGroup;
  TableForm: FormGroup;
  tableDataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isFooterBtnActive: any = { btnStatus: false };
  isFooterFormSubmitting = false; // for  Footer Row Subtmition
  tableEditedField: any = [];
  isPreventDragDrop = false; // for Prevent Drag Column when edit
  tableSelectedRow: any;
  selectedRow: any;
  selectedChildRowIndex = null;
  configData: any = {};
  filteredData: any = null;
  isChildTableEdited = false;
  isAPILoading: boolean = true;
  dublicateTableDataSource: any = []; //for store copy of Data source
  filterpopConfig: any; // for Store copy of filter pop object
  pageTitle = "Order List";

  settingOptionArr = [
    { label: "History", icon: "History.svg" },
    { label: "Dispatch", icon: "Dispatch.svg" },
    { label: "Return Order", icon: "Return.svg" },
    { label: "Print sticker", icon: "Print sticker.svg" },
    { label: "Send Latest HJ status", icon: "Status.svg" },
    { label: "Cancel order", icon: "Outline.svg" },
  ];
  order_source = [
    { name: "shop", value: "shop" },
    { name: "egold", value: "egold" },
  ];
  order_status = [
    { name: "ORDER_REGISTERED", value: "ORDER_REGISTERED" },
    { name: "ADDRESS_VALIDATED", value: "ADDRESS_VALIDATED" },
    { name: "RELEASED", value: "RELEASED" },
  ];

  ApiDataConfig: any = {
    order_status: this.order_status,
  }; // for Api Configuration

  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("childTableMenu") menu: MatMenuTrigger;
  @ViewChild("trigger") menu2: MatMenuTrigger;

  constructor(
    public dialog: MatDialog,
    private configApi: ConfigApiService,
    private commonService: CommonService,
    private tableService: TableServiceService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.tableColumns) {
      this.displayedTableColumns = this.tableColumns.map(
        (c: any) => c.columnDef
      );
    }

    this.TableControlForm = this.tableService.initializeTableControlForm();
    this.TableForm = this.tableService.initializeTableDataForm();

    const configTypes = [
      "dim_shipping_types",
      "dim_couriers",
      "dim_depositors",
    ];
    this.configApi.configType(configTypes).subscribe(async (res: any) => {
      configTypes.map((configType) => {
        this.ApiDataConfig[configType] = this.tableService.transfromOptions(
          res?.api_response?.records?.[configType]?.records,
          "idx",
          "name"
        );
      });
    });

    const lastWeekDate = moment().subtract(6, "days").format("YYYY-MM-DD");
    const filterOptions = [];
    filterOptions.push(`start_datetime="${lastWeekDate}"`);
    this.getOrders(filterOptions);
  }

  getOrders(filterOptions: any = []) {
    this.isAPILoading = true;
    this.configApi.orderTableNew(filterOptions).subscribe(
      async (res: any) => {
        this.isFooterBtnActive["btnStatus"] = false;
        this.tableEditedField = [];

        if (res?.api_response?.records?.length >= 0) {
          console.log("res?.api_response?.records", res?.api_response?.records);
          this.tableUpdateForms(res?.api_response?.records);
          this.TableControlForm.get("totalRecords")?.setValue(
            res?.api_response?.records?.length
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
    this.isFooterFormSubmitting = true;
    if (
      this.tableData.controls[this.tableData.value.length - 1].status == "VALID"
    ) {
      this.isFooterFormSubmitting = false;
      // Add New Record with set tableEditedField  false
      let t: any = {};
      Object.keys(
        this.tableEditedField[this.tableEditedField.length - 1]
      ).forEach((ele: any) => {
        t[ele] = true;
      });
      this.tableEditedField[this.tableEditedField.length - 1] = t;
      this.dublicateTableDataSource = [...this.tableData.value];
      await this.tableUpdateForms(this.tableData.value);
      this.isFooterBtnActive["btnStatus"] = true;
    }
  }

  openFilterPop() {
    const filterDepositor = this.ApiDataConfig.dim_depositors?.map(
      (ele: any) => {
        return {
          idx: ele.value,
          name: ele.name,
        };
      }
    );

    const dialogRef = this.dialog.open(OrderFilterPopComponent, {
      data: {
        depositors: filterDepositor,
        filteredData: this.filteredData ? this.filteredData : null,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.filteredData = res;
        const configTypes = Object.keys(res).map((key) => {
          if (key === "order_codes") {
            return `${key}=[${res[key].split(" ").map((d: any) => `"${d}"`)}]`;
          } else {
            return `${key}="${res[key]}"`;
          }
        });

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
              this.filterpopConfig = [configTypes[0]];
              this.getOrders(configTypes);
            }
          });
        } else {
          console.log("res..", res);
          this.filterpopConfig = [configTypes[0]];
          this.getOrders(configTypes);
        }
      }
    });
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
          this.getOrders(this.filterpopConfig);
        }
      });
    }
  }

  searchBtnClick() {
    const searchValue = this.form.searchTxt.value.toLowerCase();
    if (searchValue) {
      const filterValue = this.commonService.searchRecord(
        searchValue,
        [...this.dublicateTableDataSource],
        "id",
        "shop_order_id"
      );

      if (filterValue.length > 0) {
        this.tableUpdateForms(filterValue);
      } else {
        this.tableDataSource = new MatTableDataSource<any>(filterValue);
      }
    } else {
      this.getOrders(this.filterpopConfig);
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
          this.getOrders(this.filterpopConfig);
        }
      });
    }
  }

  resetSearchField() {
    this.TableControlForm.get("searchTxt")?.setValue("");
    if (this.filterpopConfig) {
      this.getOrders(this.filterpopConfig);
    } else {
      const lastWeekDate = moment().subtract(6, "days").format("YYYY-MM-DD");
      const filterOptions = [];
      filterOptions.push(`start_datetime="${lastWeekDate}"`);
      this.getOrders(filterOptions);
    }
  }

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
          // this.getTableRecord();
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

  selectDepositorFilter(event: any) {
    const val = event.target.value;
    const tableData = [...this.dublicateTableDataSource];

    const filterDepositor = this.commonService.selectDepositor(
      val,
      tableData,
      "depositor"
    );

    if (filterDepositor && filterDepositor.length > 0) {
      this.tableUpdateForms(filterDepositor);
    }
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
        this.TableControlForm.get("searchTxt")?.setValue("");
        this.getOrders(this.filterpopConfig);
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

  setDynamicId(index: any) {
    if (this.selectedChildRowIndex || this.selectedChildRowIndex == 0) {
      this.selectedChildRowIndex = null;
    } else {
      this.selectedChildRowIndex = index;
    }
  }

  openDialog(rowIndex: any, row: any) {
    const dialogRef = this.dialog.open(OrderChildTableComponent, {
      disableClose: true,
      data: { rowData: row },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        this.tableData.controls[rowIndex].patchValue({
          product: result["data"],
        });
        this.isChildTableEdited = result.isUpdated;
      }
      this.selectedChildRowIndex = null;
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
      this.isFooterFormSubmitting,
      control
    );
  }

  // Your changes will be lost confirmation
  canDeactivate() {
    return this.commonService.doCanDeactivate(
      this.tableEditedField,
      true,
      this.isChildTableEdited
    );
  }

  @HostListener("window:beforeunload", ["$event"])
  onbeforeunload(event: Event) {
    console.log("Event...", event);
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
    } else {
      this.getOrders(this.filterpopConfig);
    }
  }
}
