import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import * as moment from "moment";

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: "app-alter-message",
  templateUrl: "./alter-message.component.html",
  styleUrls: ["./alter-message.component.scss"],
})
export class AlterMessageComponent implements OnInit {
  FilterOption: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AlterMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.FilterOption = this.formBuilder.group({
      start_datetime: new FormControl(
        this.data &&
        this.data.filteredData &&
        this.data.filteredData.start_datetime
          ? moment(new Date(this.data.filteredData.start_datetime)).format(
              "YYYY-MM-DD"
            )
          : moment().subtract(6, "days").format("YYYY-MM-DD")
      ),
      end_datetime: new FormControl(
        this.data &&
        this.data.filteredData &&
        this.data.filteredData.end_datetime
          ? moment(new Date(this.data.filteredData.end_datetime)).format(
              "YYYY-MM-DD"
            )
          : moment().format("YYYY-MM-DD") || null
      ),
      order_codes: new FormControl(
        this.data &&
        this.data.filteredData &&
        this.data.filteredData.order_codes
          ? this.data.filteredData.order_codes
          : ""
      ),
      depositor_ids: new FormControl(
        this.data &&
        this.data.filteredData &&
        this.data.filteredData.depositor_ids
          ? this.data.filteredData.depositor_ids
          : ""
      ),
    });
  }

  FilterData() {
    this.dialogRef.close(this.FilterOption.value);
  }
}
