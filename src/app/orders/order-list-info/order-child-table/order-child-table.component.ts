import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
  Component,
  Inject,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AlertDialogBoxComponent } from "app/custom-component/alert-dialog-box/alert-dialog-box.component";
import { ConfigApiService, TableServiceService } from "app/themefolders/shared";
import { CommonService } from "app/themefolders/shared";
import { TABLE_COLUMNS } from "./order-child-table-columns";

@Component({
  selector: "app-order-child-table",
  templateUrl: "./order-child-table.component.html",
  styleUrls: ["./order-child-table.component.scss"],
})
export class OrderChildTableComponent {
  tableColumns = TABLE_COLUMNS;
  displayedColumns: any = [];
  orderProductTableForm: FormGroup;
  tableDataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isFooterBtnActive: any = { btnStatus: false };
  isFooterFomrSubmitting = false; // for  Footer Row Subtmition
  isTableRowSubmitting = false; // for  Table Row Form Subtmition
  tableEditedField: any = []; // for Edit table Edit Field Column
  isPreventDragDrop = false; // for Prevent Drag Column when edit
  ApiDataConfig: any = {}; // for Api Configuration
  tableSelectedRow: any; // for select table Row
  isAPILoading: boolean = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OrderChildTableComponent>,
    public dialog: MatDialog,
    private configApi: ConfigApiService,
    private commonService: CommonService,
    private tableService: TableServiceService,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  async ngOnInit() {
    if (this.tableColumns) {
      this.displayedColumns = this.tableColumns.map((c: any) => c.columnDef);
    }

    const configTypes = Object.keys(this.data.rowData).map((key) => {
      if (key === "id") {
        return `${"depositor_ids"}=[${this.data.rowData[key]}]`;
      } else if (key === "order_id") {
        return `${"order_id_token"}="${this.data.rowData[key]}"`;
      } else {
        return `${key}="${this.data.rowData[key]}"`;
      }
    });
    if (configTypes && configTypes.length > 0) {
      const filter = configTypes.filter(
        (item) =>
          item.includes("depositor_id") || item.includes("order_id_token")
      );
      this.orderProductTableForm = this.tableService.initializeTableDataForm();
      this.getProductOnIdToken(filter);
    }
  }

  getProductOnIdToken(params: any) {
    this.isAPILoading = true;
    this.configApi.orderTableProducts(params).subscribe(
      (res: any) => {
        this.isFooterBtnActive["btnStatus"] = false;
        this.tableEditedField = [];

        this.tableUpdateForms(res?.api_response?.records);
        this.isAPILoading = false;
      },
      (error) => {
        this.isAPILoading = false;
      }
    );
  }

  get tableData(): FormArray {
    return this.orderProductTableForm?.get("tableData") as FormArray;
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
    this.commonService.handleTableDrop(event, this.displayedColumns);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllCheckBoxSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1
      }`;
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
    this.dialog.open(AlertDialogBoxComponent, {
      data: {
        message: "delete",
        row: this.tableSelectedRow === 0 ? 0 : this.tableSelectedRow,
      },
      width: "400px",
    });
  }

  // For Table Row Validation
  isColumnInvalid(i: number, columnDef: string): boolean {
    const control =
      this.tableData.controls[i] && this.tableData.controls[i].get(columnDef);
    return this.commonService.isColumnValidation(control);
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

  onCancel() {
    const IsDataUpdated = this.commonService.isDataChanged(
      this.tableEditedField
    );
    this.dialogRef.close({
      data: this.tableData.value,
      isUpdated: IsDataUpdated,
    });
  }
}
