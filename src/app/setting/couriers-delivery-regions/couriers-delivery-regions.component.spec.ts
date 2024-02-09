import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouriersDeliveryRegionsComponent } from './couriers-delivery-regions.component';

describe('CouriersDeliveryRegionsComponent', () => {
  let component: CouriersDeliveryRegionsComponent;
  let fixture: ComponentFixture<CouriersDeliveryRegionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouriersDeliveryRegionsComponent]
    });
    fixture = TestBed.createComponent(CouriersDeliveryRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
