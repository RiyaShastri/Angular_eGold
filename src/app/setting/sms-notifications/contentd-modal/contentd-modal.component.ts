import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import Editor from "../../../../../custom-build/build/ckeditor.js";

@Component({
  selector: "app-contentd-modal",
  templateUrl: "./contentd-modal.component.html",
  styleUrls: ["./contentd-modal.component.scss"],
})
export class ContentdModalComponent {
  mentionOption: FormGroup;
  public editor: any = Editor;
  public editorConfig: any;
  ckEditorClass = true; // for remove powerbyWaterMark
  txtBindMsg: any = 0;
  feed: any = [];

  constructor(
    private formBuilder: FormBuilder,
    public dailogRef2: MatDialogRef<ContentdModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // create editor Feed Array
    data.feedData.map((idName: any) => {
      this.feed.push({
        id: `}${idName.name}`,
        text: `{{${idName.title}}}`,
        max_length: idName.max_length,
      });
    });
  }

  ngOnInit() {
    if (this.data && this.data?.data?.template) {
      this.initFormGroup(this.data);
      this.mentionOption.patchValue({
        mentionList: this.data?.data?.template,
        newMentionList: this.data?.data?.template,
      });
      this.txtBindMsg = this.data?.data?.maxLength;
    }

    this.editorConfig = {
      placeholder: "Content Template",
      toolbar: [],
      mention: {
        feeds: [
          {
            marker: "}",
            feed: this.feed,
            itemRenderer: customItemRenderer,
          },
        ],
      },
    };
  }

  initFormGroup(controlValue?: any) {
    this.mentionOption = this.formBuilder.group({
      mentionList: new FormControl([
        controlValue["mentionList"] ? controlValue["mentionList"] : "",
        Validators.required,
      ]),
      newMentionList: new FormControl([
        controlValue["mentionList"] ? controlValue["mentionList"] : "",
        Validators.required,
      ]),
    });
  }

  editorEvent(event: any) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(event, "text/html");
    const plainTextMain = doc.body.textContent || "";
    const placeholdersWithBraces = plainTextMain.match(/{{(.*?)}}/g) || [];
    const stringWithoutBraces = plainTextMain.replace(/{{.*?}}/g, "");
    const removeSpace = stringWithoutBraces.replace(/\s/g, "");

    const maxLengthValues = placeholdersWithBraces.map((placeholder) =>
      this.findMaxLength(placeholder)
    );

    const TotalMaxlength = maxLengthValues.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const totalMaxlength = removeSpace.length + TotalMaxlength;

    const Msg = Math.ceil(totalMaxlength / this.data?.max_text_msg_length);
    if (totalMaxlength > this.data?.max_text_msg_length) {
      this.txtBindMsg = `${totalMaxlength}(${Msg} msg)`;
    } else {
      this.txtBindMsg = totalMaxlength;
    }
  }

  onOkayBtnClick() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      this.mentionOption.get("mentionList")?.value,
      "text/html"
    );
    const plainTextMain = doc.body.textContent || "";

    this.dailogRef2.close({
      template: this.mentionOption.get("mentionList")?.value,
      newContentTemplate: this.mentionOption.get("mentionList")?.value,
      maxLength: this.txtBindMsg,
      index: this.data.index,
    });
  }

  // for find maxLength Value

  findMaxLength(placeholder: any) {
    const template = this.feed.find((item: any) => item.text === placeholder);
    return template ? template.max_length : 0;
  }

  dialogCancel() {
    this.dailogRef2.close();
  }
}

function customItemRenderer(item: any) {
  const OpenBracketText = item?.id?.replace("{", "");
  const CloseBracketText = OpenBracketText.replace("}", "");

  const button = document.createElement("button");
  const span = document.createElement("span");

  // ck ck-button ck-on ck-button_with-text
  button.classList.add("ck", "ck-button_with-text");

  // ck ck-button__label
  span.classList.add("ck", "ck-button__label");

  span.id = `mention-list-item-id-${item.id}`;
  span.textContent = CloseBracketText;

  button.appendChild(span);
  button.setAttribute("tabindex", "-1");

  return button;
}
