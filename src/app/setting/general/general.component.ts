import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ConfigApiService } from "app/services/config/config-api.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.scss"],
})
export class GeneralComponent implements OnInit {
  generalSettings: FormGroup;
  generalOTFrames: FormGroup;
  formSubmitted = false;
  SubmittedGeneralSettings = false;
  pageTitle = "General";
  generalSettingsRecords: any;
  generalOTFramesRecords: any;
  ApiDataConfig: any = {};
  isAPILoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private configApi: ConfigApiService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.intialSettingsForm();
    this.intialOTFrames();
    this.getSettingsRecords();
  }

  intialSettingsForm() {
    this.generalSettings = this.fb.group({
      changeSDtoND: new FormControl(""),
      dimTolerance: new FormControl("", [Validators.required]),
      emailSosna: new FormControl("", [Validators.required]),
      emailCheetah: new FormControl("", [Validators.required]),
      emailFlyingCargo: new FormControl("", [Validators.required]),
      mailKatz: new FormControl("", [Validators.required]),
      dispatchAlertEmail: new FormControl("", [Validators.required]),
    });
  }

  intialOTFrames() {
    this.generalOTFrames = this.fb.group({
      NDtoSDstartHH: new FormControl("", [Validators.required]),
      NDtoSDstartMM: new FormControl("", [Validators.required]),
      NDtoSDendHH: new FormControl("", [Validators.required]),
      NDtoSDendMM: new FormControl("", [Validators.required]),
      SDacceptStartHH: new FormControl("", [Validators.required]),
      SDacceptStartMM: new FormControl("", [Validators.required]),
    });
  }

  getSettingsRecords() {
    this.isAPILoading = true;
    // for General Settings
    const apiConfigTypes = ["settings_general"];
    this.configApi.configSettingType("GET", apiConfigTypes, null).subscribe(
      async (res: any) => {
        apiConfigTypes.map((configType) => {
          this.ApiDataConfig[configType] = this.generalSettingsRecords =
            res?.api_response?.records?.[configType]?.settings?.records;

          this.generalOTFramesRecords =
            res?.api_response?.records?.[configType]?.time_frames?.records;
        });

        if (
          this.generalSettingsRecords?.length > 0 &&
          this.generalOTFramesRecords?.length > 0
        ) {
          // get GeneralSettingsRecords
          this.setValueSettingRecords(this.generalSettingsRecords);

          // get OTFramesRecords
          this.setValueOTFramesRecords(this.generalOTFramesRecords);
        }
        this.isAPILoading = false;
      },
      (err) => {
        this.isAPILoading = false;
      }
    );
  }

  setValueSettingRecords(records: any) {
    this.generalSettings = this.fb.group({
      changeSDtoND: new FormControl(
        records.find(
          (item: any) =>
            item.name === "settings.change_sd_to_nd_if_vm_is_constrained"
        ).value == "1"
          ? true
          : false
      ),
      dimTolerance: new FormControl(
        records.find(
          (item: any) => item.name === "settings.dim_tolerance_on_vm_check"
        ).value,
        [Validators.required]
      ),
      emailSosna: new FormControl(
        records.find((item: any) => item.name === "settings.email_sosna").value,
        [Validators.required]
      ),
      emailCheetah: new FormControl(
        records.find(
          (item: any) => item.name === "settings.email_cheetah"
        ).value,
        [Validators.required]
      ),
      emailFlyingCargo: new FormControl(
        records.find(
          (item: any) => item.name === "settings.email_flyingcargo"
        ).value,
        [Validators.required]
      ),
      mailKatz: new FormControl(
        records.find((item: any) => item.name === "settings.mail_katz").value,
        [Validators.required]
      ),
      dispatchAlertEmail: new FormControl(
        records.find(
          (item: any) => item.name === "settings.dispatch_monitor_alert_emails"
        ).value,
        [Validators.required]
      ),
    });
  }

  settingSubmit() {
    this.SubmittedGeneralSettings = true;

    let payload = this.findIdxgeneralSettings(
      this.generalSettings.value,
      this.generalSettingsRecords
    );

    // extra payload
    let extraReqPayload: any = {
      api_request: {
        records: {
          settings_general: {
            settings: {
              records: payload,
            },
          },
        },
      },
    };

    if (payload && payload.length > 0) {
      this.generalSettingOTFUpdateFn(
        extraReqPayload,
        "Settings Update Successfully"
      );
    }
  }

  // for General Settings
  findIdxgeneralSettings(obj: any, records: any[]) {
    let newObj: any[] = [];
    records.forEach((ele: any) => {
      if (ele.name === "settings.change_sd_to_nd_if_vm_is_constrained") {
        if (obj.changeSDtoND !== ele.value) {
          newObj.push({
            idx: ele.idx,
            value: obj.changeSDtoND == true ? "1" : "0",
          });
        }
      }
      if (ele.name === "settings.dim_tolerance_on_vm_check") {
        if (obj.dimTolerance !== ele.value) {
          newObj.push({
            idx: ele.idx,
            value: obj.dimTolerance,
          });
        }
      }
      if (ele.name === "settings.email_sosna") {
        if (obj.emailSosna !== ele.value) {
          newObj.push({
            idx: ele.idx,
            value: obj.emailSosna,
          });
        }
      }
      if (ele.name === "settings.email_cheetah") {
        if (obj.emailCheetah !== ele.value) {
          newObj.push({
            idx: ele.idx,
            value: obj.emailCheetah,
          });
        }
      }
      if (ele.name === "settings.email_flyingcargo") {
        if (obj.emailFlyingCargo !== ele.value) {
          newObj.push({
            idx: ele.idx,
            value: obj.emailFlyingCargo,
          });
        }
      }
      if (ele.name === "settings.mail_katz") {
        if (obj.mailKatz !== ele.value) {
          newObj.push({
            idx: ele.idx,
            value: obj.mailKatz,
          });
        }
      }
      if (ele.name === "settings.dispatch_monitor_alert_emails") {
        if (obj.dispatchAlertEmail !== ele.value) {
          newObj.push({
            idx: ele.idx,
            value: obj.dispatchAlertEmail,
          });
        }
      }
    });

    return newObj;
  }

  setValueOTFramesRecords(records: any) {
    const modifyTime = records.map((item: any) => {
      const splitValues = item.value.split(":");
      return {
        idx: item.idx,
        name: item.name,
        hh: splitValues[0],
        mm: splitValues[1],
      };
    });

    this.generalOTFrames = this.fb.group({
      NDtoSDstartHH: new FormControl(
        modifyTime.find(
          (item: any) =>
            item.name === "time_frames.nd_to_sd_change_time_window.start_time"
        ).hh,
        [Validators.required]
      ),
      NDtoSDstartMM: new FormControl(
        modifyTime.find(
          (item: any) =>
            item.name === "time_frames.nd_to_sd_change_time_window.start_time"
        ).mm,
        [Validators.required]
      ),
      NDtoSDendHH: new FormControl(
        modifyTime.find(
          (item: any) =>
            item.name === "time_frames.nd_to_sd_change_time_window.end_time"
        ).hh,
        [Validators.required]
      ),
      NDtoSDendMM: new FormControl(
        modifyTime.find(
          (item: any) =>
            item.name === "time_frames.nd_to_sd_change_time_window.end_time"
        ).mm,
        [Validators.required]
      ),
      SDacceptStartHH: new FormControl(
        modifyTime.find(
          (item: any) =>
            item.name ===
            "time_frames.sd_accept_time_of_day_threshold.start_time"
        ).hh,
        [Validators.required]
      ),
      SDacceptStartMM: new FormControl(
        modifyTime.find(
          (item: any) =>
            item.name ===
            "time_frames.sd_accept_time_of_day_threshold.start_time"
        ).mm,
        [Validators.required]
      ),
    });
  }

  OTframeSubmit() {
    this.formSubmitted = true;

    const joinedValuesObject: any = {
      NDtoSDstart: `${this.generalOTFrames.value.NDtoSDstartHH}:${this.generalOTFrames.value.NDtoSDstartMM}`,
      NDtoSDend: `${this.generalOTFrames.value.NDtoSDendHH}:${this.generalOTFrames.value.NDtoSDendMM}`,
      SDacceptStart: `${this.generalOTFrames.value.SDacceptStartHH}:${this.generalOTFrames.value.SDacceptStartMM}`,
    };

    this.generalOTFramesRecords.forEach((ele: any) => {
      if (ele.name === "time_frames.nd_to_sd_change_time_window.start_time") {
        ele.value = joinedValuesObject.NDtoSDstart;
      }
      if (ele.name === "time_frames.nd_to_sd_change_time_window.end_time") {
        ele.value = joinedValuesObject.NDtoSDend;
      }
      if (
        ele.name === "time_frames.sd_accept_time_of_day_threshold.start_time"
      ) {
        ele.value = joinedValuesObject.SDacceptStart;
      }
    });

    // find Idx & Value Call PUT functions
    this.findIdxValueOTF(this.generalOTFramesRecords);
  }

  //for Operational Time frames PUT Function Call
  findIdxValueOTF(updateRecords: any) {
    const apiConfigTypes = ["settings_general"];
    let newGeneralOTFramesRecords: any;
    this.configApi
      .configSettingType("GET", apiConfigTypes, null)
      .subscribe(async (res: any) => {
        apiConfigTypes.map((configType) => {
          this.ApiDataConfig[configType] = newGeneralOTFramesRecords =
            res?.api_response?.records?.[configType]?.time_frames?.records;
        });

        const payload = newGeneralOTFramesRecords
          .map((oldOTFRecords: any, index: any) => {
            const newOTFRecords = updateRecords[index];
            if (oldOTFRecords.value !== newOTFRecords.value) {
              return {
                idx: oldOTFRecords.idx,
                value: newOTFRecords.value,
              };
            }
            return null;
          })
          .filter((obj: any) => obj !== null);

        // extra payload
        let extraReqPayload: any = {
          api_request: {
            records: {
              settings_general: {
                time_frames: {
                  records: payload,
                },
              },
            },
          },
        };

        if (payload && payload.length > 0) {
          this.generalSettingOTFUpdateFn(
            extraReqPayload,
            "Time Update Successfully"
          );
        }
      });
  }

  // Common Put Function
  generalSettingOTFUpdateFn(extraReqPayload: any, toastMsg: any) {
    this.configApi
      .configSettingType("PUT", ["settings_general"], null, extraReqPayload)
      .toPromise()
      .then((res: any) => {
        if (
          res &&
          res["api_response"] &&
          res["api_response"]["records"]?.success
        ) {
          this.toast.success(toastMsg);
        }
      })
      .catch((err) => {
        console.log("Error...", err);
      });
  }
}
