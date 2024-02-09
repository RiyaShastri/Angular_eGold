import { Component } from "@angular/core";
import { FormBuilder, Validators, AbstractControl } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  hide = true;
  registerForm = this.fb.nonNullable.group(
    {
      email: ["", [Validators.required, Validators.email]],
      username: ["", [Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"),
        ],
      ],
      confirmPassword: ["", [Validators.required]],
    },
    {
      validators: [this.matchValidator("password", "confirmPassword")],
    }
  );

  constructor(private fb: FormBuilder) {}

  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }

  onSubmit() {

  }
}
