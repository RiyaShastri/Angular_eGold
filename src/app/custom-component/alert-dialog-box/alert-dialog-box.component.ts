import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-alert-dialog-box",
  templateUrl: "./alert-dialog-box.component.html",
  styleUrls: ["./alert-dialog-box.component.scss"],
})
export class AlertDialogBoxComponent {
  content: any = "";
  title = "";
  type = "";

  constructor(
    public dialogRef: MatDialogRef<AlertDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onOkClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.content = this.data.content;
    this.type = this.data.type;
    if (this.data.showSuccess) {
      this.title = "Success";
    } else {
      this.title = this.data.title;
    }
  }

  OkReset() {
    this.dialogRef.close({
      resetPage: true,
    });
  }

  CancelReset() {
    this.dialogRef.close({
      cancelReset: true,
    });
  }

  AlterOkButton() {
    this.dialogRef.close({
      resetPage: true,
    });
  }

  AlterCancelButton() {
    this.dialogRef.close({
      resetPage: false,
    });
  }

  DeleteYesButton() {
    this.dialogRef.close({
      isDeletTableData: true,
    });
  }

  DeleteNoButton() {
    this.dialogRef.close({
      isDeletTableData: false,
    });
  }
}
