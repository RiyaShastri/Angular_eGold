import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { AlertDialogBoxComponent } from "app/custom-component/alert-dialog-box/alert-dialog-box.component";
import { ContentdModalComponent } from "./contentd-modal/contentd-modal.component";
import { ConfigApiService } from "app/services/config/config-api.service";
import { CommonService } from "app/services/tableFunction/common.service";
import { TableServiceService } from "app/services/tableServies/table-service.service";
import { TABLE_COLUMNS } from "./sms-notifications-columns";

@Component({
  selector: "app-sms-notifications",
  templateUrl: "./sms-notifications.component.html",
  styleUrls: ["./sms-notifications.component.scss"],
})
export class SmsNotificationsComponent implements OnInit {
  tableColumns = TABLE_COLUMNS;
  displayedTableColumns: any = [];
  TableControlForm: FormGroup;
  TableForm: FormGroup;
  tableDataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  isFooterBtnActive: any = { btnStatus: false };
  isFooterFomrSubmitting = false; // for  Footer Row Subtmition
  tableEditedField: any = []; // for Edit table Edit Field Column
  isPreventDragDrop = false;
  pageTitle = "SMS Notifications";
  dublicateTableDataSource: any = [];
  tableSelectedRow: any;
  editedText: any; // for Store editor copy text
  ApiDataConfig: any = {};
  isAPILoading: boolean = true;
  Max_Text_Msg_Length: any;
  templateHTMLFormate: any = [];

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
    this.getTableRecord();
  }

  getTableRecord() {
    this.isAPILoading = true;
    const apiConfigTypes = ["settings_sms"];
    this.configApi.configSettingType("GET", apiConfigTypes, null).subscribe(
      async (res: any) => {
        apiConfigTypes.map((configType) => {
          this.ApiDataConfig[configType] =
            res?.api_response?.records?.[configType]?.records;
        });

        this.Max_Text_Msg_Length =
          res?.api_response?.records?.[apiConfigTypes[0]]?.max_text_msg_length;

        this.isFooterBtnActive["btnStatus"] = false;
        this.tableEditedField = [];

        // update Max Length
        const maxLength = this.maxLengthConverter(
          this.ApiDataConfig.settings_sms,
          this.Max_Text_Msg_Length
        );

        // Update SMS Record
        const updateSMSRecord = this.ApiDataConfig.settings_sms.map(
          (template: any, index: any) => ({
            ...template,
            template: this.commonService.parseHTMLFormate(template),
            maxLength: maxLength[index],
          })
        );

        if (updateSMSRecord?.length > 0) {
          this.tableUpdateForms(updateSMSRecord);
          this.TableControlForm.get("totalRecords")?.setValue(
            updateSMSRecord?.length
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
    this.dublicateTableDataSource = [...records];
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

  openDialog(data?: any, index?: any, tableDataIndex?: any) {
    // for set feed Api dim_sms_template_variables
    const apiConfigTypes = ["dim_sms_template_variables"];
    this.configApi.configType(apiConfigTypes).subscribe(async (res: any) => {
      apiConfigTypes.map((configType) => {
        this.ApiDataConfig[configType] =
          res?.api_response?.records?.[configType]?.records;
        res?.api_response?.records?.[configType]?.records;
      });

      if (
        this.ApiDataConfig.dim_sms_template_variables &&
        this.ApiDataConfig.dim_sms_template_variables.length > 0
      ) {
        if (data) {
          const newData = this.editedText == undefined ? data : this.editedText;
          if (index === newData.index) {
            const dialogRef = this.dialog.open(ContentdModalComponent, {
              disableClose: true,
              data: {
                data: newData,
                index: index,
                feedData: this.ApiDataConfig.dim_sms_template_variables,
                max_text_msg_length: this.Max_Text_Msg_Length,
              },
            });
            dialogRef.afterClosed().subscribe((result: any) => {
              if (result) {
                this.templateHTMLFormate.push(result);
                this.editedText = result;
                const newPlaintText =
                  this.commonService.parseHTMLFormate(result);
                this.tableData.controls[tableDataIndex].patchValue({
                  template: newPlaintText,
                  maxLength: result.maxLength,
                });
              }
            });
          } else {
            const dialogRef = this.dialog.open(ContentdModalComponent, {
              disableClose: true,
              data: {
                data: data,
                index: index,
                feedData: this.ApiDataConfig.dim_sms_template_variables,
                max_text_msg_length: this.Max_Text_Msg_Length,
              },
            });

            dialogRef.afterClosed().subscribe((result: any) => {
              if (result) {
                this.templateHTMLFormate.push(result);
                this.editedText = result;
                const newPlaintText =
                  this.commonService.parseHTMLFormate(result);
                this.tableData.controls[tableDataIndex].patchValue({
                  template: newPlaintText,
                  maxLength: result.maxLength,
                });
              }
            });
          }
        }
      }
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

  tableSortData(event: any) {
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
        "idx",
        "name"
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

    // for check tableEditedField any field or value is true
    if (isEditedFieldTrue) {
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

  // sortData(value: any) {
  //   let isEditedFieldTrue: any = false;
  //   this.tableEditedField.forEach((ele: any) => {
  //     let elementValues = Object.values(ele);
  //     if (elementValues.includes(true)) {
  //       isEditedFieldTrue = true;
  //     }
  //   });

  //   if (isEditedFieldTrue) {
  //     // for check tableEditedField any field or value is true
  //     const dialogRef = this.dialog.open(AlertDialogBoxComponent, {
  //       data: {
  //         message: "Your unsaved changes will be lost",
  //         type: "alter",
  //         subMessage:
  //           "Are you sure, You want to sort column without saving your changes ?",
  //       },
  //       width: "400px",
  //     });

  //     dialogRef.afterClosed().subscribe((res: any) => {
  //       if (res.resetPage === true) {
  //         this.getTableRecord();
  //       }
  //     });
  //   }
  // }

  tableDrop(event: CdkDragDrop<string[]>) {
    this.commonService.handleTableDrop(event, this.displayedTableColumns);
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
        this.getTableRecord();
      }
    });
  }

  async updateAllRecord() {
    let finalDataset: any = [];
    let datasetForUpdate: any = [];
    let datasetForAdd: any = [];
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

    this.templateHTMLFormate.map((nexTxt: any) => {
      finalDataset.map((finalMap: any) => {
        if (nexTxt.index === finalMap.idx) {
          finalMap.template = nexTxt.template;
        }
      });
    });

    // remove isEditBtnClicked & Iseditable & isDataEdited
    const removeFlagsModifiedDataset = finalDataset.map((item: any) => {
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
        const updatePatLoad = datasetForUpdate.map((item: any) => {
          const { name, maxLength, ...newItem } = item;
          return newItem;
        });

        this.SMSUpdateFn(updatePatLoad);
      }
    }
  }

  SMSUpdateFn(payLoad: any) {
    this.configApi
      .configSettingType(
        "PUT",
        ["settings_sms"],
        payLoad,
        this.Max_Text_Msg_Length
      )
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

  // Your changes will be lost
  canDeactivate() {
    return this.commonService.doCanDeactivate(this.tableEditedField);
  }

  // maxLength count
  maxLengthConverter(data: any, maxTextLength: any) {
    const newDataSet = data.map((ele: any) => {
      const withBraLeftL = ele.template.split("{{").length - 1;
      const withBraRightL = ele.template.split("}}").length - 1;
      const finalCount = ele.template.length - withBraLeftL - withBraRightL;
      const Msg = Math.ceil(finalCount / maxTextLength);
      if (finalCount > maxTextLength) {
        return `${finalCount}(${Msg} msg)`;
      } else {
        return finalCount;
      }
    });
    return newDataSet;
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
