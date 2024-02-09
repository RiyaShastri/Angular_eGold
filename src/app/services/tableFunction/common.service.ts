import { Injectable } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AlertDialogBoxComponent } from "app/custom-component/alert-dialog-box/alert-dialog-box.component";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  // pagination,searching,& sorting Form Controls
  createFormControls() {
    return {
      sortKey: new FormControl("run_date"),
      sortType: new FormControl("asc"),
      searchTxt: new FormControl(null),
      currentPageSize: new FormControl(50),
      totalRecords: new FormControl(0),
      pageIndex: new FormControl(0),
      selectDepositor: new FormControl(""),
    };
  }

  createInitFormGroup() {
    const formControls = this.createFormControls();
    return new FormGroup(formControls);
  }

  // table FormArray
  TableFormGroup() {
    return this.formBuilder.group({
      tableData: this.formBuilder.array([]),
    });
  }

  getTableDataFormArray(formGroup: FormGroup): FormArray {
    return formGroup.get("tableData") as FormArray;
  }

  // table Form Control
  createFormFromColumns(columns: any[], controlValue: any): FormGroup {
    const formControls: any = {};
    columns.forEach((column) => {
      const controlName = column.columnDef;
      const initialValue = controlValue[controlName] || null;

      formControls[controlName] = new FormControl(initialValue, [
        Validators.required,
      ]);
    });
    formControls["isEditBtnClicked"] = new FormControl(false);
    formControls["isDataEdited"] = new FormControl(false);
    return this.formBuilder.group(formControls);
  }

  getPerPageSizeOptions(): any[] {
    return [50, 100, 250];
  }

  sortTableData(value: any, dataSource: any): any {
    const data = [...dataSource];
    let sortData: any;
    if (value.active) {
      sortData = data.sort((a: any, b: any) => {
        const comparison = a[value.active] < b[value.active] ? -1 : 1;
        return comparison * (value.direction === "asc" ? 1 : -1);
      });
    } else {
      sortData = data;
    }

    return sortData;
  }

  onRowSelected(selectedRow: any) {
    return selectedRow &&
      selectedRow.selected &&
      selectedRow.selected.length > 0
      ? selectedRow.selected
      : [];
  }

  isAllSelectedRow(selectRow: any, dataSource: any) {
    const numSelected = selectRow?.selected?.length;
    const numRows = dataSource?.length;
    return numSelected === numRows;
  }

  selectDepositor(selectDepositor: any, tableData: any[], type?: any) {
    const temp = tableData.filter((data: any) => {
      if (selectDepositor === "" || selectDepositor === null) {
        return true;
      } else if (type === "name") {
        return selectDepositor === data.name;
      } else if (type === "depositor") {
        return selectDepositor === data.depositor;
      } else {
        return false;
      }
    });

    return temp;
  }

  // Search Function
  searchRecord(searchValue: any, tableDataSource: any, id?: any, name?: any) {
    const filterRecord = tableDataSource.filter((tableValue: any) => {
      const idxMatches = tableValue[id].toString().includes(searchValue);
      const nameMatches = tableValue[name].toLowerCase().includes(searchValue);
      return idxMatches || nameMatches;
    });

    return filterRecord;
  }

  // handle tableDrop Function
  handleTableDrop(
    event: CdkDragDrop<any[]>,
    displayedColumns: string[]
  ): string[] {
    if (
      (event.currentIndex == 0 || event.previousIndex == 0) &&
      displayedColumns.includes("select")
    ) {
      return displayedColumns;
    }
    if (
      (event.currentIndex == 1 || event.previousIndex == 1) &&
      displayedColumns.includes("addAction")
    ) {
      return displayedColumns;
    }
    if (
      (event.currentIndex == displayedColumns.length - 1 ||
        event.previousIndex == displayedColumns.length - 1) &&
      displayedColumns.includes("action")
    ) {
      return displayedColumns;
    }

    moveItemInArray(displayedColumns, event.previousIndex, event.currentIndex);

    return displayedColumns;
  }

  // for EditField Fill Array
  checkisEditFiled(oldData: any, newData: any) {
    const rowDataKeysArr = Object.keys(oldData);
    const fromArryKeysArr = Object.keys(newData);

    const updatedKeys = [];
    if (rowDataKeysArr.length > 0 && fromArryKeysArr.length > 0) {
      for (let key in oldData) {
        if (newData[key] !== oldData[key]) {
          updatedKeys.push(key);
        }
      }
    }
    return updatedKeys.length > 0 ? updatedKeys : null;
  }

  isEditedField(field: any) {
    let tempObj: any = {};
    for (const property in field) {
      tempObj[property] = false;
    }
    return tempObj;
  }

  // For Table Row Validation
  isColumnValidation(control: any): boolean {
    return control && control.touched && control && control.errors?.required;
  }
  // For Footer Row Validation
  isFooterColumnValidation(
    isFooterFomrSubmitting: boolean,
    control: any
  ): boolean {
    return (
      (isFooterFomrSubmitting || (control && control.touched)) &&
      control &&
      control.errors?.required
    );
  }

  // For Count MaxLangth Value
  parseHTMLFormate(data: any) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.template, "text/html");
    const plainText = doc.body.textContent || "";
    return plainText;
  }

  // set TableData Last Field as true
  isLastEditedField(object: any) {
    let fieldTrue: any = {};
    Object.keys(object).forEach((ele: any) => {
      fieldTrue[ele] = true;
    });
    return fieldTrue;
  }
  // =======   Your changes will be lost - Code Start  =======

  isDataChanged(tableData: any) {
    if (tableData && tableData.length > 0) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i]) {
          for (let key in tableData[i]) {
            if (tableData[i][key]) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  async doCanDeactivate(
    editColumnArray: any,
    hasChildTable = false,
    hasChildTableChanged = false
  ) {
    let isAllowNavigate = this.isDataChanged(editColumnArray);
    if (hasChildTable && hasChildTableChanged) {
      isAllowNavigate = true;
    }
    return isAllowNavigate ? await this.canDeactivate() : true;
  }

  canDeactivate() {
    return new Promise((resolve, reject) => {
      try {
        const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
          data: {
            message: "Your unsaved changes will be lost",
            type: "alter",
            subMessage:
              "Are you sure, You want to leave the page without saving your changes ?",
          },
          width: "400px",
        });

        dialogRef.afterClosed().subscribe((res: any) => {
          if (res.resetPage === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        reject(true);
      }
    });
  }

  // =======  Your changes will be lost - Code End =======

  // ======== Update Header Title - Code Start  ================

  public getPageTitle = new BehaviorSubject(null);
  pageTitle = this.getPageTitle.asObservable();

  setPageTitle(title: any) {
    this.getPageTitle.next(title);
  }

  // ======== Update Header Title - Code End  ================

  modifySelectValue(tableData: any) {
    return new Promise((resolve, reject) => {
      tableData.forEach((detail: any) => {
        for (let obj in detail) {
          if (
            detail[obj] &&
            typeof detail[obj] === "object" &&
            !Array.isArray(detail[obj]) &&
            detail[obj]?.name
          ) {
            detail[obj] = detail[obj]?.value;
          }
        }
      });
      resolve(tableData);
    });
  }

  // Get edited Table Data list
  getEditedDataArr(editedFlagArr: any, tableData: any) {
    let newArr: any = [];
    return new Promise((resolve, reject) => {
      editedFlagArr.forEach((ele: any, index: any) => {
        let elementValues = Object.values(ele);
        if (elementValues.includes(true)) {
          newArr.push(tableData[index]);
        }
      });
      resolve(newArr);
    });
  }
}
