import { ApplicationRef, Injectable } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class TableServiceService {
  constructor(
    private formBuilder: FormBuilder,
    private ref: ApplicationRef // private changeDetectorRefs: ChangeDetectorRef
  ) {}

  initializeTableControlForm() {
    return this.formBuilder.group({
      sortKey: new FormControl("run_date"),
      sortType: new FormControl("asc"),
      searchTxt: new FormControl(null),
      currentPageSize: new FormControl(50),
      pageIndex: new FormControl(0),
      totalRecords: new FormControl(100),
      selectDepositor: new FormControl(""),
    });
  }

  initializeTableDataForm() {
    return this.formBuilder.group({
      tableData: this.formBuilder.array([]),
    });
  }

  manageTableDataForm(
    records: any[],
    tableColumns: any[],
    tableData: FormArray,
    tableEditedField: any[]
  ) {
    tableData.reset();
    tableData.clear();

    for (let index = 0; index < records.length; index++) {
      const element = records[index];
      const formControls: any = this.addFormControls(
        tableColumns,
        element,
        tableEditedField[index]
      );
      tableData.push(formControls.columnForm);
      tableEditedField[index] = formControls.editRowFields;
      if (index === records.length - 1) {
        const formControls: any = this.addFormControls(tableColumns, {});
        tableData.push(formControls.columnForm);
        tableEditedField[index + 1] = formControls.editRowFields;
      }
    }
  }

  addFormControls(
    tableColumns: any,
    rowData: any = {},
    rowEditedField: any = {}
  ) {
    const columnForm = this.formBuilder.group({});
    const editRowFields: any = {};
    for (let index = 0; index < tableColumns.length; index++) {
      const column = tableColumns[index];
      if (column.columnDef !== "select" && column.columnDef !== "action") {
        const defaultValue = column.controlType === "text" ? null : "";
        const fieldValidations: any = [];
        if (column?.isControlRequired) {
          fieldValidations.push(Validators.required);
        }
        const fieldValue =
          rowData[column.columnDef] === undefined
            ? defaultValue
            : rowData[column.columnDef];
        columnForm.addControl(
          column.columnDef,
          new FormControl(fieldValue, fieldValidations)
        );

        if (JSON.stringify(rowData) == "{}") {
          editRowFields[column.columnDef] = false;
        } else {
          editRowFields[column.columnDef] =
            rowEditedField[column.columnDef] || false;
        }
      }

      if (index === tableColumns.length - 1) {
        columnForm.addControl("isEditBtnClicked", new FormControl(false));
        columnForm.addControl("isDataEdited", new FormControl(false));
        return { columnForm, editRowFields };
      }
    }
    return columnForm;
  }

  tableActions(
    actionType: any,
    oldData: any,
    index: any,
    tableData: FormArray,
    tableEditedField: any[],
    isFooterBtnActive: any
  ): any {
    if (actionType == "save") {
      return this.saveAction(
        index,
        tableData,
        oldData,
        tableEditedField,
        isFooterBtnActive
      );
    } else if (actionType == "cancel") {
      return this.cancelAction(index, tableData, oldData, isFooterBtnActive);
    }
  }

  saveAction(
    index: any,
    tableData: FormArray,
    oldData: any = {},
    rowEditedField: any = [],
    isFooterBtnActive: any
  ) {
    if (tableData.controls[index].status == "VALID") {
      if (tableData.value && tableData.value[index]) {
        tableData.controls[index].patchValue({
          isEditBtnClicked: false,
          isDataEdited: true,
        });
        const updatedFields: any = this.getEditedFieldKeys(
          oldData,
          tableData.value[index]
        );
        for (let i = 0; i < updatedFields?.length; i++) {
          const updatedField = updatedFields[i];
          rowEditedField[index][updatedField] = true;
        }
      }
      let updatedData = [...tableData.value];
      updatedData.pop();
      isFooterBtnActive["btnStatus"] = true;
      return updatedData;
    } else {
      isFooterBtnActive["btnStatus"] = false;
      return false;
    }
  }

  cancelAction(
    index: any,
    tableData: FormArray,
    oldData: any,
    isFooterBtnActive: any
  ) {
    tableData.controls[index].patchValue(oldData);
    tableData.controls[index].patchValue({
      isEditBtnClicked: false,
    });
    tableData.controls[index].patchValue({ isDataEdited: false });
    let updatedData = [...tableData.value];
    updatedData.pop();
    isFooterBtnActive["btnStatus"] = true;
    return updatedData;
  }

  addNewRecord(tableData: FormArray) {
    if (tableData.controls[tableData.value.length - 1].status == "VALID") {
      let updatedData = [...tableData.value];
      return updatedData;
    } else {
      return false;
    }
  }

  // for Row All Field false value
  isFieldChangesFalse(rowField: any) {
    let tempObj: any = {};
    for (const property in rowField) {
      tempObj[property] = false;
    }
    return tempObj;
  }

  // for return table which Table Row Column is Update
  indicateFieldChanges(rowData: any, updatedData: any) {
    const rowDataKeysArr = Object.keys(rowData);
    const fromArryKeysArr = Object.keys(updatedData);

    const updatedKeys = [];
    if (rowDataKeysArr.length > 0 && fromArryKeysArr.length > 0) {
      for (let key in rowData) {
        if (
          rowDataKeysArr.includes(key) &&
          fromArryKeysArr.includes(key) &&
          updatedData[key] !== rowData[key]
        ) {
          updatedKeys.push(key);
        }
      }
    }
    return updatedKeys.length > 0 ? updatedKeys : null;
  }

  rowSelection(selectedRow: any) {
    return selectedRow &&
      selectedRow.selected &&
      selectedRow.selected.length > 0
      ? selectedRow.selected
      : [];
  }

  getEditedFieldKeys(oldData: any, newData: any) {
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

  transfromOptions(APIOptions: any = [], valueKey: any, labelKey: any) {
    return APIOptions.map((option: any) => {
      return { name: option[labelKey], value: option[valueKey] };
    });
  }
}
