import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { AlterMessageComponent } from "./alter-message/alter-message.component";
import { MaterialModule } from "app/material.module";
import { AlertDialogBoxComponent } from "./alert-dialog-box/alert-dialog-box.component";
import { CdkDrag, CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import { CommonPaginationComponent } from "./common-pagination/common-pagination.component";
import { SharedModule } from "app/themefolders/shared";

@NgModule({
  declarations: [
    AlterMessageComponent,
    AlertDialogBoxComponent,
    CommonPaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    SharedModule,
  ],
  exports: [
    AlterMessageComponent,
    AlertDialogBoxComponent,
    CommonPaginationComponent,
  ],
})
export class CustomComponentModule {}
