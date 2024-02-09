import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFilterPopComponent } from './order-filter-pop.component';

describe('OrderFilterPopComponent', () => {
  let component: OrderFilterPopComponent;
  let fixture: ComponentFixture<OrderFilterPopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderFilterPopComponent]
    });
    fixture = TestBed.createComponent(OrderFilterPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
