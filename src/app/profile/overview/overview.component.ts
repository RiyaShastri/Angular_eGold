import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  file: string = "";
  updateProfile: FormGroup;
  formSubmitted = false;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.updateProfile = this.formBuilder.group({
      img: new FormControl(""),
      username: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      mobile: new FormControl("", [Validators.required]),
    });
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    this.updateProfile.patchValue({
      img: files,
    });
  }

  updateProfileSubmit() {
    this.formSubmitted = true;
  }
}
