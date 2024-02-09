import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListInfoComponent } from './order-list-info.component';

describe('OrderListInfoComponent', () => {
  let component: OrderListInfoComponent;
  let fixture: ComponentFixture<OrderListInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderListInfoComponent]
    });
    fixture = TestBed.createComponent(OrderListInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
