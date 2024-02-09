import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-update-shipping-address",
  templateUrl: "./update-shipping-address.component.html",
  styleUrls: ["./update-shipping-address.component.scss"],
})
export class UpdateShippingAddressComponent implements OnInit {
  updateShippingAddress: FormGroup;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.updateShippingAddress = this.formBuilder.group({
      fullName: new FormControl("", [Validators.required]),
      mobilePhone: new FormControl("", [Validators.required]),
      streetHouseNum: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      notesMessenger: new FormControl("", [Validators.required]),
    });
  }

  updateShippingSubmit() {

  }
}
