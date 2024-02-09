import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-common-pagination',
  templateUrl: './common-pagination.component.html',
  styleUrls: ['./common-pagination.component.scss']
})

export class CommonPaginationComponent {

  @Input() totalRecords: any ;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  pageSize = 50;
  pageSizeOptions = [50, 100, 250];
  pageIndex = 0;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;
  @Output() getPaginationDetail = new EventEmitter<any>();

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.paginator) {
      const paginatorIntl = this.paginator["_intl"];
      paginatorIntl.itemsPerPageLabel = "Per page";
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalRecords = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getPaginationDetail.emit(this.pageEvent);
  }

}
