import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPaginationComponent } from './common-pagination.component';

describe('CommonPaginationComponent', () => {
  let component: CommonPaginationComponent;
  let fixture: ComponentFixture<CommonPaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonPaginationComponent]
    });
    fixture = TestBed.createComponent(CommonPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
