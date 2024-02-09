import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-change-locker",
  templateUrl: "./change-locker.component.html",
  styleUrls: ["./change-locker.component.scss"],
})
export class ChangeLockerComponent implements OnInit {
  changeLockerAdd: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.changeLockerAdd = this.formBuilder.group({
      fullName: new FormControl("", [Validators.required]),
      mobilePhone: new FormControl("", [Validators.required]),
      streetHouseNum: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      notesMessenger: new FormControl("", [Validators.required]),
      splitPoint: new FormControl("", [Validators.required]),
    });
  }

  changeLockerAddSubmit() {

  }
}
