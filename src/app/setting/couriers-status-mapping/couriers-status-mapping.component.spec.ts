import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouriersStatusMappingComponent } from './couriers-status-mapping.component';

describe('CouriersStatusMappingComponent', () => {
  let component: CouriersStatusMappingComponent;
  let fixture: ComponentFixture<CouriersStatusMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouriersStatusMappingComponent]
    });
    fixture = TestBed.createComponent(CouriersStatusMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
