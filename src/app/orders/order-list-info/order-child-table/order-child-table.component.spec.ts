import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderChildTableComponent } from './order-child-table.component';

describe('OrderChildTableComponent', () => {
  let component: OrderChildTableComponent;
  let fixture: ComponentFixture<OrderChildTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderChildTableComponent]
    });
    fixture = TestBed.createComponent(OrderChildTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
